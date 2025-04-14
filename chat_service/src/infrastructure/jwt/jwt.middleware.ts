import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Extends the standard Express Request to include a `userID` property,
 * which will be set after successful JWT verification.
 */
export interface AuthRequest extends Request {
    userID?: string;
}

/**
 * JWT authentication middleware for Express routes.
 *
 * This middleware:
 * - Extracts the JWT from the `Authorization` header (expects format: `Bearer <token>`).
 * - Verifies the token using the secret key defined in `process.env.JWT_SECRET`.
 * - Adds the user ID (`sub` from JWT payload) to the request object as `req.userID`.
 * - Rejects requests with missing, invalid, or expired tokens.
 *
 * @param req - The incoming HTTP request, possibly containing a JWT.
 * @param res - The HTTP response used to send error messages if authentication fails.
 * @param next - The next middleware or route handler in the Express chain.
 */
export const jwtMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const SECRET_KEY = process.env.JWT_SECRET;

    const token = req.headers.authorization?.split(" ")[1];

    if (!SECRET_KEY) {
        res.status(500).json({ message: "JWT Secret is not defined" });
        return;
    }

    if (!token) {
        res.status(401).json({ message: "No bearer token" });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { sub: string; exp: number };

        const now = Date.now();

        if (now >= decoded.exp * 1000) {
            res.status(401).json({ message: "Token has expired" });
            return;
        }

        req.userID = decoded.sub;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};
