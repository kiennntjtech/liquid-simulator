import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { RequirePermissionsGuard } from './permission.guard';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [
    { provide: APP_GUARD, useClass: RequirePermissionsGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthorizationModule {}
