// ============================================
//? Importing
// ============================================

import { Response } from "express";
import { createCookie, removeCookie } from './cookie.helper';
import { extractJwtData } from "./jwt.helper";

import { Injectable } from "@nestjs/common";
// ============================================

@Injectable()
export class AuthHelper {

    // ===================================================
    // Create cookie to store jwt in it
    // ==============================================
    createCookie(res: Response, token: string, tokenName: string) {
        return createCookie(res, token, tokenName)
    }


    // ===================================================
    // Function to remove Cookie
    // ==============================================   
    removeCookie(res: Response, tokenName: string): null {
        return removeCookie(res, tokenName)
    }

    // ==============================================   
    // Funtion to extract data from jwt
    // ==============================================   
    extractJwtData<TokenInterface>(token: string, secretTitle: string): TokenInterface {
        return extractJwtData(token, secretTitle)
    }

}