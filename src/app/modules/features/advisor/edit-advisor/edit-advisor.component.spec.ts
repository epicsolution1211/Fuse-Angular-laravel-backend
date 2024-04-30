import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdvisorComponent } from './edit-advisor.component';

describe('EditAdvisorComponent', () => {
  let component: EditAdvisorComponent;
  let fixture: ComponentFixture<EditAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAdvisorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
