// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios";
// import { useAuthStore } from "./useAuthStore";

// export const useChatStore = create((set, get) => ({
// 	messages: [],
// 	users: [],
// 	selectedUser: null,
// 	isUsersLoading: false,
// 	isMessagesLoading: false,

// 	getUsers: async () => {
// 		set({ isUsersLoading: true });
// 		try {
// 			const res = await axiosInstance.get("/messages/users");
// 			set({ users: res.data });
// 		} catch (error) {
// 			toast.error(error?.response?.data?.message || "Failed to load users");
// 		} finally {
// 			set({ isUsersLoading: false });
// 		}
// 	},

// 	getMessages: async (id, isGroup = false) => {
// 		set({ isMessagesLoading: true });
// 		try {
// 			const url = isGroup ? `/groups/messages/${id}` : `/messages/${id}`;
// 			const res = await axiosInstance.get(url);
// 			set({ messages: res.data });
// 		} catch (error) {
// 			toast.error(error?.response?.data?.message || "Failed to load messages");
// 		} finally {
// 			set({ isMessagesLoading: false });
// 		}
// 	},

// 	sendMessage: async (messageData) => {
// 		const { selectedUser, messages } = get();
// 		try {
// 			const url = selectedUser.isGroup
// 				? `/groups/send/${selectedUser._id}`
// 				: `/messages/send/${selectedUser._id}`;

// 			const res = await axiosInstance.post(url, messageData);
// 			set({ messages: [...messages, res.data] });
// 		} catch (error) {
// 			toast.error(error?.response?.data?.message || "Failed to send message");
// 		}
// 	},

// 	subscribeToMessages: (isGroup = false) => {
// 		const { selectedUser } = get();
// 		if (!selectedUser) return;

// 		const socket = useAuthStore.getState().socket;

// 		if (isGroup) {
// 			socket.on("receive-group-message", (newMessage) => {
// 				if (newMessage.groupId !== selectedUser._id) return;

// 				set({
// 					messages: [...get().messages, newMessage],
// 				});
// 			});
// 		} else {
// 			socket.on("newMessage", (newMessage) => {
// 				const isFromSelectedUser = newMessage.senderId === selectedUser._id;
// 				if (!isFromSelectedUser) return;

// 				set({
// 					messages: [...get().messages, newMessage],
// 				});
// 			});
// 		}
// 	},

// 	unsubscribeFromMessages: (isGroup = false) => {
// 		const socket = useAuthStore.getState().socket;

// 		if (isGroup) {
// 			socket.off("receive-group-message");
// 		} else {
// 			socket.off("newMessage");
// 		}
// 	},

// 	setSelectedUser: (selectedUser) => set({ selectedUser }),
// }));

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	groups: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/messages/users");
			set({ users: res.data });
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to load users");
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getGroups: async () => {
		try {
			const res = await axiosInstance.get("/groups");

			const groups = res.data.map((g) => ({
				...g,
				isGroup: true,
				fullName: g.groupName,
			}));

			set({ groups });
			console.log("Fetched Groups:", groups);
		} catch (error) {
			console.error("Error fetching groups:", error);
			toast.error("Failed to load groups");
		}
	},

	getMessages: async (id, isGroup = false) => {
		set({ isMessagesLoading: true });
		try {
			const url = isGroup ? `/groups/messages/${id}` : `/messages/${id}`;
			const res = await axiosInstance.get(url);
			set({ messages: res.data });
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to load messages");
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get();
		const socket = useAuthStore.getState().socket;

		try {
			const url = selectedUser.isGroup
				? `/groups/send/${selectedUser._id}`
				: `/messages/send/${selectedUser._id}`;

			const res = await axiosInstance.post(url, messageData);

			// Real-time broadcast is already handled by backend via socket
			set({ messages: [...messages, res.data] });

			// Optional: emit manually for real-time (can remove if backend does it)
			if (selectedUser.isGroup) {
				socket.emit("send-group-message", {
					groupId: selectedUser._id,
					message: res.data,
				});
			}
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to send message");
		}
	},

	subscribeToMessages: (isGroup = false) => {
		const { selectedUser } = get();
		if (!selectedUser) return;

		const socket = useAuthStore.getState().socket;

		if (isGroup) {
			socket.on("receive-group-message", (newMessage) => {
				if (newMessage.receiverId !== selectedUser._id) return;

				set({
					messages: [...get().messages, newMessage],
				});
			});
		} else {
			socket.on("newMessage", (newMessage) => {
				const isFromSelectedUser = newMessage.senderId === selectedUser._id;
				if (!isFromSelectedUser) return;

				set({
					messages: [...get().messages, newMessage],
				});
			});
		}
	},

	unsubscribeFromMessages: (isGroup = false) => {
		const socket = useAuthStore.getState().socket;

		if (isGroup) {
			socket.off("receive-group-message");
		} else {
			socket.off("newMessage");
		}
	},

	setSelectedUser: (selectedUser) => {
		set({ selectedUser });

		// Fetch messages for the selected user or group
		const isGroup = selectedUser.isGroup || false;
		get().getMessages(selectedUser._id, isGroup);
	},
	addUserToGroup: async (groupId, userId) => {
		try {
			await axiosInstance.post("/groups/add-user", { groupId, userId });
			toast.success("User added to group");
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to add user");
		}
	},

	removeUserFromGroup: async (groupId, userId) => {
		try {
			await axiosInstance.post("/groups/remove-user", { groupId, userId });
			toast.success("User removed from group");
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to remove user");
		}
	},

	exitGroup: async (groupId) => {
		try {
			await axiosInstance.post("/groups/exit", { groupId });
			toast.success("Exited group successfully");

			const { getGroups, setSelectedUser } = get();
			getGroups();
			setSelectedUser(null);
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to exit group");
		}
	},
}));
