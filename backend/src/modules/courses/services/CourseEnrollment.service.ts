import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// models
import { CoursesModel } from '../courses.model';
import { AcademicRecordsModel } from '../../academicRecords/academic-records.model';
import { SemestersModel } from '../../semesters/semesters.model';
import { UsersModel } from '../../users/users.model';
import { OfferedCoursesModel } from '../../offered-courses/offered-courses.model';

// interface
import { ServiceResult } from '../../../common/interfaces/service-result.interface';

// error
import { NotFoundError } from '../../../common/errors';

// enums
import { Roles } from '../../users/enums/users.enum';

// helper
import { CrudHelper } from '../../../common/helpers/crud.helper';

//=========================================================================
@Injectable()
export class CourseEnrollmentService {
    constructor(
        @InjectModel(CoursesModel)
        private readonly coursesModel: typeof CoursesModel,
        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel,
        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,
        @InjectModel(UsersModel)
        private readonly usersModel: typeof UsersModel,
        @InjectModel(OfferedCoursesModel)
        private readonly offeredCoursesModel: typeof OfferedCoursesModel,

        private readonly crudHelper: CrudHelper,
    ) { }

    async enrollStudent(studentId: string, courseId: string): Promise<ServiceResult<null>> {
        // verify student exists
        const student = await this.usersModel.findByPk(studentId);
        if (!student) throw new NotFoundError("Student not found");

        // if user is not student we stop the enrollment process --------
        if (student.role !== Roles.STUDENT) {
            throw new ConflictException(
                "Only students can enroll in courses"
            );
        }

        // verify course exists
        const course = await this.coursesModel.findByPk(courseId);
        if (!course) throw new NotFoundError("Course not found");

        // check if student is already enrolled
        const alreadyEnrolled = await this.academicRecordsModel.findOne({
            where: { studentId, courseId }
        });
        if (alreadyEnrolled) throw new ConflictException("Already enrolled in this course");

        // get current semesterv
        const today = new Date();
        const currentSemester = await this.semestersModel.findOne({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            }
        });
        if (!currentSemester) throw new NotFoundError("No active semester found");
        // verify course is offered in the current semester
        const isOffered = await this.offeredCoursesModel.findOne({
            where: { courseId, semesterId: currentSemester.id }
        });
        if (!isOffered) {
            throw new ConflictException("This course is not offered in the current semester");
        }

        // enroll student - add reocrd in academic records table  ----------------------------------------------
        await this.academicRecordsModel.create({
            id: uuidv4().substring(0, 8),
            studentId,
            courseId,
            semesterId: currentSemester.id,
            numericGrade: null,
            letterGrade: null
        });

        // update student's credit
        await this.crudHelper.update(this.usersModel, {
            id: studentId,
            currentSemesterCredits: (student.currentSemesterCredits ?? 0) + course.credit,
            totalCredits: (student.totalCredits ?? 0) + course.credit
        });
        return {
            message: "Student enrolled successfully",
            data: null,
        }
    }
}
