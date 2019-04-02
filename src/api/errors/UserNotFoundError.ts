import { HttpError } from "@mardari/routing-controllers";

export class UserNotFoundError extends HttpError {
    constructor() {
        super(404, "User not found!");
    }
}
