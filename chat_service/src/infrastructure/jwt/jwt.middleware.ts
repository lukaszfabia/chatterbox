import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
    userID?: string;
}

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
        const decoded = jwt.verify(token, SECRET_KEY) as { sub: string, exp: number };
        const now = new Date().getTime()


        if (now < decoded.exp) {
            res.status(401).json({ message: "Token has been expired" });
            return;
        }

        req.userID = decoded.sub;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};
