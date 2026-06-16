// ====================================================================================
//? Impritng
// ====================================================================================
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { plainToInstance } from 'class-transformer';
import { UsersModel } from '../../users/users.model';


// ====================================================================================

@Injectable()
// Convert plain response data to User instances before returning it
// the password will be excluded as i marked it @Exclude in user.model
export class AuthInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<UsersModel> | Promise<Observable<UsersModel>> {
        return next.handle().pipe(
            //  Response ======================================

            map((data) => { // RxJS map transforms the entire emitted response (whether it's single object or array of objects)

                // if no data returend is invalid(null, false, 0, undefined, '', {}) return it, don't implement the interceptor
                if (!data) return data;

                // ---------------------------------------------------------------------------------------

                // Convert Sequelize model instances into plain JavaScript objects
                // so class-transformer can properly apply decorators like @Exclude()
                const toPlain = (value: any) => {
                    if (value && typeof value.toJSON === 'function') {
                        return value.toJSON();
                    }
                    return value;
                };
                // -------------------------------------

                // response is a ServiceResult wrapper (contains data or message)
                if (data && typeof data === 'object' && ('data' in data || 'message' in data)) { //data is the returend object{} than containes { data: , message:}
                    if (data.data) {
                        return {
                            ...data,// message
                            data: plainToInstance(UsersModel, toPlain(data.data)) // returend data in the object
                        };
                    }
                    return data;
                }

                // reponse is Array, transform each item into a User instance
                if (Array.isArray(data)) {
                    return plainToInstance(UsersModel, data.map(toPlain));
                }

                // If the response contains a nested user object,
                // only transform the user property and preserve the rest of the response
                if (data.user) {
                    return {
                        ...data,
                        user: plainToInstance(UsersModel, toPlain(data.user))
                    };
                }

                // Otherwise, transform the single response object into a User instance
                return plainToInstance(UsersModel, toPlain(data));
            })
        );
    }
}
