import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrCapturadatosComponent } from './scr-capturadatos.component';

describe('ScrCapturadatosComponent', () => {
  let component: ScrCapturadatosComponent;
  let fixture: ComponentFixture<ScrCapturadatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrCapturadatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrCapturadatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
