import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdListasseleccionablesComponent } from './md-listasseleccionables.component';

describe('MdListasseleccionablesComponent', () => {
  let component: MdListasseleccionablesComponent;
  let fixture: ComponentFixture<MdListasseleccionablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdListasseleccionablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdListasseleccionablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
