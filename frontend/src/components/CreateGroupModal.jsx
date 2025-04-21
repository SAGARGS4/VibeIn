// import { useEffect, useState } from "react";
// import { axiosInstance } from "../lib/axios";
// import { useAuthStore } from "../store/useAuthStore";

// const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
// 	const [groupName, setGroupName] = useState("");
// 	const [users, setUsers] = useState([]);
// 	const [selectedUsers, setSelectedUsers] = useState([]);
// 	const { user } = useAuthStore();

// 	useEffect(() => {
// 		const fetchUsers = async () => {
// 			try {
// 				const res = await axios.get("/auth/users");
// 				const filtered = res.data.filter((u) => u._id !== user._id);
// 				setUsers(filtered);
// 			} catch (err) {
// 				console.error("Failed to fetch users:", err);
// 			}
// 		};

// 		if (isOpen) fetchUsers();
// 	}, [isOpen, user]);

// 	const toggleUserSelection = (id) => {
// 		setSelectedUsers((prev) =>
// 			prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
// 		);
// 	};

// 	const handleCreateGroup = async () => {
// 		if (!groupName || selectedUsers.length === 0) {
// 			return alert("Group name and members are required.");
// 		}

// 		try {
// 			const res = await axios.post("/groups", {
// 				name: groupName,
// 				members: selectedUsers,
// 			});
// 			console.log("Group Created:", res.data);
// 			onGroupCreated && onGroupCreated(res.data);
// 			onClose();
// 		} catch (err) {
// 			console.error("Error creating group:", err.response?.data || err.message);
// 		}
// 	};

// 	if (!isOpen) return null;

// 	return (
// 		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
// 			<div className="bg-white p-6 rounded-box w-full max-w-md shadow-lg">
// 				<h3 className="text-xl font-bold mb-4">Create New Group</h3>
// 				<input
// 					type="text"
// 					placeholder="Group Name"
// 					className="input input-bordered w-full mb-4"
// 					value={groupName}
// 					onChange={(e) => setGroupName(e.target.value)}
// 				/>
// 				<div className="mb-4 max-h-40 overflow-y-auto">
// 					{users.map((u) => (
// 						<div
// 							key={u._id}
// 							className={`cursor-pointer p-2 rounded ${
// 								selectedUsers.includes(u._id)
// 									? "bg-primary text-white"
// 									: "hover:bg-base-200"
// 							}`}
// 							onClick={() => toggleUserSelection(u._id)}
// 						>
// 							{u.fullName}
// 						</div>
// 					))}
// 				</div>
// 				<div className="flex justify-end gap-2">
// 					<button className="btn btn-outline" onClick={onClose}>
// 						Cancel
// 					</button>
// 					<button className="btn btn-primary" onClick={handleCreateGroup}>
// 						Create
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default CreateGroupModal;

import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
	const [groupName, setGroupName] = useState("");
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const { authUser } = useAuthStore();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await axiosInstance.get("/auth/users");
				const filtered = res.data.filter((u) => u._id !== authUser._id);
				setUsers(filtered);
			} catch (err) {
				console.error("Failed to fetch users:", err);
			}
		};

		if (isOpen) {
			fetchUsers();
			setGroupName(""); // Reset on open
			setSelectedUsers([]); // Reset on open
		}
	}, [isOpen, authUser]);

	const toggleUserSelection = (id) => {
		setSelectedUsers((prev) =>
			prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
		);
	};

	const handleCreateGroup = async () => {
		if (!groupName || selectedUsers.length === 0) {
			return alert("Group name and members are required.");
		}

		try {
			const res = await axiosInstance.post("/groups", {
				name: groupName,
				members: selectedUsers,
			});

			const createdGroup = { ...res.data, isGroup: true };

			toast.success("Group created successfully!");
			onGroupCreated && onGroupCreated(createdGroup);
			console.log("Creating group with:", {
				name: groupName,
				members: selectedUsers,
			});
			onClose();
		} catch (err) {
			console.error("Error creating group:", err.response?.data || err.message);
			toast.error("Failed to create group");
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-6 rounded-box w-full max-w-md shadow-lg">
				<h3 className="text-xl font-bold mb-4">Create New Group</h3>
				<input
					type="text"
					placeholder="Group Name"
					className="input input-bordered w-full mb-4"
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
				/>
				<div className="mb-4 max-h-40 overflow-y-auto">
					{users.length > 0 ? (
						users.map((u) => (
							<div
								key={u._id}
								className={`cursor-pointer p-2 rounded ${
									selectedUsers.includes(u._id)
										? "bg-primary text-white"
										: "hover:bg-base-200"
								}`}
								onClick={() => toggleUserSelection(u._id)}
							>
								{u.fullName}
							</div>
						))
					) : (
						<p className="text-gray-500">No users available to add.</p>
					)}
				</div>
				<div className="flex justify-end gap-2">
					<button className="btn btn-outline" onClick={onClose}>
						Cancel
					</button>
					<button
						className="btn btn-primary"
						onClick={handleCreateGroup}
						disabled={!groupName || selectedUsers.length === 0}
					>
						Create
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateGroupModal;
