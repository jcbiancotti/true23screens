import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdTablaCampoComponent } from './md-tabla-campo.component';

describe('MdTablaCampoComponent', () => {
  let component: MdTablaCampoComponent;
  let fixture: ComponentFixture<MdTablaCampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdTablaCampoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdTablaCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
