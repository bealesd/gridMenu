GridMenu = function() {
    class GridMenu {
        constructor() {
            // const href = 'https://cdn.jsdelivr.net/gh/bealesd/GridMenu@latest/grid-menu.min.css';
            const href = 'grid-menu.css';
            this.loadCss(href);

            window.addEventListener("load", () => this.start());
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

        start() {
            this.determineDelcarationType(); //imperative declaritive

            this.moveBodyContent();

            this.moveMenuToContainer();
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

        determineDelcarationType() {

        }

        moveBodyContent() {
            const body = document.querySelector('body');
            const bodyContent = document.createElement('div');
            bodyContent.id = 'bodyContent';

            [...body.children].forEach((child, index) => {
                this.insertContent(bodyContent, index, child);
            });

            this.insertContent(body, 0, bodyContent);
        }

        moveMenuToContainer() {
            const menuItems = document.querySelectorAll(`.gm-menu`);

            const div = document.createElement('div');
            div.id = 'menuContainer';

            menuItems.forEach((menu) => {
                const col = parseInt(menu.dataset.col);
                menu.style.gridRow = `1 / span 1`;
                menu.style.gridColumn = `${col} / span 1`;
                this.insertContent(div, col - 1, menu);
            });

            let body = document.querySelector('body');
            this.insertContent(body, 0, div);
        }

        addSubMenuBorders() {
            const subMenuItems = document.querySelectorAll("[data-col].gm-sub-menu-item");
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

                const lastRow = document.querySelector(`[data-row='${maxRow}'][data-col='${column}'].gm-sub-menu-item`);
                lastRow.style.borderBottom = '1px solid black';
            }
        }

        addChildMenuBorders() {
            const childMenuItems = document.querySelectorAll(".gm-child-menu-item");
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

                const lastRow = document.querySelector(`[data-row='${maxRow}'][data-parent-row='${parentRow}'][data-parent-col='${parentCol}'].gm-child-menu-item`);
                lastRow.style.borderBottom = '1px solid black';

                if (parentRow > 1) {
                    const firstRow = document.querySelector(`[data-row='1'][data-parent-row='${parentRow}'][data-parent-col='${parentCol}'].gm-child-menu-item`);
                    firstRow.style.borderTop = '1px solid black';
                }

                const subMenuRowCount = document.querySelectorAll(`[data-col='${parentCol}'].gm-sub-menu-item`).length;
                for (let j = 0; j < maxRow; j++) {
                    const actualRow = parseInt(parentRow) + j;
                    if (actualRow > subMenuRowCount) {
                        const currentRow = document.querySelector(`[data-row='${++j}'][data-parent-row='${parentRow}'][data-parent-col='${parentCol}'].gm-child-menu-item`);
                        currentRow.style.borderLeft = '1px solid black';
                        currentRow.style.marginLeft = '-1px';
                    }
                }
            }
        }

        positionMenuItems() {
            document.querySelectorAll(`.gm-menu`).forEach((menu) => {
                const col = parseInt(menu.dataset.col);

                menu.style.gridRow = `1 / span 1`;
                menu.style.gridColumn = `${col} / span 1`;
            });
        }

        positionSubMenuItems() {
            document.querySelectorAll(`.subMenu`).forEach((subMenu) => {
                subMenu.querySelectorAll(`.gm-sub-menu-item`).forEach((subMenuItem) => {
                    const row = parseInt(subMenuItem.dataset.row);
                    subMenuItem.style.gridRow = `${row} / span 1`;
                    subMenuItem.style.gridColumn = `1 / span 1`;
                    subMenuItem.classList.add('hidden');
                });
            });
        }

        positionChildMenuItems() {
            document.querySelectorAll(`.subMenu`).forEach((subMenu) => {
                subMenu.querySelectorAll(`.gm-child-menu-item`).forEach((childMenuItem) => {
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
            const menus = document.querySelectorAll('.gm-menu');
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

                    const menuItems = document.querySelectorAll(`[data-parent-col="${col}"],[data-col="${col}"][class*="gm-sub-menu-item"]`);

                    // clear all menu items
                    document.querySelectorAll(`[data-parent-col],[data-col][class*="gm-sub-menu-item"]`).forEach((subMenuItem) => {
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
                            if (elem.classList.contains('gm-sub-menu-item'))
                                elem.classList.remove('hidden');
                        });
                        menu.dataset.show = 'true';
                    }
                });
            });
        }

        isSunMenuOpen = (subMenuItem) => subMenuItem.querySelector('span').classList.contains('down');

        subMenuItemHasChidlren = (subMenuItem) => this.getSubMenuItemChildren(subMenuItem).length > 0;

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
            document.querySelectorAll('.gm-sub-menu-item').forEach((subMenuItem) => {
                if (!this.subMenuItemHasChidlren(subMenuItem)) return;
                this.insertContent(subMenuItem, 0, '<span class="up">+</span>');
            });
        }

        onSubMenuClick() {
            document.querySelectorAll('.gm-sub-menu-item').forEach((subMenuItem) => {
                if (!this.subMenuItemHasChidlren(subMenuItem)) return;
                subMenuItem.addEventListener('click', () => {
                    if (this.isSunMenuOpen(subMenuItem)) this.hideSubMenuItemChildren(subMenuItem);
                    else this.showSubMenuItemChildren(subMenuItem);;
                });
            });
        }

        moveMenuChildrenToContainers() {
            const body = document.querySelector('body');

            const menuColumnsCount = document.querySelectorAll('.gm-menu').length;
            for (let i = 1; i <= menuColumnsCount; i++) {
                const menuItem = document.querySelector(`.gm-menu[data-col="${i}"]`);
                const childItemsForMenuItem = document.querySelectorAll(`[data-col="${i}"].gm-sub-menu-item,[data-parent-col="${i}"].gm-child-menu-item`);

                const div = document.createElement('div');
                div.dataset.col = i;
                div.className = 'subMenu';
                div.style.left = `${menuItem.offsetLeft}px`;

                childItemsForMenuItem.forEach(childItem => div.appendChild(childItem));

                this.insertContent(body, i - 1, div);
            }
        }

        insertContent(parentElement, position, htmlElement) {
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
            else if (position === 0)
                parentElement.children[0].insertAdjacentElement('beforeBegin', htmlElement);
            else
                parentElement.children[position - 1].insertAdjacentElement('afterEnd', htmlElement);

        }

        promoteChildren = (htmlElement) => htmlElement.replaceWith(...htmlElement.childNodes);

        isHtmlELement = (value) =>
            (Object.prototype.toString.call(value).includes('[object HTML') &&
                Object.prototype.toString.call(value).includes('Element]')) ||
            value instanceof HTMLElement;

        isString = (value) => Object.prototype.toString.call(value) === '[object String]';

        getCssProp = (prop) => getComputedStyle(document.body.parentElement).getPropertyValue(`--${prop}`);

        getPixelCssProp = (prop) => this.pixelToNumber(this.getCssProp(prop));

        pixelToNumber = (pixel) => parseInt(pixel.trim().split('px')[0]);

        vh = (viewHeight) => viewHeight * (Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) / 100;

        vw = (viewWidth) => viewWidth * (Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100;
    }
    return new GridMenu();
}()