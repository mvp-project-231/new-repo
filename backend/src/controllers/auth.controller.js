import supabase from "../config/supabaseClient.js";
import { db } from "../config/db.js";
import { users } from "../db/schema/users.schema.js";

export async function register(req, res) {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!["artist", "client"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        await db.insert(users).values({
            id: data.user.id,
            email,
            role,
        });


        return res.status(201).json({
            message: "User registered successfully",
            userId: data.user.id,
        });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        return res.json({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            user: {
                id: data.user.id,
                email: data.user.email,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
