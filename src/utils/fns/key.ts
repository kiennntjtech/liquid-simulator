export function buildB2CAccountKey(params: {
  platform: string;
  brokerId: number;
  login: number;
}) {
  return `${params.platform}-${params.brokerId}-${params.login}`;
}
