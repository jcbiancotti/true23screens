import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crud2ValoresComponent } from './crud2-valores.component';

describe('Crud2ValoresComponent', () => {
  let component: Crud2ValoresComponent;
  let fixture: ComponentFixture<Crud2ValoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Crud2ValoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Crud2ValoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
