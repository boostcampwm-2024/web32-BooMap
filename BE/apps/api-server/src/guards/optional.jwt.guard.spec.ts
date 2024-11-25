import { OptionalJwtGuard } from '.';

describe('OptionalJwtGuard', () => {
  it('should be defined', () => {
    expect(new OptionalJwtGuard()).toBeDefined();
  });
});
