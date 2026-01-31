
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
            const errors = result.error.errors.map(err => ({
                field: err.path.join('.'),
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