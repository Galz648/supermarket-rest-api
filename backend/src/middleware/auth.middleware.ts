import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/jwt.util.js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader); // Debug log
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const user = jwt.verify(token, SECRET_KEY);
                console.log('Verified user:', user); // Debug log
                // Attach user to request
                (req as any).user = user;
            } catch (err) {
                console.error('Invalid token', err);
            }
        } else {
            console.log('No authorization header found');
        }
        next();
    }
} 
