GridMenu = function() {
    class GridMenu {
        constructor() {
            this.loadRobotoFont();
            const href = 'https://cdn.jsdelivr.net/gh/bealesd/GridMenu@latest/grid-menu.min.css';
            // const href = 'grid-menu.css';
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

        setup() {
            this.createHeaderBackground();
            this.positionOfSubMenuItems();
            this.positionOfChildMenuItems();
            this.addSubMenuBorders();
            this.addChildMenuBorders();
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

        addChildMenuBorders() {
            const childMenuItems = document.querySelectorAll(".childMenuItem");
            const rowCountPerCoulumn = {};
            [...childMenuItems].map(elem => { return { 'col': elem.dataset.parentCol, 'row': elem.dataset.parentRow } })
                .forEach((json) => {
                    const key = `${json.row}-${json.col}`;
                    if (rowCountPerCoulumn.hasOwnProperty(key))
                        rowCountPerCoulumn[key] = rowCountPerCoulumn[key] + 1;
                    else
                        rowCountPerCoulumn[key] = 1;
                })
            for (let i = 0; i < Object.keys(rowCountPerCoulumn).length; i++) {
                const rowColKey = Object.keys(rowCountPerCoulumn)[i];
                const maxRow = rowCountPerCoulumn[rowColKey];
                const parentRow = rowColKey.split('-')[0];
                const parentCol = rowColKey.split('-')[1];

                const lastRow = document.querySelector(`[data-row='${maxRow}'][data-parent-row='${parentRow}'][data-parent-col='${parentCol}'].childMenuItem`);
                lastRow.style.borderBottom = '1px solid black';

                if (parentRow > 1) {
                    const firstRow = document.querySelector(`[data-row='1'][data-parent-row='${parentRow}'][data-parent-col='${parentCol}'].childMenuItem`);
                    firstRow.style.borderTop = '1px solid black';
                }

                const subMenuRowCount = document.querySelectorAll(`[data-col='${parentCol}'].subMenuItem`).length;
                for (let j = 0; j < maxRow; j++) {
                    const actualRow = parseInt(parentRow) + j;
                    if (actualRow > subMenuRowCount) {
                        const currentRow = document.querySelector(`[data-row='${++j}'][data-parent-row='${parentRow}'][data-parent-col='${parentCol}'].childMenuItem`);
                        currentRow.style.borderLeft = '1px solid black';
                        currentRow.style.marginLeft = '-1px';
                    }
                }
            }
        }

        createHeaderBackground() {
            const headerBackground = document.createElement("div");
            headerBackground.id = 'headerBackground';

            const app = document.querySelector('#app');
            app.insertBefore(headerBackground, app.children[0]);
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
                    const menuShown = menu.dataset.show === 'true';
                    const col = parseInt(menu.dataset.col);
                    const menuItems = document.querySelectorAll(`[data-parent-col="${col}"],[data-col="${col}"][class*="subMenuItem"]`);

                    // clear all menu items
                    document.querySelectorAll(`[data-parent-col],[data-col][class*="subMenuItem"]`).forEach((subMenuItem) => {
                        subMenuItem.classList.add('hidden');
                        this.hideSubMenuItemChildren(subMenuItem);
                    });
                    // turn off all menus
                    menus.forEach((menu) => {
                        menu.dataset.show = 'false';
                    });

                    if (menuShown) menu.dataset.show = 'false';
                    else if (!menuShown) {
                        menuItems.forEach((elem) => {
                            if (elem.classList.contains('subMenuItem'))
                                elem.classList.remove('hidden');
                        });
                        menu.dataset.show = 'true';
                    }
                });
            });
        }

        isSunMenuOpen(subMenuItem) {
            const subMenuSpan = subMenuItem.querySelector('span');
            return subMenuSpan.classList.contains('down');
        }

        subMenuItemHasChidlren(subMenuItem) {
            return this.getSubMenuItemChildren(subMenuItem).length > 0;
        }

        getSubMenuItemChildren(subMenuItem) {
            const col = parseInt(subMenuItem.dataset.col);
            const row = parseInt(subMenuItem.dataset.row);
            return document.querySelectorAll(`[data-parent-row="${row}"][data-parent-col="${col}"]`);
        }

        hideSubMenuItemChildren(subMenuItem) {
            if (!this.subMenuItemHasChidlren(subMenuItem)) return;

            const subMenuSpan = subMenuItem.querySelector('span');
            subMenuSpan.classList.add('up');
            subMenuSpan.classList.remove('down');
            subMenuSpan.innerHTML = '+';

            this.getSubMenuItemChildren(subMenuItem).forEach((childItem) => {
                childItem.classList.add('hidden');
            });
        }

        showSubMenuItemChildren(subMenuItem) {
            if (!this.subMenuItemHasChidlren(subMenuItem)) return;

            const subMenuSpan = subMenuItem.querySelector('span');
            subMenuSpan.classList.add('down');
            subMenuSpan.classList.remove('up');
            subMenuSpan.innerHTML = '-';

            this.getSubMenuItemChildren(subMenuItem).forEach((childItem) => {
                childItem.classList.remove('hidden');
            });
        }

        onSubMenuClick() {
            document.querySelectorAll('.subMenuItem').forEach((subMenuItem) => {
                if (!this.subMenuItemHasChidlren(subMenuItem)) return;

                subMenuItem.innerHTML += '<span class="up">+</span>';
                subMenuItem.addEventListener('click', () => {
                    if (this.isSunMenuOpen(subMenuItem))
                        this.hideSubMenuItemChildren(subMenuItem);
                    else
                        this.showSubMenuItemChildren(subMenuItem);;
                });

            });
        }
    }
    return new GridMenu();
}()