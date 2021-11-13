import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, ChildActivationStart, Router } from '@angular/router';
import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss'],
})
export class CadastroFilmesComponent implements OnInit {
  options: FormGroup;
  generos: Array<string>;
  id: number;

  constructor(
    private fb: FormBuilder,
    public validacao: ValidarCamposService,
    private filmeService: FilmesService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  get f() {
    return this.options.controls;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];

    if(this.id) {
      this.filmeService.visualizar(this.id).subscribe((filme: Filme) => this.criarFormulario(filme));
      this.filmeService.visualizar(this.id).subscribe();
    } else {
      this.criarFormulario(this.criarFilmeEmBranco());
    }
  
    this.generos = [
      'Acao',
      'Romance',
      'Aventura',
      'Terror',
      'Ficcao cientifica',
      'Comedia',
      'Aventura',
      'Drama',
    ];
  }

  private criarFilmeEmBranco(): Filme {
    return {
      id: null,
      titulo: null,
      dtLancamento: null,
      urlFoto: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null
    } as Filme;
  }

  private criarFormulario(filme: Filme) {
    this.options = this.fb.group({
      titulo: [
        filme.titulo,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(256),
        ],
      ],
      urlFoto: [filme.urlFoto , [Validators.required, Validators.minLength(10)]],
      dataLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao, [Validators.minLength(2), Validators.maxLength(256)]],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlImdb: [filme.urlImdb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]],
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  submit(): void {
    this.options.markAllAsTouched();
    if (this.options.invalid) return;

    const filme = this.options.getRawValue() as Filme;
    if(this.id) {
      filme.id = this.id;
      this.editar(filme);
    } else {
      this.salvar(filme)
    }
  }

  reiniciarForm(): void {
    this.options.reset();
  }

  private salvar(filme: Filme): void {
    this.filmeService.salvar(filme).subscribe((retorno) => {
      const config = {
        data: {
          btnSucesso: 'Ir para a listagem',
          btnCancelar: 'Cadastrar um novo filme',
          corBtnCancelar: 'primary',
          possuiBtnFechar: true
        } as Alerta
      }
      const dialogRef = this.dialog.open(AlertaComponent, config)
      dialogRef.afterClosed().subscribe((opcao: boolean) => {
        if(opcao) {
          this.router.navigateByUrl('filmes');
        } else {
          this.reiniciarForm();
        }
      })
    },
      () => {
        const config = {
          data: {
            titulo: 'Erro ao salvar o registro',
            descricao: 'Nao conseguimos salvar seu registro, favor tentar novamente mais tarde',
            corBtnSucesso: 'warn',
            btnSucesso: 'Fechar',
          } as Alerta
        }
        this.dialog.open(AlertaComponent, config)
      });
  }

  private editar(filme: Filme): void {
    this.filmeService.editar(filme).subscribe((retorno) => {
      const config = {
        data: {
          descricao: 'Seu registro foi atualizado com sucesso!',
          btnSucesso: 'Ir para a listagem',
        } as Alerta
      }
      const dialogRef = this.dialog.open(AlertaComponent, config)
      dialogRef.afterClosed().subscribe(() => this.router.navigateByUrl('filmes'))
    }, () => {
        const config = {
          data: {
            titulo: 'Erro ao editar o registro',
            descricao: 'Nao conseguimos editar seu registro, favor tentar novamente mais tarde',
            corBtnSucesso: 'warn',
            btnSucesso: 'Fechar',
          } as Alerta
        }
        this.dialog.open(AlertaComponent, config)
      });
  }
}
