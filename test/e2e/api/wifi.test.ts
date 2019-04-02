import * as nock from "nock";
import { runSeed } from "typeorm-seeding";
import request from "supertest";
import { getMongoRepository } from "typeorm";

import { CreateUser } from "../../../src/database/seeds/CreateUser";
import { User } from "../../../src/api/models/User";
import { closeDatabase } from "../../utils/database";
import { BootstrapSettings } from "../utils/bootstrap";
import { prepareServer } from "../utils/server";

describe("/api/wifi", () => {
    let user: User;
    let userAuthorization: string;
    let settings: BootstrapSettings;

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async () => {
        settings = await prepareServer({ migrate: true });
        user = await runSeed<User>(CreateUser);
        userAuthorization = Buffer.from(`${user.email}:password`).toString(
            "base64"
        );
    });

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(async () => {
        nock.cleanAll();
        await closeDatabase(settings.connection);
    });

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    test("POST: / should store a wifi list", async done => {
        const wifiList = [
            {
                name: "Permière borne wifi",
                ssid: "SSID de la première borne"
            },
            {
                name: "Deuxième borne wifi",
                ssid: "SSID de la deuxième borne"
            }
        ];

        await request(settings.app)
            .post("/api/wifi")
            .set("Authorization", `Basic ${userAuthorization}`)
            .send(wifiList)
            .expect("Content-Type", /json/)
            .expect(200);

        const currentUser = await getMongoRepository(User).findOne({
            email: user.email,
            password: user.password
        });

        expect(currentUser.wifiList).toMatchObject(wifiList);

        done();
    });

    test("POST: / should reject an error if data is not valid", async done => {
        const notValidData = [
            {
                nom: "Doe"
            },
            {
                name: 1,
                ssid: "is valid"
            }
        ];

        await request(settings.app)
            .post("/api/wifi")
            .set("Authorization", `Basic ${userAuthorization}`)
            .send(notValidData)
            .expect("Content-Type", /json/)
            .expect(409);

        done();
    });
});
