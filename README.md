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

If you'd like a different merge (for example, preserve a specific deployed tx link `0x426c8...`), tell me which parts to keep and I'll reapply accordingly.
