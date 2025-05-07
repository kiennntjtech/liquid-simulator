/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { buildDiffRows } from './diffcheck.builder2';

describe('DiffcheckBuilder', () => {
  it('should be defined', async () => {
    const rs = await buildDiffRows();
    expect(rs).toBeDefined();
  });
});
