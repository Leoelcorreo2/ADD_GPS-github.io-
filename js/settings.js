/**
 * ==========================================
 * settings.js
 * Configuración de la aplicación
 * Registro GPS Pro
 * ==========================================
 */

class SettingsManager {

    constructor() {

        this.storageKey = "gps_pro_settings";

        this.defaults = {

            theme: "auto",

            gpsHighAccuracy: true,

            gpsTimeout: 15000,

            gpsMaximumAge: 0,

            autoExport: false

        };

        this.settings =
            this.load();

    }

    load() {

        try {

            const saved =
                localStorage.getItem(
                    this.storageKey
                );

            if (!saved) {

                return {
                    ...this.defaults
                };

            }

            return {

                ...this.defaults,

                ...JSON.parse(saved)

            };

        }
        catch {

            return {
                ...this.defaults
            };

        }

    }

    save() {

        localStorage.setItem(

            this.storageKey,

            JSON.stringify(
                this.settings
            )

        );

    }

    get(key) {

        return this.settings[key];

    }

    set(key, value) {

        this.settings[key] = value;

        this.save();

    }

    applyTheme() {

        const theme =
            this.settings.theme;

        if (theme === "dark") {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "dark"
                );

            return;
        }

        if (theme === "light") {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "light"
                );

            return;
        }

        document.documentElement
            .removeAttribute(
                "data-theme"
            );

    }

    toggleTheme() {

        const current =
            this.settings.theme;

        if (current === "dark") {

            this.settings.theme =
                "light";

        } else {

            this.settings.theme =
                "dark";

        }

        this.save();

        this.applyTheme();

    }

}

const settingsManager =
    new SettingsManager();
