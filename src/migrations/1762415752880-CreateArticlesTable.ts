import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticlesTable1762415752880 implements MigrationInterface {
    name = 'CreateArticlesTable1762415752880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "articles" (
                "id" SERIAL NOT NULL,
                "slug" character varying NOT NULL,
                "title" character varying NOT NULL,
                "description" character varying NOT NULL,
                "body" text NOT NULL,
                "favoritesCount" integer NOT NULL DEFAULT 0,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "authorId" integer,
                CONSTRAINT "PK_articles_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_articles_slug" UNIQUE ("slug")
        )
    `);
        await queryRunner.query(`
            ALTER TABLE "articles" ADD CONSTRAINT "FK_articles_author" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_articles_author"`);
      await queryRunner.query(`DROP TABLE "articles"`);
    }
}
