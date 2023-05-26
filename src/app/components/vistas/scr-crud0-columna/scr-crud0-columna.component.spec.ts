import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrCrud0ColumnaComponent } from './scr-crud0-columna.component';

describe('ScrCrud0ColumnaComponent', () => {
  let component: ScrCrud0ColumnaComponent;
  let fixture: ComponentFixture<ScrCrud0ColumnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrCrud0ColumnaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrCrud0ColumnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
