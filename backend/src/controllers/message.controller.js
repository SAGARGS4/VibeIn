import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";
import { Group } from "../models/group.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({
			_id: { $ne: loggedInUserId },
		}).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const myId = req.user._id;

		const messages = await Message.find({
			$or: [
				{ senderId: myId, receiverId: userToChatId },
				{ senderId: userToChatId, receiverId: myId },
			],
		});

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			// Upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});

		await newMessage.save();

		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const sendGroupMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: groupId } = req.params;
		const senderId = req.user._id;

		if (!mongoose.Types.ObjectId.isValid(groupId)) {
			return res.status(400).json({ error: "Invalid group ID" });
		}

		const group = await Group.findById(groupId);
		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		if (!group.members.includes(senderId)) {
			return res
				.status(403)
				.json({ error: "You are not a member of this group" });
		}

		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			receiverId: groupId,
			text,
			image: imageUrl,
			isGroupMessage: true,
		});

		await newMessage.save();

		// ✅ Fetch sender info
		const sender = await User.findById(senderId).select("fullName profilePic");

		// ✅ Attach to message
		const messageToSend = {
			...newMessage._doc,
			senderName: sender.fullName,
			senderProfilePic: sender.profilePic,
		};

		io.to(groupId).emit("receive-group-message", messageToSend);

		res.status(201).json(messageToSend);
	} catch (error) {
		console.error("Error in sendGroupMessage:", error.message);
		res.status(500).json({ error: "Failed to send group message" });
	}
};

export const getGroupMessages = async (req, res) => {
	try {
		const { id: groupId } = req.params;

		const messages = await Message.find({
			receiverId: groupId,
			isGroupMessage: true,
		}).populate("senderId", "fullName profilePic");

		// Format each message to include senderName + profilePic
		const formatted = messages.map((msg) => ({
			...msg._doc,
			senderName: msg.senderId.fullName,
			senderProfilePic: msg.senderId.profilePic,
		}));

		res.status(200).json(formatted);
	} catch (error) {
		console.error("Error in getGroupMessages:", error.message);
		res.status(500).json({ error: "Failed to fetch group messages" });
	}
};
