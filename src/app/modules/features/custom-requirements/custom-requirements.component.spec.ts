import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRequirementsComponent } from './custom-requirements.component';

describe('CustomRequirementsComponent', () => {
  let component: CustomRequirementsComponent;
  let fixture: ComponentFixture<CustomRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomRequirementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
