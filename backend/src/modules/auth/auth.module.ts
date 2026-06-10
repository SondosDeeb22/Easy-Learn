// ===============================================
//? Importing 
// ===============================================
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { AuthHelper } from './helpers/auth.helper';

import { UsersModule } from '../users/users.module';

// ===============================================
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],

  imports: [
    UsersModule,
  ],

  exports: [
    AuthService,
    AuthHelper
  ]
})

// ===============================================

export class AuthModule { }
