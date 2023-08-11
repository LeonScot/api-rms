import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from 'src/core/auth/revoked-token.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserIdPipe implements PipeTransform {

  constructor() {}

  async transform(request: Request, metadata: ArgumentMetadata) {
    // Check if the value contains a password field
    
    if (!request || !request.headers || !request.headers.authorization) {
      throw new BadRequestException('Authorization header is missing');
    }

    const token = request.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token) as TokenPayload;
    
    if (!decodedToken) {
      throw new BadRequestException('Invalid token');
    }
    return decodedToken.sub;
  }
}
