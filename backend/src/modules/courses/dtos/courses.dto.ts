import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber, IsInt, Min, Max } from 'class-validator';

export class GetCoursesQueryDto {
    @ApiPropertyOptional({ description: 'Filter by Course Code', example: 'PHY101' })
    code?: string;

    @ApiPropertyOptional({ description: 'Filter by Course Name (title)', example: 'Introduction to Physics' })
    title?: string;

    @ApiPropertyOptional({ description: 'Filter by Status (active - true/false)', example: 'true' })
    status?: string;
}

// =============================================================================

export class CreateCourseDto {
    @ApiProperty({ description: 'Course Code', example: 'PHY101' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ description: 'Course Title', example: 'Introduction to Physics' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Course Credits', example: 3 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(10)
    credit: number;

    @ApiPropertyOptional({ description: 'Status (active)', example: true })
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}

// =============================================================================

export class UpdateCourseDto {
    @ApiProperty({ description: 'The unique course identifier', example: '50000004' })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'Course Code', example: 'PHY101' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ description: 'Course Title', example: 'Introduction to Physics' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Course Credits', example: 3 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(10)
    credit: number;

    @ApiProperty({ description: 'Status (active)', example: true })
    @IsBoolean()
    @IsNotEmpty()
    active: boolean;
}

