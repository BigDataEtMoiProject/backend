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
import { UserService } from '../services/UserService';
import { Photo } from '../models/Photo';

@Authorized()
@JsonController("/photo")
export class PhotoController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public create(
        @CurrentUser({ required: true }) user: User,
        @Body({options: {limit: '10mb'}}) photo: Photo
    ): Promise<User | Error> {
        // Cannot use class-validator to validate body array in typescript

        return this.userService.addPhoto(photo, user);
    }
}
