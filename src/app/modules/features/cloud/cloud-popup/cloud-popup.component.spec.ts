import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudPopupComponent } from './cloud-popup.component';

describe('CloudPopupComponent', () => {
  let component: CloudPopupComponent;
  let fixture: ComponentFixture<CloudPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloudPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
