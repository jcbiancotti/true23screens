import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdListaseleccionableComponent } from './md-listaseleccionable.component';

describe('MdListaseleccionableComponent', () => {
  let component: MdListaseleccionableComponent;
  let fixture: ComponentFixture<MdListaseleccionableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdListaseleccionableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdListaseleccionableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
