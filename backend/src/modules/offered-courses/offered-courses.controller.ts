import { Controller, Get, Post, Patch, Delete, Request, Param, Query, Body, HttpCode } from '@nestjs/common';

//swagger
import { ApiQuery, ApiForbiddenResponse, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

//service
import { OfferedCoursesService } from './offered-courses.service';

//guard
import { RolesGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Roles } from '../users/enums/users.enum';

// dtos
import { CreateOfferedCourseDto } from './dtos/offered-courses.dto';

// ==========================================================================================
//NOTE: 
// offeredCourses = courses that are offered for registeration at a specific semester
// availableCourses = courses that exists in the system and admin can choose from to add in offered courses
// ==========================================================================================

@Controller('offered-courses')
@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.ADMIN])

export class OfferedCoursesController {
  constructor(private readonly offeredCoursesService: OfferedCoursesService) { }



  // ==========================================================================================
  //? fetch offered courses (available courses for registeration) - student + admin
  // ==========================================================================================
  @Get('/')
  @SetMetadata('roles', [Roles.STUDENT, Roles.ADMIN])
  @ApiOperation({ summary: 'Get Available Offered Courses', description: 'Fetch offered courses for the current semester that the authenticated student can enroll in based on remaining credit limits.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8, description: 'Number of items per page' })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Offered courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiNotFoundResponse({ description: 'No active semester was found' })

  async getOfferedCoursesForStudent(
    @Request() req,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query('studentId') studentId?: string,
  ) {

    const targetStudentId =
      req.user.role === Roles.ADMIN
        ? studentId
        : req.user.id;

    const result = await this.offeredCoursesService.getOfferedCoursesForStudent(targetStudentId, page, limit);
    return result;
  }


  // ==========================================================================================
  //? admin: get offered courses (filterable by semester)
  // ==========================================================================================
  @Get('admin')
  @ApiOperation({ summary: 'Get Offered Courses for Admin', description: 'Fetch all offered courses, optionally filtered by semester, for administrative management.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'semesterId', required: false, type: String, example: '20000008' })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Offered courses fetched successfully' })
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })

  async getOfferedCoursesForAdmin(
    @Query('semesterId') semesterId: string | undefined,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.offeredCoursesService.getOfferedCoursesForAdmin(semesterId, page, limit);
  }


  // ==========================================================================================
  //? admin: add a course to a semester's offered courses
  // ==========================================================================================
  @Post('add')
  @ApiOperation({ summary: 'Add Offered Course', description: 'Offer a course in a specific semester.' })
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'Course added to semester successfully' })
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiConflictResponse({ description: 'This course is already offered in the selected semester' })
  @ApiNotFoundResponse({ description: 'Course or semester not found' })

  async createOfferedCourse(@Body() data: CreateOfferedCourseDto) {
    return this.offeredCoursesService.createOfferedCourse(data);
  }


  // ==========================================================================================
  //? admin: delete an offered course by id
  // ==========================================================================================
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Offered Course', description: 'Remove a course from a semester offering.' })
  @ApiParam({ name: 'id', required: true, type: String })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Offered course removed successfully' })
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiNotFoundResponse({ description: 'Offered course not found' })

  async deleteOfferedCourse(@Param('id') id: string) {
    return this.offeredCoursesService.deleteOfferedCourse(id);
  }



  // ==========================================================================================
  //? admin: get available courese to add in offered course (basically courses that are not in offered courses)
  // ==========================================================================================

  @Get('available-courses/:semesterId')
  @ApiOperation({ summary: 'Available Courses for Semester', description: 'Get courses that can be added to a semester offering (not already offered)' })
  @ApiParam({ name: 'semesterId', required: true, type: String })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Available courses fetched successfully' })
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  async getAvailableCoursesForSemester(
    @Param('semesterId') semesterId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.offeredCoursesService.getAvailableCoursesForSemester(semesterId, page, limit);
  }
}
