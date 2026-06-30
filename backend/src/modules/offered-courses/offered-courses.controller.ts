import { Controller, Get, Request, Param, Query, Post, HttpCode } from '@nestjs/common';

//swagger
import { ApiQuery, ApiForbiddenResponse, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

//service
import { OfferedCoursesService } from './offered-courses.service';

//guard
import { RolesGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Roles } from '../users/enums/roles.enum';


@Controller('offered-courses')
@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.ADMIN])
export class OfferedCoursesController {
  constructor(private readonly offeredCoursesService: OfferedCoursesService) { }

  // ==========================================================================================
  //? fetch offered courses (available courses for registeration)
  // ==========================================================================================
  @Get('/')
  @SetMetadata('roles', [Roles.STUDENT, Roles.ADMIN])
  @ApiOperation({ summary: 'Get Available Offered Courses', description: 'Fetch offered courses for the current semester that the authenticated student can enroll in based on remaining credit limits.' })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 8, description: 'Number of items per page' })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Offered courses fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })
  @ApiNotFoundResponse({ description: 'No active semester was found' })

  async getAvailableCoursesForStudent(
    @Request() req,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query('studentId') studentId?: string,
  ) {

    const targetStudentId =
      req.user.role === Roles.ADMIN
        ? studentId
        : req.user.id;

    const result = await this.offeredCoursesService.getAvailableCoursesForStudent(targetStudentId, page, limit);
    return result;
  }
}
