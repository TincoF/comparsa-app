import { Component, inject } from '@angular/core';
import { PagosService } from '../../services/pagos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagosFormComponent } from '../../components/pagos-form/pagos-form.component';

@Component({
  imports: [CommonModule, FormsModule, PagosFormComponent],
  selector: 'app-pagos-nuevo.page',
  templateUrl: './pagos-nuevo.page.html',
})
export default class PagosNuevoPage {
  private pagosService = inject(PagosService);
  private router = inject(Router);

  async guardar(pago: any) {
    await this.pagosService.create(pago);
    alert('Pago registrado correctamente');
    this.router.navigateByUrl('/pagos');
  }

  cancelar() {
    this.router.navigateByUrl('/pagos');
  }
}
