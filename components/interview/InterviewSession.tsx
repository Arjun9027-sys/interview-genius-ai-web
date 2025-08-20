'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Send } from 'lucide-react'

interface Question {
  id: string
  text: string
  category: string
}

interface InterviewSessionProps {
  jobCategory: string
  jobSkill: string
  technicalLanguage: string
  onBack: () => void
}

export default function InterviewSession({
  jobCategory,
  jobSkill,
  technicalLanguage,
  onBack
}: InterviewSessionProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userResponse, setUserResponse] = useState('')
  const [responses, setResponses] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isInterviewComplete, setIsInterviewComplete] = useState(false)

  useEffect(() => {
    startInterview()
  }, [])

  const startInterview = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobCategory,
          jobSkill,
          technicalLanguage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
      } else {
        console.error('Failed to start interview')
      }
    } catch (error) {
      console.error('Error starting interview:', error)
    }
    setIsLoading(false)
  }

  const submitResponse = async () => {
    if (!userResponse.trim()) return

    setIsLoading(true)
    const newResponses = [...responses, userResponse]
    setResponses(newResponses)

    try {
      if (currentQuestionIndex < questions.length - 1) {
        // Get next question
        const response = await fetch('/api/interview/response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobCategory,
            jobSkill,
            technicalLanguage,
            currentQuestionId: questions[currentQuestionIndex].id,
            userResponse,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.nextQuestion) {
            setQuestions([...questions, data.nextQuestion])
          }
        }

        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setUserResponse('')
      } else {
        // Interview complete, get feedback
        const response = await fetch('/api/interview/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobCategory,
            jobSkill,
            technicalLanguage,
            responses: newResponses.map((r, i) => ({ text: r })),
            questions,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setFeedback(data.feedback)
          setIsInterviewComplete(true)
        }
      }
    } catch (error) {
      console.error('Error submitting response:', error)
    }
    setIsLoading(false)
  }

  if (isLoading && questions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Generating your interview questions...</p>
        </CardContent>
      </Card>
    )
  }

  if (isInterviewComplete) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Interview Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Feedback:</h3>
            <p className="whitespace-pre-wrap">{feedback}</p>
          </div>
          <Button onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Start New Interview
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestion && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-lg">{currentQuestion.text}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="response" className="text-sm font-medium">
            Your Response:
          </label>
          <Textarea
            id="response"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
          />
        </div>

        <Button 
          onClick={submitResponse}
          disabled={!userResponse.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
            </>
          )}
        </Button>

        {responses.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Previous Responses:</h3>
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="bg-secondary p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Q{index + 1}: {questions[index]?.text}</p>
                  <p className="text-sm text-muted-foreground">{response}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}