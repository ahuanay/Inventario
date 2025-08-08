import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAlmacen } from './list-almacen';

describe('ListAlmacen', () => {
  let component: ListAlmacen;
  let fixture: ComponentFixture<ListAlmacen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAlmacen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAlmacen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
