export interface UsuarioDto {
    usu_id: number;
    usu_nombres: string;
    usu_apellidos: string;
    usu_usuario: string;
    usu_password: string;
    usu_estado: boolean;
    usu_creado: string;
    usu_actualizado: string;
}

export interface RolDto {
    rol_id: number;
    rol_nombre: string;
    rol_descricion: string;
    rol_estado: boolean;
    rol_creado: string;
    rol_actualizado: string;
}

export interface RutaDto {
    ruta_id: number;
    ruta_nombre: string;
    ruta_ruta: string;
    ruta_url: string;
    ruta_component: string;
    ruta_indexed: boolean;
    ruta_creada: string;
    ruta_actualizada: string;
    ruta_padre: number;
    ruta_estado: boolean;
    rutasHijas?: RutaDto[]; 
}

export interface LoginResponseDto {
    usuario: UsuarioDto;
    rol: RolDto;
    rutas: RutaDto[];
    token: string;
    message?: string;  
    error?: string;    
    statusCode?: number;  

}
