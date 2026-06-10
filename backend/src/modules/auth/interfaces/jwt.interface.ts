// ===========================================================================
// importing interfaces
// ===========================================================================
import { Roles } from "../../users/enums/roles.enum"
import { User } from "../../users/users.model";

// =======================================================

// interface for jwt token
export interface LoginJwtInterface {
    userId: string;
    role: Roles;
    email: string;
}


// =======================================================
// interface for login result
export interface LoginResultInterface {
    token: string;
    data: User;
}