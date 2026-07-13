//==========================================================================================================
//? Import
//======================================================================================================
import { Response, CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

/// ======================================================================================
// function to create a cookie
// ======================================================================================

export const createCookie = (res: Response, token: string, tokenName: string) => {
    res.cookie(tokenName, token, {
        httpOnly: true,
        // SameSite=None is required when frontend and backend are on different domains (cross-site).
        // SameSite=Lax only allows cookies on same-site navigation, blocking cross-origin XHR.
        sameSite: isProduction ? 'none' : 'lax',
        // Secure must be true when SameSite=None — browsers reject cookies that aren't.
        secure: isProduction,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days — makes cookie persistent across refreshes
    });
};

/// ======================================================================================
// function to delete the jwt in a cookie
// ======================================================================================

export const removeCookie = (res: Response, tokenName: string): null => {

    const baseOptions: CookieOptions = {
        httpOnly: true,
        // Must match the options used when setting the cookie, otherwise clearCookie won't work
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
    };

    res.clearCookie(tokenName, baseOptions);
    return null;
};
