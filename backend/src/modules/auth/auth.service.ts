// ===============================================
//? Importing 
// ===============================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

// dto
import { LoginCredDto } from './dtos/login-cred.dto';
// import { RegisterDto } from './dto/register.dto';

// interface
import { LoginJwtInterface, LoginResultInterface } from './interfaces/jwt.interface';
import { ServiceResult } from '../../common/interfaces/service-result.interface';

//model
import { User } from '../users/users.model';

//service
import { UsersService } from '../users/users.service';

//errors
import { NotFoundError } from '../../common/errors';

// ===============================================

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,

        private configService: ConfigService
    ) { }

    // =========================================================================
    // ?Login 
    // =========================================================================
    async login(credentials: LoginCredDto): Promise<ServiceResult<LoginResultInterface>> {

        const { id, password } = credentials;
        // console.log(credentials);

        // check user exist by id -------------------------------
        const user: ServiceResult<User | null> = await this.usersService.findById(id);
        // console.log(user);
        if (!user.data) throw new NotFoundError('this user is not registered');

        // verifiy password -----------------------------------
        const matchFound = await bcrypt.compare(password, user.data.password);
        if (!matchFound) throw new UnauthorizedException('Invalid credentials');


        // create jwt token --------------------------------
        const secret = this.configService.get<string>('JWT_LOGIN_KEY');
        if (!secret) throw new Error('JWT_LOGIN_KEY is not defined');

        const payload: LoginJwtInterface = {
            userId: user.data.id,
            email: user.data.email,
            role: user.data.role
        }
        const token = jwt.sign(payload, secret, { expiresIn: '36000s' });

        return {
            message: "Login successful",
            data: {
                token: token,
                data: user.data
            },
        };

    }

}
