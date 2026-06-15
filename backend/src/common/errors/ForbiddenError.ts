// ============================================
// import
// ============================================
import { HttpException, HttpStatus } from '@nestjs/common';
// ============================================

export class ForbiddenError extends HttpException {
    constructor(message: string) {
        super(
            {
                code: 'FORBIDDEN_ERROR',
                message,
            },
            HttpStatus.FORBIDDEN,
        );
    }

} 