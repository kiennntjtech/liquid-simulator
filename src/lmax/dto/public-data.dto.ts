// Public Data DTOs
export class CurrentTimeResponseDto {
  epoch_millis: string;
  timestamp: string; // ISO8601 format
}

export class VersionResponseDto {
  version: string;
}
