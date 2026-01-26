export interface AsistenciaDia {
  fecha: string | null;
  descripcion: string | null;
  registros: AsistenciaRegistro[];
}
export interface AsistenciaRegistro {
  integranteId: string;
  presente: boolean;
}
