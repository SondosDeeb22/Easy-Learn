// =============================================================================
//? Import 
// ============================================================================

import { IsNotEmpty, IsString } from "class-validator";

// swagger
import { ApiProperty } from "@nestjs/swagger";

// ======================================================

export class LoginCredDto {
    // id =========================================
    @IsString()
    @IsNotEmpty()

    @ApiProperty({ description: 'userId', example: '20261144' })
    id: string;

    // password =====================================
    @IsNotEmpty()
    @IsString()

    @ApiProperty({ description: 'password', example: '123' })
    password: string;
}