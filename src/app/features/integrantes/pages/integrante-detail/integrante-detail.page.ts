import { PagosService } from './../../../pagos/services/pagos.service';

import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntegrantesService } from '../../services/integrantes.service';
import { CommonModule } from '@angular/common';
import { CumpleanosCortoPipe } from '../../../../shared/pipes/cumpleanos-corto.pipe';
import { RolBadgePipe } from '../../../../shared/pipes/rol-badge.pipe';
import { Pago } from '../../../pagos/models/pago.model';

@Component({
  selector: 'app-integrante-detail.page',
  imports: [CommonModule, CumpleanosCortoPipe, RolBadgePipe],
  templateUrl: './integrante-detail.page.html',
})
export default class IntegranteDetailPage {
  private route = inject(ActivatedRoute);
  private integrantesService = inject(IntegrantesService);
  pagos: Pago[] = [];

  integrante = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return null;
    return (
      this.integrantesService
        .getAll()()
        .find((i) => i.id === id) ?? null
    );
  });
  private pagosService = inject(PagosService);

  async ngOnInit() {
    this.pagos = await this.pagosService.getByIntegrante(
      this.integrante()?.id ?? '',
    );
  }
}
