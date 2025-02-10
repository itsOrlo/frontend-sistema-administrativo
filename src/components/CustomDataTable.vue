<template>
    <!-- <div v-if="isPending" class="flex items-center justify-center min-h-screen bg-gray-100">
        <div role="status" class="flex items-center justify-center">
            <svg aria-hidden="true" class="w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08199 50.5908C9.08199 73.3884 27.2023 91.5088 50 91.5088C72.7977 91.5088 90.918 73.3884 90.918 50.5908C90.918 27.7932 72.7977 9.67288 50 9.67288C27.2023 9.67288 9.08199 27.7932 9.08199 50.5908Z"
                    fill="currentColor" />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5531C95.2932 28.8228 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7235 75.2124 7.41289C69.5422 4.10227 63.2754 1.94025 56.7082 1.05117C51.7666 0.367499 46.7353 0.446843 41.8303 1.27873C39.3616 1.69328 37.9242 4.19778 38.5605 6.62326C39.1968 9.04874 41.673 10.4711 44.143 10.1075C47.852 9.53988 51.6361 9.61436 55.2878 10.3178C60.8788 11.3881 66.1387 13.634 70.6331 16.9043C75.1275 20.1747 78.7314 24.3748 81.188 29.192C83.0332 32.6002 84.4328 36.2577 85.3465 40.0429C85.9302 42.3678 88.4543 43.6781 90.88 43.0409Z"
                    fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
        </div>
    </div> -->
    <div>
        <div class="flex">
            <!-- Input de busqueda -->
            <div class="">
                <form class="py-2 px-2">
                    <label class="sr-only">Búsqueda</label>
                    <div class="relative w-full">
                        <div
                            class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" @input="search" placeholder="Buscar . . ."
                            class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </div>
                </form>
            </div>
            <!-- Dropdown button Columnas -->
            <div class="relative inline-block text-left">
                <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" data-dropdown-delay="200"
                    class="bg-white-700 shadow-lg hover:bg-white-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm mx-4 my-2 px-5 py-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800 "
                    type="button">Columnas
                    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 4 4 4-4" />
                    </svg>
                </button>
                <!-- Dropdown menu -->
                <div id="dropdown"
                    class="z-20 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 max-h-[400px] min-w-[400px] overflow-auto">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                        <li v-for="(header, index) in columns" :key="index"
                            class="flex justify-between hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
                            @click="onChangeVisibilityColumn(index)">
                            <span class="block px-4 py-2 ">{{
                                header.head }}</span>
                            <span :class="[
                                `${header.isShowing ? 'text-green-500' : 'text-red-500'}`,
                                `block px-4 py-2`,
                                `hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`
                            ]">{{ header.isShowing ? 'Visible' : 'Oculto' }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Dropdown button # Filas -->
            <div class="relative inline-block text-left">
                <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown-2"
                    class="bg-white-700 shadow-lg hover:bg-white-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm mx-4 my-2 px-5 py-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800 "
                    type="button"># Filas <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 4 4 4-4" />
                    </svg>
                </button>

                <!-- Dropdown menu -->
                <div id="dropdown-2"
                    class="z-20 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li v-for="(item, index) in optionsRowsPerPage" :key="index">
                            <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                @click="onChangeRowsPerPage(item)">{{ item
                                }}</span>
                        </li>

                    </ul>
                </div>
            </div>
        </div>

        <div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th v-for="(head, headIndex) in columns" :key="headIndex" scope="col"
                                :class="`${columns[headIndex].isShowing ? 'px-6 py-3' : ''}`">
                                <div v-show="head.isShowing">
                                    {{ head.head }}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowIndex) in filteredItems" :key="rowIndex"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th v-for="(cell, cellIndex) in Object.values(row ? row : [])" :key="cellIndex" scope="row"
                                :class="[
                                    ` font-medium text-gray-900 whitespace-nowrap dark:text-white`,
                                    `${columns[cellIndex].isShowing ? 'px-6 py-4' : ''}`
                                ]">

                                <div v-show="columns[cellIndex].isShowing">
                                    <div v-if="typeof cell === 'object'">
                                        {{ Object.values(cell!)[0] }}
                                    </div>
                                    <div v-else>{{ cell }}</div>
                                </div>
                            </th>
                            <th>
                                <button @click="emitRowId(row)" type="button"
                                    :class="[
                                        `text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 m-auto dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none dark:focus:ring-blue-800`,
                                        `${columns[columns.length - 1].isShowing ? 'block' : 'hidden'}`
                                    ]">Editar</button>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div>
            <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
                aria-label="Table navigation">
                <span
                    class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Mostrando
                    <span class="font-semibold text-gray-900 dark:text-white">{{ showingNumberStartRowsCurrentPage
                        }}-{{ showingNumberEndRowsCurrentPage }}</span>
                    de
                    <span class="font-semibold text-gray-900 dark:text-white">{{ totalRows }}</span>

                </span>
                <div class="flex flex-col ">


                    <ul class="inline-flex flex-wrap items-center py-5 -space-x-px rtl:space-x-reverse text-sm h-8">
                        <li>
                            <span
                                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                @click="onChangeCurrentPage(1)">Inicio</span>
                        </li>
                        <li>
                            <span
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                @click="onBeforeCurrentPage">Anterior</span>
                        </li>
                        <li v-for="item in getPaginationArray(totalPages)" :key="item">
                            <span :class="[
                                `flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`,
                                `${currentPage == item ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white' : 'bg-white'}`
                            ]" @click="onChangeCurrentPage(item)">{{
                                item }}</span>
                        </li>
                        <li>
                            <span class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
                            " @click="onNextCurrentPage">Siguiente</span>
                        </li>
                        <li>
                            <span
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                @click="onChangeCurrentPage(totalPages)">Fin</span>
                        </li>
                    </ul>

                </div>
            </nav>
        </div>
        <div>

        </div>
    </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref, watchEffect } from 'vue'

import { initDropdowns } from 'flowbite';

const props = defineProps({
    data: {
        type: Array,
        required: false
    }
})

const searchFilter = ref<string>('');

// const filteredItems = computed(() => {
//     const rowsToShow = props.data ? props.data : [];
//     let items = rowsToShow;

//     return items.filter((item: any, index) => {
//         const withinRange = index >= (currentPage.value - 1) * rowsPerPage.value &&
//             index < currentPage.value * rowsPerPage.value;

//         const matchesSearch = Object.values(item).some((value: any) => {
//             return value.toString().toLowerCase().includes(searchFilter.value.toLowerCase());
//         });

//         return matchesSearch && withinRange;
//     });
// });

const filteredItems = computed(() => {
    // const rowsToShow: any[] = props.data ? props.data : [];
    
    // // Filtrar la data completa primero
    // let items = rowsToShow.filter((item) => {
    //     return Object.values(item).some((value: any) => {
    //         return value.toString().toLowerCase().includes(searchFilter.value.toLowerCase());
    //     });
    // });

    // // Luego aplicar la paginación
    // return items.filter((item, index) => {
    //     const withinRange = index >= (currentPage.value - 1) * rowsPerPage.value &&
    //         index < currentPage.value * rowsPerPage.value;
    //     return withinRange;
    // });
    
    const rowsToShow: any[] = props.data ? props.data : [];
    
    // Filtrar la data completa primero
    let items = rowsToShow.filter((item) => {
        return Object.values(item).some((value: any) => {
            return value.toString().toLowerCase().includes(searchFilter.value.toLowerCase());
        });
    });

    // Luego aplicar la paginación
    return items.filter((item, index) => {
        const withinRange = index >= (currentPage.value - 1) * rowsPerPage.value &&
            index < currentPage.value * rowsPerPage.value;
        return withinRange;
    });
});

const search = (e: any) => {
    searchFilter.value = e.target.value;
};

const columns = ref<{ head: string; isShowing: boolean }[]>([])

watchEffect(() => {
    if (props.data && props.data.length > 0 && props.data[0]) {
        columns.value = [...Object.keys(props.data[0] as Record<string, unknown>).map((col) => {
            return { head: col, isShowing: true }
        }), { head: 'EDITAR', isShowing: true }]
    }
})

onMounted(() => {
    initDropdowns()
    if (props.data) {
        columns.value = [...Object.keys(props.data[0] as Record<string, unknown>).map((col) => {
            return { head: col, isShowing: true }
        }), { head: 'EDITAR', isShowing: true }]
    }
})

const onChangeVisibilityColumn = (index: number) => {
    columns.value[index].isShowing = !columns.value[index].isShowing
}

const onChangeCurrentPage = (page: number) => {
    currentPage.value = page
}
const onBeforeCurrentPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}
const onNextCurrentPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const optionsRowsPerPage = [5, 10, 15, 20, 25, 30, 50]
const rowsPerPage = ref<number>(optionsRowsPerPage[0])
const onChangeRowsPerPage = (rows: number) => {
    rowsPerPage.value = rows
}
const currentPage = ref<number>(1)
const totalPages = computed(() => {
    return Math.ceil(props.data ? props.data.length / rowsPerPage.value : 0)
})
const totalRows = computed(() => {
    return props.data ? props.data.length : 0
})
const showingNumberStartRowsCurrentPage = computed(() => {
    return props.data ? ((rowsPerPage.value * (currentPage.value - 1)) + 1) : 0
})
const showingNumberEndRowsCurrentPage = computed(() => {
    if (rowsPerPage.value * currentPage.value > totalRows.value) {
        return totalRows.value
    }
    return props.data ? (rowsPerPage.value * currentPage.value) : 0
})

const getPaginationArray = (arrProp: number) => {
    const arr = Array.from({length: arrProp}, (_, i) => i+ 1)
    const maxLength = 7; // Maximum length of the output array
    const selectedIndex = arr.indexOf(currentPage.value);

    if (selectedIndex === -1) {
        // If the selected number is not found in the array, return an empty array
        return [];
    }

    const startIndex = Math.max(0, selectedIndex - Math.floor((maxLength - 1) / 2));
    const endIndex = Math.min(arr.length, startIndex + maxLength);

    return arr.slice(startIndex, endIndex)
}


const emit = defineEmits(['updateRow'])

const emitRowId = (id: any) => {
    const emitId = Object.values(id)[0]
    emit('updateRow', emitId)
}
</script>

<style scoped></style>