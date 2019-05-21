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
import { Coordinates } from "../models/Coordinates";

@Authorized()
@JsonController("/coordinates")
export class CoordinatesController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public create(
        @CurrentUser({ required: true }) user: User,
        @Body() coordinatesList: Coordinates[]
    ): Promise<User | Error> {
        // Cannot use class-validator to validate body array in typescript
        const cleanMessageList: Coordinates[] = [];
        const errors: Error[] = [];

        // Validate each message element passed in the array
        coordinatesList.forEach(coordinates => {
            let cleanLongitude = undefined;
            let cleanLatitude = undefined;
            let cleanDate = undefined;

            if (
                coordinates.longitude !== undefined &&
                typeof coordinates.longitude === "string"
            ) {
                cleanLongitude = coordinates.longitude;
            } else {
                errors.push(new Error());
            }

            if (
                coordinates.latitude !== undefined &&
                typeof coordinates.latitude === "string"
            ) {
                cleanLatitude = coordinates.latitude;
            } else {
                errors.push(new Error());
            }

            if (
                coordinates.date !== undefined &&
                typeof coordinates.date === "string"
            ) {
                cleanDate = coordinates.date;
            }

            if (cleanLongitude && cleanLatitude && cleanDate) {
                const _coordinates = new Coordinates();
                _coordinates.longitude = cleanLongitude;
                _coordinates.latitude = cleanLatitude;
                _coordinates.date = cleanDate;
                cleanMessageList.push(_coordinates);
            }
        });

        // If one element is not valid, return an error
        if (errors.length > 0) {
            return undefined;
        }

        return this.userService.addCoordinates(cleanMessageList, user);
    }
}
