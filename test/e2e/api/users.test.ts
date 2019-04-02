import * as nock from "nock";
import request from "supertest";
import { runSeed } from "typeorm-seeding";

import { User } from "../../../src/api/models/User";
import { closeDatabase } from "../../utils/database";
import { BootstrapSettings } from "../utils/bootstrap";
import { prepareServer } from "../utils/server";
import { CreateUser } from "../../../src/database/seeds/CreateUser";
import { getMongoRepository } from "typeorm";

describe("/api/users", () => {
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

    test("GET: / should return a list of users", async done => {
        const res = await request(settings.app)
            .get("/api/users")
            .set("Authorization", `Basic ${userAuthorization}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.length).toBe(2);

        done();
    });

    test("GET: /:id should return user", async done => {
        const res = await request(settings.app)
            .get(`/api/users/${user.id}`)
            .set("Authorization", `Basic ${userAuthorization}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.id).toEqual(user.id.toString());
        expect(res.body.email).toBe(user.email);

        done();
    });

    test("GET: /me should return user info", async done => {
        const res = await request(settings.app)
            .get("/api/users/me")
            .set("Authorization", `Basic ${userAuthorization}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.id).toEqual(user.id.toString());
        expect(res.body.email).toEqual(user.email);
        expect(res.body.password).toEqual(user.password);

        done();
    });

    test("POST: / should store a user", async done => {
        const res = await request(settings.app)
            .post("/api/users")
            .send({
                email: "pierre.dupont@hotmail.com",
                password: "password"
            })
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(200);

        const userToBeInDB = new User();
        userToBeInDB.id = res.body.id;
        userToBeInDB.email = res.body.email;
        userToBeInDB.password = res.body.password;

        const userInserted = await getMongoRepository(User).findOne({
            email: userToBeInDB.email,
            password: userToBeInDB.password
        });

        expect(userInserted.email).toEqual(userToBeInDB.email);
        expect(userInserted.password).toEqual(userToBeInDB.password);
        expect(userInserted.id.toString()).toEqual(userToBeInDB.id);

        done();
    });

    test("PUT: /:id should update user info", async done => {
        const newEmail = "updated@mail.com";
        const res = await request(settings.app)
            .put(`/api/users/${user.id}`)
            .set("Authorization", `Basic ${userAuthorization}`)
            .send({ email: newEmail, password: "password" })
            .expect("Content-Type", /json/)
            .expect(200);

        const userWithOldEmail = await getMongoRepository(User).findOne({
            email: user.email
        });

        const userWithNewEmail = await getMongoRepository(User).findOne({
            email: res.body.email
        });

        expect(userWithOldEmail).toBe(undefined);
        expect(userWithNewEmail).toBeDefined();
        expect(userWithNewEmail.email).toEqual(newEmail);

        done();
    });

    test("DELETE: /:id should delete a user", async done => {
        const newEmail = "bruce.wayne@mail.com";
        const authorization = Buffer.from(`${newEmail}:password`).toString(
            "base64"
        ); // update auth due to the put test which change the email

        await request(settings.app)
            .delete(`/api/users/${user.id}`)
            .set("Authorization", `Basic ${authorization}`)
            .expect("Content-Type", /json/)
            .expect(200);

        const userDeleted = await getMongoRepository(User).findOne({
            email: "updated@mail.com"
        });

        expect(userDeleted).toBe(undefined);

        done();
    });
});
