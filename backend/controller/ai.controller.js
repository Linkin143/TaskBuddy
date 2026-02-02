import { Ollama } from 'ollama';
import Task from "../models/task.model.js";
import { errorHandler } from "../utils/error.js";

// Changed 127.0.0.1 to localhost to better match standard PowerShell/Docker mapping
const ollama = new Ollama({ host: 'http://localhost:11434' });

export const getTaskInsights = async (req, res, next) => {
    console.log("AI Insight Request received for user:", req.user?.id);
    try {
        const userId = req.user.id;

        // 1. Fetch relevant tasks
        const tasks = await Task.find({
            $or: [{ assignedTo: userId }, { createdBy: userId }]
        })
            .select("title description status priority dueDate todoChecklist progress")
            .sort({ updatedAt: -1 });

        if (!tasks || tasks.length === 0) {
            return res.status(200).json({
                insight: "You don't have any tasks yet. Create some tasks to get local AI insights!",
            });
        }

        // 2. Pre-process data
        const taskSummary = tasks.map((t) => {
            const checklistTotal = t.todoChecklist?.length || 0;
            const checklistDone = t.todoChecklist?.filter((i) => i.completed).length || 0;

            return `
      - [${t.status}] ${t.title} (${t.priority} Priority)
        Due: ${new Date(t.dueDate).toDateString()}
        Progress: ${t.progress}% | Checklist: ${checklistDone}/${checklistTotal}
        Context: ${t.description ? t.description.substring(0, 50) : "No description"}
      `;
        }).join("\n");

        // 3. Construct the Prompt
        const systemPrompt = `
             You are the "Task Buddy" AI Project Manager for Prince. 
             Current Date: ${new Date().toDateString()}

             USER TASK DATA:
            ${taskSummary}

            YOUR GOAL: 
            Analyze the titles, descriptions, and due dates to provide a "Priority Triage" report.


      INSTRUCTIONS:
      Analyze the workload above. Do not list tasks. Provide a high-impact summary:
      1. WORKLOAD ANALYSIS: Summarize the current distribution of Pending vs. In-Progress tasks.
      2. RISK ASSESSMENT: Identify "At Risk" tasks (High priority AND Pending AND Due soon).
      3. SUB-TASK DRILLDOWN: Highlight need for sub-task focus where checklist completion is low.
      4. STRATEGIC STEPS: Provide 2 bullet-pointed actions to maximize productivity today.

      Tone: Direct and professional. Keep it under 150 words.
    `;

        // 4. Call Local Ollama

        const response = await ollama.chat({
            model: "llama3.2:1b",
            messages: [{ role: "user", content: systemPrompt }],
            stream: false,
        });

        if (!response || !response.message) {
            throw new Error("Empty response from AI engine");
        }

        res.status(200).json({
            insight: response.message.content,
            source: "Local Ollama Engine"
        });

    } catch (error) {

        console.error("OLLAMA CONNECTION ERROR DETAILS:", {
            message: error.message,
            code: error.code,
            name: error.name
        });


        const errorMessage = error.code === 'ECONNREFUSED'
            ? "Could not connect to AI. Is Ollama running on port 11434?"
            : "Local AI is processing your request. Please try again in a moment.";

        next(errorHandler(500, errorMessage));
    }
};