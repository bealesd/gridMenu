GridMenu = function() {
    class GridMenu {
        constructor() {
            this.loadRobotoFont();
            const href = 'https://cdn.jsdelivr.net/gh/bealesd/GridMenu/grid-menu.min.css';
            this.loadCss(href);
        }

        loadRobotoFont() {
            const link = document.createElement("link");

            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen,print";
            link.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap";

            document.querySelector("head").appendChild(link);
        }

        loadCss(href) {
            const link = document.createElement("link");

            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen,print";
            link.href = href;

            document.querySelector("head").appendChild(link);
        }

        setup(rowHeight, colWidth, padding) {
            this.createHeaderBackground();
            this.setGridDimensions(rowHeight, colWidth, padding);
            this.positionOfSubMenuItems();
            this.positionOfChildMenuItems();
            this.onMenuClick();
            this.onSubMenuClick();
        }

        createHeaderBackground() {
            const headerBackground = document.createElement("div");
            headerBackground.id = 'headerBackground';

            const app = document.querySelector('#app');
            app.insertBefore(headerBackground, app.children[0]);
        }

        setGridDimensions(rowHeight, colWidth, padding) {
            const headerGrid = document.querySelector('#headerGrid');
            headerGrid.style.gridTemplateColumns = `repeat(20, ${colWidth})`;
            headerGrid.style.gridTemplateRows = `repeat(20, ${rowHeight})`;

            document.querySelectorAll('#headerGrid>div').forEach((div) => {
                div.style.padding = padding;
            });
        }

        positionMenuItems() {
            document.querySelectorAll(`.menu`).forEach((subMenuItem) => {
                const col = parseInt(menu.dataset.col);

                subMenuItem.style.gridRow = `1 / span 1`;
                subMenuItem.style.gridColumn = `${col} / span 1`;
            });
        }

        positionOfSubMenuItems() {
            document.querySelectorAll(`.subMenuItem`).forEach((subMenuItem) => {
                const row = parseInt(subMenuItem.dataset.row) + 1;
                const col = parseInt(subMenuItem.dataset.col);

                subMenuItem.style.gridRow = `${row} / span 1`;
                subMenuItem.style.gridColumn = `${col} / span 1`;
                subMenuItem.classList.add('hidden');
            });
        }

        positionOfChildMenuItems() {
            document.querySelectorAll(`.childMenuItem`).forEach((childMenuItem) => {
                const subRow = parseInt(childMenuItem.dataset.row);
                const parentRow = parseInt(childMenuItem.dataset.parentRow);

                const col = parseInt(childMenuItem.dataset.parentCol) + 1;

                const row = parentRow + subRow;
                childMenuItem.style.gridRow = `${row} / span 1`;
                childMenuItem.style.gridColumn = `${col} / span 1`;
                childMenuItem.classList.add('hidden');
            });
        }

        onMenuClick() {
            const menus = document.querySelectorAll('.menu');
            menus.forEach((menu) => {
                menu.addEventListener('click', () => {
                    const shown = menu.dataset.show;

                    const col = parseInt(menu.dataset.col);

                    const menuItems = document.querySelectorAll(`[data-parent-col="${col}"],[data-col="${col}"][class*="subMenuItem"]`);

                    // clear all menu items
                    document.querySelectorAll(`[data-parent-col],[data-col][class*="subMenuItem"]`).forEach((subMenuItem) => {
                        subMenuItem.classList.add('hidden');
                    });
                    // turn off all menus
                    menus.forEach((menu) => {
                        menu.dataset.show = 'false';
                    });

                    // turning off menu items
                    if (shown === 'true') {
                        menu.dataset.show = 'false';
                    }
                    // turn on menu items
                    else if (shown === 'false') {
                        menuItems.forEach((elem) => {
                            if (elem.classList.contains('subMenuItem')) {
                                elem.classList.remove('hidden');
                            }
                        });
                        menu.dataset.show = 'true';
                    }

                });
            });

        }

        onSubMenuClick() {
            document.querySelectorAll('.subMenuItem').forEach((subMenuItem) => {
                subMenuItem.addEventListener('click', () => {
                    const col = parseInt(subMenuItem.dataset.col);
                    const row = parseInt(subMenuItem.dataset.row);
                    const childItems = document.querySelectorAll(`[data-parent-row="${row}"][data-parent-col="${col}"]`);

                    childItems.forEach((childItem) => {
                        if (childItem.classList.contains('hidden')) {
                            childItem.classList.remove('hidden');
                        } else {
                            childItem.classList.add('hidden');
                        }
                    });
                });
            });
        }

    }
    return new GridMenu();
}()