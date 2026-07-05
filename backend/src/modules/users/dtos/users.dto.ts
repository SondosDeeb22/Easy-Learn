import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';


export class StudentDataDto {

    @ApiProperty({ description: 'The unique identifier of the student', example: '20261144' })
    id: string;

    @ApiProperty({ description: 'The full name of the student', example: 'John Doe' })
    name: string;

    @ApiProperty({ description: 'The system role assigned to the user', example: 'student' })
    role: string;

    @ApiProperty({ description: 'The date of birth for the student', example: '2000-01-01' })
    birthDate: Date;

    @ApiProperty({ description: 'The gender classification', example: 'Male' })
    gender: string;

    @ApiProperty({ description: 'The registered student email address', example: 'student@easylearn.edu' })
    email: string;

    @ApiProperty({ description: 'The password credential (excluded from standard serialization responses)' })
    @Exclude()
    password: string;

    @ApiProperty({ description: 'The credit weight enrolled in the current semester (or null if admin)', example: 12, nullable: true })
    currentSemesterCredits: number | null;

    @ApiProperty({ description: 'The total cumulative credit count registered historically (or null if admin)', example: 48, nullable: true })
    totalCredits: number | null;

    @ApiProperty({ description: 'The maximum allowed credits for enrollment in the current semester', example: 18 })
    maxCredits: number;
}


// =================================================
// dto of filters
// =================================================

export class GetStudentsQueryDto {
    @ApiPropertyOptional({ description: 'Filter by Student ID', example: '20261144' })
    studentId?: string

    @ApiPropertyOptional({ description: 'Filter by Course ID', example: '50000004' })
    courseId?: string;

    @ApiPropertyOptional({ description: 'Filter by Semester ID', example: '20000008' })
    semesterId?: string;

    @ApiPropertyOptional({ description: 'Filter by Student Status', example: 'active', enum: ['active', 'passive', 'suspended', 'graduated'] })
    status?: string;

    @ApiProperty({ description: 'The page number for pagination context', example: 1, })
    page: number;

    @ApiProperty({ description: 'Number of rows to return per page', example: 10, })
    limit: number;

}

// =================================================
// dto of student data we pass to admin 
// =================================================
export class UserCardDataDto {
    @ApiProperty({ description: 'The unique identifier of the user', example: '20261144' })
    id: string;

    @ApiProperty({ description: 'The full name of the user', example: 'Jane Doe' })
    name: string;

    @ApiProperty({ description: 'The gender classification of the user', example: 'Female' })
    gender: string;

    @ApiProperty({ description: 'Current registered semester credits count', example: 15 })
    currentSemesterCredits: number;

    @ApiProperty({ description: 'Historical cumulative credits count', example: 60 })
    totalCredits: number;

    @ApiProperty({ description: 'System role type of the user', example: 'admin' })
    role: string;

    @ApiProperty({ description: 'Registered email address of the user', example: 'admin@easylearn.edu' })
    email: string;
    // --------------------
    @ApiProperty({ description: 'The date of birth (excluded from serialized client responses)' })
    @Exclude()
    birthDate: Date;
    @ApiProperty({ description: 'Encrypted or plain password credentials (excluded from serialized client responses)' })
    @Exclude()
    password: string;
    @ApiProperty({ description: 'Record creation timestamp (excluded from serialized client responses)' })
    @Exclude()
    createdAt: Date;
    @ApiProperty({ description: 'Record modification timestamp (excluded from serialized client responses)' })
    @Exclude()
    updatedAt: Date;
}