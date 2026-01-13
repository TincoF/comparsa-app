import { Integrante } from './../../features/integrantes/models/integrante.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarIntegrante',
  standalone: true
})
export class AvatarIntegrantePipe implements PipeTransform {

  transform(integrante: Integrante): string {
    if (integrante.foto) {
      return integrante.foto;
    }

    return integrante.sexo === 'F'
      ? '/img/iconM.png'
      : '/img/iconV.png';
  }
}
