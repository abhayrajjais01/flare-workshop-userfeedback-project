// hooks/useContract.ts
"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface FeedbackItem {
  sender: `0x${string}`
  message: string
  timestamp: number
}

export interface ContractData {
  feedbackCount: number
  latestFeedback: FeedbackItem | null
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  submitFeedback: (message: string) => Promise<void>
  refetch: () => void
}

export const useFeedbackContract = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const { data: rawFeedbackCount, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "feedbackCount",
  })

  const { data: rawLatest, refetch: refetchLatest } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "latestFeedback",
  })

  const { writeContractAsync, data: txData, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txData as any,
  })

  useEffect(() => {
    if (isConfirmed) {
      refetchCount()
      refetchLatest()
    }
  }, [isConfirmed, refetchCount, refetchLatest])

  const submitFeedback = async (message: string) => {
    if (!message || message.trim().length === 0) {
      throw new Error("Message cannot be empty")
    }
    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "submitFeedback",
        args: [message],
      })
    } catch (err: any) {
      console.error("Error submitting feedback:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const feedbackCount = rawFeedbackCount ? Number(rawFeedbackCount as bigint) : 0

  let latestFeedback: FeedbackItem | null = null
  if (rawLatest && Array.isArray(rawLatest) && rawLatest.length >= 3) {
    latestFeedback = {
      sender: rawLatest[0] as `0x${string}`,
      message: rawLatest[1] as string,
      timestamp: Number(rawLatest[2] as bigint),
    }
  }

  const data: ContractData = {
    feedbackCount,
    latestFeedback,
  }

  const actions: ContractActions = {
    submitFeedback,
    refetch: () => {
      refetchCount()
      refetchLatest()
    },
  }

  const state: ContractState = {
    isLoading: isLoading || false,
    isPending: Boolean(txData),
    isConfirming,
    isConfirmed,
    hash: txData as `0x${string}` | undefined,
    error: error ?? null,
  }

  return {
    data,
    actions,
    state,
  }
}
