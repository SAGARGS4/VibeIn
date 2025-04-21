// import { Link } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";
// import { LogOut, MessageSquare, Settings, User } from "lucide-react";

// const Navbar = () => {
// 	const { logout, authUser } = useAuthStore();

// 	return (
// 		<header
// 			className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40
//     backdrop-blur-lg bg-base-100/80"
// 		>
// 			<div className="container mx-auto px-4 h-16">
// 				<div className="flex items-center justify-between h-full">
// 					<div className="flex items-center gap-8">
// 						<Link
// 							to="/"
// 							className="flex items-center gap-2.5 hover:opacity-80 transition-all"
// 						>
// 							<div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
// 								<MessageSquare className="w-5 h-5 text-primary" />
// 							</div>
// 							<h1 className="text-lg font-bold">VideIn</h1>
// 						</Link>
// 					</div>

// 					<div className="flex items-center gap-2">
// 						<Link
// 							to={"/settings"}
// 							className={`
//               btn btn-sm gap-2 transition-colors

//               `}
// 						>
// 							<Settings className="w-4 h-4" />
// 							<span className="hidden sm:inline">Settings</span>
// 						</Link>

// 						{authUser && (
// 							<>
// 								<Link to={"/profile"} className={`btn btn-sm gap-2`}>
// 									<User className="size-5" />
// 									<span className="hidden sm:inline">Profile</span>
// 								</Link>

// 								<button className="flex gap-2 items-center" onClick={logout}>
// 									<LogOut className="size-5" />
// 									<span className="hidden sm:inline">Logout</span>
// 								</button>
// 							</>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</header>
// 	);
// };
// export default Navbar;

import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
	const { logout, authUser } = useAuthStore();

	return (
		<header className="bg-base-100/95 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg shadow-sm">
			<div className="container mx-auto px-4 h-16">
				<div className="flex items-center justify-between h-full">
					<div className="flex items-center gap-8">
						<Link
							to="/"
							className="flex items-center gap-2.5 hover:opacity-80 transition-all"
						>
							<div className="size-9 rounded-lg bg-primary/15 flex items-center justify-center">
								<MessageSquare className="w-5 h-5 text-primary" />
							</div>
							<h1 className="text-lg font-bold">VibeIn</h1>
						</Link>
					</div>

					<div className="flex items-center gap-3">
						<Link
							to={"/settings"}
							className="btn btn-sm btn-ghost hover:bg-base-200 gap-2 transition-all rounded-full"
						>
							<Settings className="w-4 h-4 text-base-content" />
							<span className="hidden sm:inline font-medium">Settings</span>
						</Link>

						{authUser && (
							<>
								<Link
									to={"/profile"}
									className="btn btn-sm btn-ghost hover:bg-base-200 gap-2 transition-all rounded-full"
								>
									<User className="size-4 text-base-content" />
									<span className="hidden sm:inline font-medium">Profile</span>
								</Link>

								<button
									className="btn btn-sm btn-error text-white gap-2 hover:opacity-90 transition-all rounded-full"
									onClick={logout}
								>
									<LogOut className="size-4" />
									<span className="hidden sm:inline font-medium">Logout</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
