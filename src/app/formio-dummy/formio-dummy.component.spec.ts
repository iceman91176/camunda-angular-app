import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormioDummyComponent } from './formio-dummy.component';

describe('FormioDummyComponent', () => {
  let component: FormioDummyComponent;
  let fixture: ComponentFixture<FormioDummyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormioDummyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormioDummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
