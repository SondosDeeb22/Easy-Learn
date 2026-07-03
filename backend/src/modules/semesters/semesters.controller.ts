import { Controller, HttpCode, Get, Request, SetMetadata, UseGuards, Query, Post, Patch, Body } from '@nestjs/common';

//swagger
import { ApiOperation, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';

//service
import { SemestersService } from './semesters.service';

//dtos
import { GetSemestersQueryDto, CreateSemesterDto, UpdateSemesterDto } from './dtos/semesters.dto';

//guard
import { RolesGuard } from '../auth/guards/auth.guard';
import { Roles } from '../users/enums/users.enum';

@Controller('semesters')
@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.ADMIN])
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) { }

  // ==========================================================================================
  //? Get current active semester
  // ==========================================================================================
  @Get('/current')

  @SetMetadata('roles', [Roles.ADMIN, Roles.STUDENT])
  @ApiOperation({ summary: 'Get Current Semester', description: 'Fetch the active semester based on the current date.' })

  @HttpCode(200)
  @ApiOkResponse({ description: 'Current semester fetched successfully' })

  async getCurrentSemester(@Request() req) {
    const result = await this.semestersService.getCurrentSemester();
    return result;
  }

  // ==========================================================================================
  //? Get all semesters
  // ==========================================================================================
  @Get('/all')
  @ApiOperation({ summary: 'Get All Semesters', description: 'Fetch list of all semesters configured in the database system.' })

  @HttpCode(200)
  @ApiOkResponse({ description: 'Semesters fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })

  async getAllSemesters(
    @Request() req,
    @Query() query?: GetSemestersQueryDto) {

    const result = await this.semestersService.getAllSemesters(query);
    return result;
  }

  // ==========================================================================================
  //? Create Semester
  // ==========================================================================================
  @Post('/add')
  @ApiOperation({ summary: 'Create Semester', description: 'Create a new semester in the system.' })
  @HttpCode(201)
  @ApiOkResponse({ description: 'Semester created successfully' })
  async createSemester(@Body() body: CreateSemesterDto) {
    return await this.semestersService.createSemester(body);
  }

  // ==========================================================================================
  //? Update Semester
  // ==========================================================================================
  @Patch('/update')
  @ApiOperation({ summary: 'Update Semester', description: 'Update details of an existing semester.' })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Semester updated successfully' })
  async updateSemester(@Body() body: UpdateSemesterDto) {
    return await this.semestersService.updateSemester(body);
  }
}
