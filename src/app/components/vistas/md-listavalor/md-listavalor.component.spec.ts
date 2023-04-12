import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdListavalorComponent } from './md-listavalor.component';

describe('MdListavalorComponent', () => {
  let component: MdListavalorComponent;
  let fixture: ComponentFixture<MdListavalorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdListavalorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdListavalorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
