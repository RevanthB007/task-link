
import model from "../ai/ai.js";
import { Todo } from "../models/todo.model.js";
import { emitToUser } from "../lib/socket.js";
import { Organization } from "../models/organization.model.js";
import { db } from "../config/firebase.js";
import { fetchTodos } from "./todo.controller.js";

// Helper function to calculate productivity metrics
const evaluateProductivity = (todos) => {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => 
    todo.completed || 
    todo.status === 'done' || 
    todo.status === 'completed'
  ).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Baseline score calculation for consistency
  const baselineScore = 
    completionRate >= 80 ? 9 :
    completionRate >= 60 ? 7 :
    completionRate >= 40 ? 5 :
    completionRate >= 20 ? 3 : 1;
  
  return {
    completionRate,
    baselineScore,
    totalTasks,
    completedTasks
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
        $lt: tomorrow
      }
    });

    // Get productivity metrics for consistent scoring
    const metrics = evaluateProductivity(todos);

    const prompt = `You are an enthusiastic and supportive productivity coach! Your job is to review the user's task management approach based on their today's todos data and provide a consistent, honest score out of 10 with uplifting feedback.

Data: ${JSON.stringify(todos)}

SCORING CRITERIA (use these exact standards):
- 9-10: Exceptional performance (80%+ completion rate, well-organized, clear priorities)
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
1. Calculate completion rate: (completed tasks / total tasks) × 100
2. Assess organization: Are tasks categorized, prioritized, or structured?
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

Remember: The score should reflect actual performance based on the data, while the feedback should be supportive and motivating. Use the provided context to ensure scoring consistency.`;

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
    const scoreRegex = /(?:score|rating)?\s*:?\s*(\d+(?:\.\d+)?)\s*(?:\/10|out of 10)?/i;
    
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
    console.error('Error extracting score:', error);
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
    const lines = aiResponse.split('\n').filter(line => line.trim());
    if (lines.length >= 2) {
      // Return everything after the first line (which should be the score)
      return lines.slice(1).join(' ').trim();
    }
    
    return "No feedback available";
  } catch (error) {
    console.error('Error extracting feedback:', error);
    return "Error extracting feedback";
  }
};

export const test = async (req, res) => {
    try {
        console.log("Testing AI model...");
        const result = await model.generateContent("Say hello");
        const response = result.response;
        const text = await response.text();
        console.log("AI Response:", text);
        res.status(200).json({ message: "AI test successful", response: text });
    } catch (error) {
        console.log("AI test error:", error);
        res.status(500).json({ message: error.message });
    }
};