import { ApiProperty } from "@nestjs/swagger"


export class RemoveCourseDto {
    @ApiProperty({ description: 'The unique identifier of the academic/enrollment record', example: 'd3b07384-d113-4ec8-a5c1-d3456789abcd' })
    id: string
}

export class UpdateGradeDto extends RemoveCourseDto {
    @ApiProperty({ description: 'The grade letter or mark to assign to the record (e.g. A, B+, Pass, or numeric value)', example: 'AA' })
    grade: string
}