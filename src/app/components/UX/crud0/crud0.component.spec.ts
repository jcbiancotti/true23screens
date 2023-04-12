import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crud0Component } from './crud0.component';

describe('Crud0Component', () => {
  let component: Crud0Component;
  let fixture: ComponentFixture<Crud0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Crud0Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Crud0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
