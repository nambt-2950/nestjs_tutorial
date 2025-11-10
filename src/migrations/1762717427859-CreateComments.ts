import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateComments1762717427859 implements MigrationInterface {
    name = 'CreateComments1762717427859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "comments" (
                "id" SERIAL NOT NULL,
                "body" TEXT NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "authorId" integer,
                "articleId" integer,
                CONSTRAINT "PK_comments_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "comments"
                ADD CONSTRAINT "FK_comments_author"
                    FOREIGN KEY ("authorId") REFERENCES "users"("id")
                        ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "comments"
                ADD CONSTRAINT "FK_comments_article"
                    FOREIGN KEY ("articleId") REFERENCES "articles"("id")
                        ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_article"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_author"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }
}