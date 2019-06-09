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
import NodeGeocoder from "node-geocoder";

@Authorized()
@JsonController("/coordinates")
export class CoordinatesController {
    constructor(private userService: UserService) {}

    @Post()
    @OnUndefined(BadRequest)
    public async create(
        @CurrentUser({ required: true }) user: User,
        @Body() coordinate: Coordinates
    ): Promise<User | Error> {
        const geocoder = NodeGeocoder({
            provider: "openstreetmap"
        });

        const reverseResult = await geocoder.reverse({
            lat: parseFloat(coordinate.latitude),
            lon: parseFloat(coordinate.longitude)
        });

        if (
            typeof reverseResult[0] !== "undefined" &&
            reverseResult[0].city !== "undefined"
        ) {
            coordinate.city = reverseResult[0].city;
        }

        return this.userService.addCoordinates(coordinate, user);
    }
}
