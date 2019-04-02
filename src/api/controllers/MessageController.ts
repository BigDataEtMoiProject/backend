import {
    Authorized,
    Body,
    JsonController,
    OnUndefined,
    Post
} from "@mardari/routing-controllers";

import { Message } from "../models/Message";
import { UserService } from "../services/UserService";
import { BadRequest } from "../errors/BadRequest";
import { CurrentUser } from "routing-controllers";
import { User } from "../models/User";

@Authorized()
@JsonController("/messages")
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public create(
        @CurrentUser({ required: true }) user: User,
        @Body() messageList: Message[]
    ): Promise<User | Error> {
        // Cannot use class-validator to validate body array in typescript
        const cleanMessageList: Message[] = [];
        const errors: Error[] = [];

        // Validate each message element passed in the array
        messageList.forEach(message => {
            let cleanMessage = undefined;
            let cleanPhone = undefined;
            let cleanDate = undefined;

            if (
                message.message !== undefined &&
                typeof message.message === "string"
            ) {
                cleanMessage = message.message;
            } else {
                errors.push(new Error());
            }

            if (
                message.phone !== undefined &&
                typeof message.phone === "string"
            ) {
                cleanPhone = message.phone;
            } else {
                errors.push(new Error());
            }

            if (
                message.date !== undefined &&
                typeof message.date === "string"
            ) {
                cleanDate = message.date;
            }

            if (cleanMessage && cleanPhone && cleanDate) {
                const _message = new Message();
                _message.message = cleanMessage;
                _message.phone = cleanPhone;
                _message.date = cleanDate;
                cleanMessageList.push(_message);
            }
        });

        // If one element is not valid, return an error
        if (errors.length > 0) {
            return undefined;
        }

        return this.userService.addMessageList(cleanMessageList, user);
    }
}
