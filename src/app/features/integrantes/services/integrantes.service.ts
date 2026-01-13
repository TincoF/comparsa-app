import { Injectable, signal } from '@angular/core';
import { Integrante } from '../models/integrante.model';
import { integrantes } from '../../../../assets/mocks/integrantes.mock';


@Injectable({ providedIn: 'root' })
export class IntegrantesService {

  private STORAGE_KEY = 'integrantes_mock';
  private integrantesSignal = signal<Integrante[]>(this.loadIntegrantes());
  private loadIntegrantes(): Integrante[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return integrantes;
      }
    }
    return integrantes;
  }

  private saveIntegrantes(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.integrantesSignal()))
  }

  getAll() {
    return this.integrantesSignal;
  }

  create(data: Integrante) {
    const nuevo: Integrante = {
      ...data,
      id: crypto.randomUUID()
    };
    this.integrantesSignal.update(list => {
      const updated = [...list, nuevo];
      this.saveIntegrantes();
      return updated;
    });
    this.saveIntegrantes();
  }

  update(data: Integrante) {
    this.integrantesSignal.update(list => {
      const updated = list.map(i => i.id === data.id ? data : i);
      this.saveIntegrantes();
      return updated;
    });
    this.saveIntegrantes();
  }
  delete(id: string) {
    this.integrantesSignal.update(list => {
      const updated = list.filter(i => i.id !== id);
      this.saveIntegrantes();
      return updated;
    });
    this.saveIntegrantes();
  }
}
