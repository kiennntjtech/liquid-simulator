import { registerAs } from '@nestjs/config';
import * as cluster from 'cluster';
import * as os from 'os';

export default registerAs('app', () => ({
  timezone: process.env.TZ,
  environment: process.env.NODE_ENV,
  secretKey: process.env.SECRET_KEY,
  port: parseInt(process.env.PORT, 10) || 3100,
  url:
    process.env.PUBLIC_URL || process.env.LOCAL_URL || 'http://localhost:3000/',
  serverUrl: process.env.PUBLIC_SERVER_URL || 'http://localhost:3100/',
  worker_id:
    cluster.Worker !== undefined
      ? `${os.hostname()}-${parseInt(process.env.NODE_APP_INSTANCE) + 1}`
      : os.hostname(),
  is_master:
    !process.env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE === '0',
}));
