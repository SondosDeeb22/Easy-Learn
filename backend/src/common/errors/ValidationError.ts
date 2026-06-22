import { HttpException, HttpStatus } from '@nestjs/common';
// ============================================

// Bad Request Error
export class ValidationError extends HttpException {
    constructor(message: string) {
        super({
            code: 'VALIDATION_ERROR',
            message,
        },
            HttpStatus.BAD_REQUEST,
        );
    }
}