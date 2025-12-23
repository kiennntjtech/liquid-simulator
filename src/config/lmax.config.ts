import { registerAs } from '@nestjs/config';

export default registerAs('lmax', () => ({
  server: process.env.LMAX_SERVER,
  clientKeyId: process.env.LMAX_CLIENT_KEY_ID,
  clientSecret: process.env.LMAX_CLIENT_SECRET,
  socketUrl: process.env.LMAX_SOCKET_URL,
}));
