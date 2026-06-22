import { ApiProperty } from "@nestjs/swagger"


export class RemoveCourseDto {
    @ApiProperty()
    id: string
}

export class UpdateGradeDto extends RemoveCourseDto {
    @ApiProperty()
    grade: string
}