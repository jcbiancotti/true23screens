import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrCrud1Component } from './scr-crud1.component';

describe('ScrCrud1Component', () => {
  let component: ScrCrud1Component;
  let fixture: ComponentFixture<ScrCrud1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrCrud1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrCrud1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
