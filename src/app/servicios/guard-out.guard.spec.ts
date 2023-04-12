import { TestBed } from '@angular/core/testing';

import { GuardOutGuard } from './guard-out.guard';

describe('GuardOutGuard', () => {
  let guard: GuardOutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardOutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
