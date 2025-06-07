import { DataSource, DataSourceOptions } from 'typeorm';

const config: DataSourceOptions & { cli?: { migrationsDir: string } } = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
};

const AppDataSource = new DataSource(config);

AppDataSource.initialize()
  .then(() => console.log('Data Source initialized'))
  .catch((err) => console.error('Error initializing data source', err));

export default AppDataSource;
