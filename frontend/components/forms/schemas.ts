import { z } from "zod";

export const securitySchema = z.object({
    mode: z.literal("security"),
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().nullable().optional()
});

export const loginSchema = z.object({
    mode: z.literal("login"),
    email_or_username: z.string().min(1, "Required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
    mode: z.literal("register"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileSchema = z.object({
    mode: z.literal("profile"),
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    bio: z.string().max(500).optional(),
    avatarFile: z
        .instanceof(File)
        .optional()
        .nullable(),
    backgroundFile: z
        .instanceof(File)
        .optional()
        .nullable(),
});

export const messageSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty').max(500, 'Message cannot exceed 500 characters'),
});

type ZodObjectType = z.ZodObject<z.ZodRawShape>;

export function getUnionSchema(lhs: ZodObjectType, rhs: ZodObjectType) {
    const lhsWithMode = lhs.extend({
        mode: z.literal("login"),
    });

    const rhsWithMode = rhs.extend({
        mode: z.literal("register"),
    });

    return z.discriminatedUnion("mode", [lhsWithMode, rhsWithMode]);
}