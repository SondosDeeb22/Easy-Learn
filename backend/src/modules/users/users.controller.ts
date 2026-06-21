import { Controller, UseGuards, Get, Param, SetMetadata, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { NotFoundError } from 'src/common/errors';

// guard
import { Roles } from './enums/roles.enum';
import { RolesGuard } from '../auth/guards/auth.guard';


//interceptor
import { TransformInterceptor } from '../../common/interceptors/Transform.interceptor';
import { UseInterceptors } from '@nestjs/common';

import { StudentDataDto } from './dtos/users.dto';
// ============================================================

@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.STUDENT, Roles.ADMIN])

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  /// ============================================================


  @Get('/students')

  @HttpCode(200)
  @ApiOkResponse({ description: "User fetched successfully" })

  //error
  @ApiForbiddenResponse({ description: "Forbidden access" })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'courseId', required: false })
  @ApiQuery({ name: 'semesterId', required: false })
  async getStudents(
    // @Query('page') page: number,
    // @Query('limit') limit: number,

    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
    @Query('semesterId') semesterId?: string,

  ) {
    return this.usersService.getStudents({ studentId, courseId, semesterId }, 1, 10);
  }
  /// ============================================================

  @Get('/:id')
  @UseInterceptors(new TransformInterceptor(StudentDataDto))

  @HttpCode(200)
  @ApiOkResponse({ description: "user fetched successfully" })
  //error
  @ApiNotFoundResponse({ description: "User was not found" })
  @ApiForbiddenResponse({ description: "You are not authorized to access" })

  async findUserById(@Param('id') id: string) {
    const result = await this.usersService.getStudentData(id);
    if (!result) throw new NotFoundError("User was not found");
    console.log("this is userData:\n", result)
    return result
  }
  /// ============================================================



}
