import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RequirePermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(permissions, user.permissions);
  }

  private matchRoles(
    requirePermissions: string[],
    userPermissions: string[],
  ): boolean {
    if (!userPermissions) return false;

    for (const permission of requirePermissions) {
      if (!userPermissions.includes(permission)) return false;
    }
    return true;
  }
}
