import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Pago } from '../../models/pago.model';

@Component({
  selector: 'app-pagos-table',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pagos-table.component.html',
})
export class PagosTableComponent {
  listPagos = input.required<any[]>();
  integrantes = input.required<any[]>();
  rowOffset = input<number>(0);
  edit = output<any>();
  delete = output<any>();

  getIntegranteName(integranteId: string): string {
    const i = this.integrantes().find((x) => x.id === integranteId);
    return i ? `${i.nombres} ${i.apellidos}` : '—';
  }
}
