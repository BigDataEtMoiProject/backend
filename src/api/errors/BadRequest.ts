import { HttpError } from "@mardari/routing-controllers";

export class BadRequest extends HttpError {
    constructor() {
        super(409, "Bad Request");
    }
}
