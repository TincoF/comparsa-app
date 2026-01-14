import { Asistencia } from './asistencia.model';
import { Talla } from './talla.model';
import { Pago } from './pago.model';
import { Alquiler } from './alquiler.model';

export interface Integrante {
  id: string;
  nombres: string;
  apellidos: string;
  sexo: 'F' | 'M';
  rol: 'Bailarina' | 'Chilquino' | 'Músico' | 'Capitan' | 'Otro' | undefined;
  socio: boolean;
  celular: string;
  cumpleanos?: string | null;
  foto?: string;

  instrumento?: 'Quena'|'Guitarra'|'Tinya'|'Otro'|null;
  musico_pagado?: boolean | null;

  tallas: Talla;

  asistencia?: Asistencia[] | null;

  pagos?: Pago[];

  alquila_vestuario: boolean;

  alquiler?: Alquiler | null;

  observaciones?: string | null;

}
