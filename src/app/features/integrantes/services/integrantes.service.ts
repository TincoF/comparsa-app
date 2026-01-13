import { Injectable, signal } from '@angular/core';
import { Integrante } from '../models/integrante.model';
import { integrantes as mockIntegrantes } from '../../../../assets/mocks/integrantes.mock';
import { supabase } from '../../../core/supabase.client';

const USE_SUPABASE = true;

@Injectable({ providedIn: 'root' })
export class IntegrantesService {

  private integrantesSignal = signal<Integrante[]>([]);

  constructor() {
    if (USE_SUPABASE) {
      this.loadFromSupabase();
    } else {
      this.loadFromMock();
    }
  }

  // =====================
  // MOCK
  // =====================
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

  // =====================
  // SUPABASE
  // =====================
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

  // =====================
  // API PUBLICA
  // =====================
  getAll() {
    return this.integrantesSignal;
  }

  async create(data: Integrante) {
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
      return;
    }

    const { error } = await supabase
      .from('integrantes')
      .insert(integranteConId);

    if (error) {
      console.error('❌ Error creando integrante', error);
      return;
    }

    await this.loadFromSupabase(); // 🔥 IMPORTANTE
  }

  async update(data: Integrante) {
    if (!USE_SUPABASE) {
      this.integrantesSignal.update(list =>
        list.map(i => i.id === data.id ? data : i)
      );
      this.saveMock();
      return;
    }

    const { error } = await supabase
      .from('integrantes')
      .update(data)
      .eq('id', data.id);

    if (error) {
      console.error('❌ Error actualizando integrante', error);
      return;
    }

    await this.loadFromSupabase();
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
      return;
    }

    await this.loadFromSupabase();
  }
}

