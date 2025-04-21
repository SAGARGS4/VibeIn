import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

const RemoveUserFromGroupModal = ({ group, isOpen, onClose }) => {
	const removeUserFromGroup = useChatStore((s) => s.removeUserFromGroup);
	const [selected, setSelected] = useState(null);

	if (!isOpen) return null;

	const members = group?.members || [];

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
			<div className="bg-white p-4 rounded w-80">
				<h3 className="font-bold mb-2">Remove User</h3>
				<select
					className="select select-bordered w-full mb-4"
					onChange={(e) => setSelected(e.target.value)}
				>
					<option value="">Select Member</option>
					{members.map((m) => (
						<option key={m._id} value={m._id}>
							{m.fullName || m.name}
						</option>
					))}
				</select>
				<div className="flex justify-end gap-2">
					<button className="btn" onClick={onClose}>
						Cancel
					</button>
					<button
						className="btn btn-error"
						onClick={() => {
							if (selected) {
								removeUserFromGroup(group._id, selected);
								onClose();
							}
						}}
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
};

export default RemoveUserFromGroupModal;
