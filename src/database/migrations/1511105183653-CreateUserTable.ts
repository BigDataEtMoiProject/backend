import { MigrationInterface, QueryRunner, getMongoManager } from "typeorm";
import { User } from "../../../src/api/models/User";
import { Wifi } from "../../../src/api/models/Wifi";
import { Message } from "../../../src/api/models/Message";
import { TimeOnApp } from "../../../src/api/models/TimeOnApp";
import { Coordinates } from "../../../src/api/models/Coordinates";

export class CreateUserTable1511105183653 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const user = new User();
        user.email = "bruce.wayne@mail.com";
        user.password = "password";

        const wifi = new Wifi();
        wifi.name = "default ssid name";
        wifi.ssid = "default ssid value";

        user.wifiList = [wifi];

        const message = new Message();
        message.message = "A new message";
        message.phone = "0612345678";
        message.date = "02/04/2019 16:33:54";

        user.messageList = [message];

        const timeOnApp = new TimeOnApp();
        timeOnApp.appName = "Reddit";
        timeOnApp.datetime = "02/04/2019 16:33:54";

        user.timeOnAppList = [timeOnApp];

        const coordinate = new Coordinates();
        coordinate.longitude = "2.20784993";
        coordinate.latitude = "48.6887772";
        coordinate.date = "23-05-2019 16:56:06";
        coordinate.city = "Villebon-sur-Yvette";

        user.coordinatesList = [coordinate];

        return await getMongoManager().save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await getMongoManager().dropCollectionIndexes("user");
    }
}
