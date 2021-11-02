import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
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

  constructor(
    private fb: FormBuilder,
    public validacao: ValidarCamposService,
    private filmeService: FilmesService,
    public dialog: MatDialog,
  ) {}

  get f() {
    return this.options.controls;
  }

  ngOnInit() {
    this.options = this.fb.group({
      titulo: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(256),
        ],
      ],
      urlFoto: ['', [Validators.required, Validators.minLength(10)]],
      dataLancamento: ['', [Validators.required]],
      descricao: ['', [Validators.minLength(2), Validators.maxLength(256)]],
      nota: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlImdb: ['', [Validators.minLength(10)]],
      genero: ['', [Validators.required]],
      hideRequired: false,
      floatLabel: 'auto',
    });

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

  submit(): void {
    this.options.markAllAsTouched();
    if (this.options.invalid) return;

    const filme = this.options.getRawValue() as Filme;
    this.salvar(filme);
  }

  reiniciarForm(): void {
    this.options.reset;
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
    }),
      () => {
        alert('ERRO AO SALVAR');
      };
  }
}
