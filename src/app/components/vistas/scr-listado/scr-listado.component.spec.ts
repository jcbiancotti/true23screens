import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrListadoComponent } from './scr-listado.component';

describe('ScrListadoComponent', () => {
  let component: ScrListadoComponent;
  let fixture: ComponentFixture<ScrListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrListadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
