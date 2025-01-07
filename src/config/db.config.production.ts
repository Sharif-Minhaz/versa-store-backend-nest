import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import path from 'path';

export default (): PostgresConnectionOptions => ({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  port: +process.env.PORT,
  entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
  synchronize: false,
});
