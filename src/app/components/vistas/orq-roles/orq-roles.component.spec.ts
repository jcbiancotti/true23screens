import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrqRolesComponent } from './orq-roles.component';

describe('OrqRolesComponent', () => {
  let component: OrqRolesComponent;
  let fixture: ComponentFixture<OrqRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrqRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrqRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
