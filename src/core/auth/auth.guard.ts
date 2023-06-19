import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { jwtConstants } from './jwt.constant';
  
  @Injectable()
  export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
        
      // Get the requested route path
      const { path } = request.route;

      // Define the routes that should be excluded from authentication
      const excludedRoutes = ['/auth/login', '/user/verify', '/auth/forgotpassword'];

      // Check if the requested route should be excluded
      const shouldExclude = excludedRoutes.some(route => path.includes(route));

      if (shouldExclude) {
        // Allow the route to pass without authentication
        return true;
      }
    
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
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