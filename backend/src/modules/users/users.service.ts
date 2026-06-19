// ==================================================
import { Injectable } from '@nestjs/common';

import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { SemestersModel } from '../courses/semesters.model';

//dto
import { StudentDataDto } from './dtos/users.dto';
//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { StudnetData } from './interfaces/user.interface';
// ==================================================
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel)
        private readonly userModel: typeof UsersModel,

        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel
    ) { }


    // ==================================================
    //? function to Find user by ID 
    // ==================================================
    async findById(id: string): Promise<ServiceResult<UsersModel | null>> {

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
    // ==================================================
    //? function to get studnet data 
    // ==================================================
    async getStudentData(studentId: string): Promise<ServiceResult<StudentDataDto | null>> {

        const user = await this.userModel.findByPk(studentId);

        if (!user) {
            return { message: "User not found", data: null };
        }


        // get maxCredit for this semester from semester model
        const today = new Date();
        const semester = await this.semestersModel.findOne({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            },
            attributes: ['maxCredits']
        });
        if (!semester) {
            return { message: "Semester not found", data: null };
        }
        // ================================================

        const { password, createdAt, updatedAt, ...userWithoutPassword } = user.toJSON();

        const studentFinalData: StudnetData = {
            ...userWithoutPassword,
            maxCredits: semester?.maxCredits ?? 0,
        };
        console.log("this is student final data from function ", studentFinalData)


        return {
            message: "User found successfully",
            data: studentFinalData,
        }


    }


}

