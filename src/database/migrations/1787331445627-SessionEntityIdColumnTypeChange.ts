import { MigrationInterface, QueryRunner } from 'typeorm';

export class SessionEntityIdColumnTypeChange1787331445627 implements MigrationInterface {
  name = 'SessionEntityIdColumnTypeChange1787331445627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "id" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
  }
}
