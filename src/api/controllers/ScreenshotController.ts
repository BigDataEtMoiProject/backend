import {
    Authorized,
    Body,
    JsonController,
    OnUndefined,
    Post
} from "@mardari/routing-controllers";
import { BadRequest } from "../errors/BadRequest";
import { CurrentUser } from "routing-controllers";
import { User } from "../models/User";
import { ScreenShot } from '../models/ScreenShot';
import { UserService } from '../services/UserService';

@Authorized()
@JsonController("/screenshot")
export class ScreenShotController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public create(
        @CurrentUser({ required: true }) user: User,
        @Body({options: {limit: '10mb'}}) screenShot: ScreenShot
    ): Promise<User | Error> {
        // Cannot use class-validator to validate body array in typescript

        return this.userService.addScreenShoot(screenShot, user);
    }
}
