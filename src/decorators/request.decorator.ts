import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ReqDec = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request;
        return request;
    }
)