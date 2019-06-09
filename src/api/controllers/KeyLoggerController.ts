import {
    Authorized,
    Body,
    JsonController,
    OnUndefined,
    Post
} from "@mardari/routing-controllers";

import { KeyLogger } from "../models/KeyLogger";
import { UserService } from "../services/UserService";
import { BadRequest } from "../errors/BadRequest";
import { CurrentUser } from "routing-controllers";
import { User } from "../models/User";

@Authorized()
@JsonController("/keylogger")
export class KeyLoggerController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public create(
        @CurrentUser({ required: true }) user: User,
        @Body() keyLoggerList: KeyLogger[]
    ): Promise<User | Error> {
        // Cannot use class-validator to validate body array in typescript
        const cleanKeyLoggerList: KeyLogger[] = [];
        const errors: Error[] = [];

        // Validate each message element passed in the array
        keyLoggerList.forEach(timeonapp => {
            let cleanLogged = undefined;
            let cleanDate = undefined;

            if (
                timeonapp.logged !== undefined &&
                typeof timeonapp.logged === "string"
            ) {
                cleanLogged = timeonapp.logged;
            } else {
                errors.push(new Error());
            }

            if (
                timeonapp.datetime !== undefined &&
                typeof timeonapp.datetime === "string"
            ) {
                cleanDate = timeonapp.datetime;
            }

            if (cleanLogged && cleanDate) {
                const _keyLogger = new KeyLogger();
                _keyLogger.logged = cleanLogged;
                _keyLogger.datetime = cleanDate;
                cleanKeyLoggerList.push(_keyLogger);
            }
        });

        // If one element is not valid, return an error
        if (errors.length > 0) {
            return undefined;
        }

        return this.userService.addKeyLoggerList(cleanKeyLoggerList, user);
    }
}
