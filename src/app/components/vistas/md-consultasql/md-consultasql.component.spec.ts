import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdConsultasqlComponent } from './md-consultasql.component';

describe('MdConsultasqlComponent', () => {
  let component: MdConsultasqlComponent;
  let fixture: ComponentFixture<MdConsultasqlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdConsultasqlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdConsultasqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
