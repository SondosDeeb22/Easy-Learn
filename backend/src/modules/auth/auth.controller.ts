// ===============================================
//? Importing 
// ===============================================
import { Controller, Post, Body, Res, Req, Get, HttpCode, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredDto } from './dtos/login-cred.dto';

import { ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiOperation } from '@nestjs/swagger';

import * as express from 'express';

//interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

//helper
import { AuthHelper } from './helpers/auth.helper';

//error
import { UnauthorizedError } from 'src/common/errors';
// ===============================================
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authHelper: AuthHelper) { }


  // ==============================================
  //? Login
  // ===============================================
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Login with Id and Password' })

  @UseInterceptors(AuthInterceptor)

  @HttpCode(200)
  @ApiOkResponse({ description: 'Login successful' })
  // error
  @ApiNotFoundResponse({ description: 'User not Registered' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })

  async Login(
    @Body() loginCred: LoginCredDto,
    @Res({ passthrough: true }) res: express.Response
  ) {

    const { data: { token, data } } = await this.authService.login(loginCred);

    await this.authHelper.createCookie(res, token, 'login-token');

    return {
      message: "Login success",
      data

    };
  };
  // ==============================================
  //? Logout
  // ===============================================

  @Post('logout')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Logout successful' })
  async Logout(
    @Res({ passthrough: true }) res: express.Response
  ) {
    await this.authHelper.removeCookie(res, 'login-token')
    return {
      message: "Logout success"
    }
  }


  // ==============================================
  //? Get user data from JWT 
  // ===============================================

  @Get('user')
  // error
  @ApiUnauthorizedResponse({ description: 'Session Expired, please login again!' })

  async getUserData(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response
  ) {

    const token: string | undefined = req.cookies?.['login-token'];
    if (!token) {
      throw new UnauthorizedError("Session Expired, please login again!");
    }

    try {
      return await this.authService.getUserFromToken(token);
    } catch (error) {
      await this.authHelper.removeCookie(res, 'login-token');
      throw new UnauthorizedError("Session Expired, please login again!");
    }
  }




}
