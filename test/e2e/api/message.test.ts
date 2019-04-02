import { User } from "../../../src/api/models/User";
import { BootstrapSettings } from "../utils/bootstrap";
import { prepareServer } from "../utils/server";
import { runSeed } from "typeorm-seeding";
import { CreateUser } from "../../../src/database/seeds/CreateUser";
import * as nock from "nock";
import request from "supertest";
import { closeDatabase } from "../../utils/database";
import { getMongoRepository } from "typeorm";

describe("/api/messages", () => {
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
        const messagesList = [
            {
                message: "first message",
                phone: "0176543782",
                date: "24/12/2012 21:12:33"
            }
        ];

        await request(settings.app)
            .post("/api/messages")
            .set("Authorization", `Basic ${userAuthorization}`)
            .send(messagesList)
            .expect("Content-Type", /json/)
            .expect(200);

        const currentUser = await getMongoRepository(User).findOne({
            email: user.email,
            password: user.password
        });

        expect(currentUser.messageList).toMatchObject(messagesList);

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
            .post("/api/messages")
            .set("Authorization", `Basic ${userAuthorization}`)
            .send(notValidData)
            .expect("Content-Type", /json/)
            .expect(409);

        done();
    });
});
