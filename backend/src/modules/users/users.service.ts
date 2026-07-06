// ==================================================
import { Inject, Injectable } from '@nestjs/common';

import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

import { UsersModel } from './users.model';
import { SemestersModel } from '../semesters/semesters.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { GPARecordsModel } from '../grades/gpa-records.model';
import { Roles, Status } from './enums/users.enum';
//dto
import { StudentDataDto, GetStudentsQueryDto } from './dtos/users.dto';
//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { FilterdStudent, FilteredStudentData } from './interfaces/user.interface';

// services
import { GetStudentsService } from './services/GetStudents.service';
// ==================================================
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel)
        private readonly usersModel: typeof UsersModel,

        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,

        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel,

        @InjectModel(GPARecordsModel)
        private readonly gpaRecordsModel: typeof GPARecordsModel,

        private readonly getStudentsService: GetStudentsService
    ) { }


    // ==================================================
    //? function to Find user by ID 
    // ==================================================
    async findById(id: string): Promise<ServiceResult<UsersModel | null>> {

        let customMessage: string;

        const user = await this.usersModel.findByPk(id);


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
    async getUserData(studentId: string): Promise<ServiceResult<StudentDataDto | null>> {

        const user = await this.usersModel.findByPk(studentId);

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
        const studentFinalData: StudentDataDto = {
            ...user.toJSON(),
            maxCredits: semester?.maxCredits ?? 0,
        }

        console.log("this is student final data from function ", studentFinalData)


        return {
            message: "User found successfully",
            data: studentFinalData,
        }


    }


    // ==================================================
    //? function to fetch students by course/semester , or id for specifc student
    // ==================================================

    async getStudents(query: GetStudentsQueryDto): Promise<ServiceResult<FilterdStudent | FilteredStudentData | [] | null>> {
        return this.getStudentsService.getStudents(query);
    }


    // ==================================================
    //? get student GPA(for current semetesr)
    // ==================================================

    async getCurrentStudentGPA(studentId: string, semesterId: string): Promise<ServiceResult<number | null>> {
        const gpa_record = await this.gpaRecordsModel.findOne({
            where: {
                studentId,
                semesterId
            },
            attributes: ['gpa']
        });

        if (!gpa_record) {
            return { message: "GPA record not found", data: null };
        }

        return {
            message: "GPA record found successfully",
            data: gpa_record.gpa,
        }

    }


}

