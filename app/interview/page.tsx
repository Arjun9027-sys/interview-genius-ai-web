import InterviewSetup from '@/components/interview/InterviewSetup'

export default function InterviewPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 gradient-text">
              AI Interview Practice
            </h1>
            <p className="text-muted-foreground">
              Configure your interview session and start practicing
            </p>
          </div>
          <InterviewSetup />
        </div>
      </div>
    </div>
  )
}