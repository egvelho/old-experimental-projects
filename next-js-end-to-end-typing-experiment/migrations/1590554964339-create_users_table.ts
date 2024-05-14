import {MigrationInterface, QueryRunner} from "typeorm";

export class createUsersTable1590554964339 implements MigrationInterface {
    name = 'createUsersTable1590554964339'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar NOT NULL, "name" varchar NOT NULL, "surname" varchar NOT NULL, "phoneNumber" varchar NOT NULL, "email" varchar NOT NULL, "cpf" varchar NOT NULL, "role" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_a2664123afd470b0446b98f69e2" UNIQUE ("uid", "phoneNumber", "email"))`, undefined);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "identifier" varchar, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
