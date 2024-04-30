import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureCommentsComponent } from './feature-comments.component';

describe('FeatureCommentsComponent', () => {
  let component: FeatureCommentsComponent;
  let fixture: ComponentFixture<FeatureCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
