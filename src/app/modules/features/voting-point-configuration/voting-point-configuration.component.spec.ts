import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingPointConfigurationComponent } from './voting-point-configuration.component';

describe('VotingPointConfigurationComponent', () => {
  let component: VotingPointConfigurationComponent;
  let fixture: ComponentFixture<VotingPointConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingPointConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingPointConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
