import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrcardComponent } from './usrcard.component';

describe('UsrcardComponent', () => {
  let component: UsrcardComponent;
  let fixture: ComponentFixture<UsrcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsrcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsrcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
