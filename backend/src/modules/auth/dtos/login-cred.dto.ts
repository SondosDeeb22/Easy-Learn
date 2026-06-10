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

    @ApiProperty()
    id: string;

    // password =====================================
    @IsNotEmpty()
    @IsString()

    @ApiProperty()
    password: string;
}