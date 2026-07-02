import { Controller, HttpCode, Get, Request, SetMetadata, UseGuards } from '@nestjs/common';

//swagger
import { ApiOperation, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';

//service
import { SemestersService } from './semesters.service';

//guard
import { RolesGuard } from '../auth/guards/auth.guard';
import { Roles } from '../users/enums/users.enum';

@Controller('semesters')
@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.ADMIN])
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) { }

  // ==========================================================================================
  //? Get all semesters
  // ==========================================================================================
  @Get('/all')
  @ApiOperation({ summary: 'Get All Semesters', description: 'Fetch list of all semesters configured in the database system.' })

  @HttpCode(200)
  @ApiOkResponse({ description: 'Semesters fetched successfully' })
  //error
  @ApiForbiddenResponse({ description: 'You are not authorized to access' })

  async getAllSemesters(@Request() req) {
    const result = await this.semestersService.getAllSemesters();
    return result;
  }
}
