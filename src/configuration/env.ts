import 'dotenv/config';
import { Env } from './interface/env.interface';

const config: Env = {
  app: {
    env: process.env.ENV || 'dev',
    port: parseInt(process.env.APP_PORT, 10),
  },
  database: {
    databaseUrl: process.env.DATABASEURL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  bscscan: {
    bscscanApiKey: process.env.BSCSCAN_API_KEY,
  },
};

export const env = Object.freeze<Env>(config);

export const environment = (): any => ({ ...env });
