import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMoviesTable1793341957718 implements MigrationInterface {
  name = 'CreateMoviesTable1793341957718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movies" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "genre" character varying NOT NULL, "watched" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movies"`);
  }
}
