/**
 * ==========================================
 * csv.js
 * Gestión CSV
 * Registro GPS Pro
 * ==========================================
 */

class CSVManager {

    constructor() {

        this.separator = ";";

        this.headers = [

            "longitud",
            "latitud",
            "altitud",
            "fecha",
            "hora",
            "provincia",
            "lugar",
            "notas"

        ];

    }

    /**
     * Exportar registros
     */
    async exportCSV() {

        try {

            const locations =
                await gpsDB.getAllLocations();

            let csv =
                this.headers.join(
                    this.separator
                ) + "\n";

            locations.forEach(
                location => {

                    csv += [

                        location.longitude ?? "",
                        location.latitude ?? "",
                        location.altitude ?? "",
                        location.date ?? "",
                        location.time ?? "",
                        location.province ?? "",
                        location.place ?? "",
                        location.notes ?? ""

                    ]
                    .map(
                        value =>
                            this.escapeCSV(
                                value
                            )
                    )
                    .join(
                        this.separator
                    ) + "\n";

                }
            );

            this.downloadCSV(
                csv
            );

            return true;

        }
        catch (error) {

            console.error(
                error
            );

            return false;

        }

    }

    /**
     * Escapar valores
     */
    escapeCSV(
        value
    ) {

        const text =
            String(
                value
            );

        if (

            text.includes(
                this.separator
            )

            ||

            text.includes(
                '"'
            )

            ||

            text.includes(
                "\n"
            )

        ) {

            return `"${text.replaceAll('"', '""')}"`;

        }

        return text;

    }

    /**
     * Descargar CSV
     */
    downloadCSV(
        csvContent
    ) {

        const blob =
            new Blob(
                [
                    "\uFEFF" +
                    csvContent
                ],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        const now =
            new Date();

        const fileName =
            `ubicaciones_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}.csv`;

        link.href = url;

        link.download =
            fileName;

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        URL.revokeObjectURL(
            url
        );

    }

    /**
     * Leer CSV
     */
    async importCSV(
        file,
        overwrite = false
    ) {

        try {

            const content =
                await file.text();

            const records =
                this.parseCSV(
                    content
                );

            if (
                overwrite
            ) {

                await gpsDB.clearAll();

            }

            for (
                const record
                of records
            ) {

                await gpsDB.addLocation(
                    record
                );

            }

            return {

                success: true,

                imported:
                    records.length

            };

        }
        catch (error) {

            console.error(
                error
            );

            return {

                success: false,

                error:
                    error.message

            };

        }

    }

    /**
     * Parse CSV
     */
    parseCSV(
        content
    ) {

        const lines =
            content
                .trim()
                .split(
                    /\r?\n/
                );

        if (
            lines.length < 2
        ) {

            throw new Error(
                "CSV vacío"
            );

        }

        const header =
            lines[0]
                .split(
                    this.separator
                )
                .map(
                    h =>
                        h.trim()
                        .toLowerCase()
                );

        this.validateHeader(
            header
        );

        const records = [];

        for (
            let i = 1;
            i < lines.length;
            i++
        ) {

            const cols =
                lines[i]
                    .split(
                        this.separator
                    );

            if (
                cols.length < 8
            ) {

                continue;

            }

            records.push({

                longitude:
                    parseFloat(
                        cols[0]
                    ),

                latitude:
                    parseFloat(
                        cols[1]
                    ),

                altitude:
                    parseFloat(
                        cols[2]
                    ),

                date:
                    cols[3],

                time:
                    cols[4],

                province:
                    cols[5],

                place:
                    cols[6],

                notes:
                    cols[7],

                timestamp:
                    Date.now()

            });

        }

        return records;

    }

    /**
     * Validar cabecera
     */
    validateHeader(
        header
    ) {

        const expected =
            this.headers;

        const valid =
            expected.every(
                column =>
                    header.includes(
                        column
                    )
            );

        if (
            !valid
        ) {

            throw new Error(
                "Formato CSV incorrecto"
            );

        }

    }

    /**
     * Generar CSV desde array
     */
    generateCSVString(
        locations
    ) {

        let csv =
            this.headers.join(
                ";"
            ) + "\n";

        locations.forEach(
            location => {

                csv += [

                    location.longitude,
                    location.latitude,
                    location.altitude,
                    location.date,
                    location.time,
                    location.province,
                    location.place,
                    location.notes

                ].join(
                    ";"
                ) + "\n";

            }
        );

        return csv;

    }

    /**
     * Exportar una ubicación
     */
    exportSingleLocation(
        location
    ) {

        const csv =
            this.generateCSVString(
                [location]
            );

        this.downloadCSV(
            csv
        );

    }

    /**
     * Crear backup
     */
    async createBackup() {

        const locations =
            await gpsDB.getAllLocations();

        const backup = {

            version: 1,

            created:
                new Date()
                .toISOString(),

            records:
                locations

        };

        return backup;

    }

}
