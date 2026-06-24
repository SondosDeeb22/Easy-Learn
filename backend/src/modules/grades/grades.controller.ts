import { Controller, Get, Param, SetMetadata } from '@nestjs/common';

import { Roles } from 'src/modules/users/enums/roles.enum';
import { ApiTags, ApiForbiddenResponse, ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';
//service
import { GradesService } from './grades.service';

// ============================================================
@SetMetadata('roles', [Roles.ADMIN])

@ApiTags('grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) { }


  @Get('/:studentId')
  @ApiParam({ name: 'studentId', example: '20261144', })
  // -------------
  @ApiOkResponse({ description: "GPA and CGPA updated successfully" })
  //error
  @ApiForbiddenResponse({ description: "Forbidden access" })
  // -------------

  @ApiOperation({ summary: 'Update Student GPA', description: 'Calculate and update a specific student GPA and CGPA.' })
  async upsertGPAAndUpdateCGPA(
    @Param('studentId') studentId: string) {
    return this.gradesService.upsertGPAAndUpdateCGPA(studentId);
  }

}
