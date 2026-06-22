/**
 * ==========================================
 * db.js
 * Gestión de IndexedDB
 * Registro GPS Pro
 * ==========================================
 */

const DB_NAME = "RegistroGPSPro";
const DB_VERSION = 1;

const STORE_LOCATIONS = "locations";

class GPSDatabase {

    constructor() {
        this.db = null;
    }

    /**
     * Inicializa la base de datos
     */
    async init() {

        return new Promise((resolve, reject) => {

            const request = indexedDB.open(
                DB_NAME,
                DB_VERSION
            );

            request.onerror = () => {

                console.error(
                    "Error abriendo IndexedDB"
                );

                reject(
                    request.error
                );

            };

            request.onsuccess = () => {

                this.db =
                    request.result;

                console.log(
                    "IndexedDB iniciada"
                );

                resolve();

            };

            request.onupgradeneeded = event => {

                const db =
                    event.target.result;

                this.createSchema(db);

            };

        });

    }

    /**
     * Crea estructura inicial
     */
    createSchema(db) {

        if (
            !db.objectStoreNames.contains(
                STORE_LOCATIONS
            )
        ) {

            const store =
                db.createObjectStore(
                    STORE_LOCATIONS,
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

            store.createIndex(
                "date",
                "date",
                { unique: false }
            );

            store.createIndex(
                "province",
                "province",
                { unique: false }
            );

            store.createIndex(
                "place",
                "place",
                { unique: false }
            );

            store.createIndex(
                "timestamp",
                "timestamp",
                { unique: false }
            );

        }

    }

    /**
     * Obtiene ObjectStore
     */
    getStore(
        mode = "readonly"
    ) {

        const transaction =
            this.db.transaction(
                STORE_LOCATIONS,
                mode
            );

        return transaction.objectStore(
            STORE_LOCATIONS
        );

    }

    /**
     * Añadir ubicación
     */
    async addLocation(location) {

        return new Promise(
            (resolve, reject) => {

                const store =
                    this.getStore(
                        "readwrite"
                    );

                const request =
                    store.add(location);

                request.onsuccess =
                    () =>
                        resolve(
                            request.result
                        );

                request.onerror =
                    () =>
                        reject(
                            request.error
                        );

            }
        );

    }

    /**
     * Obtener todas
     */
    async getAllLocations() {

        return new Promise(
            (resolve, reject) => {

                const store =
                    this.getStore();

                const request =
                    store.getAll();

                request.onsuccess =
                    () =>
                        resolve(
                            request.result
                        );

                request.onerror =
                    () =>
                        reject(
                            request.error
                        );

            }
        );

    }

    /**
     * Obtener por ID
     */
    async getLocationById(id) {

        return new Promise(
            (resolve, reject) => {

                const store =
                    this.getStore();

                const request =
                    store.get(
                        Number(id)
                    );

                request.onsuccess =
                    () =>
                        resolve(
                            request.result
                        );

                request.onerror =
                    () =>
                        reject(
                            request.error
                        );

            }
        );

    }

    /**
     * Actualizar ubicación
     */
    async updateLocation(
        location
    ) {

        return new Promise(
            (resolve, reject) => {

                const store =
                    this.getStore(
                        "readwrite"
                    );

                const request =
                    store.put(
                        location
                    );

                request.onsuccess =
                    () =>
                        resolve();

                request.onerror =
                    () =>
                        reject(
                            request.error
                        );

            }
        );

    }

    /**
     * Eliminar ubicación
     */
    async deleteLocation(id) {

        return new Promise(
            (resolve, reject) => {

                const store =
                    this.getStore(
                        "readwrite"
                    );

                const request =
                    store.delete(
                        Number(id)
                    );

                request.onsuccess =
                    () =>
                        resolve();

                request.onerror =
                    () =>
                        reject(
                            request.error
                        );

            }
        );

    }

    /**
     * Buscar por texto
     */
    async searchLocations(
        searchText
    ) {

        const locations =
            await this.getAllLocations();

        const term =
            searchText
                .toLowerCase()
                .trim();

        return locations.filter(
            location => {

                return (

                    location.place
                        ?.toLowerCase()
                        .includes(term)

                    ||

                    location.province
                        ?.toLowerCase()
                        .includes(term)

                    ||

                    location.notes
                        ?.toLowerCase()
                        .includes(term)

                );

            }
        );

    }

    /**
     * Obtener últimas ubicaciones
     */
    async getRecentLocations(
        limit = 50
    ) {

        const locations =
            await this.getAllLocations();

        return locations
            .sort(
                (
                    a,
                    b
                ) =>

                    b.timestamp -
                    a.timestamp

            )
            .slice(
                0,
                limit
            );

    }

    /**
     * Eliminar todas
     */
    async clearAll() {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const store =
                    this.getStore(
                        "readwrite"
                    );

                const request =
                    store.clear();

                request.onsuccess =
                    () =>
                        resolve();

                request.onerror =
                    () =>
                        reject(
                            request.error
                        );

            }
        );

    }

}

/**
 * Instancia global
 */
const gpsDB =
    new GPSDatabase();
