import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import User from "./user.entity";

export default class SeedUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const userRepository = await connection.getRepository(User);
        const settings = {};
        const users = await factory(User)(settings).makeMany(100);

        await userRepository.save(users);
    }
}
