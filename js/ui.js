/**
 * ==========================================
 * ui.js
 * Gestión visual
 * ==========================================
 */

class UIManager {

    constructor() {

        this.currentPage =
            "dashboard";

    }

    initNavigation() {

        document
            .querySelectorAll(
                ".bottom-nav button"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",

                        () => {

                            this.showPage(
                                button.dataset.page
                            );

                        }

                    );

                }
            );

    }

    showPage(pageId) {

        document
            .querySelectorAll(
                ".page"
            )
            .forEach(
                page =>
                    page.classList.remove(
                        "active"
                    )
            );

        document
            .getElementById(
                pageId
            )
            .classList.add(
                "active"
            );

        this.currentPage =
            pageId;

        if (
            pageId === "map"
        ) {

            setTimeout(
                () => {

                    if (
                        mapManager.map
                    ) {

                        mapManager.map.invalidateSize();

                    }

                },
                300
            );

        }

    }

    async renderLocations() {

        const container =
            document.getElementById(
                "locationsList"
            );

        const locations =
            await gpsDB.getRecentLocations(
                500
            );

        container.innerHTML = "";

        locations.forEach(
            location => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "location-card";

                card.innerHTML = `

                    <h3>
                        ${location.place || "Sin nombre"}
                    </h3>

                    <p>
                        ${location.date}
                        ${location.time}
                    </p>

                    <p>
                        ${location.province}
                    </p>

                    <div class="location-actions">

                        <button
                            data-id="${location.id}"
                            class="edit-btn">

                            Editar

                        </button>

                    </div>

                `;

                container.appendChild(
                    card
                );

            }
        );

    }

}

const uiManager =
    new UIManager();
