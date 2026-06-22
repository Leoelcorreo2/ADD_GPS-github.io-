/**
 * ==========================================
 * map.js
 * Gestión del mapa Leaflet
 * Registro GPS Pro
 * ==========================================
 */

class MapManager {

    constructor() {

        this.map = null;

        this.markers = [];

        this.currentMarker = null;

        this.defaultZoom = 16;

    }

    /**
     * Inicializa mapa
     */
    init() {

        if (this.map) {
            return;
        }

        this.map = L.map(
            "mapContainer",
            {
                zoomControl: true
            }
        );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 20,
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(this.map);

        this.map.setView(
            [40.4168, -3.7038],
            6
        );

    }

    /**
     * Centrar mapa
     */
    centerMap(
        latitude,
        longitude,
        zoom = this.defaultZoom
    ) {

        if (!this.map) {
            return;
        }

        this.map.setView(
            [
                latitude,
                longitude
            ],
            zoom
        );

    }

    /**
     * Mostrar posición actual
     */
    showCurrentLocation(
        latitude,
        longitude
    ) {

        if (!this.map) {
            return;
        }

        if (this.currentMarker) {

            this.map.removeLayer(
                this.currentMarker
            );

        }

        this.currentMarker =
            L.marker(
                [
                    latitude,
                    longitude
                ]
            )
            .addTo(
                this.map
            )
            .bindPopup(
                `
                <strong>
                    Posición actual
                </strong>
                <br>
                Lat:
                ${latitude}
                <br>
                Lon:
                ${longitude}
                `
            );

        this.centerMap(
            latitude,
            longitude
        );

    }

    /**
     * Elimina marcadores
     */
    clearMarkers() {

        this.markers.forEach(
            marker => {

                this.map.removeLayer(
                    marker
                );

            }
        );

        this.markers = [];

    }

    /**
     * Añadir marcador
     */
    addMarker(
        location
    ) {

        const marker =
            L.marker(
                [
                    location.latitude,
                    location.longitude
                ]
            )
            .addTo(
                this.map
            );

        marker.bindPopup(
            this.buildPopup(
                location
            )
        );

        this.markers.push(
            marker
        );

        return marker;

    }

    /**
     * Crear popup
     */
    buildPopup(
        location
    ) {

        return `
            <div class="popup">

                <strong>
                    ${location.place || "Ubicación"}
                </strong>

                <br>

                ${location.province || ""}

                <hr>

                Lat:
                ${location.latitude}

                <br>

                Lon:
                ${location.longitude}

                <br>

                Alt:
                ${location.altitude || "N/D"} m

                <br>

                ${location.date}

                ${location.time}

            </div>
        `;

    }

    /**
     * Cargar todas las ubicaciones
     */
    async loadLocations() {

        if (!this.map) {
            return;
        }

        this.clearMarkers();

        const locations =
            await gpsDB.getAllLocations();

        locations.forEach(
            location => {

                this.addMarker(
                    location
                );

            }
        );

        if (
            locations.length > 0
        ) {

            this.fitToLocations(
                locations
            );

        }

    }

    /**
     * Ajustar zoom
     */
    fitToLocations(
        locations
    ) {

        if (
            locations.length === 0
        ) {
            return;
        }

        const bounds =
            L.latLngBounds(
                locations.map(
                    location => [

                        location.latitude,
                        location.longitude

                    ]
                )
            );

        this.map.fitBounds(
            bounds,
            {
                padding: [40, 40]
            }
        );

    }

    /**
     * Abrir ubicación
     */
    focusLocation(
        location
    ) {

        this.centerMap(
            location.latitude,
            location.longitude,
            18
        );

    }

    /**
     * Refrescar mapa
     */
    async refresh() {

        await this.loadLocations();

    }

    /**
     * Mostrar ruta futura
     */
    drawRoute(
        coordinates
    ) {

        return L.polyline(
            coordinates,
            {
                color: "#1565C0",
                weight: 4
            }
        ).addTo(
            this.map
        );

    }

}
