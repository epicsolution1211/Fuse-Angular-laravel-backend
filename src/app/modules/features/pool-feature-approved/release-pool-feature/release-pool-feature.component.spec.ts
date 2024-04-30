import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasePoolFeatureComponent } from './release-pool-feature.component';

describe('ReleasePoolFeatureComponent', () => {
  let component: ReleasePoolFeatureComponent;
  let fixture: ComponentFixture<ReleasePoolFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleasePoolFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasePoolFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
