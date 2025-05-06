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
  jobSkill: string;
  technicalLanguage?: string;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
}

// Job skill definitions grouped by job category
export const jobSkillsByCategory: Record<string, string[]> = {
  "Software Engineering": [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile App Development",
    "DevOps",
    "Cloud Architecture",
    "Database Management",
    "UI/UX Development"
  ],
  "Data Science": [
    "Machine Learning",
    "Data Analysis",
    "Big Data Processing",
    "Statistical Modeling",
    "Natural Language Processing",
    "Computer Vision",
    "Data Visualization",
    "Data Engineering"
  ],
  "Product Management": [
    "Product Strategy",
    "User Research",
    "Market Analysis",
    "Agile Methodologies",
    "Roadmap Planning",
    "Product Analytics",
    "Cross-functional Leadership",
    "Product Launch"
  ],
  "Marketing": [
    "Digital Marketing",
    "Content Strategy",
    "SEO/SEM",
    "Social Media Marketing",
    "Marketing Analytics",
    "Brand Management",
    "Email Marketing",
    "Growth Marketing"
  ],
  "Sales": [
    "B2B Sales",
    "B2C Sales",
    "Sales Strategy",
    "Account Management",
    "Lead Generation",
    "Negotiation",
    "CRM Management",
    "Sales Analytics"
  ],
  "Customer Success": [
    "Customer Support",
    "Client Relationship Management",
    "User Onboarding",
    "Retention Strategies",
    "Technical Support",
    "Customer Feedback Analysis",
    "Customer Education",
    "Service Quality Assurance"
  ],
  "Design": [
    "UI Design",
    "UX Design",
    "Visual Design",
    "Interaction Design",
    "Product Design",
    "Design Systems",
    "Usability Testing",
    "Graphic Design"
  ],
  "Finance": [
    "Financial Analysis",
    "Investment Management",
    "Financial Planning",
    "Risk Assessment",
    "Accounting",
    "Financial Reporting",
    "Budgeting",
    "Forecasting"
  ],
  "Human Resources": [
    "Talent Acquisition",
    "Employee Relations",
    "Performance Management",
    "Compensation & Benefits",
    "HR Operations",
    "Learning & Development",
    "Diversity & Inclusion",
    "Organizational Development"
  ]
};

class InterviewService {
  private session: InterviewSession | null = null;

  startSession(jobCategory: string, jobSkill: string, technicalLanguage?: string): InterviewSession {
    // Initialize a new interview session
    this.session = {
      jobCategory,
      jobSkill,
      technicalLanguage,
      currentQuestionIndex: 0,
      questions: this.getInitialQuestions(jobCategory, jobSkill, technicalLanguage),
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

  private getInitialQuestions(jobCategory: string, jobSkill: string, technicalLanguage?: string): InterviewQuestion[] {
    // Initial questions based on job category
    const commonQuestions = [
      {
        id: "q1",
        text: `Tell me about your background and experience in ${jobCategory}, particularly with ${jobSkill}${technicalLanguage ? ` using ${technicalLanguage}` : ''}.`,
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
    
    // Technical language specific question
    const technicalQuestion = technicalLanguage ? [
      {
        id: "tech1",
        text: `Describe a challenging problem you solved using ${technicalLanguage} in a ${jobSkill} context.`,
        category: "technical_language"
      }
    ] : [];
    
    // Add category-specific and skill-specific questions
    const categoryQuestions: Record<string, InterviewQuestion[]> = {
      "Software Engineering": [
        {
          id: "se1",
          text: `Describe a complex ${jobSkill} challenge you've faced${technicalLanguage ? ` with ${technicalLanguage}` : ''} and how you solved it.`,
          category: "technical"
        },
        {
          id: "se2",
          text: `How do you stay updated with the latest trends and practices in ${jobSkill}${technicalLanguage ? ` and ${technicalLanguage}` : ''}?`,
          category: "learning"
        }
      ],
      "Data Science": [
        {
          id: "ds1",
          text: `Explain a data project involving ${jobSkill}${technicalLanguage ? ` using ${technicalLanguage}` : ''} where you derived actionable insights.`,
          category: "technical"
        },
        {
          id: "ds2",
          text: `How do you ensure the statistical validity of your models when working with ${jobSkill}${technicalLanguage ? ` in a ${technicalLanguage} environment` : ''}?`,
          category: "methodology"
        }
      ],
      "Product Management": [
        {
          id: "pm1",
          text: `How do you prioritize features in your product roadmap, especially for ${jobSkill} initiatives?`,
          category: "strategy"
        },
        {
          id: "pm2",
          text: `Tell me about a time when you had to make a difficult product decision related to ${jobSkill} based on user feedback.`,
          category: "decision_making"
        }
      ],
      // Add more categories as needed
    };
    
    return [
      ...commonQuestions,
      ...technicalQuestion,
      ...(categoryQuestions[jobCategory] || [])
    ];
  }

  private async generateFollowUpQuestion(): Promise<InterviewQuestion | null> {
    if (!this.session) return null;
    
    // Instead of using OpenAI API directly, this function would now connect to your own backend
    // For now, we'll create a placeholder follow-up question to maintain functionality
    
    try {
      // This mock function simulates what your backend would do
      const jobCategory = this.session.jobCategory;
      const jobSkill = this.session.jobSkill;
      const technicalLanguage = this.session.technicalLanguage;
      
      // Create a generic follow-up question based on the session data
      const followUpText = `Tell me more about your experience with ${jobSkill} ${technicalLanguage ? 
        `using ${technicalLanguage}` : 
        ''} in the ${jobCategory} field. What specific challenges have you encountered?`;
      
      return {
        id: `gen-${this.session.questions.length + 1}`,
        text: followUpText,
        category: "follow_up"
      };
    } catch (error) {
      console.error("Error generating follow-up question:", error);
      throw error;
    }
  }

  getFeedback(): Promise<string> {
    if (!this.session) {
      return Promise.reject("No active session");
    }
    
    // Similar to generateFollowUpQuestion, this would connect to your backend
    // For now, we'll create a placeholder feedback response
    
    return new Promise((resolve) => {
      // Create a generic feedback based on session data
      const { jobCategory, jobSkill, technicalLanguage, questions, responses } = this.session!;
      
      const feedbackText = `
# Interview Feedback

## Overview
You've completed an interview for a ${jobCategory} position focusing on ${jobSkill}${technicalLanguage ? ` with ${technicalLanguage}` : ''}.

## Strengths
- You provided detailed responses to the questions
- Your answers demonstrated knowledge of ${jobSkill}

## Areas for Improvement
- Consider providing more specific examples in your answers
- Focus on quantifiable achievements when possible

## Preparation Tips
- Research more about current trends in ${jobCategory}
- Prepare stories that highlight your experience with ${jobSkill}${technicalLanguage ? ` and ${technicalLanguage}` : ''}
- Practice explaining technical concepts in a clear, concise manner

Keep practicing and refining your interview skills!
      `;
      
      // Return the feedback text after a short delay to simulate API call
      setTimeout(() => resolve(feedbackText), 500);
    });
  }
}

export const interviewService = new InterviewService();
