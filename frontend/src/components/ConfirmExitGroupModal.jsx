import { useChatStore } from "../store/useChatStore";

const ConfirmExitGroupModal = ({ groupId, isOpen, onClose }) => {
	const exitGroup = useChatStore((s) => s.exitGroup);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
			<div className="bg-white p-4 rounded w-80">
				<h3 className="font-bold mb-4">Exit Group?</h3>
				<p className="mb-4">Are you sure you want to exit this group?</p>
				<div className="flex justify-end gap-2">
					<button className="btn" onClick={onClose}>
						Cancel
					</button>
					<button
						className="btn btn-error"
						onClick={() => {
							exitGroup(groupId);
							onClose();
						}}
					>
						Exit
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmExitGroupModal;
