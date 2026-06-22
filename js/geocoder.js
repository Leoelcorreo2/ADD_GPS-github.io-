/**
 * ==========================================
 * geocoder.js
 * Geocodificación inversa
 * Registro GPS Pro
 * ==========================================
 */

class GeocoderManager {

    constructor() {

        this.baseUrl =
            "https://nominatim.openstreetmap.org/reverse";

    }

    /**
     * Obtiene dirección desde coordenadas
     */
    async reverseGeocode(
        latitude,
        longitude
    ) {

        try {

            const url =
                `${this.baseUrl}?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;

            const response =
                await fetch(
                    url,
                    {
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );

            if (
                !response.ok
            ) {

                throw new Error(
                    "Error consultando Nominatim"
                );

            }

            const data =
                await response.json();

            return this.parseResult(
                data
            );

        }
        catch (error) {

            console.error(
                "Error geocodificando:",
                error
            );

            return this.emptyResult();

        }

    }

    /**
     * Procesa respuesta
     */
    parseResult(
        data
    ) {

        const address =
            data.address || {};

        return {

            province:
                address.state ||
                address.province ||
                "",

            municipality:
                address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                "",

            postcode:
                address.postcode ||
                "",

            country:
                address.country ||
                "",

            street:
                address.road ||
                "",

            houseNumber:
                address.house_number ||
                "",

            displayName:
                data.display_name ||
                "",

            raw:
                data

        };

    }

    /**
     * Resultado vacío
     */
    emptyResult() {

        return {

            province: "",
            municipality: "",
            postcode: "",
            country: "",
            street: "",
            houseNumber: "",
            displayName: "",
            raw: null

        };

    }

    /**
     * Devuelve texto amigable
     */
    formatLocation(
        geoData
    ) {

        const parts = [];

        if (
            geoData.street
        ) {

            let street =
                geoData.street;

            if (
                geoData.houseNumber
            ) {

                street +=
                    " " +
                    geoData.houseNumber;

            }

            parts.push(
                street
            );

        }

        if (
            geoData.municipality
        ) {

            parts.push(
                geoData.municipality
            );

        }

        if (
            geoData.province
        ) {

            parts.push(
                geoData.province
            );

        }

        return parts.join(
            ", "
        );

    }

    /**
     * Obtiene provincia
     */
    async getProvince(
        latitude,
        longitude
    ) {

        const result =
            await this.reverseGeocode(
                latitude,
                longitude
            );

        return result.province;

    }

    /**
     * Obtiene municipio
     */
    async getMunicipality(
        latitude,
        longitude
    ) {

        const result =
            await this.reverseGeocode(
                latitude,
                longitude
            );

        return result.municipality;

    }

    /**
     * Obtiene dirección completa
     */
    async getFullAddress(
        latitude,
        longitude
    ) {

        const result =
            await this.reverseGeocode(
                latitude,
                longitude
            );

        return result.displayName;

    }

}
