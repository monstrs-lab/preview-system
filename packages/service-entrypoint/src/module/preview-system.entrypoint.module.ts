/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { S3Client }                          from '@aws-sdk/client-s3'
import { Storage }                           from '@google-cloud/storage'
import { MikroORM }                          from '@mikro-orm/core'
import { Migrator }                          from '@mikro-orm/migrations'
import { MikroOrmModule }                    from '@mikro-orm/nestjs'
import { PostgreSqlDriver }                  from '@mikro-orm/postgresql'
import { CqrsModule }                        from '@monstrs/nestjs-cqrs'
import { Module }                            from '@nestjs/common'
import { OnModuleInit }                      from '@nestjs/common'
import { ConfigModule }                      from '@nestjs/config'
import { ConfigService }                     from '@nestjs/config'

import { PreviewSystemInfrastructureModule } from '@preview-system/infrastructure-module'
import { entities }                          from '@preview-system/infrastructure-module'

import * as configs                          from '../configs/index.js'
import * as migrations                       from '../migrations/index.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Object.values(configs),
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        driver: PostgreSqlDriver,
        host: configService.get('postgres.host'),
        port: configService.get('postgres.port'),
        user: configService.get('postgres.username'),
        password: configService.get('postgres.password'),
        dbName: configService.get('postgres.database'),
        entities: Object.values(entities),
        forceUndefined: true,
        migrations: {
          disableForeignKeys: false,
          migrationsList: Object.keys(migrations).map((name: string) => ({
            class: migrations[name as keyof typeof migrations],
            name,
          })),
        },
        extensions: [Migrator],
      }),
      inject: [ConfigService],
    }),
    PreviewSystemInfrastructureModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService<{
          access: configs.AccessConfig
          storage: configs.StorageConfig
        }>
      ) => {
        if (configService.get('storage.type', { infer: true }) === 's3') {
          return {
            access: {
              urls: configService.get('access.urls', { infer: true })!,
            },
            storage: {
              bucket: configService.get('storage.bucket', { infer: true })!,
              client: new S3Client(configService.get('storage.client', { infer: true })!),
            },
          }
        }

        return {
          access: {
            urls: configService.get('access.urls', { infer: true })!,
          },
          storage: {
            bucket: configService.get('storage.bucket', { infer: true })!,
            client: new Storage(configService.get('storage.client', { infer: true })),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class PreviewSystemEntrypointModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up()
  }
}
