import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueMessageBoxComponent } from './true-message-box.component';

describe('TrueMessageBoxComponent', () => {
  let component: TrueMessageBoxComponent;
  let fixture: ComponentFixture<TrueMessageBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrueMessageBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrueMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
