import { db } from "../config/db.js";
import { artists } from "../db/schema/artists.schema.js";
import { eq } from "drizzle-orm";


export async function getProfile(req, res) {
    try {
        console.log("=== GET PROFILE CALLED ===");
        console.log("req.user:", req.user);

        if (!req.user || !req.user.id) {
            console.error("No req.user or req.user.id");
            return res.status(401).json({
                success: false,
                error: "Authentication required."
            });
        }

        console.log("Querying artist with ID:", req.user.id);

        if (!artists) {
            console.error("ERROR: artists schema is undefined!");
            return res.status(500).json({
                success: false,
                error: "Server configuration error"
            });
        }

        const artistProfile = await db.select({
            id: artists.id,
            email: artists.email,
            username: artists.username,
            dateOfBirth: artists.dateOfBirth,
            createdAt: artists.createdAt,
        })
            .from(artists)
            .where(eq(artists.id, req.user.id))
            .limit(1);

        console.log("Query result:", artistProfile);

        if (artistProfile.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Artist profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: { profile: artistProfile[0] }
        });

    } catch (err) {
        console.error("Get profile error:", err);
        console.error("Error stack:", err.stack);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            ...(process.env.NODE_ENV === 'development' && { details: err.message })
        });
    }
}