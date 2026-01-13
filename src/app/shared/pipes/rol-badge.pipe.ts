
import { Pipe, PipeTransform } from '@angular/core';
import { Integrante } from './../../features/integrantes/models/integrante.model';

@Pipe({
  name: 'rolBadge',
  standalone: true
})
export class RolBadgePipe implements PipeTransform {

  transform(rol: Integrante['rol']): string {
    switch (rol) {
      case 'Bailarina':
        return 'badge badge-secondary';
      case 'Chilquino':
        return 'badge badge-success';
      case 'Músico':
        return 'badge badge-accent';
      case 'Capitan':
        return 'badge badge-neutral';
      default:
        return 'badge badge-info';
    }
  }
}
