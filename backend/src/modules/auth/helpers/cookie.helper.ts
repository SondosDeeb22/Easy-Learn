//==========================================================================================================
//? Import
//======================================================================================================
import { Response } from 'express';

/// ======================================================================================
// function to create a cookie
// ======================================================================================

export const createCookie = (res: Response, token: string, tokenName: string) => {
    res.cookie(tokenName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict"
    })
}

/// ======================================================================================
// function to delete the jwt in a cookie
// ======================================================================================

export const removeCookie = (res: Response, tokenName: string): null => {

    const isProduction = process.env.NODE_ENV === "development";
    const baseOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" as const : "lax" as const,
        path: "/",
    }

    // Clear with the same options used to set the cookie
    res.clearCookie(tokenName, baseOptions);

    // Also try clearing with /api path for backwards compatibility
    res.clearCookie(tokenName, { ...baseOptions, path: "/api" });
    return null;

}
