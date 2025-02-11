import { useApi } from '@/composables/use-api'
import { useQuery } from '@tanstack/vue-query'
import type { MenuRutasResponseDto } from '../dto/menu-rutas-response.dto'

export const useMenuRutas = (rolId: number) => {
    return useQuery({
        queryKey: ['menu-rutas', rolId],
        queryFn: async () => {
            const res = await useApi.post<MenuRutasResponseDto>('api/v1/auth/login', { rolId })
            const { rutas, token } = res.data

            // Opcional: Guardar el token para futuras peticiones
            localStorage.setItem('authToken', token)

            return rutas
        }
    })
}
