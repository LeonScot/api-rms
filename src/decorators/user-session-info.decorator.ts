import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserSessionInfo } from 'src/core/auth/jwt.model';

export const UserSession = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request;
        return request['user'] as UserSessionInfo;
    }
)