import { IntegrantesService } from './../../services/integrantes.service';
import { Component } from '@angular/core';
import { IntegranteFormComponent } from "../../components/integrante-form/integrante-form.component";
import { Integrante } from '../../models/integrante.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-integrante-nuevo',
  imports: [IntegranteFormComponent],
  templateUrl: './integrante-nuevo.page.html',
})
export default class IntegranteNuevo {

  constructor(
    private integrantesService: IntegrantesService,
    private router: Router
  ) {}

  onSave(data: Integrante) {
    this.integrantesService.create(data);
    this.router.navigate(['/integrantes']);
  }
}
