import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "../store/useChatStore";

const AddUserToGroupModal = ({ groupId, isOpen, onClose }) => {
	const [users, setUsers] = useState([]);
	const [selected, setSelected] = useState(null);
	const addUserToGroup = useChatStore((s) => s.addUserToGroup);

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await axiosInstance.get("/auth/users");
			setUsers(res.data);
		};
		if (isOpen) fetchUsers();
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
			<div className="bg-white p-4 rounded w-80">
				<h3 className="font-bold mb-2">Add User to Group</h3>
				<select
					className="select select-bordered w-full mb-4"
					onChange={(e) => setSelected(e.target.value)}
				>
					<option value="">Select User</option>
					{users.map((u) => (
						<option key={u._id} value={u._id}>
							{u.fullName}
						</option>
					))}
				</select>
				<div className="flex justify-end gap-2">
					<button className="btn" onClick={onClose}>
						Cancel
					</button>
					<button
						className="btn btn-primary"
						onClick={() => {
							if (selected) {
								addUserToGroup(groupId, selected);
								onClose();
							}
						}}
					>
						Add
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddUserToGroupModal;
