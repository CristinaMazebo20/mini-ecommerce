import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoProdutos } from './gestao-produtos';

describe('GestaoProdutos', () => {
  let component: GestaoProdutos;
  let fixture: ComponentFixture<GestaoProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestaoProdutos],
    }).compileComponents();

    fixture = TestBed.createComponent(GestaoProdutos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
