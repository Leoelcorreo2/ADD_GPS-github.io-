/**
 * ==========================================
 * app.js
 * Bootstrap aplicación
 * ==========================================
 */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await gpsDB.init();

        settingsManager.applyTheme();

        uiManager.initNavigation();

        mapManager.init();

        await uiManager.renderLocations();

        try {

            const position =
                await gpsManager
                    .getCurrentPosition();

            gpsManager.updateUI(
                position
            );

            mapManager.showCurrentLocation(
                position.latitude,
                position.longitude
            );

        }
        catch (error) {

            console.error(
                error
            );

        }

        document
            .getElementById(
                "btnLocate"
            )
            .addEventListener(
                "click",

                async () => {

                    const position =
                        await gpsManager
                            .getCurrentPosition();

                    gpsManager.updateUI(
                        position
                    );

                    mapManager.showCurrentLocation(
                        position.latitude,
                        position.longitude
                    );

                }

            );

        document
            .getElementById(
                "btnAddLocation"
            )
            .addEventListener(
                "click",

                async () => {

                    const position =
                        await gpsManager
                            .getCurrentPosition();

                    const geoData =
                        await geocoder
                            .reverseGeocode(

                                position.latitude,

                                position.longitude

                            );

                    const location =
                        gpsManager
                            .createLocationRecord(

                                position,

                                geoData.province,

                                geoData.municipality,

                                ""

                            );

                    await gpsDB
                        .addLocation(
                            location
                        );

                    await uiManager
                        .renderLocations();

                    await mapManager
                        .refresh();

                }

            );

        document
            .getElementById(
                "btnExportCSV"
            )
            .addEventListener(
                "click",

                async () => {

                    await csvManager
                        .exportCSV();

                }

            );

        document
            .getElementById(
                "btnToggleDarkMode"
            )
            .addEventListener(
                "click",

                () => {

                    settingsManager
                        .toggleTheme();

                }

            );

    }

);

if (
    "serviceWorker"
    in navigator
) {

    navigator.serviceWorker
        .register(
            "./sw.js"
        );

}
