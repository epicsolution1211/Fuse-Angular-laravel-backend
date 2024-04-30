import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcuUsasesComponent } from './ccu-usases.component';

describe('CcuUsasesComponent', () => {
  let component: CcuUsasesComponent;
  let fixture: ComponentFixture<CcuUsasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcuUsasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcuUsasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
