import { IntegrantesService } from './../../services/integrantes.service';
import { Component, signal } from '@angular/core';
import { IntegranteFormComponent } from "../../components/integrante-form/integrante-form.component";
import { Integrante } from '../../models/integrante.model';
import { Router } from '@angular/router';
import { AlertComponent, Alert } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-integrante-nuevo',
  imports: [IntegranteFormComponent, AlertComponent],
  templateUrl: './integrante-nuevo.page.html',
})
export default class IntegranteNuevo {
  alert = signal<Alert | null>(null);

  constructor(
    private integrantesService: IntegrantesService,
    private router: Router
  ) {}

  async onSave(data: Integrante) {
    const result = await this.integrantesService.create(data);

    if (result.success) {
      this.alert.set({
        type: 'success',
        message: result.message || 'Integrante creado exitosamente'
      });
      setTimeout(() => {
        this.router.navigate(['/integrantes']);
      }, 1500);
    } else {
      this.alert.set({
        type: 'error',
        message: result.message || 'Error al crear integrante'
      });
    }
  }

  closeAlert() {
    this.alert.set(null);
  }
}

