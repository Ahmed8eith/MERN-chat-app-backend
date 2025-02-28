import express from "express"
import protectRoute from "../middlewares/protectRoute.js"
import { getFreinds, getUsersForSidebar } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/", protectRoute,getUsersForSidebar)

router.get("/get-freinds", protectRoute,getFreinds)

export default router