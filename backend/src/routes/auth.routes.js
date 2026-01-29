import { Router } from 'express';
import { register, login} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/profile.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", requireAuth, getProfile);

export default router;