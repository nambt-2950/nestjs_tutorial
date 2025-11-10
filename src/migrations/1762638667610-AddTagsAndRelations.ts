import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagsAndRelations1762638667610 implements MigrationInterface {
    name = 'AddTagsAndRelations1762638667610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tags" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_tag_name" UNIQUE ("name"),
                CONSTRAINT "PK_tag_id" PRIMARY KEY ("id")
                )
            `);

            await queryRunner.query(`
                CREATE TABLE "article_tags" (
                "articleId" integer NOT NULL,
                "tagId" integer NOT NULL,
                CONSTRAINT "PK_article_tags" PRIMARY KEY ("articleId", "tagId"),
                CONSTRAINT "FK_article_tags_article" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_article_tags_tag" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "article_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }
}
