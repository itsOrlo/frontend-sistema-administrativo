import type { GlobalPersonalResponse } from "./interfaces/global-personal-response"

const DB_NAME = 'db-personal'
const STORE_NAME = 'sn-personal'
const DB_VERSION = 1

let db: IDBDatabase

export const openDbPersonal = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result
            resolve(db)
        }

        request.onerror = (event) => {
            reject(new Error(`Error opening IndexedDB Personal:::${event}`))
        }
    })
}

export const closeDbPersonal = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(new Error(`Error closing IndexedDB Personal:::${event}`));
        };
    });
};


export const addAllPersonal = async (people: GlobalPersonalResponse[]) => {
    const db = await openDbPersonal()
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        people.forEach((person: GlobalPersonalResponse) => {
            person.id = person.LDOC_CEDULA
            store.put(person)
        })

        transaction.oncomplete = () => {
            console.log('All personal added')
            resolve()
        }

        transaction.onerror = () => {
            reject(new Error('Transaction error while adding estudiantes'))
        }
    })
}


export const addPersonal = async (person: GlobalPersonalResponse) => {
    const db = await openDbPersonal()
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        person.id = person.LDOC_CEDULA

        const request = store.put(person)

        request.onsuccess = () => {
            resolve()
        }

        request.onerror = () => {
            reject(new Error('Error adding docente'))
        }
    })
}

export const getAllPersonal = async () => {
    const db = await openDbPersonal()
    return new Promise<any[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            resolve(request.result)
        }

        request.onerror = () => {
            reject(new Error('Error getting all personal'))
        }
    })
}

export const searchPersonal = async (query: string) => {
    const db = await openDbPersonal()
    return new Promise<any[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => {
            const people = request.result
            const filtered = people.filter((person: any) =>
                Object.values(person).some((value: any) =>
                    value.toString().toLowerCase().includes(query.toLowerCase())
                )
            )
            resolve(filtered)
        }

        request.onerror = () => {
            reject(new Error('Error searching docente'))
        }
    })
}
