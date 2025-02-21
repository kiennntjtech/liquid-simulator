import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create.test.dto';
import { User } from '@/decorators/user.decorator';
import { UpdateTestDto } from './dto/update.test.dto';
import { RequirePermissions } from '@/authorization/permission.decorator';
import { Roles } from '@/authorization/roles.decorator';

@ApiBearerAuth()
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @Roles('admin')
  async register(@Body() createTestDto: CreateTestDto) {
    await this.testService.create(createTestDto);
    return 'OK';
  }

  @Patch('/:id')
  @RequirePermissions('permission1', 'permission3')
  async update(@Param() params, @Body() updateTestDto: UpdateTestDto) {
    await this.testService.update(params.id, updateTestDto);
    return 'OK';
  }

  @Delete('/:id')
  @RequirePermissions('permission2')
  async delete(@Param() params) {
    await this.testService.delete(params.id);
    return 'OK';
  }
}
