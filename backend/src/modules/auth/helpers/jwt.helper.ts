// =======================================================
// importing
// =======================================================
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from 'src/common/errors';
// =======================================================
// extract token's data
// =======================================================

export const extractJwtData = <TokenInterface>(token: string, secretKey: string): TokenInterface => {

    const data = jwt.verify(token, secretKey) as TokenInterface;
    if (!data || typeof data !== "object") {
        console.log("data in token is not valid");
        throw new UnauthorizedError("Invalid Token");
    }


    return data;
}