import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdListavalorValorComponent } from './md-listavalor-valor.component';

describe('MdListavalorValorComponent', () => {
  let component: MdListavalorValorComponent;
  let fixture: ComponentFixture<MdListavalorValorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdListavalorValorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdListavalorValorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
