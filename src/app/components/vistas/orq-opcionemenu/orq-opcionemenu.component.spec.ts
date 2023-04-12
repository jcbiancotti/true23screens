import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrqOpcionemenuComponent } from './orq-opcionemenu.component';

describe('OrqOpcionemenuComponent', () => {
  let component: OrqOpcionemenuComponent;
  let fixture: ComponentFixture<OrqOpcionemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrqOpcionemenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrqOpcionemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
