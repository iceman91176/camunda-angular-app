import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormioStartComponent } from './formio-start.component';

describe('FormioStartComponent', () => {
  let component: FormioStartComponent;
  let fixture: ComponentFixture<FormioStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormioStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormioStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
