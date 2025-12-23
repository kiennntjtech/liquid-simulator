export class AuthenticateRequestDto {
  client_key_id: string;
  timestamp: string;
  nonce: string;
  signature: string;
}

export class AuthenticateResponseDto {
  token: string;
}

// sample data
// {
// "client_key_id": "2a6aed0de9f875c2407bc693034b477f",
// "timestamp": "2021-10-21T01:43:28.786Z",
// "nonce": "nonce",
// "signature": "pMp/ugxPIAVIMyf6hqMSa63xrJc+PKr4nat1A0GHWEk="
// }
