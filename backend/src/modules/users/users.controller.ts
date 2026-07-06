import { Controller, UseGuards, Get, Param, SetMetadata, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiQuery, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { NotFoundError } from 'src/common/errors';

// guard
import { Roles } from './enums/users.enum';
import { RolesGuard } from '../auth/guards/auth.guard';


//interceptor
import { TransformInterceptor } from '../../common/interceptors/Transform.interceptor';
import { UseInterceptors } from '@nestjs/common';

import { StudentDataDto, UserCardDataDto, GetStudentsQueryDto } from './dtos/users.dto';
// ============================================================

@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.STUDENT, Roles.ADMIN])

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /// ================================================================
  //? fetch the user data
  // ===============================================================
  @Get('/:id')

  @ApiParam({ name: 'id', example: '20261144', })
  @ApiOperation({ summary: 'Get Student Detailed Data', description: 'Retrieve detailed data for a specific student, basic info from users table and the semester maxCredits.' })
  @UseInterceptors(new TransformInterceptor(StudentDataDto))

  @HttpCode(200)
  @ApiOkResponse({ description: "user fetched successfully" })
  //error
  @ApiNotFoundResponse({ description: "User was not found" })
  @ApiForbiddenResponse({ description: "You are not authorized to access" })

  async findUserById(@Param('id') id: string) {
    const result = await this.usersService.getUserData(id);
    if (!result) throw new NotFoundError("User was not found");
    console.log("this is userData:\n", result)
    return result;
  }

  // ===========================================================
  //? fetch student current gpa
  // =============================================================
  @Get('/gpa/:studentId/:semesterId')
  @ApiParam({ name: 'studentId', example: '20261144', })
  @ApiParam({ name: 'semesterId', example: 'semester-1', })

  async getStudentCurrentGPA(
    @Param('studentId') studentId: string,
    @Param('semesterId') semesterId: string
  ) {
    const result = await this.usersService.getCurrentStudentGPA(studentId, semesterId);
    if (!result) throw new NotFoundError("User was not found");
    return result;
  }


  /// ============================================================
  //? fetch the filtered students
  // =============================================================
  @Get('/students')
  @ApiOperation({ summary: 'Get List of Filtered Students', description: 'Fetch a list of students with pagination. Filter by courseId, or semesterId.' })

  @HttpCode(200)
  @ApiOkResponse({ description: "User fetched successfully" })

  //error
  @ApiForbiddenResponse({ description: "Forbidden access" })
  async getStudents(
    @Query() query: GetStudentsQueryDto,
  ) {
    return this.usersService.getStudents(query);
  }






}
