//==========================================================================================================
//? Import
//======================================================================================================
import { Response, CookieOptions } from 'express';

/// ======================================================================================
// function to create a cookie
// ======================================================================================

export const createCookie = (res: Response, token: string, tokenName: string) => {
    res.cookie(tokenName, token, {
        httpOnly: true,
        sameSite: "lax"
    })
}

/// ======================================================================================
// function to delete the jwt in a cookie
// ======================================================================================

export const removeCookie = (res: Response, tokenName: string): null => {

    const baseOptions: CookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    }

    // Clear with the same options used to set the cookie
    res.clearCookie(tokenName, baseOptions);

    // Also try clearing with /api path for backwards compatibility
    res.clearCookie(tokenName, { ...baseOptions, path: "/api" });
    return null;

}
