import { BadRequestException } from '@nestjs/common';

export class RecordNotFoundException extends BadRequestException {
  constructor() {
    super('The record is not exist');
  }
}
