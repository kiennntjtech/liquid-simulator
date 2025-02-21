import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create.test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestEntity } from './entities/test.entity';
import { Repository } from 'typeorm/repository/Repository';
import { UpdateTestDto } from './dto/update.test.dto';
import { RecordNotFoundException } from 'src/exception/recordnotfound.exception';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private testRepository: Repository<TestEntity>,
  ) {}

  async create(testDto: CreateTestDto) {
    const newTest = new TestEntity();
    newTest.name = testDto.name;
    await this.testRepository.save(newTest);
  }

  async update(id: number, updateTestDto: UpdateTestDto) {
    const oldData = await this.testRepository.findOneBy({
      id: id,
    });

    if (!oldData) {
      throw new RecordNotFoundException();
    }

    oldData.name = updateTestDto.name;
    await this.testRepository.save(oldData);
  }

  async delete(id: number) {
    const oldData = await this.testRepository.findOneBy({
      id: id,
    });
    if (!oldData) {
      throw new RecordNotFoundException();
    }
    await this.testRepository.remove(oldData);
  }
}
