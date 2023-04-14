import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdConsultasqlFiltroComponent } from './md-consultasql-filtro.component';

describe('MdConsultasqlFiltroComponent', () => {
  let component: MdConsultasqlFiltroComponent;
  let fixture: ComponentFixture<MdConsultasqlFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdConsultasqlFiltroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdConsultasqlFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
