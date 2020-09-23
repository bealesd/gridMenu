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
            this.positionMenuItems();

            this.moveMenuChildrenToContainers();
            this.createSubmMenuExpanders();

            this.positionSubMenuItems();
            this.positionChildMenuItems();

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
            document.querySelectorAll(`.menu`).forEach((menu) => {
                const col = parseInt(menu.dataset.col);

                menu.style.gridRow = `1 / span 1`;
                menu.style.gridColumn = `${col} / span 1`;
            });
        }

        positionSubMenuItems() {
            document.querySelectorAll(`.subMenu`).forEach((subMenu) => {
                subMenu.querySelectorAll(`.subMenuItem`).forEach((subMenuItem) => {
                    const row = parseInt(subMenuItem.dataset.row);
                    subMenuItem.style.gridRow = `${row} / span 1`;
                    subMenuItem.style.gridColumn = `1 / span 1`;
                    subMenuItem.classList.add('hidden');
                });
            });
        }

        positionChildMenuItems() {
            document.querySelectorAll(`.subMenu`).forEach((subMenu) => {
                subMenu.querySelectorAll(`.childMenuItem`).forEach((childMenuItem) => {
                    const subRow = parseInt(childMenuItem.dataset.row);
                    const parentRow = parseInt(childMenuItem.dataset.parentRow);
                    const col = 2;
                    const row = parentRow + subRow - 1;
                    childMenuItem.style.gridRow = `${row} / span 1`;
                    childMenuItem.style.gridColumn = `${col} / span 1`;
                    childMenuItem.classList.add('hidden');

                });
            });
        }

        onMenuClick() {
            const menus = document.querySelectorAll('.menu');
            menus.forEach((menu) => {
                menu.addEventListener('click', () => {
                    const menuShown = menu.dataset.show === 'true';
                    const col = parseInt(menu.dataset.col);

                    const subMenuItem = document.querySelector(`.subMenu[data-col="${col}"]`);

                    // move all subMenus to the rear
                    document.querySelectorAll(`.subMenu`).forEach((subMenu) => {
                        subMenu.style.zIndex = -1;
                    });

                    // move subMenu to front
                    subMenuItem.style.zIndex = 12;

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

                    if (menuShown) {
                        menu.dataset.show = 'false';
                        subMenuItem.style.zIndex = -1;
                    } else if (!menuShown) {
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

            this.getSubMenuItemChildren(subMenuItem).forEach(childItem => childItem.classList.add('hidden'));
        }

        showSubMenuItemChildren(subMenuItem) {
            if (!this.subMenuItemHasChidlren(subMenuItem)) return;

            const subMenuSpan = subMenuItem.querySelector('span');
            subMenuSpan.classList.add('down');
            subMenuSpan.classList.remove('up');
            subMenuSpan.innerHTML = '-';

            this.getSubMenuItemChildren(subMenuItem).forEach((childItem) => childItem.classList.remove('hidden'));
        }

        createSubmMenuExpanders() {
            document.querySelectorAll('.subMenuItem').forEach((subMenuItem) => {
                if (!this.subMenuItemHasChidlren(subMenuItem)) return;
                this.insertContent(subMenuItem, 0, '', '<span class="up">+</span>');
                // subMenuItem.innerHTML += '<span class="up">+</span>';
            });
        }

        onSubMenuClick() {
            document.querySelectorAll('.subMenuItem').forEach((subMenuItem) => {
                if (!this.subMenuItemHasChidlren(subMenuItem)) return;
                subMenuItem.addEventListener('click', () => {
                    if (this.isSunMenuOpen(subMenuItem)) this.hideSubMenuItemChildren(subMenuItem);
                    else this.showSubMenuItemChildren(subMenuItem);;
                });

            });
        }

        getCssProp = (prop) => getComputedStyle(document.body.parentElement).getPropertyValue(`--${prop}`);
        getPixelCssProp = (prop) => this.pixelToNumber(this.getCssProp(prop));
        pixelToNumber = (pixel) => parseInt(pixel.trim().split('px')[0]);

        moveMenuChildrenToContainers() {
            const menuHeight = document.querySelector('.menu').offsetHeight;
            const app = document.querySelector('#app');

            const menuColumnsCount = document.querySelectorAll('.menu').length;
            for (let i = 1; i <= menuColumnsCount; i++) {
                const menuItem = document.querySelector(`.menu[data-col="${i}"]`);
                const childItemsForMenuItem = document.querySelectorAll(`[data-col="${i}"].subMenuItem,[data-parent-col="${i}"].childMenuItem`);

                const div = document.createElement('div');

                const rowheight = this.getPixelCssProp('header-vertical-padding') * 2 +
                    this.getPixelCssProp('header-font-size') +
                    this.getPixelCssProp('header-border-size');

                childItemsForMenuItem.forEach((item) => {
                    div.appendChild(item);
                });

                div.dataset.col = i;
                div.className = 'subMenu';
                div.style.marginTop = `${menuHeight}px`;
                div.style.display = 'grid';
                div.style.gridTemplateRows = `repeat(20, ${rowheight}px)`;
                div.style.left = `${menuItem.offsetLeft}px`;
                div.style.zIndex = -1;
                div.style.position = 'fixed';
                div.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
                div.style.fontSize = this.getPixelCssProp('header-font-size');

                this.insertContent(app, i - 1, 'before', div);
            }
        }

        insertContent(parentElement, position, beforeOrAfter, htmlElement) {
            if (!this.isHtmlELement(htmlElement) && !this.isString(htmlElement))
                return;

            if (!this.isHtmlELement(htmlElement) && this.isString(htmlElement)) {
                const innerHtml = htmlElement;
                htmlElement = document.createElement('div');
                htmlElement.innerHTML = innerHtml;
                htmlElement = htmlElement.children[0];
            }

            const children = parentElement.children;
            if (children.length === 0)
                parentElement.appendChild(htmlElement);
            else if (beforeOrAfter.toLocaleLowerCase() === 'after')
                parentElement.children[position].insertAdjacentElement('afterEnd', htmlElement);
            else
                parentElement.children[position].insertAdjacentElement('beforeBegin', htmlElement);
        }

        promoteChildren(htmlElement) {
            htmlElement.replaceWith(...htmlElement.childNodes);
        }

        isHtmlELement = (value) =>
            (Object.prototype.toString.call(value).includes('[object HTML') &&
                Object.prototype.toString.call(value).includes('Element]')) ||
            value instanceof HTMLElement;


        isString = (value) => Object.prototype.toString.call(value) === '[object String]';


    }
    return new GridMenu();
}()