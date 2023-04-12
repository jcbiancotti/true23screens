import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdListavaloresComponent } from './md-listavalores.component';

describe('MdListavaloresComponent', () => {
  let component: MdListavaloresComponent;
  let fixture: ComponentFixture<MdListavaloresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdListavaloresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdListavaloresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
