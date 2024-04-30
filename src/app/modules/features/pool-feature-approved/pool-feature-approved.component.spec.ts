import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolFeatureApprovedComponent } from './pool-feature-approved.component';

describe('PoolFeatureApprovedComponent', () => {
  let component: PoolFeatureApprovedComponent;
  let fixture: ComponentFixture<PoolFeatureApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolFeatureApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolFeatureApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
