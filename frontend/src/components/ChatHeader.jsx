import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";
import AddUserToGroupModal from "./AddUserToGroupModal";
import RemoveUserFromGroupModal from "./RemoveUserFromGroupModal";
import ConfirmExitGroupModal from "./ConfirmExitGroupModal";

const ChatHeader = () => {
	const { selectedUser, setSelectedUser } = useChatStore();
	const { authUser, onlineUsers } = useAuthStore();

	const [showAddModal, setShowAddModal] = useState(false);
	const [showRemoveModal, setShowRemoveModal] = useState(false);
	const [showExitModal, setShowExitModal] = useState(false);

	if (!selectedUser) return null;

	return (
		<div className="p-2.5 border-b border-base-300">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{/* Avatar or Group Icon */}
					<div className="avatar">
						<div className="size-10 rounded-full relative">
							<img
								src={selectedUser.profilePic || "/avatar.png"}
								alt={selectedUser.name || selectedUser.fullName || "User"}
							/>
						</div>
					</div>

					{/* Name + Status */}
					<div>
						<h3 className="font-medium text-base">
							{selectedUser.isGroup
								? selectedUser.name || "Unnamed Group"
								: selectedUser.fullName || "Unnamed User"}
						</h3>
						{!selectedUser.isGroup && (
							<p className="text-sm text-base-content/70">
								{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
							</p>
						)}
					</div>
				</div>

				{/* Close button */}
				<button
					onClick={() => setSelectedUser(null)}
					className="btn btn-ghost btn-sm"
				>
					<X />
				</button>
			</div>

			{/* Group Management Buttons */}
			{selectedUser.isGroup && (
				<div className="mt-2 flex gap-2">
					{selectedUser.createdBy === authUser._id ? (
						<>
							<button
								className="btn btn-sm"
								onClick={() => setShowAddModal(true)}
							>
								Add User
							</button>
							<button
								className="btn btn-sm btn-warning"
								onClick={() => setShowRemoveModal(true)}
							>
								Remove User
							</button>
						</>
					) : (
						<button
							className="btn btn-sm btn-error"
							onClick={() => setShowExitModal(true)}
						>
							Exit Group
						</button>
					)}
				</div>
			)}

			{/* Modals */}
			<AddUserToGroupModal
				groupId={selectedUser._id}
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
			/>
			<RemoveUserFromGroupModal
				group={selectedUser}
				isOpen={showRemoveModal}
				onClose={() => setShowRemoveModal(false)}
			/>
			<ConfirmExitGroupModal
				groupId={selectedUser._id}
				isOpen={showExitModal}
				onClose={() => setShowExitModal(false)}
			/>
		</div>
	);
};

export default ChatHeader;
