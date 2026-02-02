import ollama from "ollama";
import Task from "../models/task.model.js";
import { errorHandler } from "../utils/error.js";

export const getTaskInsights = async (req, res, next) => {
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

    // 2. Pre-process data (Optimized for Small Language Models)
    const taskSummary = tasks.map((t) => {
      const checklistTotal = t.todoChecklist.length;
      const checklistDone = t.todoChecklist.filter((i) => i.completed).length;
      
      return `
      - [${t.status}] ${t.title} (${t.priority} Priority)
        Due: ${new Date(t.dueDate).toDateString()}
        Progress: ${t.progress}% | Checklist: ${checklistDone}/${checklistTotal}
        Context: ${t.description ? t.description.substring(0, 50) : "No description"}
      `;
    }).join("\n");

    // 3. Construct the Detailed Prompt for Ollama
    const systemPrompt = `
      You are an expert AI Project Manager for Prince. 
      Current Date: ${new Date().toDateString()}

      TASK LIST:
      ${taskSummary}

      INSTRUCTIONS:
      Analyze the workload above. Do not list tasks. Provide a high-impact summary:
      1. WORKLOAD SUMMARY: Evaluate if Prince is over-leveraged based on High/Medium priorities.
      2. RISK ASSESSMENT: Identify "At Risk" tasks (High priority AND Pending AND Due soon).
      3. SUB-TASK DRILLDOWN: If tasks have 0% progress or low checklist completion, highlight the need for sub-task focus.
      4. STRATEGIC STEPS: Provide 2 bullet-pointed actions to maximize productivity today.

      Tone: Direct and professional. Keep it under 150 words.
    `;

    // 4. Call Local Ollama (Running in your Docker)
    const response = await ollama.chat({
      model: "llama3.2:1b",
      messages: [{ role: "user", content: systemPrompt }],
      stream: false,
    });

    res.status(200).json({ 
      insight: response.message.content,
      source: "Local Ollama Engine"
    });

  } catch (error) {
    console.error("Ollama Insight Error:", error);
    next(errorHandler(500, "Local AI is offline. Ensure Docker container 'task-buddy-ai' is running."));
  }
};