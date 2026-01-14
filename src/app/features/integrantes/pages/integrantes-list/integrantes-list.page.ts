
import { IntegrantesService } from './../../services/integrantes.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { integrantes } from '../../../../../assets/mocks/integrantes.mock';
import { IntegranteTable } from "../../components/integrante-table/integrante-table.component";
import { IntegranteFormComponent } from "../../components/integrante-form/integrante-form.component";
import { Integrante } from '../../models/integrante.model';
import { AlertComponent, Alert } from '../../../../shared/components/alert/alert.component';



@Component({
  selector: 'app-integrantes-list.page',
  imports: [IntegranteTable, IntegranteFormComponent, CommonModule, FormsModule, AlertComponent],
  templateUrl: './integrantes-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IntegrantesListPage {

  integrantesService = inject(IntegrantesService);
  integrantes = this.integrantesService.getAll();
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  alert = signal<Alert | null>(null);
  chicas = computed(() => this.integrantesService.getTotalChicas());
  varones = computed(() => this.integrantesService.getTotalVarones());
  get pagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get totalPages() {
    const pages = Math.max(1, Math.ceil(this.filteredIntegrantes.length / this.pageSize));
    if (this.currentPage > pages) {
      this.currentPage = pages;
    }
    return pages;
  }
  get pagedIntegrantes() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredIntegrantes.slice(start, start + this.pageSize);
  }

  get filteredIntegrantes() {
    const term = this.searchTerm.trim().toLowerCase();
    let list = [...this.integrantes()];
    // Ordenar por creación: los últimos primero (asumiendo que el último agregado está al final)
    list.reverse();
    if (term.length < 3) return list;
    return list.filter(i =>
      i.nombres.toLowerCase().includes(term) ||
      i.apellidos.toLowerCase().includes(term)
    );
  }
  onDelete(integrante: Integrante) {
    if (confirm('¿Seguro que deseas eliminar este integrante?')) {
      this.integrantesService.delete(integrante.id);
    }
  }
  selectedIntegrante: Integrante | null = null;

  @ViewChild('editModal') modal!: ElementRef<HTMLDialogElement>;

  openEdit(integrante: Integrante) {
    this.selectedIntegrante = structuredClone(integrante);
    this.modal.nativeElement.showModal();
  }

  closeModal() {
    this.modal.nativeElement.close();
    this.selectedIntegrante = null;
  }

  async onUpdate(data: Integrante) {
    if (!this.selectedIntegrante) return;

    const result = await this.integrantesService.update({
      ...this.selectedIntegrante,
      ...data
    });

    if (result.success) {
      this.alert.set({
        type: 'success',
        message: result.message || 'Integrante actualizado exitosamente'
      });
    } else {
      this.alert.set({
        type: 'error',
        message: result.message || 'Error al actualizar integrante'
      });
    }

    this.closeModal();
  }

  async onSave(data: Integrante) {
    if (data.id) {
      const result = await this.integrantesService.update(data);
      if (result.success) {
        this.alert.set({
          type: 'success',
          message: result.message || 'Integrante actualizado exitosamente'
        });
      } else {
        this.alert.set({
          type: 'error',
          message: result.message || 'Error al actualizar integrante'
        });
      }
    } else {
      const result = await this.integrantesService.create(data);
      if (result.success) {
        this.alert.set({
          type: 'success',
          message: result.message || 'Integrante creado exitosamente'
        });
      } else {
        this.alert.set({
          type: 'error',
          message: result.message || 'Error al crear integrante'
        });
      }
    }
    this.closeModal();
  }

  closeAlert() {
    this.alert.set(null);
  }

}
