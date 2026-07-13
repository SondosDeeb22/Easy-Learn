// ===========================================================
//?importing
// ===========================================================
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';

//helper
import { AuthHelper } from '../helpers/auth.helper';

//interface
import { LoginJwtInterface } from '../interfaces/jwt.interface';

// ===========================================================

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authHelper: AuthHelper,

    private configService: ConfigService
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // get the required Roles from the route ----------------------------------------------------------------
    const requiredRoles = this.reflector.getAllAndOverride(
      'roles', [context.getHandler(), context.getClass(),],
    );
    // reflector.getAllAndOverride() retrieves metadata from multiple targets
    //  it checks the route handler (method), then the controller class, (according to where we defined the guard roles in controller file)
    // and returns the first matching metadata value it finds

    // console.log(requiredRoles)
    if (!requiredRoles) {
      console.log("No roles defined on controller")
      return true;
    }
    console.log("requiredRoles: ", requiredRoles)


    // from request get the token --------------------------------
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const token = request.cookies['login-token'];
    console.log(`this is cookie : ${token}`)
    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }


    // get login-secret from .env file -----------
    const jwtLoginKey = this.configService.get<string>('JWT_LOGIN_KEY');
    if (!jwtLoginKey) {
      throw new Error("JWT_LOGIN_KEY was not found!");
    }

    // get the user role from jwt ------------------------------------------------------
    try {
      const payload: LoginJwtInterface = this.authHelper.extractJwtData<LoginJwtInterface>(token, jwtLoginKey);

      console.log("payload: ", payload);
      request.user = payload;

      const userRole = payload.role;
      if (!userRole) {
        this.authHelper.removeCookie(response, 'login-token');
        throw new UnauthorizedException('Token payload is missing role');
      }

      // check if user role is authorized to access the route -----------------------------------
      const isAuthorized: boolean = requiredRoles.some(role => role == userRole);

      if (!isAuthorized) {
        throw new ForbiddenException('Insufficient permissions for this resource');
      }
      return true;

      // ==========================================
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      this.authHelper.removeCookie(response, 'login-token');
      throw new UnauthorizedException('Invalid or expired authentication token');
    }

  }

}
