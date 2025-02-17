import { Request } from 'express';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private logger: Logger
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    if(!request.headers.authorization) {
      throw new UnauthorizedException()
    }
    const jwtString = request.headers.authorization.split('Bearer ')[1];
    try {
      this.authService.verify(jwtString);  
    } catch( err ) {
      this.logger.log("access token exripred", err.expiredAt);
      throw new UnauthorizedException('access token expired');
    }
    return true;  
  }
}