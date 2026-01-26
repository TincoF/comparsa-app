export interface Pago {
  id: string;
  integranteId: string;
  monto: number;
  concepto: string;
  fecha: string;
  metodoPago?: string | null;
  observacion?: string | null;
}
