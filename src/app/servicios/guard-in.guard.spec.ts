import { TestBed } from '@angular/core/testing';

import { GuardInGuard } from './guard-in.guard';

describe('GuardInGuard', () => {
  let guard: GuardInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
