// ============================================
// import
// ============================================
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
// ============================================

export class InternalServerError extends HttpException {
    constructor(message: string) {
        super(
            {
                code: 'INTERNAL_SERVER_ERROR',
                message
            },
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}