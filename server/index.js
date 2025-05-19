import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Predefined questions by category
const questionBank = {
  "Software Engineering": {
    "Frontend Development": [
      "Explain the virtual DOM and its benefits in React",
      "What are React hooks and how do they improve component logic?",
      "Describe the difference between controlled and uncontrolled components",
      "How do you handle state management in large React applications?"
    ],
    "Backend Development": [
      "Explain RESTful API design principles",
      "How do you handle database transactions?",
      "Describe microservices architecture and its benefits",
      "How do you implement authentication and authorization?"
    ]
  },
  "Data Science": {
    "Machine Learning": [
      "Explain the difference between supervised and unsupervised learning",
      "How do you handle overfitting in machine learning models?",
      "Describe the process of feature selection",
      "What evaluation metrics do you use for classification problems?"
    ]
  }
};

// Helper function to get random questions from the question bank
function getRandomQuestions(category, skill, count = 3) {
  const questions = questionBank[category]?.[skill] || [];
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Start interview session endpoint
app.post('/api/interview/start', async (req, res) => {
  try {
    const { jobCategory, jobSkill, technicalLanguage } = req.body;

    // Get initial questions from question bank
    const baseQuestions = getRandomQuestions(jobCategory, jobSkill);

    // Generate additional questions using OpenAI
    const prompt = `Generate 2 technical interview questions for a ${jobSkill} position${
      technicalLanguage ? ` focusing on ${technicalLanguage}` : ''
    } in ${jobCategory}. Questions should be challenging and specific to the role.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an expert technical interviewer. Generate specific, technical questions that assess both theoretical knowledge and practical experience."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    // Extract generated questions
    const aiQuestions = completion.choices[0].message.content
      .split('\n')
      .filter(q => q.trim())
      .map((q, index) => ({
        id: `ai-${index}`,
        text: q.replace(/^\d+\.\s*/, '').trim(),
        category: 'technical'
      }));

    // Combine predefined and AI-generated questions
    const questions = [
      ...baseQuestions.map((q, index) => ({
        id: `base-${index}`,
        text: q,
        category: 'technical'
      })),
      ...aiQuestions
    ];

    res.json({ questions });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ error: 'Failed to start interview session' });
  }
});

// Submit response and get feedback
app.post('/api/interview/response', async (req, res) => {
  try {
    const { 
      jobCategory, 
      jobSkill, 
      technicalLanguage, 
      currentQuestionId, 
      userResponse 
    } = req.body;

    // Generate follow-up question based on the response
    const prompt = `Based on this response to a ${jobSkill} interview question: "${userResponse}",
      generate a relevant follow-up question that digs deeper into the candidate's knowledge of ${
        technicalLanguage ? `${technicalLanguage} and ` : ''
      }${jobSkill}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Generate follow-up questions that probe deeper into the candidate's knowledge and experience."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const followUpQuestion = {
      id: `follow-up-${Date.now()}`,
      text: completion.choices[0].message.content.trim(),
      category: 'follow_up'
    };

    res.json({ nextQuestion: followUpQuestion });
  } catch (error) {
    console.error('Error processing response:', error);
    res.status(500).json({ error: 'Failed to process response' });
  }
});

// Get interview feedback
app.post('/api/interview/feedback', async (req, res) => {
  try {
    const { 
      jobCategory, 
      jobSkill, 
      technicalLanguage, 
      responses, 
      questions 
    } = req.body;

    // Create a summary of the interview
    const interviewSummary = responses.map((r, i) => {
      const question = questions[i];
      return `Q: ${question.text}\nA: ${r.text}`;
    }).join('\n\n');

    const prompt = `Provide detailed feedback for a ${jobSkill} interview${
      technicalLanguage ? ` focusing on ${technicalLanguage}` : ''
    } in ${jobCategory}. Here are the questions and answers:\n\n${interviewSummary}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Provide constructive feedback on the candidate's responses, highlighting strengths and areas for improvement."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    res.json({ feedback: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});