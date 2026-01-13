import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntegrantesService } from '../../services/integrantes.service';
import { CommonModule } from '@angular/common';
import { Integrante } from '../../models/integrante.model';

@Component({
  selector: 'app-integrante-detail.page',
  imports: [CommonModule],
  templateUrl: './integrante-detail.page.html',
})
export default class IntegranteDetailPage {
  private route = inject(ActivatedRoute);
  private integrantesService = inject(IntegrantesService);

  integrante = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return null;
    return this.integrantesService.getAll()().find(i => i.id === id) ?? null;
  });
}
