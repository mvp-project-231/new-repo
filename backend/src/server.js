import "dotenv/config";
import app from "./app.js";
import { db } from "./config/db.js";
import { sql } from "drizzle-orm";
import supabase from "./config/supabaseClient.js";

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await db.select(sql`1`);
        console.log("Database connected");

        if (supabase) {
            console.log("Supabase client initialized");
        } else {
            console.warn(
                "Supabase not configured: set SUPABASE_URL and SUPABASE_ANON_KEY in .env if needed"
            );
        }

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to database", err);
        process.exit(1);
    }
})();
