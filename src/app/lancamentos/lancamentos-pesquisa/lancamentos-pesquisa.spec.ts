import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentosPesquisa } from './lancamentos-pesquisa';

describe('LancamentosPesquisa', () => {
  let component: LancamentosPesquisa;
  let fixture: ComponentFixture<LancamentosPesquisa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentosPesquisa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LancamentosPesquisa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
