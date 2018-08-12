import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherdashComponent } from './weatherdash.component';

describe('WeatherdashComponent', () => {
  let component: WeatherdashComponent;
  let fixture: ComponentFixture<WeatherdashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherdashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
