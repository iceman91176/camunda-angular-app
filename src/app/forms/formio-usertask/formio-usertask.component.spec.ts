import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormioUsertaskComponent } from './formio-usertask.component';

describe('FormioUsertaskComponent', () => {
  let component: FormioUsertaskComponent;
  let fixture: ComponentFixture<FormioUsertaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormioUsertaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormioUsertaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
