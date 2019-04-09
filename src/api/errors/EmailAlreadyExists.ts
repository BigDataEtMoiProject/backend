import { HttpError } from "@mardari/routing-controllers";

export class EmailAlreadyExists extends HttpError {
    constructor() {
        super(409, "Email address already registered");
    }
}
