# On-Chain User Feedback

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-live-brightgreen)

This repository implements a minimal, beginner-friendly smart contract and frontend helpers that let users submit short feedback messages on-chain (Flare Coston2 testnet example). It is intended as an educational/demo project and a small production-ready pattern for wallet-gated feedback collection.

## Project Summary

- **Contract**: `SimpleFeedback` — accepts short string messages, stores them in a `Feedback` struct array, and emits `FeedbackSubmitted` events.
- **Frontend helpers**: typed ABI (`lib/contract.ts`), `hooks/useContract.ts` hook for read/write flows, and a sample UI component in `components/sample.tsx`.
- **Deployment**: example deployed address on Coston2 testnet shown below.

## Deployed Contract
`0x429b583a22099C7f8FE4De17a06F4fFC33489d92`
https://coston2-explorer.flare.network/address/0x429b583a22099C7f8FE4De17a06F4fFC33489d92

## What It Does

- `submitFeedback(string message)` — stores message, sender address, and timestamp.
- `feedbackCount()` — returns number of feedback entries.
- `getFeedback(uint256 index)` — returns a specific feedback entry.
- `latestFeedback()` — convenience to return the last feedback.

## Features & Integration Notes

- Wallet-gated submissions: users must connect a web3 wallet to submit.
- Small ABI and no constructor parameters make deployment easy.
- The `useFeedbackContract` hook centralises transaction state (pending/confirmed), refetches after confirmations, and surfaces errors for the UI.
- For production: consider input length caps, off-chain storage + on-chain hash for large payloads, and pagination if the feedback list grows.

## Example Smart Contract (excerpt)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleFeedback - collect short user feedback on-chain
contract SimpleFeedback {
    struct Feedback {
        address sender;
        string message;
        uint256 timestamp;
    }

    Feedback[] private feedbacks;

    event FeedbackSubmitted(address indexed sender, uint256 indexed index, uint256 timestamp);

    function submitFeedback(string calldata message) external {
        require(bytes(message).length > 0, "Message empty");
        feedbacks.push(Feedback({ sender: msg.sender, message: message, timestamp: block.timestamp }));
        uint256 index = feedbacks.length - 1;
        emit FeedbackSubmitted(msg.sender, index, block.timestamp);
    }

    function feedbackCount() external view returns (uint256) {
        return feedbacks.length;
    }

    function getFeedback(uint256 index) external view returns (address sender, string memory message, uint256 timestamp) {
        require(index < feedbacks.length, "Index OOB");
        Feedback storage f = feedbacks[index];
        return (f.sender, f.message, f.timestamp);
    }

    function latestFeedback() external view returns (address sender, string memory message, uint256 timestamp) {
        require(feedbacks.length > 0, "No feedback yet");
        Feedback storage f = feedbacks[feedbacks.length - 1];
        return (f.sender, f.message, f.timestamp);
    }
}
```

## How to Use

1. Install dependencies and run the frontend (see `package.json`).
2. Connect a wallet and use the sample component to read the latest feedback or submit a new one.
3. For integrations, use the ABI in `lib/contract.ts` and the deployed address above.

---
# On-Chain User Feedback

## Project Title
On-Chain User Feedback — Simple feedback collection stored on the Flare Coston2 testnet

## Contract Address
`0x429b583a22099C7f8FE4De17a06F4fFC33489d92`  
https://coston2-explorer.flare.network/address/0x429b583a22099C7f8FE4De17a06F4fFC33489d92

## Description
This project provides a minimal, production-oriented interface to a smart contract that stores short user feedback messages on-chain. The intention is to demonstrate a transparent, tamper-evident way to collect user comments or lightweight feedback without off-chain storage. The front-end is wallet-gated: users must connect their web3 wallet to submit feedback. Submissions are simple transactions that emit an event and append feedback to an on-chain array (accessible via read-only contract calls).

The repository includes:
- A typed ABI and contract address reference (`lib/contract.ts`).
- A React hook (`hooks/useContract.ts`) that wraps read/write interactions, manages loading state, transaction lifecycle, and automatic refetches after confirmation.
- A sample UI component (`components/sample.tsx`) that shows contract stats (total feedback count, latest feedback) and a form to submit new feedback.

## Features
- **Wallet-gated submissions**: users must connect their wallet to submit feedback.
- **On-chain storage**: feedback is recorded on-chain; each submission emits a `FeedbackSubmitted` event.
- **Read access**: contract exposes `feedbackCount` and `latestFeedback` for efficient reads.
- **UX-friendly hook**: the included React hook encapsulates read/write calls, handles transaction hashes, confirmation states, refetching after confirmations, and surfaces errors for straightforward UI integration.
- **Minimal surface area**: no constructor parameters and a small ABI — easy to audit and integrate.

## How It Solves the Problem
### Problem
Collecting user feedback usually relies on centralised databases or third-party services, which introduces trust issues (data tampering, censorship), single points of failure, and complexity for transparency/audit requirements.

### Solution
This project demonstrates a simple, auditable pattern to collect feedback on an EVM-compatible chain (Flare Coston2 testnet). By storing feedback on-chain:
- **Integrity**: feedback cannot be altered without leaving an on-chain trace.
- **Transparency**: anyone can read submitted feedback via the contract or explorer.
- **Simplicity**: the smart contract exposes a minimal API (`feedbackCount`, `latestFeedback`, `getFeedback`, `submitFeedback`) which simplifies frontend integration.
- **Portability**: the same pattern can be used for public comment systems, audit trails, or simple message boards where immutability and provenance are desirable.

### Typical Use Cases
- Small projects that want a public, untampered log of user comments.
- Prototype demos for on-chain message storage.
- Educational examples showing how to build simple dApps with a read/write flow and transaction confirmation UX.

## Technical Notes & Integration Tips
- The hook `useFeedbackContract` centralises behavior:
  - Reads `feedbackCount` and `latestFeedback`.
  - Submits via `submitFeedback(message)` and triggers refetches after confirmation.
  - Exposes `state` with `isLoading`, `isPending`, `isConfirming`, `isConfirmed`, `hash`, and `error` to drive UI feedback.
- The sample UI demonstrates:
  - Wallet gating (users are prompted to connect before interacting).
  - Clear UX for submitting messages and monitoring transaction status.
  - Read-only cards showing total feedback count and latest entry.
- For production or larger messages:
  - On-chain storage costs rise with message size; consider off-chain storage + on-chain hash if you need large payloads.
  - Add input length caps and validation to reduce gas costs and avoid abuse.
  - Consider pagination / batched reads if `feedbackCount` grows large.

## Contract ABI & Address
The project uses the ABI exported in `lib/contract.ts` and the deployed address above. Use those values for any external integrations (viem, ethers, wagmi, etc.).

---


If you'd like a different merge (for example, preserve a specific deployed tx link `0x426c8...`), tell me which parts to keep and I'll reapply accordingly.
