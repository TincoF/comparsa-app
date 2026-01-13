import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Integrante } from '../../models/integrante.model';
import { AvatarIntegrantePipe } from '../../../../shared/pipes/avatar-integrante.pipe';
import { RolBadgePipe } from '../../../../shared/pipes/rol-badge.pipe';
import { SocioBadgePipe } from '../../../../shared/pipes/socio-badge.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-integrante-table',
  imports: [CommonModule, AvatarIntegrantePipe, RolBadgePipe, SocioBadgePipe, RouterLink],
  templateUrl: './integrante-table.component.html',
})
export class IntegranteTable {
  listIntegrantes = input.required<Integrante[]>();
  edit = output<Integrante>();
  delete = output<Integrante>();
}
