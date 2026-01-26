import { Injectable, signal } from '@angular/core';
import { supabase } from '../../../core/supabase.client';
import { Pago } from '../models/pago.model';

const USE_SUPABASE = true;

export interface OperationResult {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class PagosService {
  private pagosSignal = signal<Pago[]>([]);

  constructor() {
    if (USE_SUPABASE) {
      this.loadFromSupabase();
    } else {
      this.loadFromMock();
    }
  }
  private loadFromMock() {
    const data = localStorage.getItem('pagos_mock');
    const list = data ? JSON.parse(data) : [];
    this.pagosSignal.set(list);
  }

  private saveMock() {
    localStorage.setItem('pagos_mock', JSON.stringify(this.pagosSignal()));
  }

  async loadFromSupabase() {
    const { data, error } = await supabase
      .from('pagos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('❌ Error cargando pagos', error);
      return;
    }

    this.pagosSignal.set(
      (data ?? []).map((p: any) => ({
        id: p.id,
        integranteId: p.integrante_id,
        monto: p.monto,
        concepto: p.concepto,
        fecha: p.fecha,
        observacion: p.observacion,
        metodoPago: p.metodo_pago ?? 'Efectivo',
      })),
    );
  }

  getAll() {
    return this.pagosSignal;
  }

  getByIntegrante(integranteId: string) {
    return this.pagosSignal().filter((p) => p.integranteId === integranteId);
  }

  async create(data: Omit<Pago, 'id'>): Promise<OperationResult> {
    const pagoConId: Pago = {
      ...data,
      id: crypto.randomUUID(),
    };

    if (!USE_SUPABASE) {
      this.pagosSignal.update((list) => [...list, pagoConId]);
      this.saveMock();
      return { success: true, message: 'Pago registrado exitosamente' };
    }

    const { error } = await supabase.from('pagos').insert({
      id: pagoConId.id,
      integrante_id: pagoConId.integranteId,
      monto: pagoConId.monto,
      concepto: pagoConId.concepto,
      fecha: pagoConId.fecha,
      observacion: pagoConId.observacion ?? null,
      metodo_pago: pagoConId.metodoPago ?? null,
    });

    if (error) {
      console.error('❌ Error creando pago', error);
      return { success: false, message: 'Error al registrar pago' };
    }

    await this.loadFromSupabase();
    return { success: true, message: 'Pago registrado exitosamente' };
  }

  async update(data: Pago): Promise<OperationResult> {
    if (!USE_SUPABASE) {
      this.pagosSignal.update((list) =>
        list.map((p) => (p.id === data.id ? data : p)),
      );
      this.saveMock();
      return { success: true, message: 'Pago actualizado exitosamente' };
    }

    const { error } = await supabase
      .from('pagos')
      .update({
        integrante_id: data.integranteId,
        monto: data.monto,
        concepto: data.concepto,
        fecha: data.fecha,
        observacion: data.observacion ?? null,
        metodo_pago: data.metodoPago ?? null,
      })
      .eq('id', data.id);

    if (error) {
      console.error('❌ Error actualizando pago', error);
      return {
        success: false,
        message: 'Error al actualizar pago',
      };
    }

    await this.loadFromSupabase();
    return { success: true, message: 'Pago actualizado exitosamente' };
  }

  async delete(id: string) {
    if (!USE_SUPABASE) {
      this.pagosSignal.update((list) => list.filter((p) => p.id !== id));
      this.saveMock();
      return;
    }

    const { error } = await supabase.from('pagos').delete().eq('id', id);

    if (error) {
      console.error('❌ Error borrando pago', error);
      return {
        success: false,
        message: 'Error al borrar pago',
      };
    }

    await this.loadFromSupabase();
    return { success: true, message: 'Pago borrado exitosamente' };
  }
}
