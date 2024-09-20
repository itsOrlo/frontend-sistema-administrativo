export interface MenuRutasResponseDto {
    success: boolean;
    rutas:   RutaInterface[];
}

export interface RutaInterface {
    ruta_id: number;             // Cambia id a ruta_id
    ruta_nombre: string;         // Cambia nombre a ruta_nombre
    ruta_url: string;            // Cambia path a ruta_url
    ruta_ruta: string;           // Cambia ruta a ruta_ruta
    ruta_component: string;      // Cambia component a ruta_component
    ruta_padre: number;          // Cambia padre a ruta_padre
    ruta_indexed: boolean;       // Cambia indexeddb a ruta_indexed
    ruta_estado?: boolean;       // Agrega si es necesario
    rutasHijas?: RutaInterface[]; // Mantén rutasHijas
}
