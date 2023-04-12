import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrSelectorComponent } from './scr-selector.component';

describe('ScrSelectorComponent', () => {
  let component: ScrSelectorComponent;
  let fixture: ComponentFixture<ScrSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
