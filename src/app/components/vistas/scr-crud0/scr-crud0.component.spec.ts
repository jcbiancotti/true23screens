import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrCrud0Component } from './scr-crud0.component';

describe('ScrCrud0Component', () => {
  let component: ScrCrud0Component;
  let fixture: ComponentFixture<ScrCrud0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrCrud0Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrCrud0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
