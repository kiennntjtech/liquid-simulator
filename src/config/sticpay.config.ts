import { registerAs } from '@nestjs/config';

export default registerAs('sticpay', () => ({
  sticpay_account: process.env.STICPAY_ACCOUNT,
  sticpay_key: process.env.STICPAY_KEY,
  sticpay_mode: process.env.STICPAY_MODE,
  sticpay_url: process.env.STICPAY_URL,
}));
