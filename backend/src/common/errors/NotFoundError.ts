// ============================================
// import
// ============================================
import { HttpException, HttpStatus } from '@nestjs/common';

// ============================================

export class NotFoundError extends HttpException {
    constructor(message: string) {
        super(
            {
                code: 'NOT_FOUND_ERROR',
                message
            },
            HttpStatus.NOT_FOUND
        );
    }
} 