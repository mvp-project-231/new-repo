import supabase from "../config/supabaseClient.js";
import { db } from "../config/db.js";
import { artists } from "../db/schema/artists.schema.js";
import { eq } from "drizzle-orm";
import { validateRegister, validateLogin } from "../validators/index.js";


export const register = [ validateRegister,
    async (req, res) => {
        try {
            const { email, username, password, date_of_birth } = req.validatedData;

            const existingArtist = await db.select()
                .from(artists)
                .where(eq(artists.username, username))
                .limit(1);

            if (existingArtist.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: "Username already taken",
                    field: "username"
                });
            }

            const existingEmail = await db.select()
                .from(artists)
                .where(eq(artists.email, email))
                .limit(1);

            if (existingEmail.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: "Email already registered",
                    field: "email"
                });
            }

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                        date_of_birth: date_of_birth,
                        registered_at: new Date().toISOString()
                    }
                }
            });

            if (authError) {
                return res.status(400).json({
                    success: false,
                    error: authError.message,
                    code: authError.code || 'AUTH_ERROR'
                });
            }

            await db.insert(artists).values({
                id: authData.user.id,
                email: authData.user.email,
                username: username,
                dateOfBirth: date_of_birth,
            });

            return res.status(201).json({
                success: true,
                message: "Artist registered successfully",
                data: {
                    userId: authData.user.id,
                    email: authData.user.email,
                    username: username,
                    requiresEmailVerification: !authData.user.email_confirmed_at,
                    verificationSent: !!authData.user.confirmation_sent_at
                }
            });

        } catch (err) {
            console.error("Register error:", err);
            if (err.code === '23505') {
                return res.status(400).json({
                    success: false,
                    error: "Username or email already exists"
                });
            }

            return res.status(500).json({
                success: false,
                error: "Internal server error",
                ...(process.env.NODE_ENV === 'development' && { details: err.message })
            });
        }
    }
];

export const login = [ validateLogin,
    async (req, res) => {
        try {
            const { email, password } = req.validatedData;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                let errorMessage = error.message;
                let statusCode = 401;

                if (error.message.includes("Invalid login credentials")) {
                    errorMessage = "Invalid email or password";
                } else if (error.message.includes("Email not confirmed")) {
                    errorMessage = "Please verify your email address";
                    statusCode = 403;
                }
                return res.status(statusCode).json({
                    success: false,
                    error: errorMessage
                });
            }

            const artist = await db.select({
                id: artists.id,
                email: artists.email,
                username: artists.username,
                dateOfBirth: artists.dateOfBirth,
                createdAt: artists.createdAt
            })
                .from(artists)
                .where(eq(artists.id, data.user.id))
                .limit(1);

            if (artist.length === 0) {
                return res.status(403).json({
                    success: false,
                    error: "Artist profile not found. Please register first."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    accessToken: data.session.access_token,
                    refreshToken: data.session.refresh_token,
                    expiresAt: data.session.expires_at,
                    user: {
                        ...artist[0],
                    }
                }
            });

        } catch (err) {
            console.error("Login error:", err);
            return res.status(500).json({
                success: false,
                error: "Internal server error",
                ...(process.env.NODE_ENV === 'development' && { details: err.message })
            });
        }
    }
];