import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

// =================================================================================
export class GetSemestersQueryDto {
    @ApiPropertyOptional({ description: 'Filter by Semester Title', example: 'Fall' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ description: 'Filter by Date (ISO format)', example: '2026-07-03' })
    @IsString()
    @IsOptional()
    date?: string;

    @ApiPropertyOptional({ description: 'Page number', example: 1 })
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ description: 'Limit number', example: 10 })
    @IsOptional()
    limit?: number;
}

// --------------------------------------------------------------------------------

export class CreateSemesterDto {
    @ApiProperty({ description: 'Semester Title', example: 'Fall 2026-2027' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Start Date', example: '2026-09-01' })
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({ description: 'End Date', example: '2027-01-15' })
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty({ description: 'Maximum Credits', example: 18 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    maxCredits: number;
}
// --------------------------------------------------------------------------------

export class UpdateSemesterDto {
    @ApiProperty({ description: 'Semester ID', example: '20000001' })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'Semester Title', example: 'Fall 2026-2027' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Start Date', example: '2026-09-01' })
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({ description: 'End Date', example: '2027-01-15' })
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty({ description: 'Maximum Credits', example: 18 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    maxCredits: number;
}
