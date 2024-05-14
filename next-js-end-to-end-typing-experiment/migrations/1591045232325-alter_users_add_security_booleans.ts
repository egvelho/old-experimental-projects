import {MigrationInterface, QueryRunner} from "typeorm";

export class alterUsersAddSecurityBooleans1591045232325 implements MigrationInterface {
    name = 'alterUsersAddSecurityBooleans1591045232325'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar NOT NULL, "name" varchar NOT NULL, "surname" varchar NOT NULL, "phoneNumber" varchar NOT NULL, "email" varchar NOT NULL, "cpf" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "emailVerified" boolean NOT NULL DEFAULT (0), "blocked" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_a2664123afd470b0446b98f69e2" UNIQUE ("uid", "phoneNumber", "email"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "uid", "name", "surname", "phoneNumber", "email", "cpf", "role", "createdAt", "updatedAt") SELECT "id", "uid", "name", "surname", "phoneNumber", "email", "cpf", "role", "createdAt", "updatedAt" FROM "user"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar NOT NULL, "name" varchar NOT NULL, "surname" varchar NOT NULL, "phoneNumber" varchar NOT NULL, "email" varchar NOT NULL, "cpf" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_a2664123afd470b0446b98f69e2" UNIQUE ("uid", "phoneNumber", "email"))`, undefined);
        await queryRunner.query(`INSERT INTO "user"("id", "uid", "name", "surname", "phoneNumber", "email", "cpf", "role", "createdAt", "updatedAt") SELECT "id", "uid", "name", "surname", "phoneNumber", "email", "cpf", "role", "createdAt", "updatedAt" FROM "temporary_user"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_user"`, undefined);
    }

}
