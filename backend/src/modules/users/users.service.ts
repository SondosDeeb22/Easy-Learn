// ==================================================
import { Injectable } from '@nestjs/common';


import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';


//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';

// ==================================================
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User
    ) { }


    //? function to Find user by ID 
    // ==================================================
    async findById(id: string): Promise<ServiceResult<User | null>> {

        let customMessage: string;

        const user = await this.userModel.findByPk(id);


        if (!user) {
            customMessage = "User not found"
        }
        else {
            customMessage = "User found successfully"
        }

        return {
            message: customMessage,
            data: user,
        }


    }


}

