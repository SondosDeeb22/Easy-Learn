// ============================================
// import
// ============================================
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
// ============================================
export class UnauthorizedError extends HttpException {
    constructor(message: string) {
        super(
            {
                code: 'UNAUTHORIZED_ERROR',
                message
            },
            HttpStatus.UNAUTHORIZED
        );
    }
}