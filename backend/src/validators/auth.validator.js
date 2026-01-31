
import { z } from 'zod';
import {
    emailSchema,
    usernameSchema,
    passwordSchema,
    dateOfBirthSchema
} from './schemas.js';


export const registerSchema = z.object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    date_of_birth: dateOfBirthSchema,
})
    .refine((data) => {
        const reservedUsernames = ['admin', 'root', 'superuser', 'system'];
        return !reservedUsernames.includes(data.username.toLowerCase());
    }, {
        message: "This username is reserved",
        path: ["username"]
    });

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, { message: "Password is required" }),
});

export const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // Zod v3 exposes validation problems on `issues` (older examples used `errors`).
            // Guard defensively to avoid runtime TypeError when the property name differs.
            const rawIssues = (result.error && (result.error.issues || result.error.errors)) || [];
            const errors = rawIssues.map(err => ({
                field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
                message: err.message
            }));

            return res.status(400).json({
                success: false,
                error: "Validation failed",
                details: errors
            });
        }

        req.validatedData = result.data;
        next();
    } catch (error) {
        console.error("Validation middleware error:", error);
        return res.status(500).json({
            success: false,
            error: "Validation error occurred"
        });
    }
};

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);