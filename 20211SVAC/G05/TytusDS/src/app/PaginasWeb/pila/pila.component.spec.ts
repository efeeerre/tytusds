import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilaComponent } from './Pila.component';

describe('ListasCircularesComponent', () => {
  let component: PilaComponent;
  let fixture: ComponentFixture<PilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
