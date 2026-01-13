export interface Pago {
  fecha: string;
  monto: number;
  concepto: string;
  metodoPago: 'Efectivo' | 'Transferencia' | 'Yape' | 'Plin' | 'Otro';
  detalles?: string | null;
}
