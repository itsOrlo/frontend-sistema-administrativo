export interface MenuRutasResponseDto {
    usuario: UsuarioInterface;
    rol: RolInterface;
    rutas: RutaInterface[];
    token: string;
}

export interface UsuarioInterface {
    usu_id: number;
    usu_nombre: string;
    usu_apellido: string;
    usu_usuario: string;
}

export interface RolInterface {
    rol_id: number;
    rol_nombre: string;
    rol_descricion: string;
    rol_estado: boolean;
    rol_creado: string; // ISO date format (ej: "2024-09-30T16:57:31.390Z")
    rol_actualizado: string;
}

export interface RutaInterface {
    ruta_id: number;
    ruta_padre: number;
    ruta_nombre: string;
    ruta_ruta: string;
    ruta_url: string;
    ruta_component: string;
    ruta_indexed: boolean;
    roru_privilegio: number;
    rutasHijas?: RutaInterface[]; // Si hay rutas anidadas
}
