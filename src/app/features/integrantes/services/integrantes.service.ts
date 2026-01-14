import { Injectable, signal } from '@angular/core';
import { Integrante } from '../models/integrante.model';
import { integrantes as mockIntegrantes } from '../../../../assets/mocks/integrantes.mock';
import { supabase } from '../../../core/supabase.client';

const USE_SUPABASE = true;

export interface OperationResult {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class IntegrantesService {

  private integrantesSignal = signal<Integrante[]>([]);

  getTotalChicas() {
    return this.integrantesSignal().filter(i => i.sexo === 'F').length;
  }

  getTotalVarones() {
    return this.integrantesSignal().filter(i => i.sexo === 'M').length;
  }

  constructor() {
    if (USE_SUPABASE) {
      this.loadFromSupabase();
    } else {
      this.loadFromMock();
    }
  }

  private loadFromMock() {
    const data = localStorage.getItem('integrantes_mock');
    const list = data ? JSON.parse(data) : mockIntegrantes;
    this.integrantesSignal.set(list);
  }

  private saveMock() {
    localStorage.setItem(
      'integrantes_mock',
      JSON.stringify(this.integrantesSignal())
    );
  }

  async loadFromSupabase() {
    const { data, error } = await supabase
      .from('integrantes')
      .select('*');

    if (error) {
      console.error('❌ Error cargando integrantes', error);
      return;
    }

    this.integrantesSignal.set(data as Integrante[]);
  }

  getAll() {
    return this.integrantesSignal;
  }

  async create(data: Integrante): Promise<OperationResult> {
    const integranteConId: Integrante = {
      ...data,
      id: crypto.randomUUID(),
    };

    if (!USE_SUPABASE) {
      this.integrantesSignal.update(list => {
        const updated = [...list, integranteConId];
        localStorage.setItem('integrantes_mock', JSON.stringify(updated));
        return updated;
      });
      return { success: true, message: 'Integrante creado exitosamente' };
    }

    const { error } = await supabase
      .from('integrantes')
      .insert(integranteConId);

    if (error) {
      console.error('❌ Error creando integrante', error);
      return {
        success: false,
        message: `Error al crear integrante`
      };
    }

    await this.loadFromSupabase();
    return { success: true, message: 'Integrante creado exitosamente' };
  }

  async update(data: Integrante): Promise<OperationResult> {
    if (!USE_SUPABASE) {
      this.integrantesSignal.update(list =>
        list.map(i => i.id === data.id ? data : i)
      );
      this.saveMock();
      return { success: true, message: 'Integrante actualizado exitosamente' };
    }

    const { error } = await supabase
      .from('integrantes')
      .update(data)
      .eq('id', data.id);

    if (error) {
      console.error('❌ Error actualizando integrante', error);
      return {
        success: false,
        message: `Error al actualizar integrante`
      };
    }

    await this.loadFromSupabase();
    return { success: true, message: 'Integrante actualizado exitosamente' };
  }

  async delete(id: string) {
    if (!USE_SUPABASE) {
      this.integrantesSignal.update(list =>
        list.filter(i => i.id !== id)
      );
      this.saveMock();
      return;
    }

    const { error } = await supabase
      .from('integrantes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error borrando integrante', error);
      return {
        success: false,
        message: `Error al borrar integrante`
      };
    }

    await this.loadFromSupabase();
    return { success: true, message: 'Integrante borrado exitosamente' };
  }
}

