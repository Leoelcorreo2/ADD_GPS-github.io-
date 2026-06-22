const CACHE_NAME = "gps-pro-v1";

const FILES = [

    "./",

    "./index.html",

    "./css/app.css",

    "./css/mobile.css",

    "./css/dark.css",

    "./js/app.js",

    "./js/db.js",

    "./js/gps.js",

    "./js/geocoder.js",

    "./js/map.js",

    "./js/csv.js",

    "./js/settings.js",

    "./js/ui.js",

    "./manifest.json"

];

self.addEventListener(

    "install",

    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(
                cache =>
                    cache.addAll(
                        FILES
                    )
            )

        );

    }

);

self.addEventListener(

    "fetch",

    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(

                response =>

                    response ||

                    fetch(
                        event.request
                    )

            )

        );

    }

);
