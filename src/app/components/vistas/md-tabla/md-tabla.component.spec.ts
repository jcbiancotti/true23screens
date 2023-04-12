import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdTablaComponent } from './md-tabla.component';

describe('MdTablaComponent', () => {
  let component: MdTablaComponent;
  let fixture: ComponentFixture<MdTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
