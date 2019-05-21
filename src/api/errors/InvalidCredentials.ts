import { HttpError } from "@mardari/routing-controllers";

export class InvalidCredentials extends HttpError {
    constructor() {
        super(400, "Invalid credentials");
    }
}
