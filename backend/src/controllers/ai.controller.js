import model from "../ai/ai.js";
import { Todo } from "../models/todo.model.js";
import { emitToUser } from "../lib/socket.js";
import { Organization } from "../models/organization.model.js";
import { db } from "../config/firebase.js";
import { fetchTodos } from "./todo.controller.js";

// Helper function to calculate productivity metrics
const evaluateProductivity = (todos) => {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(
    (todo) =>
      todo.isCompleted || todo.status === "done" || todo.status === "completed"
  ).length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Baseline score calculation for consistency
  const baselineScore =
    completionRate >= 80
      ? 9
      : completionRate >= 60
      ? 7
      : completionRate >= 40
      ? 5
      : completionRate >= 20
      ? 3
      : 1;

  return {
    completionRate,
    baselineScore,
    totalTasks,
    completedTasks,
  };
};

export const reviewUser = async (req, res) => {
  const userId = req.user.uid;
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch user's todos for today
    const todos = await Todo.find({
      userId,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (todos) {
      console.log("todos", todos);
    }
    // Get productivity metrics for consistent scoring
    const metrics = evaluateProductivity(todos);
    const prompt = `You are an enthusiastic and supportive productivity coach! Your job is to review the user's task management approach based on their today's todos data and provide a consistent, honest score out of 10 with uplifting feedback.

Data: ${todos}

SCORING CRITERIA (use these exact standards):
- 9-10: Exceptional performance (80%+ completion rate, well-organized, clear structure)
- 7-8: Strong performance (60-79% completion rate, good organization, solid progress)
- 5-6: Moderate performance (40-59% completion rate, some organization, decent effort)
- 3-4: Needs improvement (20-39% completion rate, limited organization, minimal progress)
- 1-2: Poor performance (0-19% completion rate, disorganized, little to no progress)

CONTEXT FOR CONSISTENCY:
- Total tasks: ${metrics.totalTasks}
- Completed tasks: ${metrics.completedTasks}
- Completion rate: ${metrics.completionRate.toFixed(1)}%
- Baseline score range: ${metrics.baselineScore}-${metrics.baselineScore + 1}

EVALUATION CHECKLIST:
1. Calculate completion rate: (tasks with isCompleted: true / total tasks) × 100
2. Assess organization: Are tasks categorized or structured?
3. Review progress indicators: Are there signs of ongoing effort?
4. Note task complexity and realistic goal-setting

Please respond in this exact format:
Score: [number between 0-10]
Feedback: [brief encouraging and constructive feedback]

FEEDBACK GUIDELINES:
- Always start with something positive (effort, progress, organization)
- Be specific about what contributed to the score
- Offer one actionable suggestion for improvement
- End with encouragement
- Keep tone enthusiastic but honest
- Focus on productivity patterns, not task content
- Acknowledge any progress made

Remember: The score should reflect actual performance based on the completion rate (isCompleted boolean values), while the feedback should be supportive and motivating. Use the provided context to ensure scoring consistency.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    // Extract score and feedback properly
    const score = extractScore(text);
    const feedback = extractFeedback(text);

    res.status(200).json({ score, feedback, metrics }); // Optional: include metrics for debugging
  } catch (error) {
    console.log("error reviewing user ", error);
    res.status(500).json({ message: error.message });
  }
};

export const extractScore = (aiResponse) => {
  try {
    // Remove extra whitespace and normalize the response
    const cleanResponse = aiResponse.trim();

    // Regex to find score (number between 0-10, including decimals)
    const scoreRegex =
      /(?:score|rating)?\s*:?\s*(\d+(?:\.\d+)?)\s*(?:\/10|out of 10)?/i;

    let score = null;

    // Try to find score with context first
    const scoreMatch = cleanResponse.match(scoreRegex);
    if (scoreMatch) {
      const foundScore = parseFloat(scoreMatch[1]);
      if (foundScore >= 0 && foundScore <= 10) {
        score = foundScore;
      }
    }

    // If no score found with context, look for any number between 0-10
    if (score === null) {
      const numberRegex = /\b(\d+(?:\.\d+)?)\b/g;
      const numbers = cleanResponse.match(numberRegex);
      if (numbers) {
        for (const num of numbers) {
          const numValue = parseFloat(num);
          if (numValue >= 0 && numValue <= 10) {
            score = numValue;
            break;
          }
        }
      }
    }

    return score;
  } catch (error) {
    console.error("Error extracting score:", error);
    return null;
  }
};

export const extractFeedback = (aiResponse) => {
  try {
    // Look for feedback after "Feedback:" keyword
    const feedbackMatch = aiResponse.match(/feedback\s*:\s*(.+)/i);
    if (feedbackMatch) {
      return feedbackMatch[1].trim();
    }

    // If no "Feedback:" found, look for content after score
    const lines = aiResponse.split("\n").filter((line) => line.trim());
    if (lines.length >= 2) {
      // Return everything after the first line (which should be the score)
      return lines.slice(1).join(" ").trim();
    }

    return "No feedback available";
  } catch (error) {
    console.error("Error extracting feedback:", error);
    return "Error extracting feedback";
  }
};


export const generateSchedule = async (req, res) => {
  let { date } = req.query;
  if(!date){
    date = new Date();
  }
  
  try {
    console.log("Generating schedule for date:", date);
    const inputDate = new Date(date);
    const dateString = inputDate.toISOString().split("T")[0];

    const startOfDay = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate(),
      23,
      59,
      59,
      999
    );
    
    const todos = await Todo.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: "pending" // Only get unscheduled tasks
    });
    
    if (todos.length === 0) {
      return res.status(200).json({ 
        message: "No pending tasks found for this date",
        optimizationSummary: {
          tasksScheduled: 0,
          totalDuration: "0 minutes",
          optimizationNotes: "No tasks to schedule"
        }
      });
    }
    
    const prompt = `
You are an intelligent task scheduling assistant. Your job is to analyze a list of tasks to create an optimized daily schedule for ${date}.

## Tasks to Schedule:
${JSON.stringify(todos, null, 2)}

## Your Responsibilities:

### 1. Duration Estimation
For tasks without duration, estimate based on:
- Task title and description complexity
- Category type (Work tasks typically longer than Personal)
- Priority level (High priority often means more complex)
- Provide realistic estimates (15 minutes to 4 hours range)

### 2. Time Slot Assignment
For each task, determine:
- Optimal start time within working hours (9:00 AM - 5:00 PM)
- End time (start time + duration)
- Scheduling reason (why this time was chosen)

### 3. Optimization Logic
Consider:
- Priority-based scheduling (high priority gets better time slots)
- Deadline constraints (urgent tasks scheduled earlier)
- Energy levels (complex tasks in morning hours)
- 15-minute buffer between tasks
- Realistic time allocation

## CRITICAL: Return ONLY valid JSON in this exact format:

{
  "scheduledTasks": [
    {
      "id": "task_id_here",
      "status": "scheduled",
      "duration": "2 hours",
      "scheduledSlot": {
        "date": "${date}",
        "time": "09:00 - 11:00",
        "startTime": "09:00",
        "endTime": "11:00",
        "duration": 120,
        "reason": "Scheduled during morning hours for optimal focus on high-priority work task"
      }
    }
  ],
  "optimizationSummary": {
    "tasksScheduled": 5,
    "totalDuration": "6 hours 30 minutes",
    "optimizationNotes": "Prioritized high-priority tasks in morning slots, grouped similar categories together"
  }
}

Do not include any text before or after the JSON. Return only the JSON object.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    console.log("Raw Gemini response:", text);
    
    // Parse the JSON response
    let geminiResponse;
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      geminiResponse = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return res.status(500).json({ 
        message: "Failed to parse AI response",
        error: parseError.message 
      });
    }
    
    // Update each task in the database
    const updatePromises = geminiResponse.scheduledTasks.map(async (scheduledTask) => {
      try {
        const updatedTask = await Todo.findOneAndUpdate(
          { id: scheduledTask.id },
          {
            status: 'scheduled',
            duration: scheduledTask.duration,
            scheduledSlot: {
              date: new Date(scheduledTask.scheduledSlot.date),
              startTime: scheduledTask.scheduledSlot.startTime,
              endTime: scheduledTask.scheduledSlot.endTime,
              duration: scheduledTask.scheduledSlot.duration,
              reason: scheduledTask.scheduledSlot.reason
            }
          },
          { new: true }
        );
        
        if (!updatedTask) {
          console.error(`Task with id ${scheduledTask.id} not found`);
        }
        
        return updatedTask;
      } catch (updateError) {
        console.error(`Error updating task ${scheduledTask.id}:`, updateError);
        throw updateError;
      }
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    console.log("Schedule generated successfully");
    
    // Return optimization summary to frontend
    res.status(200).json({
      message: "Schedule generated successfully",
      optimizationSummary: geminiResponse.optimizationSummary
    });
    
  } catch (error) {
    console.error("Schedule generation error:", error);
    res.status(500).json({ 
      message: "Failed to generate schedule",
      error: error.message 
    });
  }
};