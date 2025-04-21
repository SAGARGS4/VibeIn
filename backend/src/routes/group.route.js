import express from "express";
import {
	createGroup,
	getUserGroups,
	addUserToGroup,
	removeUserFromGroup,
	exitGroup,
} from "../controllers/group.controller.js";
import {
	sendGroupMessage,
	getGroupMessages,
} from "../controllers/message.controller.js"; // Import group message handlers
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createGroup);
router.get("/", protectRoute, getUserGroups);

// Add routes for group messages
router.get("/messages/:id", protectRoute, getGroupMessages); // Fetch group messages
router.post("/send/:id", protectRoute, sendGroupMessage); // Send group message
router.post("/add-user", protectRoute, addUserToGroup);
router.post("/remove-user", protectRoute, removeUserFromGroup);
router.post("/exit", protectRoute, exitGroup);

export default router;
