// components/sample.tsx
"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useFeedbackContract } from "@/hooks/useContract"

const SampleIntegration = () => {
  const { isConnected } = useAccount()
  const [message, setMessage] = useState("")
  const { data, actions, state } = useFeedbackContract()

  const handleSubmit = async () => {
    if (!message || message.trim().length === 0) return
    try {
      await actions.submitFeedback(message.trim())
      setMessage("")
    } catch (err) {
      console.error("Submit error:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-3">User Feedback</h2>
          <p className="text-muted-foreground">Please connect your wallet to submit feedback and view on-chain responses.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">User Feedback</h1>
          <p className="text-muted-foreground text-sm mt-1">Submit short feedback messages that are stored on-chain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Total Feedbacks</p>
            <p className="text-2xl font-semibold text-foreground">{data.feedbackCount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Latest Feedback</p>
            {data.latestFeedback ? (
              <div>
                <p className="text-sm font-medium text-foreground break-words mb-1">{data.latestFeedback.message}</p>
                <p className="text-xs text-muted-foreground">From: {data.latestFeedback.sender}</p>
                <p className="text-xs text-muted-foreground">At: {new Date(data.latestFeedback.timestamp * 1000).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No feedback yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Feedback</label>
            <textarea
              rows={4}
              placeholder="Write a short feedback message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={state.isLoading || state.isPending || !message.trim()}
            className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {state.isLoading || state.isPending ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>

        {state.hash && (
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Transaction Hash</p>
            <p className="text-sm font-mono text-foreground break-all mb-3">{state.hash}</p>
            {state.isConfirming && <p className="text-sm text-primary">Waiting for confirmation...</p>}
            {state.isConfirmed && <p className="text-sm text-green-500">Transaction confirmed!</p>}
          </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-card border border-destructive rounded-lg">
            <p className="text-sm text-destructive-foreground">Error: {state.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SampleIntegration
