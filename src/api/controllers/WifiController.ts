import {
    JsonController,
    Post,
    Authorized,
    Body,
    CurrentUser,
    OnUndefined
} from "@mardari/routing-controllers";
import { UserService } from "../services/UserService";
import { User } from "../models/User";
import { Wifi } from "../models/Wifi";
import { BadRequest } from "../errors/BadRequest";

@JsonController("/wifi")
export class WifiController {
    constructor(private userService: UserService) {}

    @Authorized()
    @Post()
    @OnUndefined(BadRequest)
    public async create(
        @CurrentUser({ required: true }) user: User,
        @Body({ type: Wifi, required: true }) wifiList: Wifi[]
    ): Promise<User | Error> {
        // Cannot use class-validator to validate body array in typescript
        const cleanWifiList: Wifi[] = [];
        const errors: Error[] = [];

        // Validate each wifi element passed in the array
        wifiList.forEach(wifi => {
            let cleanName = undefined;
            let cleanSSID = undefined;

            if (wifi.name !== undefined && typeof wifi.name === "string") {
                cleanName = wifi.name;
            } else {
                errors.push(new Error());
            }

            if (wifi.ssid !== undefined && typeof wifi.ssid === "string") {
                cleanSSID = wifi.ssid;
            } else {
                errors.push(new Error());
            }

            if (cleanName && cleanSSID) {
                const _wifi = new Wifi();
                _wifi.name = cleanName;
                _wifi.ssid = cleanSSID;
                cleanWifiList.push(_wifi);
            }
        });

        // If one element is not valid, return an error
        if (errors.length > 0) {
            return undefined;
        }

        return this.userService.addWifiList(cleanWifiList, user);
    }
}
