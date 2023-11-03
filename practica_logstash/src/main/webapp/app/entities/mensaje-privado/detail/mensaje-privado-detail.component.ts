import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMensajePrivado } from '../mensaje-privado.model';

@Component({
  selector: 'jhi-mensaje-privado-detail',
  templateUrl: './mensaje-privado-detail.component.html',
})
export class MensajePrivadoDetailComponent implements OnInit {
  mensajePrivado: IMensajePrivado | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mensajePrivado }) => {
      this.mensajePrivado = mensajePrivado;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
