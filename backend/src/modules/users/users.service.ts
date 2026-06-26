// ==================================================
import { Inject, Injectable } from '@nestjs/common';

import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

import { UsersModel } from './users.model';
import { SemestersModel } from '../semesters/semesters.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { GPARecordsModel } from '../grades/gpa-records.model';
//dto
import { StudentDataDto, GetStudentsQueryDto } from './dtos/users.dto';
//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { FilterdStudent, FilteredStudentData } from './interfaces/user.interface';
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
        private readonly gpaRecordsModel: typeof GPARecordsModel
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

    async getStudents(query: GetStudentsQueryDto): Promise<ServiceResult<FilterdStudent | FilteredStudentData | [] | null>> {
        const { studentId, courseId, semesterId, page, limit } = query;

        const offset = (page - 1) * limit;


        // Case 1: find specific student by ID
        if (studentId) {
            const student = await this.usersModel.findByPk(studentId);
            if (!student) {
                return { message: "Student was not found", data: null };
            }

            const { password, createdAt, updatedAt, ...studentWithoutPassword } = student.toJSON();

            const filteredStudent: FilterdStudent = {
                ...studentWithoutPassword,
            }


            return { message: "Student found successfully", data: filteredStudent };
        }

        // ------------------------------------------------------------------
        // Case 2: both courseId and semesterId
        if (courseId && semesterId) {
            const academicRecords = await this.academicRecordsModel.findAndCountAll({
                limit,
                offset,
                where: { courseId, semesterId },
                group: ['studentId', 'user.id', 'user.name', 'user.email', 'user.gender', 'user.birthDate', 'user.currentSemesterCredits', 'user.totalCredits'],
                // used group which remove duplicated objects with same studentId, so we have only one entry per user in .rows
                // side effect for user group is that .count changed from number to array of duplicated objects(GroupedCountResultItem[]), defining thier studentId and how many times they found

                include: [{
                    model: UsersModel,
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredits", "totalCredits"]
                }],
                attributes: ['studentId']
            });

            if (academicRecords.rows.length === 0) {
                return { message: `No users found for this course: ${courseId} at this semester: ${semesterId}`, data: [] };
            }
            const students = academicRecords.rows.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredits: record.user?.currentSemesterCredits,
                totalCredits: record.user?.totalCredits
            })
            );
            const totalRows = Array.isArray(academicRecords.count)
                ? academicRecords.count.length   // if grouped query, count will be an array, its .length = unique rows(here sence we used group in the query it will always be array, we keep this condition to satisfy typescript, becasue .count is declared as number | GroupedCountResultItem[])
                : academicRecords.count;

            console.log(`/backend/users.service.ts \n students counts: ${totalRows} \n students: ${students} \n query result: ${academicRecords}`)


            return {
                message: `${totalRows} Students found successfully`,
                data: { totalRows: totalRows, students: students }
            };
        }

        // ------------------------------------------------------------------
        // Case 3: only semesterId
        if (semesterId) {
            const academicRecords = await this.academicRecordsModel.findAndCountAll({
                limit,
                offset,
                where: { semesterId },
                group: ['studentId', 'user.id', 'user.name', 'user.email', 'user.gender', 'user.birthDate', 'user.currentSemesterCredits', 'user.totalCredits'],
                include: [{
                    model: UsersModel,
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredits", "totalCredits"]
                }],
                attributes: ['studentId']
            });

            if (academicRecords.rows.length == 0) {
                return { message: `No users found with for this semester: ${semesterId}`, data: [] };
            }

            const students = academicRecords.rows.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredits: record.user?.currentSemesterCredits,
                totalCredits: record.user?.totalCredits
            })
            );
            const totalRows = Array.isArray(academicRecords.count)
                ? academicRecords.count.length
                : academicRecords.count;

            console.log(`/backend/users.service.ts \n Found students count: ${totalRows} \n Found students: ${JSON.stringify(students, null, 2)}\n query result: ${JSON.stringify(academicRecords, null, 2)}`)

            return {
                message: `${totalRows} Students found successfully`,
                data: { totalRows: totalRows, students: students }
            };
        }

        // ------------------------------------------------------------------
        // Case 4: only courseId
        if (courseId) {
            const academicRecords = await this.academicRecordsModel.findAndCountAll({
                limit,
                offset,
                where: { courseId },
                group: ['studentId', 'user.id', 'user.name', 'user.email', 'user.gender', 'user.birthDate', 'user.currentSemesterCredits', 'user.totalCredits'],
                include: [{
                    model: UsersModel,
                    as: "user",
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredits", "totalCredits"]
                }],
                attributes: ['studentId']
            });

            if (academicRecords.rows.length === 0) {
                return { message: `No users found for this course: ${courseId}`, data: [] };
            }

            const students = academicRecords.rows.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredits: record.user?.currentSemesterCredits,
                totalCredits: record.user?.totalCredits
            })
            );
            const totalRows = Array.isArray(academicRecords.count)
                ? academicRecords.count.length
                : academicRecords.count;


            console.log("this is students data from get students service:", students)
            return {
                message: `${totalRows} Students found successfully`,
                data: { totalRows: totalRows, students: students }
            };

        }

        // ------------------------------------------------------------------

        return {
            message: "Set parameters to find students",
            data: [],
        }
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

