import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoPedidos } from './gestao-pedidos';

describe('GestaoPedidos', () => {
  let component: GestaoPedidos;
  let fixture: ComponentFixture<GestaoPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestaoPedidos],
    }).compileComponents();

    fixture = TestBed.createComponent(GestaoPedidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
