# flare-workshop-userfeedback-project
# ⭐ Simple Feedback Smart Contract

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-live-brightgreen)

A minimal, beginner-friendly Solidity smart contract that lets users submit feedback directly on-chain.  
Perfect for learning how to:

- Store user data on the blockchain
- Work with events
- Interact with smart contracts from a frontend

---

## 📌 Project Description

The **SimpleFeedback** contract allows anyone to send a feedback message, which is then stored on-chain together with:

- The sender’s wallet address
- The message text
- The timestamp of submission

There are **no constructor inputs** required during deployment — you just deploy and start using it.  
This makes it ideal for beginners experimenting with Solidity and dApp basics.

---

## 🚀 What It Does

- Accepts a feedback message from any address using `submitFeedback(string message)`.
- Saves each feedback in a list as a `Feedback` struct.
- Emits a `FeedbackSubmitted` event whenever a new feedback is added.
- Provides read-only functions to:
  - Get the total number of feedback entries
  - Read a specific feedback by index
  - Fetch the latest feedback submitted

---

## ✨ Features

- **Zero deployment parameters** – clean and simple deployment.
- **Struct-based storage** – feedback data is neatly organized.
- **Event-driven design** – `FeedbackSubmitted` makes it easy to plug into UIs or indexers.
- **View functions**:
  - `feedbackCount()` – total feedback entries
  - `getFeedback(uint256 index)` – get specific feedback
  - `latestFeedback()` – get the most recent feedback
- **Beginner-friendly** – straightforward logic, easy to extend.

---

## 🔗 Deployed Smart Contract Link

`https://coston2-explorer.flare.network//tx/0x426c8cc4ea16e786682f76dc6c842407d2d22d0c2b231969c0b9fedcb05d763d`

---

## 🧪 Example Use Cases

You can use this contract for:

- Collecting product feedback from users
- Gathering suggestions during a hackathon/dApp demo
- Learning how to work with:
  - `struct`
  - dynamic arrays
  - events
  - `view` functions
  - basic input validation (`require`)

---

## 🧾 Smart Contract Code

```solidity
// SPDX-License-Identifier: MIT pragma solidity ^0.8.20; /// @title SimpleFeedback - beginner smart contract to collect user feedback /// @notice No constructor inputs during deployment. Anyone can submit feedback. contract SimpleFeedback { struct Feedback { address sender; string message; uint256 timestamp; } Feedback[] private feedbacks; /// @notice Emitted when a new feedback is submitted event FeedbackSubmitted(address indexed sender, uint256 indexed index, uint256 timestamp); /// @notice Submit feedback. Use calldata for gas savings. /// @param message The feedback text (keep it reasonably short to avoid high gas) function submitFeedback(string calldata message) external { // basic validation: disallow empty messages require(bytes(message).length > 0, "Message empty"); feedbacks.push(Feedback({ sender: msg.sender, message: message, timestamp: block.timestamp })); uint256 index = feedbacks.length - 1; emit FeedbackSubmitted(msg.sender, index, block.timestamp); } /// @notice Returns number of feedback entries stored function feedbackCount() external view returns (uint256) { return feedbacks.length; } /// @notice Read a feedback by index /// @param index The feedback index (0..feedbackCount()-1) /// @return sender Address who submitted /// @return message The feedback text /// @return timestamp When it was submitted (unix) function getFeedback(uint256 index) external view returns (address sender, string memory message, uint256 timestamp) { require(index < feedbacks.length, "Index OOB"); Feedback storage f = feedbacks[index]; return (f.sender, f.message, f.timestamp); } /// @notice Convenience: return the last feedback (reverts if none) function latestFeedback() external view returns (address sender, string memory message, uint256 timestamp) { require(feedbacks.length > 0, "No feedback yet"); Feedback storage f = feedbacks[feedbacks.length - 1]; return (f.sender, f.message, f.timestamp); } }

