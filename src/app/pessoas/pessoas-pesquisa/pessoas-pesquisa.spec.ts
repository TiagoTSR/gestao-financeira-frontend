import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoasPesquisa } from './pessoas-pesquisa';

describe('PessoasPesquisa', () => {
  let component: PessoasPesquisa;
  let fixture: ComponentFixture<PessoasPesquisa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoasPesquisa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PessoasPesquisa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
