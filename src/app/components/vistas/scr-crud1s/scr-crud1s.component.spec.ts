import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrCrud1sComponent } from './scr-crud1s.component';

describe('ScrCrud1sComponent', () => {
  let component: ScrCrud1sComponent;
  let fixture: ComponentFixture<ScrCrud1sComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrCrud1sComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrCrud1sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
