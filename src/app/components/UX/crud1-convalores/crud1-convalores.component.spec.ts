import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crud1ConvaloresComponent } from './crud1-convalores.component';

describe('Crud1ConvaloresComponent', () => {
  let component: Crud1ConvaloresComponent;
  let fixture: ComponentFixture<Crud1ConvaloresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Crud1ConvaloresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Crud1ConvaloresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
