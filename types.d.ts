// import { Request as ExpressRequest } from 'express';
import {User} from "./src/db/schema"

// interface RequestWithUser extends ExpressRequest {
//     user?: User;
//   }



declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

