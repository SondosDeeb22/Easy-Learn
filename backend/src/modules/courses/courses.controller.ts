import { Controller, Get, Request, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiForbiddenResponse } from '@nestjs/swagger';

//service
import { CoursesService } from './courses.service';

//guard
import { RolesGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Roles } from '../users/enums/roles.enum';
// ======================================================

@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.STUDENT,])

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }


  // ==========================================================================================
  //? Get All courses 
  // ==========================================================================================
  @ApiQuery({
    name: 'semester',
    required: false,
    type: String,
  })
  //error
  @ApiForbiddenResponse({ description: "You are not authorized to access this resource" })
  @Get("all")
  async getAllCourses(@Request() req, @Query("semester") semester?: string) {
    console.log(req.user);
    return this.coursesService.getAllCourses(req.user.id, semester);
  }
}
