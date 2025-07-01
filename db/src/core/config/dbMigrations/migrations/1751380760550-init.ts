import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1751380760550 implements MigrationInterface {
    name = 'Init1751380760550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "languages"`);
        await queryRunner.query(`CREATE TYPE "languages"."programming_language_status_enum" AS ENUM('1', '0')`);
        await queryRunner.query(`CREATE TABLE "languages"."programming_language" ("id" BIGSERIAL NOT NULL, "identifier" character varying(50) NOT NULL, "status" "languages"."programming_language_status_enum" NOT NULL DEFAULT '0', "created_date" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modified_date" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "version" integer NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_d7bd858452aa2a54b0939d3800e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_87fbff262ec25584178e9a3b04" ON "languages"."programming_language" ("identifier") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_52aff2ee3c4a056c638bb1782c" ON "languages"."programming_language" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "languages"."IDX_52aff2ee3c4a056c638bb1782c"`);
        await queryRunner.query(`DROP INDEX "languages"."IDX_87fbff262ec25584178e9a3b04"`);
        await queryRunner.query(`DROP TABLE "languages"."programming_language"`);
        await queryRunner.query(`DROP TYPE "languages"."programming_language_status_enum"`);
    }

}
