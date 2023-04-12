import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdTablasComponent } from './md-tablas.component';

describe('MdTablasComponent', () => {
  let component: MdTablasComponent;
  let fixture: ComponentFixture<MdTablasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdTablasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdTablasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
