import { Seed, Factory } from "typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../../src/api/models/User";

export class CreateUser implements Seed {
    public async seed(factory: Factory, connection: Connection): Promise<User> {
        const em = connection.createEntityManager();

        const user = new User();
        user.email = "pierre.dupont@gmail.com";
        user.password = "password";

        return await em.save(user);
    }
}
