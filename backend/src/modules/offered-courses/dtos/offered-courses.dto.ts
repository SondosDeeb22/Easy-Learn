import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetOfferedCoursesQueryDto {
    @ApiPropertyOptional({ description: 'Filter by Semester ID', example: '20000008' })
    @IsString()
    @IsOptional()
    semesterId?: string;
}

// --------------------------------------

export class CreateOfferedCourseDto {
    @ApiProperty({ description: 'The unique course identifier', example: '50000004' })
    @IsString()
    @IsNotEmpty()
    courseId: string;

    @ApiProperty({ description: 'The unique semester identifier', example: '20000008' })
    @IsString()
    @IsNotEmpty()
    semesterId: string;
}
