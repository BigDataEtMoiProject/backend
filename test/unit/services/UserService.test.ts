import { User } from "../../../src/api/models/User";
import { UserService } from "../../../src/api/services/UserService";
import { events } from "../../../src/api/subscribers/events";
import { EventDispatcherMock } from "../lib/EventDispatcherMock";
import { LogMock } from "../lib/LogMock";
import { RepositoryMock } from "../lib/RepositoryMock";
import { createDatabaseConnection } from "../../../test/utils/database";
import { UserRepository } from "../../../src/api/repositories/UserRepository";

describe("UserService", () => {
    let log: LogMock;
    let repo: RepositoryMock<User>;
    let ed: EventDispatcherMock;

    beforeEach(async done => {
        log = new LogMock();
        repo = new RepositoryMock();
        ed = new EventDispatcherMock();
        done();
    });

    test("Find should return a list of users", async done => {
        const user = new User();
        user.email = "john.doe@test.com";
        repo.list = [user];
        const userService = new UserService(repo as any, ed as any, log);
        const list = await userService.find();
        expect(list[0].email).toBe(user.email);
        done();
    });

    test("Create should dispatch subscribers", async done => {
        const user = new User();
        user.email = "john.doe@test.com";
        user.password = await User.hashPassword("password");
        const userService = new UserService(repo as any, ed as any, log);
        const newUser = await userService.create(user);
        expect(ed.dispatchMock).toBeCalledWith([events.user.created, newUser]);
        done();
    });
});
