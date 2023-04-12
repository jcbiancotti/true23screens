import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndesktopComponent } from './indesktop.component';

describe('IndesktopComponent', () => {
  let component: IndesktopComponent;
  let fixture: ComponentFixture<IndesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndesktopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
