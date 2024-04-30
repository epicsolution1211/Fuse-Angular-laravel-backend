import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolFeatureVotersComponent } from './pool-feature-voters.component';

describe('PoolFeatureVotersComponent', () => {
  let component: PoolFeatureVotersComponent;
  let fixture: ComponentFixture<PoolFeatureVotersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolFeatureVotersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolFeatureVotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
