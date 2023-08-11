import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { JwtPayload, jwtConstants } from './jwt.model';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from 'src/modules/users/user.schema';
  
  @Injectable()
  export class AdminGuard implements CanActivate {

    constructor(private jwtService: JwtService, private reflector: Reflector) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
    
      const token = this.extractTokenFromHeader(request);
      
      try {
        const payload: JwtPayload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
        );
        if (payload.role !== UserRoleEnum.admin) {
          throw new UnauthorizedException();
        }
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }