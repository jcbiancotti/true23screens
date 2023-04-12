import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrBuscadorComponent } from './scr-buscador.component';

describe('ScrBuscadorComponent', () => {
  let component: ScrBuscadorComponent;
  let fixture: ComponentFixture<ScrBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrBuscadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
