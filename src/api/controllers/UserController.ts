import {
    Authorized,
    Body,
    Delete,
    Get,
    JsonController,
    OnUndefined,
    Param,
    Post,
    Put,
    Req
} from "@mardari/routing-controllers";

import { UserNotFoundError } from "../errors/UserNotFoundError";
import { User } from "../models/User";
import { UserService } from "../services/UserService";
import { DeleteResult } from "typeorm";
import { EmailAlreadyExists } from "../errors/EmailAlreadyExists";

@JsonController("/users")
export class UserController {
    constructor(private userService: UserService) {}

    @Authorized()
    @Get()
    public find(): Promise<User[]> {
        return this.userService.find();
    }

    @Authorized()
    @Get("/me")
    public findMe(@Req() req: any): Promise<User[]> {
        return req.user;
    }

    @Authorized()
    @Get("/:id")
    @OnUndefined(UserNotFoundError)
    public one(@Param("id") id: string): Promise<User | undefined> {
        return this.userService.findOne(id);
    }

    @Post()
    @OnUndefined(EmailAlreadyExists)
    public create(@Body({ required: true }) user: User): Promise<User | Error> {
        return this.userService.create(user);
    }

    @Authorized()
    @Put("/:id")
    public update(@Param("id") id: string, @Body() user: User): Promise<User> {
        return this.userService.update(id, user);
    }

    @Authorized()
    @Delete("/:id")
    public delete(@Param("id") id: string): Promise<DeleteResult> {
        return this.userService.delete(id);
    }
}
