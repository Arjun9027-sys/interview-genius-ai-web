
import { toast } from "sonner";

// Types for our interview system
export interface InterviewQuestion {
  id: string;
  text: string;
  category: string;
}

export interface InterviewResponse {
  questionId: string;
  text: string;
}

export interface InterviewSession {
  jobCategory: string;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
}

class InterviewService {
  private apiKey: string | null = null;
  private session: InterviewSession | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai_api_key');
    }
    return this.apiKey;
  }

  startSession(jobCategory: string): InterviewSession {
    // Initialize a new interview session
    this.session = {
      jobCategory,
      currentQuestionIndex: 0,
      questions: this.getInitialQuestions(jobCategory),
      responses: []
    };
    return this.session;
  }

  getCurrentSession(): InterviewSession | null {
    return this.session;
  }

  getCurrentQuestion(): InterviewQuestion | null {
    if (!this.session) return null;
    
    const { currentQuestionIndex, questions } = this.session;
    if (currentQuestionIndex >= questions.length) return null;
    
    return questions[currentQuestionIndex];
  }

  async submitResponse(text: string): Promise<InterviewQuestion | null> {
    if (!this.session || !this.getCurrentQuestion()) return null;
    
    const currentQuestion = this.getCurrentQuestion()!;
    
    // Save the response
    this.session.responses.push({
      questionId: currentQuestion.id,
      text
    });
    
    // Move to the next question or generate a follow-up
    this.session.currentQuestionIndex++;
    
    // If we've used all pre-defined questions, generate a follow-up
    if (this.session.currentQuestionIndex >= this.session.questions.length) {
      try {
        const newQuestion = await this.generateFollowUpQuestion();
        if (newQuestion) {
          this.session.questions.push(newQuestion);
        }
      } catch (error) {
        console.error("Failed to generate follow-up question:", error);
        toast.error("Failed to generate follow-up question");
        return null;
      }
    }
    
    return this.getCurrentQuestion();
  }

  private getInitialQuestions(jobCategory: string): InterviewQuestion[] {
    // Initial questions based on job category
    const commonQuestions = [
      {
        id: "q1",
        text: "Tell me about your background and experience in this field.",
        category: "general"
      },
      {
        id: "q2",
        text: "What do you consider your biggest professional achievement?",
        category: "achievements"
      },
      {
        id: "q3",
        text: "How do you handle challenging situations or conflicts in the workplace?",
        category: "soft_skills"
      }
    ];
    
    // Add category-specific questions
    const categoryQuestions: Record<string, InterviewQuestion[]> = {
      "Software Engineering": [
        {
          id: "se1",
          text: "Describe a complex technical challenge you've faced and how you solved it.",
          category: "technical"
        },
        {
          id: "se2",
          text: "How do you stay updated with the latest technologies and programming practices?",
          category: "learning"
        }
      ],
      "Data Science": [
        {
          id: "ds1",
          text: "Explain a data project where you derived actionable insights that impacted business decisions.",
          category: "technical"
        },
        {
          id: "ds2",
          text: "How do you ensure the statistical validity of your models?",
          category: "methodology"
        }
      ],
      "Product Management": [
        {
          id: "pm1",
          text: "How do you prioritize features in your product roadmap?",
          category: "strategy"
        },
        {
          id: "pm2",
          text: "Tell me about a time when you had to make a difficult product decision based on user feedback.",
          category: "decision_making"
        }
      ],
      // Add more categories as needed
    };
    
    return [
      ...commonQuestions,
      ...(categoryQuestions[jobCategory] || [])
    ];
  }

  private async generateFollowUpQuestion(): Promise<InterviewQuestion | null> {
    if (!this.apiKey || !this.session) return null;
    
    // Prepare the context for generating a follow-up question
    const jobCategory = this.session.jobCategory;
    const previousQuestions = this.session.questions.map(q => q.text).join("\n");
    const previousResponses = this.session.responses.map(r => r.text).join("\n");
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an AI interviewer for a ${jobCategory} position. Generate a follow-up question based on the candidate's previous responses. The question should be challenging but fair, and should help assess the candidate's skills and fit for the role. Make the question specific to something mentioned in their previous responses.`
            },
            {
              role: "user",
              content: `Previous questions: ${previousQuestions}\n\nCandidate's responses: ${previousResponses}\n\nPlease generate a follow-up question that digs deeper into the candidate's experience, technical skills, or problem-solving abilities related to ${jobCategory}.`
            }
          ],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      const generatedQuestion = data.choices[0]?.message?.content;
      
      if (!generatedQuestion) {
        throw new Error("No question generated");
      }
      
      return {
        id: `gen-${this.session.questions.length + 1}`,
        text: generatedQuestion,
        category: "follow_up"
      };
    } catch (error) {
      console.error("Error generating follow-up question:", error);
      throw error;
    }
  }

  getFeedback(): Promise<string> {
    if (!this.apiKey || !this.session) {
      return Promise.reject("No active session or API key");
    }
    
    // Prepare all questions and responses
    const responseData = this.session.questions.map((question, index) => {
      const response = this.session.responses[index] || { text: "No response provided" };
      return { question: question.text, response: response.text };
    });
    
    return fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert interviewer and career coach. Provide constructive feedback on the candidate's interview responses for a ${this.session.jobCategory} position. Focus on strengths, areas for improvement, and specific advice for future interviews.`
          },
          {
            role: "user",
            content: `Here are the interview questions and the candidate's responses:\n\n${JSON.stringify(responseData, null, 2)}\n\nPlease provide comprehensive feedback on the candidate's interview performance.`
          }
        ],
        temperature: 0.7
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      const feedback = data.choices[0]?.message?.content;
      if (!feedback) {
        throw new Error("No feedback generated");
      }
      return feedback;
    });
  }
}

export const interviewService = new InterviewService();
