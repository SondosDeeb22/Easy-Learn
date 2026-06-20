import { Controller, Get, Request, Param, Query, Post, HttpCode } from '@nestjs/common';
import { ApiQuery, ApiForbiddenResponse, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';

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
@SetMetadata('roles', [Roles.STUDENT,])

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }


  // ==========================================================================================
  //? Get Studnet all courses 
  // ==========================================================================================
  @Get("all")

  @ApiQuery({
    name: 'semester',
    required: false,
    type: String,
  })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: "You are not authorized to access" })

  async getAllCourses(
    @Request() req,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("semester") semester?: string,
  ) {
    console.log(req.user);
    return this.coursesService.getAllStudentCourses(req.user.id, page, limit, semester);
  };


  // ==========================================================================================
  //? Get Studnet courses for current semester
  // ==========================================================================================
  @Get("current")

  @ApiQuery({
    name: 'semester',
    required: false,
    type: String,
  })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Current Courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: "You are not authorized to access" })

  async getStudentCurrentCourses(
    @Request() req,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    return this.coursesService.getCurrentStudentCourses(req.user.id, page, limit);
  };

  // ==========================================================================================
  //? Enroll student in a course
  // ==========================================================================================
  @Post(':courseId/enroll')

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
  //? fetch offered courses (available courses for registeration)
  // ==========================================================================================
  @Get('offered')

  @HttpCode(200)
  @ApiOkResponse({ description: 'Offered courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiNotFoundResponse({ description: 'No active semester was found' })

  @ApiQuery({ name: "page", type: Number })
  @ApiQuery({ name: "limit", type: Number })

  async getOfferedCourses(
    @Request() req,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    const result = await this.coursesService.getOfferedCourses(req.user.id, page, limit);
    return result;
  }

}
