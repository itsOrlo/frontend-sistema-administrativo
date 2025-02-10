import { useApi } from '@/composables/use-api'
import { useQuery } from '@tanstack/vue-query'
import type { MenuRutasResponseDto } from '../dto/menu-rutas-response.dto'

export const useMenuRutas = (rolId: number) => {
    try {
        const query = useQuery({
            queryKey: ['menu-rutas', rolId],
            queryFn: async () => {
                const res = await useApi.post<MenuRutasResponseDto>(`login/rutas`, { rolId })
                return res.data
            }
        })

        return query
    } catch (error) {
        console.error(error)
    }
}
