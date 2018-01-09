import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTreeComponent } from './event-tree.component';

describe('EventTreeComponent', () => {
  let component: EventTreeComponent;
  let fixture: ComponentFixture<EventTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
