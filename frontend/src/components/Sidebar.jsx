import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Plus } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
	const {
		getUsers,
		getGroups,
		users,
		groups,
		selectedUser,
		setSelectedUser,
		isUsersLoading,
	} = useChatStore();

	const { onlineUsers } = useAuthStore();

	const [showOnlineOnly, setShowOnlineOnly] = useState(false);
	const [showGroupsOnly, setShowGroupsOnly] = useState(false);
	const [showGroupModal, setShowGroupModal] = useState(false);

	useEffect(() => {
		getUsers();
		getGroups();
	}, [getUsers, getGroups]);

	const filteredUsers = showOnlineOnly
		? users.filter((user) => onlineUsers.includes(user._id))
		: users;

	const filteredGroups = groups;

	if (isUsersLoading) return <SidebarSkeleton />;

	return (
		<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100 shadow-sm">
			<div className="border-b border-base-300 w-full p-5 bg-base-200/50">
				<div className="flex items-center gap-2 mb-4">
					<Users className="size-6 text-primary" />
					<span className="font-semibold hidden lg:block text-lg">
						Contacts
					</span>
				</div>

				<button
					className="btn btn-sm btn-primary w-full mt-3 hidden lg:flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all duration-200"
					onClick={() => setShowGroupModal(true)}
				>
					<Plus className="size-4" /> Create Group
				</button>

				<div className="mt-4 hidden lg:flex items-center gap-2">
					<label className="cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
						<input
							type="checkbox"
							checked={showOnlineOnly}
							onChange={(e) => setShowOnlineOnly(e.target.checked)}
							className="checkbox checkbox-sm checkbox-primary"
						/>
						<span className="text-sm font-medium">Show online only</span>
					</label>
					<span className="text-xs text-primary-focus font-medium">
						({onlineUsers.length - 1} online)
					</span>
				</div>

				<div className="mt-3 hidden lg:flex items-center gap-2">
					<label className="cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
						<input
							type="checkbox"
							checked={showGroupsOnly}
							onChange={(e) => setShowGroupsOnly(e.target.checked)}
							className="checkbox checkbox-sm checkbox-primary"
						/>
						<span className="text-sm font-medium">Show groups only</span>
					</label>
				</div>
			</div>

			<div className="overflow-y-auto w-full py-3 flex-1 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
				{!showGroupsOnly &&
					filteredUsers.map((user) => (
						<button
							key={user._id}
							onClick={() => setSelectedUser(user)}
							className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-all ${
								selectedUser?._id === user._id && !selectedUser?.isGroup
									? "bg-base-200 border-l-4 border-primary"
									: ""
							}`}
						>
							<div className="relative mx-auto lg:mx-0">
								<img
									src={user.profilePic || "/avatar.png"}
									alt={user.name}
									className="size-12 object-cover rounded-full shadow-sm border border-base-300"
								/>
								{onlineUsers.includes(user._id) && (
									<span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100 animate-pulse" />
								)}
							</div>
							<div className="hidden lg:block text-left min-w-0">
								<div className="font-medium truncate">{user.fullName}</div>
								<div
									className={`text-sm ${
										onlineUsers.includes(user._id)
											? "text-green-500"
											: "text-zinc-400"
									}`}
								>
									{onlineUsers.includes(user._id) ? "Online" : "Offline"}
								</div>
							</div>
						</button>
					))}

				{!showGroupsOnly && filteredUsers.length === 0 && (
					<div className="text-center text-zinc-500 py-8 italic bg-base-100/50 rounded-lg mx-3 my-4">
						No online users available
					</div>
				)}

				{filteredGroups.length > 0 && (
					<div className="border-t border-base-300 mt-4 pt-4">
						<h3 className="text-sm font-semibold text-primary px-5 mb-2 uppercase tracking-wider">
							Group Chats
						</h3>
						{filteredGroups.map((group) => (
							<button
								key={group._id}
								onClick={() => setSelectedUser({ ...group, isGroup: true })}
								className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-all ${
									selectedUser?._id === group._id && selectedUser?.isGroup
										? "bg-base-200 border-l-4 border-primary"
										: ""
								}`}
							>
								<div className="size-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg shadow-sm">
									{group.name[0]?.toUpperCase()}
								</div>
								<div className="hidden lg:block text-left min-w-0">
									<div className="font-medium truncate">{group.name}</div>
									<div className="text-sm text-primary/70">Group</div>
								</div>
							</button>
						))}
					</div>
				)}
			</div>

			<CreateGroupModal
				isOpen={showGroupModal}
				onClose={() => setShowGroupModal(false)}
				onGroupCreated={() => getGroups()}
			/>
		</aside>
	);
};

export default Sidebar;
