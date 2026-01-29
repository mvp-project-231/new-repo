import { db } from "../config/db.js";
import { users } from "../db/schema/users.schema.js";
import { eq } from "drizzle-orm";

export async function getProfile(req, res) {
    try {
        const profile = await db
            .select()
            .from(users)
            .where(eq(users.id, req.user.id))
            .limit(1);

        if (!profile.length) {
            return res.status(404).json({ error: "Profile not found" });
        }

        return res.json({
            id: profile[0].id,
            email: profile[0].email,
            role: profile[0].role,
        });
    } catch (err) {
        console.error("Profile error:", err);
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
}
