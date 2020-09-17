GridMenu = function() {
    class GridMenu {
        //TODO remove margin, add small column 20px
        //TODO remove inner sub menu divide lines, allow user to specify a line, or use a line break?
        constructor() {
            this.loadRobotoFont();
            const href = 'https://cdn.jsdelivr.net/gh/bealesd/GridMenu@latest/grid-menu.min.css';
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

        setup(rowHeight, colWidth) {
            this.createHeaderBackground();
            this.setGridDimensions(rowHeight, colWidth);
            this.positionOfSubMenuItems();
            this.positionOfChildMenuItems();
            this.addSubMenuBorders();
            this.onMenuClick();
            this.onSubMenuClick();
        }

        addSubMenuBorders() {
            const subMenuItems = document.querySelectorAll("[data-col].subMenuItem");
            const rowCountPerCoulumn = {};
            [...subMenuItems].map(elem => parseInt(elem.dataset.col)).
            forEach((num) => {
                if (rowCountPerCoulumn.hasOwnProperty(num))
                    rowCountPerCoulumn[num] = rowCountPerCoulumn[num] + 1;
                else
                    rowCountPerCoulumn[num] = 1;
            })
            for (let i = 0; i < Object.keys(rowCountPerCoulumn).length; i++) {
                const column = Object.keys(rowCountPerCoulumn)[i];
                const maxRow = rowCountPerCoulumn[column];

                const lastRow = document.querySelector(`[data-row='${maxRow}'][data-col='${column}'].subMenuItem`);
                lastRow.style.borderBottom = '1px solid black';
            }
        }

        createHeaderBackground() {
            const headerBackground = document.createElement("div");
            headerBackground.id = 'headerBackground';

            const app = document.querySelector('#app');
            app.insertBefore(headerBackground, app.children[0]);
        }

        setGridDimensions(rowHeight, colWidth) {
            const headerGrid = document.querySelector('#headerGrid');
            headerGrid.style.gridTemplateColumns = `repeat(20, ${colWidth})`;
            headerGrid.style.gridTemplateRows = `repeat(20, ${rowHeight})`;
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