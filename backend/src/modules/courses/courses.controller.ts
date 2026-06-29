import { Controller, Get, Request, Param, Query, Post, HttpCode, BadRequestException, Delete } from '@nestjs/common';
import { ApiQuery, ApiForbiddenResponse, ApiBadRequestResponse, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

//service
import { CoursesService } from './courses.service';

//guard
import { RolesGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Roles } from '../users/enums/roles.enum';
import { NotFoundError } from 'src/common/errors';
// ======================================================

@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.ADMIN])

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }


  // ==========================================================================================
  //? Get all courses 
  // ==========================================================================================
  @Get('all')
  @ApiOperation({ summary: 'Get All Database Courses', description: 'Fetch list of all courses present in the system database records.' })

  @HttpCode(200)
  @ApiOkResponse({ description: 'All courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })

  async getAllCourses(@Request() req,) {
    const result = await this.coursesService.getAllCourses();
    return result;
  }


  // ==========================================================================================
  //? Get Studnet all courses 
  // ==========================================================================================
  @Get("student/all")
  @SetMetadata('roles', [Roles.STUDENT])
  @ApiOperation({ summary: 'Get Student All Registered Courses', description: 'Retrieve history of all courses the authenticated student is or has been registered in.' })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 5, description: 'Number of items per page' })
  @ApiQuery({
    name: 'semester',
    required: false,
    type: String,
    example: '20000008',
    description: 'Filter by specific Semester ID'
  })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: "You are not authorized to access" })

  async getAllStudentCourses(
    @Request() req,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("semester") semester?: string,
  ) {
    console.log(req.user);
    return this.coursesService.getAllStudentCourses(req.user.id, page, limit, semester);
  };


  // // ==========================================================================================
  // //? Get Studnet courses for current semester - by student
  // // ==========================================================================================
  // @Get("current")
  // @SetMetadata('roles', [Roles.STUDENT])
  // @ApiOperation({ summary: 'Get Current Semester Courses for Student', description: 'Fetch courses the authenticated student is registered in for the active academic semester.' })
  // @HttpCode(200)
  // @ApiOkResponse({ description: 'Current Courses fetched successfully' })
  // //error
  // @ApiForbiddenResponse({ description: "You are not authorized to access" })

  // async getStudentCurrentCourses(
  //   @Request() req,

  // ) {
  //   return this.coursesService.getCurrentStudentCourses(req.user.id);
  // };

  // // ==========================================================================================
  // //? Get Studnet courses for current semester - by admin
  // // ==========================================================================================
  // @Get("current/:studentId")
  // @ApiOperation({ summary: 'Get Current Semester Courses for Student (Admin)', description: 'Allows admins to view any student\'s courses for the current semester.' })
  // @ApiParam({ name: 'studentId', required: true, type: String, example: '20261144', description: 'The unique student identifier' })
  // @HttpCode(200)
  // @ApiOkResponse({ description: 'Current Courses fetched successfully' })
  // //error
  // @ApiForbiddenResponse({ description: "You are not authorized to access" })

  // async getStudentCurrentCoursesForAdmin(
  //   @Request() req,
  //   @Param('studentId') studentId: string,
  // ) {
  //   return this.coursesService.getCurrentStudentCourses(studentId);
  // };


  // ==========================================================================================
  //? Get Studnet courses for current semester - by admin
  // ==========================================================================================
  @Get("current")
  @SetMetadata('roles', [Roles.STUDENT, Roles.ADMIN])
  @ApiOperation({ summary: 'Get Student Current Semester Courses', description: 'Allows admins to view any student\'s courses for the current semester.' })
  @ApiQuery({ required: false, name: "studentId", type: String })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Current Courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: "You are not authorized to access" })
  @ApiBadRequestResponse({ description: "studentId is required for administrators" })
  async getStudentCurrentCoursesForAdmin(
    @Request() req,
    @Query('studentId') studentId: string,
  ) {
    // admin can see details for all student by providing studentId
    // students can only access their own courses
    if (req.user.role === Roles.ADMIN && !studentId) throw new BadRequestException("studentId is required for administrators.");

    const targetStudentId =
      req.user.role === Roles.ADMIN
        ? studentId
        : req.user.id;

    return this.coursesService.getCurrentStudentCourses(targetStudentId);

  };









  // ==========================================================================================
  //? Enroll student in a course
  // ==========================================================================================
  @Post(':courseId/enroll')
  @SetMetadata('roles', [Roles.STUDENT])
  @ApiOperation({ summary: 'Enroll Student in Course', description: 'Enrolls the authenticated student in the specified course ID for the current semester.' })
  @ApiParam({ name: 'courseId', required: true, type: String, example: '50000004', description: 'The unique course identifier' })
  @ApiCreatedResponse({ description: 'Student enrolled in course successfully' })
  //error
  @ApiNotFoundResponse()
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiConflictResponse({ description: 'Already enrolled in this course' })
  async enrollStudent(
    @Param('courseId') courseId: string,
    @Request() req
  ) {
    const result = await this.coursesService.enrollStudent(req.user.id, courseId);
    return result;
  }




  // ==========================================================================================
  //? withdraw a student from a course
  // ==========================================================================================
  @Delete('withdraw/:studentId/:courseId')
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Withdraw Student from Course', description: 'Withdraws the authenticated student from the specified course for the current semester.' })
  @ApiParam({ name: 'courseId', required: true, type: String, example: '50000004', description: 'The unique course identifier' })
  @ApiCreatedResponse({ description: 'Student withdrawn from course successfully' })
  //error
  @ApiNotFoundResponse()
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiConflictResponse({ description: 'You are not registered for this course' })
  async withdrawStudent(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
    @Request() req
  ) {
    const result = await this.coursesService.withdrawStudentCourse(studentId, courseId);
    return result;
  }

}
