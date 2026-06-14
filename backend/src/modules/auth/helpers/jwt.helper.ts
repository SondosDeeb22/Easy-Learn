// =======================================================
// importing
// =======================================================
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from 'src/common/errors';

// =======================================================
// extract token's data
// =======================================================

export const extractJwtData = <TokenInterface>(token: string, secretTitle: string): TokenInterface => {

    const secret = process.env[secretTitle];
    if (!secret) {
        throw new Error(`${secretTitle} is not defined`);
    }

    const data = jwt.verify(token, secret) as TokenInterface;
    if (!data || typeof data !== "object") {
        throw new UnauthorizedError("Invalid Token");
    }


    return data;
}