import { ApiProperty } from "@nestjs/swagger"


export class RemoveCourseDto {
    @ApiProperty({ description: 'The unique identifier of the academic/enrollment record', example: '10000005' })
    id: string
}

export class UpdateGradeDto extends RemoveCourseDto {
    @ApiProperty({ description: 'The grade letter or mark to assign to the record (e.g. A, B+, Pass, or numeric value)', example: 93 })
    numericGrade: number
}