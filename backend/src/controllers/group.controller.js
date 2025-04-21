import { Group } from "../models/group.model.js";

export const createGroup = async (req, res) => {
	try {
		const { name, members } = req.body;

		const uniqueMembers = [...new Set([...members, req.user._id.toString()])];

		const group = await Group.create({
			name,
			members: uniqueMembers,
			createdBy: req.user._id,
		});

		res.status(201).json(group);
	} catch (error) {
		console.error("Group Creation Error:", error.message);
		res.status(500).json({ error: "Failed to create group" });
	}
};

export const getUserGroups = async (req, res) => {
	try {
		const groups = await Group.find({ members: req.user._id });
		res.status(200).json(groups);
	} catch (error) {
		console.error("Get Groups Error:", error.message);
		res.status(500).json({ error: "Failed to fetch groups" });
	}
};
// Add a user to a group (admin only)
export const addUserToGroup = async (req, res) => {
	try {
		const { groupId, userId } = req.body;
		const group = await Group.findById(groupId);

		if (!group) return res.status(404).json({ message: "Group not found" });
		if (!group.createdBy.equals(req.user._id))
			return res
				.status(403)
				.json({ message: "Only the group admin can add users" });

		if (group.members.includes(userId))
			return res.status(400).json({ message: "User already in group" });

		group.members.push(userId);
		await group.save();
		res.status(200).json({ message: "User added to group" });
	} catch (error) {
		console.error("Add User Error:", error.message);
		res.status(500).json({ message: "Failed to add user to group" });
	}
};

// Remove a user from group (admin only)
export const removeUserFromGroup = async (req, res) => {
	try {
		const { groupId, userId } = req.body;
		const group = await Group.findById(groupId);

		if (!group) return res.status(404).json({ message: "Group not found" });
		if (!group.createdBy.equals(req.user._id))
			return res
				.status(403)
				.json({ message: "Only the group admin can remove users" });

		group.members = group.members.filter((id) => id.toString() !== userId);
		await group.save();
		res.status(200).json({ message: "User removed from group" });
	} catch (error) {
		console.error("Remove User Error:", error.message);
		res.status(500).json({ message: "Failed to remove user from group" });
	}
};

// Let a user exit a group
export const exitGroup = async (req, res) => {
	try {
		const { groupId } = req.body;
		const group = await Group.findById(groupId);

		if (!group) return res.status(404).json({ message: "Group not found" });

		// Prevent admin from exiting their own group
		if (group.createdBy.equals(req.user._id)) {
			return res.status(400).json({ message: "Admin cannot exit the group" });
		}

		group.members = group.members.filter(
			(id) => id.toString() !== req.user._id.toString()
		);
		await group.save();
		res.status(200).json({ message: "You exited the group" });
	} catch (error) {
		console.error("Exit Group Error:", error.message);
		res.status(500).json({ message: "Failed to exit group" });
	}
};
