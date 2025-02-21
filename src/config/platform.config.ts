import { registerAs } from '@nestjs/config';

export default registerAs('platform', () => ({
  fee: 0.2,
}));
