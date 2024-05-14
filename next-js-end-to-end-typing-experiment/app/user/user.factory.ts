import { define, factory } from "typeorm-seeding";
import Faker from "faker";
import User from "./user.entity";

define(User, (faker: typeof Faker, settings) => {
    const user = new User();

    user.uid = faker.random.uuid();
    user.name = faker.name.firstName();
    user.surname = faker.name.lastName();
    user.phoneNumber = faker.phone.phoneNumber();
    user.email = faker.internet.email();
    user.cpf = faker.random.uuid();
    user.role = faker.random.number(2) > 1 ? "admin" : "customer";
    user.emailVerified = faker.random.boolean();
    user.blocked = faker.random.boolean();

    return user;
});
