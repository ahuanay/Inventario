import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAlmacen } from './new-almacen';

describe('NewAlmacen', () => {
  let component: NewAlmacen;
  let fixture: ComponentFixture<NewAlmacen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAlmacen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAlmacen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
