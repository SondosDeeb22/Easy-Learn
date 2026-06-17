// ===============================================
//? Importing 
// ===============================================
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { AuthHelper } from './helpers/auth.helper';

import { UsersModule } from '../users/users.module';
import { RolesGuard } from './guards/auth.guard';

// ===============================================
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, RolesGuard],

  imports: [
    UsersModule
  ],

  exports: [
    AuthHelper,
    RolesGuard
  ]
})

// ===============================================

export class AuthModule { }
