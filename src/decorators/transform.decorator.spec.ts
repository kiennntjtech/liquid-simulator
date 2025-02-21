import { TakeDatePathOnly } from './transform.decorator';
import { plainToClass } from 'class-transformer';

class TestTakeDateOnly {
  @TakeDatePathOnly()
  date: string;
}

describe('TakeDateOnly', () => {
  it('input valid', () => {
    const test = plainToClass(TestTakeDateOnly, {
      date: '2020-01-31T00:00:00',
    });
    expect(test.date).toBe('2020-01-31');
  });

  it('input invalid format', () => {
    const test = plainToClass(TestTakeDateOnly, {
      date: '2020-01-31',
    });
    expect(test.date).toBe('2020-01-31');
  });
});
