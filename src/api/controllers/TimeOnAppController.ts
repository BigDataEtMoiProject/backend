import {
    Authorized,
    Body,
    JsonController,
    OnUndefined,
    Post
} from "@mardari/routing-controllers";

import { TimeOnApp } from "../models/TimeOnApp";
import { UserService } from "../services/UserService";
import { BadRequest } from "../errors/BadRequest";
import { CurrentUser } from "routing-controllers";
import { User } from "../models/User";

@Authorized()
@JsonController("/timeonapp")
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public create(
        @CurrentUser({ required: true }) user: User,
        @Body() messageList: TimeOnApp[]
    ): Promise<User | Error> {
        // Cannot use class-validator to validate body array in typescript
        const cleanMessageList: TimeOnApp[] = [];
        const errors: Error[] = [];

        // Validate each message element passed in the array
        messageList.forEach(timeonapp => {
            let cleanAppName = undefined;
            let cleanDate = undefined;

            if (
                timeonapp.appName !== undefined &&
                typeof timeonapp.appName === "string"
            ) {
                cleanAppName = timeonapp.appName;
            } else {
                errors.push(new Error());
            }

            if (
                timeonapp.datetime !== undefined &&
                typeof timeonapp.datetime === "string"
            ) {
                cleanDate = timeonapp.datetime;
            }

            if (cleanAppName && cleanDate) {
                const _timeOnApp = new TimeOnApp();
                _timeOnApp.appName = cleanAppName;
                _timeOnApp.datetime = cleanDate;
                cleanMessageList.push(_timeOnApp);
            }
        });

        // If one element is not valid, return an error
        if (errors.length > 0) {
            return undefined;
        }

        return this.userService.addTimeOnAppList(cleanMessageList, user);
    }
}
