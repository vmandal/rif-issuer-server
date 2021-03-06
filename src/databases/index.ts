import config from 'config';
import Sequelize from 'sequelize';
import { dbConfig } from '@interfaces/db.interface';
import DidCodeModel from '@models/didCodes.model';
import IssuedCredentialsModel from '@models/issuedCredentials.model';
import { logger } from '@utils/logger';

const { host, user, password, database, pool }: dbConfig = config.get('dbConfig');

const sequelize = new Sequelize.Sequelize(database, user, password, {
  host: host,
  dialect: 'sqlite',
  storage: './database.sqlite',
  pool: {
    min: pool.min,
    max: pool.max,
  },
  logQueryParameters: process.env.NODE_ENV === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize.authenticate();

const DB = {
  DidCodes: DidCodeModel(sequelize),
  IssuedCredentials: IssuedCredentialsModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;
