import {
    JsonController,
    Body,
    OnUndefined,
    Post
} from "@mardari/routing-controllers";
import { User } from "../models/User";
import { LoginRequest } from "./requests/LoginRequest";
import { validate } from "class-validator";
import { InvalidCredentials } from "../errors/InvalidCredentials";
import { UserService } from "../services/UserService";

@JsonController()
export class AuthenticationController {
    constructor(private userService: UserService) {}

    @Post("/login")
    @OnUndefined(InvalidCredentials)
    public async login(
        @Body() loginRequest: LoginRequest
    ): Promise<User | undefined> {
        const errors = await validate(loginRequest);

        if (errors.length === 0) {
            const user = await this.userService.authenticate(
                loginRequest.email,
                loginRequest.password
            );

            return user;
        }

        return undefined;
    }
}
