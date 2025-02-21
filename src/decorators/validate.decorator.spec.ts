import { QueryParamDateOnly } from './validate.decorator';
import { validateSync } from 'class-validator';

class TestQueryParamDateOnly {
  @QueryParamDateOnly()
  date: string;
}
describe('QueryParamDateOnly', () => {
  it('input valid', () => {
    const test = new TestQueryParamDateOnly();
    test.date = '2020-01-31';
    const errors = validateSync(test);
    expect(errors.length).toBe(0);
  });

  it('input invalid format', () => {
    const test = new TestQueryParamDateOnly();
    test.date = '2020-01-31T00:00:00';
    const errors = validateSync(test);
    expect(errors.length).toBe(1);
  });

  it('input invalid date', () => {
    const test = new TestQueryParamDateOnly();
    test.date = '2020-01-32';
    const errors = validateSync(test);
    expect(errors.length).toBe(1);
  });
});
