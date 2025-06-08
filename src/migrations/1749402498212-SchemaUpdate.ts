import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1749402498212 implements MigrationInterface {
  name = 'SchemaUpdate1749402498212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorites_artists" ("favorites_id" character varying NOT NULL, "artist_id" uuid NOT NULL, CONSTRAINT "PK_189bc8666f024c8f3d461abcd8c" PRIMARY KEY ("favorites_id", "artist_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5bdcd957882619377bed2ca78d" ON "favorites_artists" ("favorites_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8bfb6dd796755ef300ab5a71b2" ON "favorites_artists" ("artist_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites_albums" ("favorites_id" character varying NOT NULL, "album_id" uuid NOT NULL, CONSTRAINT "PK_a6bdb542df5a2321e809433ed78" PRIMARY KEY ("favorites_id", "album_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_897546a83e072f2174f750bb6f" ON "favorites_albums" ("favorites_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f17950531ea5f11fae13c7bbbd" ON "favorites_albums" ("album_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites_tracks" ("favorites_id" character varying NOT NULL, "track_id" uuid NOT NULL, CONSTRAINT "PK_f0aebe044ba82bebd6fd3422c51" PRIMARY KEY ("favorites_id", "track_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ad95f1cff317e49161ea28bfe9" ON "favorites_tracks" ("favorites_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b8a7703eafd7a5041fb494838" ON "favorites_tracks" ("track_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_artists" ADD CONSTRAINT "FK_5bdcd957882619377bed2ca78d3" FOREIGN KEY ("favorites_id") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_artists" ADD CONSTRAINT "FK_8bfb6dd796755ef300ab5a71b27" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_albums" ADD CONSTRAINT "FK_897546a83e072f2174f750bb6fd" FOREIGN KEY ("favorites_id") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_albums" ADD CONSTRAINT "FK_f17950531ea5f11fae13c7bbbde" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_tracks" ADD CONSTRAINT "FK_ad95f1cff317e49161ea28bfe9c" FOREIGN KEY ("favorites_id") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_tracks" ADD CONSTRAINT "FK_4b8a7703eafd7a5041fb494838c" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites_tracks" DROP CONSTRAINT "FK_4b8a7703eafd7a5041fb494838c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_tracks" DROP CONSTRAINT "FK_ad95f1cff317e49161ea28bfe9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_albums" DROP CONSTRAINT "FK_f17950531ea5f11fae13c7bbbde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_albums" DROP CONSTRAINT "FK_897546a83e072f2174f750bb6fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_artists" DROP CONSTRAINT "FK_8bfb6dd796755ef300ab5a71b27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_artists" DROP CONSTRAINT "FK_5bdcd957882619377bed2ca78d3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b8a7703eafd7a5041fb494838"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad95f1cff317e49161ea28bfe9"`,
    );
    await queryRunner.query(`DROP TABLE "favorites_tracks"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f17950531ea5f11fae13c7bbbd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_897546a83e072f2174f750bb6f"`,
    );
    await queryRunner.query(`DROP TABLE "favorites_albums"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8bfb6dd796755ef300ab5a71b2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5bdcd957882619377bed2ca78d"`,
    );
    await queryRunner.query(`DROP TABLE "favorites_artists"`);
  }
}
