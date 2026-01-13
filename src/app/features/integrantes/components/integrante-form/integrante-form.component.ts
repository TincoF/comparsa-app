import { input, output, Component, effect, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { Integrante } from '../../models/integrante.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-integrante-form',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './integrante-form.component.html',
})
export class IntegranteFormComponent implements OnInit, OnChanges {

  integrante = input<Integrante | null>(null);
  save = output<Integrante>();
  cancel = output<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.buildForm();
    this.handleSexo();
    this.handleRol();
    this.form.get('sexo')?.valueChanges.subscribe(sexo => {
      if (sexo === 'F') {
        this.form.get('rol')?.setValue('Bailarina');
      } else if (sexo === 'M') {
        this.form.get('rol')?.setValue('');
      }
    });
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['integrante'] && this.form) {
      const data = this.integrante();
      if (data) {
        this.form.reset();
        // Patch todos los valores juntos, incluyendo alquiler y alquilaVestuario
        this.form.patchValue({
          ...data,
          alquilaVestuario: !!data.alquilaVestuario,
        });
        // Patch explícito del grupo alquiler si corresponde
        if (data.alquilaVestuario && data.alquiler) {
          this.form.get('alquiler')?.patchValue(data.alquiler);
        } else {
          this.form.get('alquiler')?.reset();
        }
      } else {
        this.form.reset(); // valores por defecto
      }
      this.cdr.detectChanges();
    }
  }
  private buildForm() {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cumpleanos: [''],
      celular: [''],
      sexo: ['F'],
      rol: ['Bailarina'],
      socio: [false],
      instrumento: [''],
      musicoPagado: [false],
      observaciones: [''],
      tallas: this.fb.group({
        polo: [''],
        camisa: [''],
        falda: [''],
        cintura: [''],
        blusa: [''],
      }),
      alquilaVestuario: [false], // booleano, igual que en el mock
      alquiler: this.fb.group({
        garante: [''],
        dni: [''],
        direccion: [''],
        detalles: ['']
      })
    });
  }

  private handleSexo() {
    this.form.get('sexo')?.valueChanges.subscribe(sexo => {
      if (sexo === 'F') {
        this.form.patchValue({
          rol: 'Bailarina',
          instrumento: null,
          musicoPagado: null
        });
      }
    });
  }

  private handleRol() {
    this.form.get('rol')?.valueChanges.subscribe(rol => {
      if (rol === 'Capitan' || rol === 'Chilquino') {
        this.form.patchValue({
          instrumento: null,
          musicoPagado: null
        });
      }
    });
  }

  get esMujer() {
    return this.form.get('sexo')?.value === 'F';
  }

  get esVaron() {
    return this.form.get('sexo')?.value === 'M';
  }

  get mostrarMusico() {
    const rol = this.form.get('rol')?.value;
    return !this.esMujer && rol !== 'Capitan' && rol !== 'Chilquino';
  }

  get mostrarAlquiler() {
    return this.form.get('alquilaVestuario')?.value === true;
  }

  get mostrarTallasFemeninas() {
    return this.esMujer;
  }
  get mostrarTallasMasculinas() {
    return this.esVaron;
  }

submit() {
  if (this.form.invalid) return;
  if (this.form.get('sexo')?.value === 'placeholder') {
    return;
  }
  const raw = this.form.value;
  const data: Integrante = {
    ...(this.integrante() ?? {}),
    ...raw,
    socio: raw.socio === true || raw.socio === 'si',
    musicoPagado: raw.musicoPagado === true || raw.musicoPagado === 'si',
    alquiler: raw.alquilaVestuario ? raw.alquiler : null,
  };
  this.save.emit(data);
}

  cancelar() {
    this.cancel.emit();
  }
}
