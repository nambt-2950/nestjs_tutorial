import { registerAs } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { join } from 'path';

export const databaseOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'nestdb',
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  logging: process.env.DB_LOGGING === 'true',
} as PostgresConnectionOptions;

export default registerAs('database', () => databaseOptions);