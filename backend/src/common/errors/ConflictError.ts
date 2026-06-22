import { HttpException, HttpStatus } from '@nestjs/common';
// ============================================

export class ConflictError extends HttpException {

    constructor(message: string) {
        super({
            code: 'CONFLICT_ERROR',
            message,
        },
            HttpStatus.CONFLICT,
        );
    }
}   
