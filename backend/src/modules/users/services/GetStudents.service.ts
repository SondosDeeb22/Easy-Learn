import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UsersModel } from '../users.model';
import { AcademicRecordsModel } from '../../academicRecords/academic-records.model';

import { Roles, Status } from '../enums/users.enum';

import { GetStudentsQueryDto } from '../dtos/users.dto';

import { ServiceResult } from '../../../common/interfaces/service-result.interface';
import { FilterdStudent, FilteredStudentData } from '../interfaces/user.interface';
// ==================================================
@Injectable()
export class GetStudentsService {
    constructor(
        @InjectModel(UsersModel)
        private readonly usersModel: typeof UsersModel,

        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel,
    ) { }

    async getStudents(query: GetStudentsQueryDto): Promise<ServiceResult<FilterdStudent | FilteredStudentData | [] | null>> {
        const { studentId, courseId, semesterId, status, page, limit } = query;

        const parsedPage = page ? Number(page) : undefined;
        const parsedLimit = limit ? Number(limit) : undefined;
        const usePagination = parsedPage !== undefined && parsedLimit !== undefined && !isNaN(parsedPage) && !isNaN(parsedLimit) && parsedPage > 0 && parsedLimit > 0;

        const limitOption = usePagination ? parsedLimit : undefined;
        const offsetOption = usePagination ? (parsedPage - 1) * parsedLimit : undefined;

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
                limit: limitOption,
                offset: offsetOption,
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
                limit: limitOption,
                offset: offsetOption,
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
                limit: limitOption,
                offset: offsetOption,
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
            limit: limitOption,
            offset: offsetOption,
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
}
