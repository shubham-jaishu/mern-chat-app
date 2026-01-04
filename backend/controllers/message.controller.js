import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		if (!message || !message.trim()) {
			return res.status(400).json({ error: "Message cannot be empty" });
		}

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// Run in parallel for better performance
		await Promise.all([conversation.save(), newMessage.save()]);

		// Socket.io functionality
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages");

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const addReaction = async (req, res) => {
	try {
		const { messageId } = req.params;
		const { emoji } = req.body;
		const userId = req.user._id;

		if (!emoji || !emoji.trim()) {
			return res.status(400).json({ error: "Emoji is required" });
		}

		const message = await Message.findById(messageId);

		if (!message) {
			return res.status(404).json({ error: "Message not found" });
		}

		// Remove all previous reactions from this user on this message
		message.reactions = message.reactions.filter(
			(r) => r.userId.toString() !== userId.toString()
		);

		// Check if user is reacting with the same emoji (toggle off)
		const hasSameReaction = message.reactions.some(
			(r) => r.userId.toString() === userId.toString() && r.emoji === emoji
		);

		// If not the same emoji, add the new reaction
		if (!hasSameReaction) {
			message.reactions.push({
				emoji,
				userId,
			});
		}

		await message.save();

		// Broadcast to both users
		const receiverSocketId = getReceiverSocketId(message.receiverId);
		const senderSocketId = getReceiverSocketId(message.senderId);

		console.log("Reaction - Receiver socket:", receiverSocketId, "Sender socket:", senderSocketId);

		const reactionData = {
			messageId: message._id,
			reactions: message.reactions,
		};

		// Emit to receiver
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("reactionAdded", reactionData);
		}

		// Emit to sender
		if (senderSocketId) {
			io.to(senderSocketId).emit("reactionAdded", reactionData);
		}

		res.status(200).json(message);
	} catch (error) {
		console.log("Error in addReaction controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const removeReaction = async (req, res) => {
	try {
		const { messageId } = req.params;
		const { emoji } = req.body;
		const userId = req.user._id;

		const message = await Message.findById(messageId);

		if (!message) {
			return res.status(404).json({ error: "Message not found" });
		}

		message.reactions = message.reactions.filter(
			(r) => !(r.userId.toString() === userId.toString() && r.emoji === emoji)
		);

		await message.save();

		// Broadcast to both users
		const receiverSocketId = getReceiverSocketId(message.receiverId);
		const senderSocketId = getReceiverSocketId(message.senderId);

		console.log("Reaction Remove - Receiver socket:", receiverSocketId, "Sender socket:", senderSocketId);

		const reactionData = {
			messageId: message._id,
			reactions: message.reactions,
		};

		// Emit to receiver
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("reactionRemoved", reactionData);
		}

		// Emit to sender
		if (senderSocketId) {
			io.to(senderSocketId).emit("reactionRemoved", reactionData);
		}

		res.status(200).json(message);
	} catch (error) {
		console.log("Error in removeReaction controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteMessage = async (req, res) => {
	try {
		console.log("DELETE request received, params:", req.params);
		const { messageId } = req.params;
		const userId = req.user._id;

		console.log("Deleting message:", messageId, "by user:", userId);
		const message = await Message.findById(messageId);

		if (!message) {
			return res.status(404).json({ error: "Message not found" });
		}

		// Only sender can delete
		if (message.senderId.toString() !== userId.toString()) {
			return res.status(403).json({ error: "You can only delete your own messages" });
		}

		message.isDeleted = true;
		await message.save();

		// Broadcast to both users
		const receiverSocketId = getReceiverSocketId(message.receiverId);
		const senderSocketId = getReceiverSocketId(message.senderId);

		const deleteData = {
			messageId: message._id,
			isDeleted: true
		};

		if (receiverSocketId) {
			io.to(receiverSocketId).emit("messageDeleted", deleteData);
		}

		if (senderSocketId) {
			io.to(senderSocketId).emit("messageDeleted", deleteData);
		}

		res.status(200).json({ message: "Message deleted successfully" });
	} catch (error) {
		console.log("Error in deleteMessage controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const editMessage = async (req, res) => {
	try {
		console.log("PUT request received, params:", req.params, "body:", req.body);
		const { messageId } = req.params;
		const { message: newMessage } = req.body;
		const userId = req.user._id;

		console.log("Editing message:", messageId, "by user:", userId);

		if (!newMessage || !newMessage.trim()) {
			return res.status(400).json({ error: "Message cannot be empty" });
		}

		const message = await Message.findById(messageId);

		if (!message) {
			return res.status(404).json({ error: "Message not found" });
		}

		// Only sender can edit
		if (message.senderId.toString() !== userId.toString()) {
			return res.status(403).json({ error: "You can only edit your own messages" });
		}

		message.message = newMessage;
		message.editedAt = new Date();
		await message.save();

		// Broadcast to both users
		const receiverSocketId = getReceiverSocketId(message.receiverId);
		const senderSocketId = getReceiverSocketId(message.senderId);

		const editData = {
			messageId: message._id,
			message: message.message,
			editedAt: message.editedAt
		};

		if (receiverSocketId) {
			io.to(receiverSocketId).emit("messageEdited", editData);
		}

		if (senderSocketId) {
			io.to(senderSocketId).emit("messageEdited", editData);
		}

		res.status(200).json(message);
	} catch (error) {
		console.log("Error in editMessage controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};