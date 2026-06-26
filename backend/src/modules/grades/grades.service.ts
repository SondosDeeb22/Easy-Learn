import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { v4 as uuidv4 } from 'uuid';

//models
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { CoursesModel } from '../courses/courses.model';
import { GradeScaleModel } from './grades.model';
import { GPARecordsModel } from './gpa-records.model';
import { SemestersModel } from '../semesters/semesters.model';
import { UsersModel } from '../users/users.model';

import { ServiceResult } from 'src/common/interfaces/service-result.interface';
// =============================================================================
@Injectable()
export class GradesService {
    constructor(
        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel,

        @InjectModel(GPARecordsModel)
        private readonly gpaRecordsModel: typeof GPARecordsModel,

        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,

        @InjectModel(UsersModel)
        private readonly usersModel: typeof UsersModel,

    ) { }

    // =============================================================================
    //? upsert GPA And Update CGPA

    // - check GPA calculation eligibility (all grades for current semester courses must be recorded)
    // - calculate GPA for current semeseter courses
    // - check if a GPA was alreday exists in gpa_records table
    // - upsert the GPA  (update if existed, insert if not)
    // - calculate CGPA based on the new GPA
    // - update the CGPA in the users table
    // ===============================================================

    async upsertGPAAndUpdateCGPA(
        studentId: string,
        semesterId: string
    ): Promise<ServiceResult<null>> {

        // Verify student exists
        const student = await this.usersModel.findByPk(studentId);
        if (!student) {
            return {
                message: `Student with ID "${studentId}" not found.`,
                data: null,
            };
        }
        // -------------------------

        // // automatically determine current semester
        // const today = new Date();
        // let semester = await this.semestersModel.findOne({
        //     where: {
        //         startDate: { [Op.lte]: today },
        //         endDate: { [Op.gte]: today },
        //     },
        // });


        // if (!semester) {
        //     return {
        //         message: 'No semesters found in the database.',
        //         data: null,
        //     };
        // }

        // const semesterId = semester.id;
        // -------------------------

        const currentSemesterCourses = await this.academicRecordsModel.findAll({
            where: {
                studentId,
                semesterId,
            },
            attributes: ["semesterId", "studentId", "letterGrade"],
            include: [
                {
                    model: CoursesModel,
                    attributes: ['credit'],
                },
                {
                    model: GradeScaleModel,
                    attributes: ['gradePoint'],
                },
            ],
        });

        // Verify student has registered courses in this semester
        if (currentSemesterCourses.length === 0) {
            return {
                message: `No courses registered for student "${studentId}" in semester "${semesterId}".`,
                data: null,
            };
        }

        // check if there is a course with no letter grade 
        const hasUngradedCourses = currentSemesterCourses.some(
            course => course.letterGrade === null,
        );
        console.log(`(backend/grades.service)\nStudent has ungraded courses: `, hasUngradedCourses);

        // stop the process of calcuating the GPA if a current course was not graded yet
        if (hasUngradedCourses) {
            return {
                message:
                    'No GPA yet! All current semester courses must be graded first.',
                data: null,
            };
        }
        // ========================================================= 

        // flatten the nested course data 
        const gpaInputs = currentSemesterCourses.map(record => {
            const gradePoint = record.gradeScale?.gradePoint;
            const credit = record.course?.credit;
            return {
                gradePoint,
                credit,
            }
        });
        console.log(`(backend/grades.service)\nGPA Inputs: `, gpaInputs);

        // ========================================================= 
        // calculate student GPA


        // compute total quality Points
        const semesterQualityPoints = gpaInputs.reduce((total, item) => {
            return total + (item.gradePoint * item.credit);
        }, 0);

        //compute total credits
        const semesterCredits = gpaInputs.reduce((total, item) => {
            return total + item.credit;
        }, 0);

        //calculate GPA
        const gpa = Number((semesterQualityPoints / semesterCredits).toFixed(2));
        console.log(`(backend/grades.service)\nCalculated GPA: `, gpa);

        // ========================================================= 
        // check if GPA already exists in gpa_records table, then update it. otherwise add record
        const gpaRecord = await this.gpaRecordsModel.findOne({
            where: {
                studentId,
                semesterId,
            },
        });

        // update the gpa record if it exists
        if (gpaRecord) {
            gpaRecord.gpa = gpa;
            gpaRecord.qualityPoints = semesterQualityPoints;
            gpaRecord.totalCredits = semesterCredits;
            await gpaRecord.save();
        } else {
            await this.gpaRecordsModel.create({
                id: uuidv4(),
                studentId,
                semesterId,
                gpa,
                qualityPoints: semesterQualityPoints,
                totalCredits: semesterCredits,
            });
        }

        // ========================================================= 
        // recalculate the CGPA
        const studentGpaRecords = await this.gpaRecordsModel.findAll({
            where: {
                studentId,
            },
            attributes: ["qualityPoints", "totalCredits"],
        });
        console.log(`(backend/grades.service)\nStudent GPA Records: `, JSON.stringify(studentGpaRecords, null, 2));

        //compute total quality points
        const cumulativeQualityPoints = studentGpaRecords.reduce((total, item) => {
            return total + item.qualityPoints;
        }, 0);
        //compute total credits
        const cumulativeCredits = studentGpaRecords.reduce((total, item) => {
            return total + item.totalCredits;
        }, 0);

        //calculate GPA
        const cgpa = Number((cumulativeQualityPoints / cumulativeCredits).toFixed(2));
        console.log(`(backend/grades.service)\nCalculated CGPA: `, cgpa);

        // Update the CGPA in the users table
        student.cgpa = cgpa;
        await student.save();

        return {
            message: 'GPA and CGPA was updated successfully',
            data: null,
        };
    }



}
