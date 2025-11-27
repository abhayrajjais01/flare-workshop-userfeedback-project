// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleFeedback - beginner smart contract to collect user feedback
/// @notice No constructor inputs during deployment. Anyone can submit feedback.
contract SimpleFeedback {
    struct Feedback {
        address sender;
        string message;
        uint256 timestamp;
    }

    Feedback[] private feedbacks;

    /// @notice Emitted when a new feedback is submitted
    event FeedbackSubmitted(address indexed sender, uint256 indexed index, uint256 timestamp);

    /// @notice Submit feedback. Use calldata for gas savings.
    /// @param message The feedback text (keep it reasonably short to avoid high gas)
    function submitFeedback(string calldata message) external {
        // basic validation: disallow empty messages
        require(bytes(message).length > 0, "Message empty");

        feedbacks.push(Feedback({
            sender: msg.sender,
            message: message,
            timestamp: block.timestamp
        }));

        uint256 index = feedbacks.length - 1;
        emit FeedbackSubmitted(msg.sender, index, block.timestamp);
    }

    /// @notice Returns number of feedback entries stored
    function feedbackCount() external view returns (uint256) {
        return feedbacks.length;
    }

    /// @notice Read a feedback by index
    /// @param index The feedback index (0..feedbackCount()-1)
    /// @return sender Address who submitted
    /// @return message The feedback text
    /// @return timestamp When it was submitted (unix)
    function getFeedback(uint256 index) external view returns (address sender, string memory message, uint256 timestamp) {
        require(index < feedbacks.length, "Index OOB");
        Feedback storage f = feedbacks[index];
        return (f.sender, f.message, f.timestamp);
    }

    /// @notice Convenience: return the last feedback (reverts if none)
    function latestFeedback() external view returns (address sender, string memory message, uint256 timestamp) {
        require(feedbacks.length > 0, "No feedback yet");
        Feedback storage f = feedbacks[feedbacks.length - 1];
        return (f.sender, f.message, f.timestamp);
    }
}

