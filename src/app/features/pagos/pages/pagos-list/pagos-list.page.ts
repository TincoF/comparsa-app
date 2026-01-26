import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { PagosService } from '../../services/pagos.service';
import { PagosTableComponent } from '../../components/pagos-table/pagos-table.component';

import { Pago } from '../../models/pago.model';
import { Alert } from '../../../../shared/components/alert/alert.component';
import { IntegrantesService } from '../../../integrantes/services/integrantes.service';
import { PagosFormComponent } from '../../components/pagos-form/pagos-form.component';

@Component({
  selector: 'app-pagos-list.page',
  imports: [PagosTableComponent, PagosFormComponent],
  templateUrl: './pagos-list.page.html',
})
export default class PagosListPage {
  private pagosService = inject(PagosService);
  private integrantesService = inject(IntegrantesService);

  pagos = this.pagosService.getAll();
  selectedPago: Pago | null = null;
  @ViewChild('editModal') modal!: ElementRef<HTMLDialogElement>;
  onEditPago(pago: Pago) {
    this.selectedPago = structuredClone(pago);
    this.modal.nativeElement.showModal();
  }

  closeModal() {
    this.modal.nativeElement.close();
    this.selectedPago = null;
  }

  async guardar(data: Pago) {
    if (!this.selectedPago) return;
    const result = await this.pagosService.update({
      ...this.selectedPago,
      ...data,
    });
    if (result.success) {
      this.alert.set({
        type: 'success',
        message: result.message || 'Pago actualizado exitosamente',
      });
    } else {
      this.alert.set({
        type: 'error',
        message: result.message || 'Error al actualizar pago',
      });
    }
    this.closeModal();
  }

  cancelar() {
    this.closeModal();
  }
  integrantes = this.integrantesService.getAll();

  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  alert = signal<Alert | null>(null);

  getIntegranteName(integranteId: string): string {
    const i = this.integrantes().find((x) => x.id === integranteId);
    return i ? `${i.nombres} ${i.apellidos}` : '—';
  }

  get filteredPagos(): Pago[] {
    const term = this.searchTerm.trim().toLowerCase();

    let list = [...this.pagos()];
    list.reverse(); // últimos pagos primero

    if (term.length < 3) return list;

    return list.filter((p) => {
      const nombre = this.getIntegranteName(p.integranteId).toLowerCase();
      return nombre.includes(term) || p.concepto.toLowerCase().includes(term);
    });
  }

  get totalPages(): number {
    const pages = Math.max(
      1,
      Math.ceil(this.filteredPagos.length / this.pageSize),
    );
    if (this.currentPage > pages) {
      this.currentPage = pages;
    }
    return pages;
  }

  get pagedPagos(): Pago[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPagos.slice(start, start + this.pageSize);
  }

  get pagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  async onDeletePago(pago: Pago) {
    if (!confirm('¿Seguro que deseas eliminar este pago?')) return;

    const result = await this.pagosService.delete(pago.id);

    if ((result as any)?.success === false) {
      this.alert.set({
        type: 'error',
        message: 'Error al eliminar pago',
      });
    } else {
      this.alert.set({
        type: 'success',
        message: 'Pago eliminado correctamente',
      });
    }
  }

  closeAlert() {
    this.alert.set(null);
  }
}
