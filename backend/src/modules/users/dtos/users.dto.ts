import { ApiProperty, } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
export class StudentDataDto {

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    birthDate: Date;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    @Exclude()
    password: string;

    @ApiProperty()
    currentSemesterCredit: number;

    @ApiProperty()
    totalCredit: number;

    @ApiProperty()
    maxCredits: number;
}