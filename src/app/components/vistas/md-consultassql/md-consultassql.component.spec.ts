import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdConsultassqlComponent } from './md-consultassql.component';

describe('MdConsultassqlComponent', () => {
  let component: MdConsultassqlComponent;
  let fixture: ComponentFixture<MdConsultassqlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdConsultassqlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdConsultassqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
