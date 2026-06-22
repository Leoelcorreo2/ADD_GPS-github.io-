/**
 * ==========================================
 * gps.js
 * Gestión GPS Android
 * Registro GPS Pro
 * ==========================================
 */

class GPSManager {

    constructor() {

        this.watchId = null;

        this.currentPosition = null;

        this.isTracking = false;

    }

    /**
     * Verifica compatibilidad GPS
     */
    isSupported() {

        return (
            "geolocation" in navigator
        );

    }

    /**
     * Solicita permisos
     */
    async requestPermission() {

        if (
            !navigator.permissions
        ) {

            return true;

        }

        try {

            const result =
                await navigator.permissions.query(
                    {
                        name: "geolocation"
                    }
                );

            return (
                result.state === "granted"
                ||
                result.state === "prompt"
            );

        }
        catch {

            return true;

        }

    }

    /**
     * Obtiene posición única
     */
    async getCurrentPosition() {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                if (
                    !this.isSupported()
                ) {

                    reject(
                        new Error(
                            "GPS no soportado"
                        )
                    );

                    return;

                }

                navigator.geolocation.getCurrentPosition(

                    position => {

                        this.currentPosition =
                            this.formatPosition(
                                position
                            );

                        resolve(
                            this.currentPosition
                        );

                    },

                    error => {

                        reject(
                            this.handleError(
                                error
                            )
                        );

                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0
                    }

                );

            }
        );

    }

    /**
     * Inicia seguimiento continuo
     */
    startTracking(
        callback
    ) {

        if (
            this.isTracking
        ) {

            return;

        }

        this.watchId =
            navigator.geolocation.watchPosition(

                position => {

                    this.currentPosition =
                        this.formatPosition(
                            position
                        );

                    if (
                        callback
                    ) {

                        callback(
                            this.currentPosition
                        );

                    }

                },

                error => {

                    console.error(
                        this.handleError(
                            error
                        )
                    );

                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }

            );

        this.isTracking = true;

    }

    /**
     * Detiene seguimiento
     */
    stopTracking() {

        if (
            this.watchId !== null
        ) {

            navigator.geolocation.clearWatch(
                this.watchId
            );

            this.watchId = null;

            this.isTracking = false;

        }

    }

    /**
     * Formatea datos GPS
     */
    formatPosition(
        position
    ) {

        return {

            latitude:
                position.coords.latitude,

            longitude:
                position.coords.longitude,

            altitude:
                position.coords.altitude,

            accuracy:
                position.coords.accuracy,

            altitudeAccuracy:
                position.coords.altitudeAccuracy,

            heading:
                position.coords.heading,

            speed:
                position.coords.speed,

            timestamp:
                position.timestamp

        };

    }

    /**
     * Actualiza dashboard
     */
    updateUI(
        position
    ) {

        const lat =
            document.getElementById(
                "gpsLatitude"
            );

        const lon =
            document.getElementById(
                "gpsLongitude"
            );

        const alt =
            document.getElementById(
                "gpsAltitude"
            );

        const acc =
            document.getElementById(
                "gpsAccuracy"
            );

        if (
            lat
        ) {

            lat.textContent =
                position.latitude.toFixed(
                    6
                );

        }

        if (
            lon
        ) {

            lon.textContent =
                position.longitude.toFixed(
                    6
                );

        }

        if (
            alt
        ) {

            alt.textContent =
                position.altitude
                !== null
                    ? position.altitude.toFixed(
                        2
                    ) + " m"
                    : "N/D";

        }

        if (
            acc
        ) {

            acc.textContent =
                Math.round(
                    position.accuracy
                ) + " m";

        }

    }

    /**
     * Crea registro listo para BD
     */
    createLocationRecord(
        position,
        province = "",
        place = "",
        notes = ""
    ) {

        const now =
            new Date();

        return {

            longitude:
                position.longitude,

            latitude:
                position.latitude,

            altitude:
                position.altitude,

            date:
                now.toISOString()
                   .split("T")[0],

            time:
                now.toTimeString()
                   .split(" ")[0],

            province,

            place,

            notes,

            timestamp:
                Date.now()

        };

    }

    /**
     * Gestión de errores
     */
    handleError(
        error
    ) {

        switch (
            error.code
        ) {

            case error.PERMISSION_DENIED:

                return new Error(
                    "Permiso GPS denegado"
                );

            case error.POSITION_UNAVAILABLE:

                return new Error(
                    "Posición no disponible"
                );

            case error.TIMEOUT:

                return new Error(
                    "Tiempo de espera agotado"
                );

            default:

                return new Error(
                    "Error GPS desconocido"
                );

        }

    }

}

/**
 * Instancia global
 */
const gpsManager =
    new GPSManager();
