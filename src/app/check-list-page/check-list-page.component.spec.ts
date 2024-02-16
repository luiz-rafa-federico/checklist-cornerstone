import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListPageComponent } from './check-list-page.component';

describe('CheckListPageComponent', () => {
  let component: CheckListPageComponent;
  let fixture: ComponentFixture<CheckListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
