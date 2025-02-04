import { Migration } from '@mikro-orm/migrations'

export class Migration20250204170631 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "previews" ("id" uuid not null, "source_url" varchar(2048) not null, "preview_url" varchar(2048) not null, constraint "previews_pkey" primary key ("id"));`
    )
  }
}
