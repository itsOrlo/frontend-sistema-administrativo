// composables/useClients.ts
import { ref, computed, watch } from 'vue'
import { useApi } from '@/composables/use-api'
import Swal from 'sweetalert2'

export interface Cliente {
  Acción: string
  Empresa: string
  Ruc: string
  Contacto: string
  Correo: string
  Teléfono: string
}

export function useClients(pageSize = 10) {
  const clientes = ref<Cliente[]>([])
  const searchTerm = ref('')
  const currentPage = ref(1)
  const isLoading = ref(false)
  const mostrarModalCrear = ref(false)

  const clientesFiltrados = computed(() => {
    if (!searchTerm.value) return clientes.value
    
    const term = searchTerm.value.toLowerCase()
    return clientes.value.filter((cliente) => 
      Object.values(cliente)
        .join(' ')
        .toLowerCase()
        .includes(term)
    )
  })

  const totalPages = computed(() => 
    Math.ceil(clientesFiltrados.value.length / pageSize)
  )

  const clientesPaginados = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize
    return clientesFiltrados.value.slice(startIndex, startIndex + pageSize)
  })

  const loadClients = async () => {
    try {
      isLoading.value = true
      const response = await useApi.get('/api/v1/consultoria/consultoria-empresa')
      clientes.value = response.data
    } catch (error) {
      console.error('Error cargando clientes:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar la lista de clientes.'
      })
    } finally {
      isLoading.value = false
    }
  }

  const deleteClient = async (cliente: Cliente) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <p>¿Deseas eliminar el cliente <strong>${cliente.Empresa}</strong>?</p>
        <p class="mt-2 text-sm text-gray-500">Esta acción no se puede deshacer.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    try {
      const clienteId = parseInt(cliente.Acción)
      if (!clienteId) throw new Error('ID de cliente no válido')

      const response = await useApi.put('/api/v1/consultoria/eliminar-consultoria', {
        ccli_id: clienteId
      })

      if (response.status === 200) {
        clientes.value = clientes.value.filter(c => c.Acción !== cliente.Acción)
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'El cliente ha sido eliminado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        await loadClients()
      }
    } catch (error) {
      console.error('Error eliminando cliente:', error)
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el cliente. Por favor, inténtalo de nuevo.',
        icon: 'error'
      })
    }
  }

  // Reset página cuando cambia el término de búsqueda
  watch(searchTerm, () => {
    currentPage.value = 1
  })

  return {
    // Estado
    clientes,
    searchTerm,
    currentPage,
    isLoading,
    mostrarModalCrear,
    
    // Computed
    clientesFiltrados,
    clientesPaginados,
    totalPages,
    
    // Métodos
    loadClients,
    deleteClient,
    
    // Helpers
    setPage: (page: number) => currentPage.value = page,
    toggleCreateModal: (show: boolean) => mostrarModalCrear.value = show
  }
}