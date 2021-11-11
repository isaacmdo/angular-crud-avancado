import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {
  readonly imagemPadrao = 'http://www.ccta.ufpb.br/labeet/contents/acervos/categorias/cordofones/udecra/sem-imagem.jpg/@@images/image.jpeg'
  filme: Filme

  constructor(private activateRoute: ActivatedRoute,
    private filmesService: FilmesService) { }

  ngOnInit() {
    this.visualizar(this.activateRoute.snapshot.params['id']);
  }

  private visualizar(id: number): void {
    this.filmesService.visualizar(id).subscribe((filme: Filme) => this.filme = filme);
  }

}
