import { Controller, UseGuards, Get, Param, SetMetadata, HttpCode, Query, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiQuery } from '@nestjs/swagger';

import { NotFoundError } from 'src/common/errors';

// guard
import { Roles } from '../users/enums/roles.enum';
import { RolesGuard } from '../auth/guards/auth.guard';

//service
import { AcademicRecordsService } from './academicRecords.service';

// dto
import { UpdateGradeDto } from './dtos/academicRecords.dto';
// ============================================================

@UseGuards(RolesGuard)
@SetMetadata('roles', [Roles.ADMIN])

@ApiTags('academic-records')
@Controller('academic-records')
export class AcademicRecordsController {
    constructor(private readonly academicRecordsService: AcademicRecordsService) { }
    /// ============================================================


    @Patch('/student/update-grade')

    @HttpCode(200)
    @ApiOkResponse({ description: "User fetched successfully" })

    //error
    @ApiForbiddenResponse({ description: "Forbidden access" })
    async updateGrade(
        @Body() payload: UpdateGradeDto,

    ) {
        return this.academicRecordsService.updateStudentGrade(payload);
    }
    /// ============================================================



}
