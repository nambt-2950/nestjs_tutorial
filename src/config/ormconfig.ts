import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseOptions } from './database.config';

export default new DataSource(databaseOptions as DataSourceOptions);