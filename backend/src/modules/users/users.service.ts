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
        const { studentId, courseId, semesterId, status, page, limit } = query;

        const offset = (page - 1) * limit;

        // Calculate global counts for the dashboard cards
        const activeCount = await this.usersModel.count({ where: { role: Roles.STUDENT, status: Status.ACTIVE } });
        const graduatedCount = await this.usersModel.count({ where: { role: Roles.STUDENT, status: Status.GRADUATED } });
        const passiveCount = await this.usersModel.count({ where: { role: Roles.STUDENT, status: Status.PASSIVE } });

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

        // Case 2: both courseId and semesterId
        if (courseId && semesterId) {
            const academicRecords = await this.academicRecordsModel.findAndCountAll({
                limit,
                offset,
                where: { courseId, semesterId },
                group: ['studentId', 'user.id', 'user.name', 'user.email', 'user.gender', 'user.birthDate', 'user.currentSemesterCredits', 'user.totalCredits', 'user.status'],
                // used group which remove duplicated objects with same studentId, so we have only one entry per user in .rows
                // side effect for user group is that .count changed from number to array of duplicated objects(GroupedCountResultItem[]), defining thier studentId and how many times they found

                include: [{
                    model: UsersModel,
                    where: {
                        ...(status ? { status } : {})
                    },
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredits", "totalCredits", "status"]
                }],
                attributes: ['studentId']
            });

            if (academicRecords.rows.length === 0) {
                return {
                    message: `No users found for this course: ${courseId} at this semester: ${semesterId}`,
                    data: { totalRows: 0, students: [], activeCount, graduatedCount, passiveCount }
                };
            }
            const students = academicRecords.rows.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredits: record.user?.currentSemesterCredits,
                totalCredits: record.user?.totalCredits,
                status: record.user?.status
            }));
            const totalRows = Array.isArray(academicRecords.count)
                ? academicRecords.count.length
                : academicRecords.count;

            return {
                message: `${totalRows} Students found successfully`,
                data: { totalRows: totalRows, students: students, activeCount, graduatedCount, passiveCount }
            };
        }

        // ------------------------------------------------------------------
        // Case 3: only semesterId
        if (semesterId) {
            const academicRecords = await this.academicRecordsModel.findAndCountAll({
                limit,
                offset,
                where: { semesterId },
                group: ['studentId', 'user.id', 'user.name', 'user.email', 'user.gender', 'user.birthDate', 'user.currentSemesterCredits', 'user.totalCredits', 'user.status'],
                include: [{
                    model: UsersModel,
                    where: {
                        ...(status ? { status } : {})
                    },
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredits", "totalCredits", "status"]
                }],
                attributes: ['studentId']
            });

            if (academicRecords.rows.length == 0) {
                return {
                    message: `No users found with for this semester: ${semesterId}`,
                    data: { totalRows: 0, students: [], activeCount, graduatedCount, passiveCount }
                };
            }

            const students = academicRecords.rows.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredits: record.user?.currentSemesterCredits,
                totalCredits: record.user?.totalCredits,
                status: record.user?.status
            }));
            const totalRows = Array.isArray(academicRecords.count)
                ? academicRecords.count.length
                : academicRecords.count;

            return {
                message: `${totalRows} Students found successfully`,
                data: { totalRows: totalRows, students: students, activeCount, graduatedCount, passiveCount }
            };
        }

        // Case 4: only courseId
        if (courseId) {
            const academicRecords = await this.academicRecordsModel.findAndCountAll({
                limit,
                offset,
                where: { courseId },
                group: ['studentId', 'user.id', 'user.name', 'user.email', 'user.gender', 'user.birthDate', 'user.currentSemesterCredits', 'user.totalCredits', 'user.status'],
                include: [{
                    model: UsersModel,
                    as: "user",
                    where: {
                        ...(status ? { status } : {})
                    },
                    attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredits", "totalCredits", "status"]
                }],
                attributes: ['studentId']
            });

            if (academicRecords.rows.length === 0) {
                return {
                    message: `No users found for this course: ${courseId}`,
                    data: { totalRows: 0, students: [], activeCount, graduatedCount, passiveCount }
                };
            }

            const students = academicRecords.rows.map(record => ({
                id: record.user?.id,
                name: record.user?.name,
                email: record.user?.email,
                gender: record.user?.gender,
                birthDate: record.user?.birthDate,
                currentSemesterCredits: record.user?.currentSemesterCredits,
                totalCredits: record.user?.totalCredits,
                status: record.user?.status
            }));
            const totalRows = Array.isArray(academicRecords.count)
                ? academicRecords.count.length
                : academicRecords.count;

            return {
                message: `${totalRows} Students found successfully`,
                data: { totalRows: totalRows, students: students, activeCount, graduatedCount, passiveCount }
            };
        }

        // Case 5: general query (e.g. status filter, or empty filter listing all students)
        const whereClause: any = { role: Roles.STUDENT };
        if (status) {
            whereClause.status = status;
        }

        const { rows: studentsRows, count: totalRows } = await this.usersModel.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            attributes: ["id", "name", "email", "gender", "birthDate", "currentSemesterCredits", "totalCredits", "status"]
        });

        const students = studentsRows.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            birthDate: user.birthDate,
            currentSemesterCredits: user.currentSemesterCredits,
            totalCredits: user.totalCredits,
            status: user.status
        }));

        return {
            message: `${totalRows} Students found successfully`,
            data: {
                totalRows,
                students,
                activeCount,
                graduatedCount,
                passiveCount
            }
        };
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

