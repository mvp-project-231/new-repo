import supabase from "../config/supabaseClient.js";

export async function requireAuth(req, res, next) {
    try {
        if (!supabase) {
            return res.status(500).json({ error: "Supabase not configured" });
        }

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }

        const token = authHeader.replace("Bearer ", "");

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        req.user = data.user;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(500).json({ error: "Authentication failed" });
    }
}
