import { registerAs } from '@nestjs/config'
import isDocker       from 'is-docker'

export interface PostgresConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
}

export const postgresConfig = registerAs(
  'postgres',
  (): PostgresConfig => ({
    host: process.env.POSTGRES_HOST || (isDocker() ? 'db' : 'localhost'),
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'password',
    database: process.env.POSTGRES_DB ?? 'db',
  })
)
