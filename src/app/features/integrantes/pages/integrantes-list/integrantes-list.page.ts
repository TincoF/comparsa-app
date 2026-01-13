
import { IntegrantesService } from './../../services/integrantes.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { integrantes } from '../../../../../assets/mocks/integrantes.mock';
import { IntegranteTable } from "../../components/integrante-table/integrante-table.component";
import { IntegranteFormComponent } from "../../components/integrante-form/integrante-form.component";
import { Integrante } from '../../models/integrante.model';



@Component({
  selector: 'app-integrantes-list.page',
  imports: [IntegranteTable, IntegranteFormComponent, CommonModule, FormsModule],
  templateUrl: './integrantes-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IntegrantesListPage {
    get pagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  private integrantesService = inject(IntegrantesService);
  integrantes = this.integrantesService.getAll();
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  get totalPages() {
    const pages = Math.max(1, Math.ceil(this.filteredIntegrantes.length / this.pageSize));
    // Si el filtro cambia y la página actual queda fuera de rango, ajusta
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
    if (term.length < 3) return this.integrantes();
    return this.integrantes().filter(i =>
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

  onUpdate(data: Integrante) {
    if (!this.selectedIntegrante) return;

    this.integrantesService.update({
      ...this.selectedIntegrante,
      ...data
    });

    this.closeModal();
  }
  onSave(data: Integrante) {
    if (data.id) {
      this.integrantesService.update(data);
    } else {
      this.integrantesService.create(data);
    }
    this.closeModal();
  }

}
