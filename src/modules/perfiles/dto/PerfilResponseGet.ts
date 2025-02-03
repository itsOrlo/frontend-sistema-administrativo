export interface PerfilResponse {
    perf_id: number;
    perf_nombre: string;
    perf_nivel_contribucion: string;
    usu_id: number;
    proc_id: number;
    perf_estado: number;
    perf_experiencia_minima: number;
    perf_salario_minimo: string;
    perf_salario_maximo: string;
    perf_fecha_creacion: string;
    perf_fecha_actualizacion: string;
    opciones?: string[];
  }
  