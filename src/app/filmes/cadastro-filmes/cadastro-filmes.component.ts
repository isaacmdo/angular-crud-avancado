import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss'],
})
export class CadastroFilmesComponent implements OnInit {
  options: FormGroup;

  constructor(private fb: FormBuilder,
    public validacao: ValidarCamposService) {}

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
      descricao: [''],
      nota: [
        0,
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(10),
        ],
      ],
      urlImdb: ['', [Validators.minLength(10)]],
      genero: ['', [Validators.required]],
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  salvar(): void {
    this.options.markAllAsTouched();
    if (this.options.invalid) return;
    console.log('entrou');
    alert('SUCESSO!!!\n\n' + JSON.stringify(this.options.value, null, 4));
  }

  reiniciarForm(): void {
    this.options.reset;
  }
}
