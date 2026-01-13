// pipes/socio-badge.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'socioBadge',
  standalone: true
})
export class SocioBadgePipe implements PipeTransform {

  transform(esSocio: boolean): string {
    return esSocio
      ? 'badge badge-warning'
      : 'badge badge-info';
  }
}
