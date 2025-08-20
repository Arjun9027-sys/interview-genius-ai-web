'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Play } from 'lucide-react'
import InterviewSession from './InterviewSession'

const jobCategories = [
  'Software Engineering',
  'Data Science',
  'Product Management',
  'Design',
  'Marketing'
]

const jobSkills = {
  'Software Engineering': ['Frontend Development', 'Backend Development', 'Full Stack', 'DevOps'],
  'Data Science': ['Machine Learning', 'Data Analysis', 'Data Engineering', 'AI Research'],
  'Product Management': ['Product Strategy', 'Growth', 'Analytics', 'User Research'],
  'Design': ['UI/UX Design', 'Product Design', 'Graphic Design', 'Design Systems'],
  'Marketing': ['Digital Marketing', 'Content Marketing', 'Growth Marketing', 'Brand Marketing']
}

const technicalLanguages = [
  'JavaScript', 'Python', 'Java', 'TypeScript', 'React', 'Node.js', 
  'SQL', 'AWS', 'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch'
]

export default function InterviewSetup() {
  const [jobCategory, setJobCategory] = useState('')
  const [jobSkill, setJobSkill] = useState('')
  const [technicalLanguage, setTechnicalLanguage] = useState('')
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)

  const handleStartInterview = () => {
    if (jobCategory && jobSkill) {
      setIsInterviewStarted(true)
    }
  }

  if (isInterviewStarted) {
    return (
      <InterviewSession
        jobCategory={jobCategory}
        jobSkill={jobSkill}
        technicalLanguage={technicalLanguage}
        onBack={() => setIsInterviewStarted(false)}
      />
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Interview Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job-category">Job Category</Label>
          <Select value={jobCategory} onValueChange={setJobCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a job category" />
            </SelectTrigger>
            <SelectContent>
              {jobCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-skill">Job Skill</Label>
          <Select 
            value={jobSkill} 
            onValueChange={setJobSkill}
            disabled={!jobCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a job skill" />
            </SelectTrigger>
            <SelectContent>
              {jobCategory && jobSkills[jobCategory as keyof typeof jobSkills]?.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technical-language">Technical Language (Optional)</Label>
          <Select value={technicalLanguage} onValueChange={setTechnicalLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select a technical language/framework" />
            </SelectTrigger>
            <SelectContent>
              {technicalLanguages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleStartInterview}
          disabled={!jobCategory || !jobSkill}
          className="w-full"
          size="lg"
        >
          <Play className="mr-2 h-4 w-4" />
          Start Interview
        </Button>
      </CardContent>
    </Card>
  )
}