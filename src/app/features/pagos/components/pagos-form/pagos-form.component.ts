import {
  input,
  output,
  Component,
  effect,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Integrante } from '../../../integrantes/models/integrante.model';

import { IntegrantesService } from '../../../integrantes/services/integrantes.service';
import { Pago } from '../../models/pago.model';

@Component({
  selector: 'app-pagos-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pagos-form.component.html',
})
export class PagosFormComponent implements OnInit, OnChanges {
  pago = input<Pago | null>(null);
  save = output<Pago>();
  cancel = output<void>();
  form!: FormGroup;
  integrantesService = new IntegrantesService();
  integrantesSignal = this.integrantesService.getAll();

  get integrantesOrdenados() {
    return [...this.integrantesSignal()].sort((a, b) => {
      const nombreA = `${a.nombres} ${a.apellidos}`.toLowerCase();
      const nombreB = `${b.nombres} ${b.apellidos}`.toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pago'] && this.form) {
      const data = this.pago();
      if (data) {
        this.form.reset();
        this.form.patchValue({
          ...data,
          metodoPago: data.metodoPago ?? 'Efectivo',
          observaciones: data.observacion ?? '',
        });
      } else {
        this.form.reset();
      }
      this.cdr.detectChanges();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      integranteId: ['', Validators.required],
      monto: [[Validators.required, Validators.min(1)]],
      concepto: ['', Validators.required],
      fecha: ['', Validators.required],
      metodoPago: ['Efectivo', Validators.required],
      observaciones: [''],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.value;
    const data: Pago = {
      ...(this.pago() ?? {}),
      ...raw,
      integranteId: raw.integranteId,
      monto: raw.monto,
      concepto: raw.concepto,
      fecha: raw.fecha,
      metodoPago: raw.metodoPago,
      observacion: raw.observaciones,
    };
    this.save.emit(data);
  }

  cancelar() {
    this.cancel.emit();
  }
}
