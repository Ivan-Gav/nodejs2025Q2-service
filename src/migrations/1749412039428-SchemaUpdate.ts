import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1749412039428 implements MigrationInterface {
  name = 'SchemaUpdate1749412039428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "duration" integer NOT NULL, "artistId" uuid, "albumId" uuid, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites" ("id" character varying NOT NULL, CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
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
      `ALTER TABLE "track" ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_3d06f25148a4a880b429e3bc839" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
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
      `ALTER TABLE "album" DROP CONSTRAINT "FK_3d06f25148a4a880b429e3bc839"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"`,
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
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "track"`);
  }
}
