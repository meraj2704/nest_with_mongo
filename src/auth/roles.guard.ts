import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const hasRole = this.reflector.get<string[]>('roles', context.getHandler());
    if (!hasRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return hasRole.some((role) => user.role === role);
  }
}
