import {
    Authorized,
    Body,
    JsonController,
    OnUndefined,
    Post
} from "@mardari/routing-controllers";

import { BadRequest } from "../errors/BadRequest";
import { UserService } from "../services/UserService";
import { CurrentUser } from "routing-controllers";
import { User } from "../models/User";
import { CallHistory } from '../models/CallHistory';

@Authorized()
@JsonController("/callHistory")
export class CallHistoryController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public async create(
        @CurrentUser({ required: true }) user: User,
        @Body() callHistory: CallHistory[]
    ): Promise<User | Error> {
        return this.userService.addCallHistory(callHistory, user);
    }
}
