import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRelations1762635716741 implements MigrationInterface {
    name = 'AddUserRelations1762635716741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_following" (
                "userId" integer NOT NULL,
                "followingId" integer NOT NULL,
                CONSTRAINT "PK_user_following" PRIMARY KEY ("userId", "followingId"),
                CONSTRAINT "FK_user_following_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_user_following_following" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "user_favorites_article" (
              "userId" integer NOT NULL,
              "articleId" integer NOT NULL,
              CONSTRAINT "PK_user_favorites_article" PRIMARY KEY ("userId", "articleId"),
              CONSTRAINT "FK_user_favorites_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
              CONSTRAINT "FK_user_favorites_article" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_favorites_article"`);
        await queryRunner.query(`DROP TABLE "user_following"`);
    }
}
