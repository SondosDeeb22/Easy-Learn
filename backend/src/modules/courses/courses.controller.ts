import { Controller, Get, Request, Param, Query, Post, HttpCode, BadRequestException, Delete, Body, Patch } from '@nestjs/common';
import { ApiQuery, ApiForbiddenResponse, ApiBadRequestResponse, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

//service
import { CoursesService } from './courses.service';

//guard
import { RolesGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Roles } from '../users/enums/users.enum';
import { NotFoundError } from 'src/common/errors';
// dtos
import { GetCoursesQueryDto, CreateCourseDto, UpdateCourseDto } from './dtos/courses.dto';

// ======================================================
@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.ADMIN])

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }



  // ==========================================================================================
  //? Create a new course
  // ==========================================================================================
  @Post('add')
  @ApiOperation({ summary: 'Create Course', description: 'Creates a new course in the system.' })
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'Course created successfully' })
  // error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiConflictResponse({ description: 'Course with this code already exists' })

  async createCourse(@Body() data: CreateCourseDto) {
    return this.coursesService.createCourse(data);
  }

  // ==========================================================================================
  //? Update course details
  // ==========================================================================================
  @Patch('update')
  @ApiOperation({ summary: 'Update Course', description: 'Updates details of an existing course in the system.' })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Course updated successfully' })
  // error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiConflictResponse({ description: 'Course with this code or title already exists' })
  async updateCourse(@Body() data: UpdateCourseDto) {
    return this.coursesService.updateCourse(data);
  }


  // ==========================================================================================
  //? Get Studnet courses for current semester
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
  //? Get courses with filters
  // ==========================================================================================
  @Get()
  @ApiOperation({ summary: 'Get Filtered Courses', description: 'Fetch a list of courses. Filter by code, name, or status.' })
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 5, description: 'Number of items per page' })

  @ApiQuery({ name: 'code', required: false, type: String, example: 'CSE101', description: 'Filter by course code' })
  @ApiQuery({ name: 'title', required: false, type: String, example: 'Introduction to Computer Science', description: 'Filter by course title' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, example: true, description: 'Filter by course status' })

  @ApiOkResponse({ description: 'Courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  async getCourses(
    @Query() query: GetCoursesQueryDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.coursesService.getCourses(query, page, limit);
  }


  // ==========================================================================================
  //? Get Studnet's all courses 
  // ==========================================================================================
  @Get("student/all")
  @SetMetadata('roles', [Roles.STUDENT])
  @ApiOperation({ summary: 'Get Student All Registered Courses', description: 'Retrieve history of all courses the authenticated student is or has been registered in.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 5, description: 'Number of items per page' })
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
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("semester") semester?: string,
  ) {
    console.log(req.user);
    return this.coursesService.getAllStudentCourses(req.user.id, page, limit, semester);
  };



  // ==========================================================================================
  //? Enroll student in a course
  // ==========================================================================================
  @Post(':courseId/enroll')
  @SetMetadata('roles', [Roles.STUDENT, Roles.ADMIN])
  @ApiOperation({ summary: 'Enroll Student in Course', description: 'Enrolls the authenticated student in the specified course ID for the current semester.' })
  @ApiParam({ name: 'courseId', required: true, type: String, example: '50000004', description: 'The unique course identifier' })
  @ApiCreatedResponse({ description: 'Student enrolled in course successfully' })
  //error
  @ApiNotFoundResponse()
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiConflictResponse({ description: 'Already enrolled in this course' })
  async enrollStudent(
    @Param('courseId') courseId: string,
    @Query('studentId') studentId: string,
    @Request() req
  ) {

    if (req.user.role === Roles.ADMIN && !studentId) throw new BadRequestException("studentId is required for administrators.");

    const targetStudentId =
      req.user.role === Roles.ADMIN
        ? studentId
        : req.user.id;

    return this.coursesService.enrollStudent(targetStudentId, courseId);

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
    console.log("removing course for student :", studentId)
    const result = await this.coursesService.withdrawStudentCourse(studentId, courseId);
    return result;
  }

}
