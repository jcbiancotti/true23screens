import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrCrud0sComponent } from './scr-crud0s.component';

describe('ScrCrud0sComponent', () => {
  let component: ScrCrud0sComponent;
  let fixture: ComponentFixture<ScrCrud0sComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrCrud0sComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrCrud0sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
