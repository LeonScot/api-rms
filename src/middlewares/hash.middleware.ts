import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check if the request body contains a password field
    if (req.body.password) {
      // Generate a salt and hash the password
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

      // Replace the plain password with the hashed password in the request body
      req.body.password = hashedPassword;
    }

    next();
  }
}
