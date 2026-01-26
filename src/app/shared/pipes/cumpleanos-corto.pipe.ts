import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cumpleanosCorto', standalone: true })
export class CumpleanosCortoPipe implements PipeTransform {
  private meses = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ];

  transform(value: string | null | undefined): string {
    if (!value || value.length < 7) return '';
    let mes = '', dia = '';
    if (value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        mes = parts[1];
        dia = parts[2];
      }
    }
    const mesNum = parseInt(mes, 10);
    const diaNum = parseInt(dia, 10);
    if (!mesNum || !diaNum) return '';
    return `${diaNum} ${this.meses[mesNum - 1]}`;
  }
}
