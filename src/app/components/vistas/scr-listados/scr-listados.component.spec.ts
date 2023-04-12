import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrListadosComponent } from './scr-listados.component';

describe('ScrListadosComponent', () => {
  let component: ScrListadosComponent;
  let fixture: ComponentFixture<ScrListadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrListadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrListadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
