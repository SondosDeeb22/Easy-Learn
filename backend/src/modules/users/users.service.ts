// ==================================================
import { Inject, Injectable } from '@nestjs/common';

import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

import { UsersModel } from './users.model';
import { SemestersModel } from '../courses/semesters.model';
import { AcademicRecordsModel } from './academicRecords.model';

//dto
import { StudentDataDto, StudentFilterParamsDto } from './dtos/users.dto';
//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { filterdStudentInterface } from './interfaces/user.interface';
// ==================================================
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel)
        private readonly usersModel: typeof UsersModel,

        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,

        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel
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
    async getStudentData(studentId: string): Promise<ServiceResult<StudentDataDto | null>> {

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

    async getStudents(filters: StudentFilterParamsDto): Promise<ServiceResult<filterdStudentInterface | filterdStudentInterface[] | null>> {
        const { studentId, courseId, semesterId } = filters;


        // Case 1: find specific student by ID
        if (studentId) {
            const student = await this.usersModel.findByPk(studentId);
            if (!student) {
                return { message: "Student was not found", data: null };
            }

            const { password, createdAt, updatedAt, ...studentWithoutPassword } = student.toJSON();

            const filteredStudent: filterdStudentInterface = {
                ...studentWithoutPassword,
            }


            return { message: "Student found successfully", data: filteredStudent };
        }

        // ------------------------------------------------------------------
        // Case 2: both courseId and semesterId
        if (courseId && semesterId) {
            const academicRecords = await this.academicRecordsModel.findAll({
                where: { courseId, semesterId },
                include: [{
                    model: UsersModel,
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredit", "totalCredit"]
                }],
                attributes: []
            });

            if (academicRecords.length === 0) {
                return { message: `No users found for this course: ${courseId} at this semester: ${semesterId}`, data: [] };
            }
            const students = academicRecords.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredit: record.user?.currentSemesterCredit,
                totalCredit: record.user?.totalCredit
            })
            );

            return { message: `${students.length} Students found successfully`, data: students };
        }

        // ------------------------------------------------------------------
        // Case 3: only semesterId
        if (semesterId) {
            const academicRecords = await this.academicRecordsModel.findAll({
                where: { semesterId },
                include: [{
                    model: UsersModel,
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredit", "totalCredit"]
                }],
                attributes: []
            });

            if (academicRecords.length === 0) {
                return { message: `No users found with for this semester: ${semesterId}`, data: [] };
            }

            const students = academicRecords.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredit: record.user?.currentSemesterCredit,
                totalCredit: record.user?.totalCredit
            })
            );

            return { message: "Users found successfully", data: students };
        }

        // ------------------------------------------------------------------
        // Case 4: only courseId
        if (courseId) {
            const academicRecords = await this.academicRecordsModel.findAll({
                where: { courseId },
                include: [{
                    model: UsersModel,
                    as: "user",
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredit", "totalCredit"]
                }],
                attributes: []
            });

            if (academicRecords.length === 0) {
                return { message: `No users found for this course: ${courseId}`, data: [] };
            }

            const students = academicRecords.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredit: record.user?.currentSemesterCredit,
                totalCredit: record.user?.totalCredit
            })
            );

            console.log("this is students data from get students service:", students)
            return { message: "Users found successfully", data: students };

        }

        // ------------------------------------------------------------------

        return {
            message: "Set parameters to find students",
            data: [],
        }
    }



}

