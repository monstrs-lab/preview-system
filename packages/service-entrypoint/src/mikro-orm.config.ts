import type { Options }     from '@mikro-orm/postgresql'

import { Migrator }         from '@mikro-orm/migrations'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'

import { entities }         from '@preview-system/infrastructure-module'

import * as migrations      from './migrations/index.js'

const options: Options = {
  driver: PostgreSqlDriver,
  dbName: 'db',
  user: 'postgres',
  password: 'password',
  entities: Object.values(entities),
  migrations: {
    disableForeignKeys: false,
    migrationsList: Object.keys(migrations).map((name: string) => ({
      class: migrations[name as keyof typeof migrations],
      name,
    })),
    pathTs: './src/migrations',
    emit: 'ts',
  },
  extensions: [Migrator],
}

export default options
