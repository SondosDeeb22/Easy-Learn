// ===========================================================================
// importing interfaces
// ===========================================================================
import { Roles } from "../../users/enums/roles.enum"

// =======================================================

// interface for jwt token
export interface LoginJwtInterface {
    id: string;
    role: Roles;
    email: string;
    name: string;
}


// =======================================================
// interface for login result
export interface LoginResultInterface {
    token: string;
    data: LoginJwtInterface;
}