// =======================================================
// importing
// =======================================================
import jwt from 'jsonwebtoken';



// =======================================================
// extract token's data
// =======================================================

export const extractJwtData = <TokenInterface>(token: string, secretTitle: string): TokenInterface => {
    const secret = process.env[secretTitle];
    if (!secret) {
        throw new Error(`${secretTitle} is not defined`);
    }

    const decoded = jwt.verify(token, secret) as TokenInterface;
    return decoded;
}