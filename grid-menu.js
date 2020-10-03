GridMenu = function () {
    class GridMenu {
        UP_ARROW = '&#x25BA;';
        DOWN_ARROW = '&#9660;';

        constructor() {
            this.menuItems = [];
            this.subMenuItems = [];
            this.childMenuItems = [];
            this.subMenuContainers = [];
            this.menuBorder = '1px solid black';

            // const href = 'https://cdn.jsdelivr.net/gh/bealesd/GridMenu@latest/grid-menu.min.css';
            const href = 'grid-menu.css';
            this.loadCss(href);

            window.addEventListener("load", () => this.initialize());
        }

        loadRobotoFont() {
            this.loadCss("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
        }

        loadCss(href) {
            const link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen,print";
            link.href = href;
            document.querySelector("head").appendChild(link);
        }

        initialize() {
            this.body = document.querySelector('body');

            this.flatternMenu();

            this.menuItems = this.getMenuItemsDom();
            this.subMenuItems = this.getSubMenuItemsDom();
            this.childMenuItems = this.getChildMenuItemsDom();

            this.removeIntialMenuHtml();

            this.moveBodyContent();

            this.moveMenuToContainer();
            this.positionMenuItems();

            this.moveMenuChildrenToContainers();

            this.subMenuContainers = this.getSubMenuContainersDom();

            this.positionSubMenuItems();
            this.positionChildMenuItems();

            this.createSubmMenuExpanders();

            this.addSubMenuBorders();
            this.addChildMenuBorders();

            this.onMenuClick();
            this.onSubMenuClick();
        }

        //#region GETTERS
        getChildMenuItems(args) {
            let delegate;

            if (!Object.keys(args).includes('menuCol'))
                return [];
            else if (!Object.keys(args).includes('subMenuRow'))
                delegate = child => child.menuCol === args.menuCol;
            else if (!Object.keys(args).includes('childRow'))
                delegate = child => child.menuCol === args.menuCol && child.subMenuRow === args.subMenuRow;
            else
                delegate = child => child.menuCol === args.menuCol && child.subMenuRow === args.subMenuRow && child.childMenuRow === args.childRow;

            return this.childMenuItems.find(delegate);
        }

        getSubMenuItems(args) {
            let delegate;

            if (!Object.keys(args).includes('menuCol'))
                return [];
            else if (!Object.keys(args).includes('subMenuRow'))
                delegate = subMenuItem => subMenuItem.menuCol === args.menuCol;
            else
                delegate = subMenuItem => subMenuItem.menuCol === args.menuCol && subMenuItem.subMenuRow === args.subMenuRow;

            return this.subMenuItems.filter(delegate);
        }

        getMenuItem(args) {
            if (!Object.keys(args).includes('menuCol'))
                return [];
            else
                return this.menuItems.find(menuitem => menuitem.menuCol === args.menuCol);
        }

        getSubAndChildMenuItems = (menuCol) => [...this.subMenuItems.filter(subItem => subItem.menuCol === menuCol), ...this.childMenuItems.filter(childItem => childItem.menuCol === menuCol)];

        getSubMenuContainer = (menuCol) => this.subMenuContainers.find(container => container.menuCol === menuCol);

        getSubMenuItemChildren = (subMenuItem) => this.childMenuItems.filter(x => x.menuCol === subMenuItem.menuCol && x.subMenuRow === subMenuItem.subMenuRow);

        getMenuItemsDom = () => {
            const menuItems = [];
            document.querySelectorAll('.gm-menu').forEach((menu) => {
                menuItems.push({
                    'html': menu,
                    'menuCol': parseInt(menu.dataset.menuCol),
                    'showChildren': false
                });
            });
            return menuItems;
        }

        getSubMenuItemsDom = () => {
            const subMenuItems = [];
            document.querySelectorAll('.gm-sub-menu-item').forEach((subMenuItem) => {
                subMenuItems.push({
                    'html': subMenuItem,
                    'menuCol': parseInt(subMenuItem.dataset.menuCol),
                    'subMenuRow': parseInt(subMenuItem.dataset.subMenuRow)
                });
            });
            return subMenuItems;
        }

        getChildMenuItemsDom = () => {
            const childMenuItems = [];
            document.querySelectorAll('.gm-child-menu-item').forEach((childMenuItem) => {
                childMenuItems.push({
                    'childMenuRow': parseInt(childMenuItem.dataset.childMenuRow),
                    'subMenuRow': parseInt(childMenuItem.dataset.subMenuRow),
                    'menuCol': parseInt(childMenuItem.dataset.menuCol),
                    'html': childMenuItem
                });
            });
            return childMenuItems;
        }

        getSubMenuContainersDom = () => {
            const subMenuContainers = [];
            [...document.querySelectorAll(`.gm-sub-menu`)].forEach((container) => {
                subMenuContainers.push({
                    'menuCol': parseInt(container.dataset.menuCol),
                    'html': container
                });
            });
            return subMenuContainers;
        }

        getIntialMenuItemsDom = () => {
            if (document.querySelector('.gm-container') === null) return [];

            const menuItems = [];
            [...document.querySelector('.gm-container').children].forEach((menu, menuCol) => {
                menuItems.push({
                    'html': menu,
                    'menuCol': menuCol + 1
                });
            });
            return menuItems;
        }

        getInitialSubMenuItemsDom = () => {
            const subMenuItems = [];
            this.getIntialMenuItemsDom().forEach((menuItem) => {
                [...menuItem.html.children].forEach((subMenuItem, subMenuRow) => {
                    subMenuItems.push({
                        'menuCol': menuItem.menuCol,
                        'html': subMenuItem,
                        'subMenuRow': subMenuRow + 1
                    });
                });
            });
            return subMenuItems;
        }

        getInitialChildMenuItems = () => {
            const childMenuItems = [];
            const subMenuItems = this.getInitialSubMenuItemsDom();

            subMenuItems.forEach((subMenuItem) => {
                [...subMenuItem.html.children].forEach((childMenuItem, childMenuRow) => {
                    childMenuItems.push({
                        'childMenuRow': childMenuRow + 1,
                        'subMenuRow': subMenuItem.subMenuRow,
                        'menuCol': subMenuItem.menuCol,
                        'html': childMenuItem
                    });
                });
            });
            return childMenuItems;
        }
        //#region 

        flatternMenu() {
            this.getIntialMenuItemsDom().forEach((menuItem) => {
                const div = document.createElement('div');
                div.classList.add('gm-menu');
                div.dataset.menuCol = menuItem.menuCol;
                if (menuItem.html.id) div.id = menuItem.html.id;
                div.innerHTML = menuItem.html.dataset.value;
                this.insertContent(this.body, 0, div);
            });

            this.getInitialSubMenuItemsDom().forEach((subMenuItem) => {
                const div = document.createElement('div');
                div.classList.add('gm-sub-menu-item');
                div.dataset.menuCol = subMenuItem.menuCol;
                div.dataset.subMenuRow = subMenuItem.subMenuRow;
                if (subMenuItem.html.id) div.id = subMenuItem.html.id;
                div.innerHTML = subMenuItem.html.dataset.value;
                this.insertContent(this.body, 0, div);
            });

            this.getInitialChildMenuItems().forEach((childMenuItem) => {
                const div = document.createElement('div');
                div.classList.add('gm-child-menu-item');
                div.dataset.subMenuRow = childMenuItem.subMenuRow;
                div.dataset.menuCol = childMenuItem.menuCol;
                div.dataset.childMenuRow = childMenuItem.childMenuRow;
                if (childMenuItem.html.id) div.id = childMenuItem.html.id;
                div.innerHTML = childMenuItem.html.dataset.value;
                this.insertContent(this.body, 0, div);
            });
        }

        removeIntialMenuHtml = () => document.querySelector('.gm-container').remove();

        moveBodyContent() {
            const bodyContent = document.createElement('div');
            bodyContent.id = 'bodyContent';

            [...this.body.children].forEach((child, index) => this.insertContent(bodyContent, index, child));
            this.insertContent(this.body, 0, bodyContent);
        }

        moveMenuToContainer() {
            const div = document.createElement('div');
            div.id = 'gm-menu-container';

            this.menuItems.forEach((menu) => {
                menu.html.style.gridRow = `1 / span 1`;
                menu.html.style.gridColumn = `${menu.menuCol} / span 1`;
                this.insertContent(div, menu.menuCol - 1, menu.html);
            });
            this.insertContent(this.body, 0, div);
        }

        addSubMenuBorders() {
            const subMenuGroups = this.countSubMenuMenuItemsInGroup();
            subMenuGroups.forEach((subMenuGroup) => {
                const lastRow = this.getSubMenuItems({ 'menuCol': subMenuGroup.menuCol, 'subMenuCol': subMenuGroup.rowCount })[0];
                lastRow.html.style.borderBottom = this.menuBorder;
            });
        }

        countChildMenuItemsInGroup() {
            const childMenuRowCountPerGroup = [];
            this.childMenuItems.forEach((childMenuItem) => {
                const childMenuGroup = childMenuRowCountPerGroup.find(r => r.menuCol === childMenuItem.menuCol && r.subMenuRow === childMenuItem.subMenuRow);
                if (childMenuGroup === undefined) {
                    childMenuRowCountPerGroup.push({
                        'menuCol': childMenuItem.menuCol,
                        'subMenuRow': childMenuItem.subMenuRow,
                        'rowCount': 1
                    })
                } else childMenuGroup.rowCount++;
            });
            return childMenuRowCountPerGroup;
        }

        countSubMenuMenuItemsInGroup() {
            const subMenuRowCountPerGroup = [];
            this.subMenuItems.forEach((subMenuItem) => {
                const subMenuGroup = subMenuRowCountPerGroup.find(r => r.menuCol === subMenuItem.menuCol);
                if (subMenuGroup === undefined) {
                    subMenuRowCountPerGroup.push({
                        'menuCol': subMenuItem.menuCol,
                        'rowCount': 1
                    })
                } else subMenuGroup.rowCount++;
            });
            return subMenuRowCountPerGroup;
        }

        addChildMenuBorders() {
            const childMenuRowCountPerGroup = this.countChildMenuItemsInGroup();
            const subMenuRowCountPerGroup = this.countSubMenuMenuItemsInGroup();

            childMenuRowCountPerGroup.forEach((childGroup) => {
                const relMaxChildRow = (childGroup.subMenuRow - 1) + childGroup.rowCount;
                const maxSubMenuRow = subMenuRowCountPerGroup.find(subMenuGroup => subMenuGroup.menuCol === childGroup.menuCol).rowCount;

                if (relMaxChildRow > maxSubMenuRow) {
                    let unboundChildRowsCount = relMaxChildRow - maxSubMenuRow;
                    for (let i = 0; i < unboundChildRowsCount; i++) {
                        let undboundChildRow = childGroup.rowCount - i;
                        const childItem = this.getChildMenuItems({ 'menuCol': childGroup.menuCol, 'subMenuRow': childGroup.subMenuRow, 'childRow': undboundChildRow });
                        childItem.html.style.borderLeft = this.menuBorder;
                        childItem.html.style.marginLeft = '-1px';
                    }
                }

                if (childGroup.subMenuRow !== 1) {
                    const firstChildItem = this.getChildMenuItems({ 'menuCol': childGroup.menuCol, 'subMenuRow': childGroup.subMenuRow, 'childRow': 1 });
                    firstChildItem.html.style.borderTop = this.menuBorder;
                }

                const lastChildItem = this.getChildMenuItems({ 'menuCol': childGroup.menuCol, 'subMenuRow': childGroup.subMenuRow, 'childRow': childGroup.rowCount });
                lastChildItem.html.style.borderBottom = this.menuBorder;;
            });
        }

        positionMenuItems() {
            this.menuItems.forEach((menu) => {
                menu.html.style.gridRow = `1 / span 1`;
                menu.html.style.gridColumn = `${menu.menuCol} / span 1`;
            });
        }

        positionSubMenuItems() {
            this.subMenuItems.forEach((subMenuItem) => {
                subMenuItem.html.style.gridRow = `${subMenuItem.subMenuRow} / span 1`;
                subMenuItem.html.style.gridColumn = `1 / span 1`;
                subMenuItem.html.style.display = 'grid';
                subMenuItem.html.style.gridTemplateColumns = 'auto 10px';

                const div = document.createElement('div');

                div.innerHTML = subMenuItem.html.innerHTML;
                subMenuItem.html.innerHTML = '';

                this.insertContent(subMenuItem.html, 0, div);

            });
        }

        positionChildMenuItems() {
            this.childMenuItems.forEach((childMenuItem) => {
                const row = childMenuItem.subMenuRow + childMenuItem.childMenuRow - 1;
                childMenuItem.html.style.gridRow = `${row} / span 1`;
                childMenuItem.html.style.gridColumn = `2 / span 1`;
                childMenuItem.html.classList.add('gm-hidden');
            });
        }

        onMenuClick() {
            this.menuItems.forEach((menu) => {
                menu.html.addEventListener('click', () => {
                    const showMenu = !menu.showChildren;

                    this.hideSubMenus();
                    this.hideChildMenuItems();

                    this.menuItems.forEach(menu => menu.showChildren = false);

                    if (!showMenu) {
                        this.hideSubMenu(menu.menuCol);
                        menu.showChildren = false;
                    } else if (showMenu) {
                        this.showSubMenu(menu.menuCol);
                        menu.showChildren = true;
                    }
                });
            });
        }

        hideSubMenus = () => this.subMenuContainers.forEach(container => container.html.style.zIndex = -1);

        hideSubMenu = (menuCol) => this.getSubMenuContainer(menuCol).html.style.zIndex = -1;

        showSubMenu = (menuCol) => this.getSubMenuContainer(menuCol).html.style.zIndex = 12;

        isSunMenuOpen = (subMenuItem) => subMenuItem.html.querySelector('span').classList.contains('down');

        subMenuItemHasChidlren = (subMenuItem) => this.getSubMenuItemChildren(subMenuItem).length > 0;

        hideChildMenuItems() {
            this.subMenuItems.forEach((subMenuItem) => {
                this.hideSubMenuItemChildren(subMenuItem);
            });
        }

        hideSubMenuItemChildren(subMenuItem) {
            if (!this.subMenuItemHasChidlren(subMenuItem)) return;

            const subMenuSpan = subMenuItem.html.querySelector('span');
            subMenuSpan.classList.add('up');
            subMenuSpan.classList.remove('down');
            subMenuSpan.innerHTML = this.UP_ARROW;

            this.getSubMenuItemChildren(subMenuItem).forEach(childItem => childItem.html.classList.add('gm-hidden'));
        }

        hideOtherSubMenuItemChildren = (subMenuItem) => this.subMenuItems.forEach(item => (item.html !== subMenuItem.html) && this.hideSubMenuItemChildren(item));

        showSubMenuItemChildren(subMenuItem) {
            if (!this.subMenuItemHasChidlren(subMenuItem)) return;

            const subMenuSpan = subMenuItem.html.querySelector('span');
            subMenuSpan.classList.add('down');
            subMenuSpan.classList.remove('up');

            subMenuSpan.innerHTML = this.DOWN_ARROW;
            subMenuSpan.id = 'gm-span';

            this.getSubMenuItemChildren(subMenuItem).forEach((childItem) => childItem.html.classList.remove('gm-hidden'));
        }

        createSubmMenuExpanders = () =>
            this.subMenuItems.forEach(subMenuItem => this.subMenuItemHasChidlren(subMenuItem) &&
                this.insertContent(subMenuItem.html, 1, `<span id="gm-span" class="up">${this.UP_ARROW}</span>`))

        onSubMenuClick() {
            this.subMenuItems.forEach((subMenuItem) => {
                if (!this.subMenuItemHasChidlren(subMenuItem)) return;
                subMenuItem.html.addEventListener('click', () => {
                    this.hideOtherSubMenuItemChildren(subMenuItem);
                    if (this.isSunMenuOpen(subMenuItem)) this.hideSubMenuItemChildren(subMenuItem);
                    else this.showSubMenuItemChildren(subMenuItem);
                });
            });
        }

        moveMenuChildrenToContainers() {
            for (let i = 1; i <= this.menuItems.length; i++) {
                const menuItem = this.getMenuItem({ 'menuCol': i });

                const childItemsForMenuItem = this.getSubAndChildMenuItems(i);

                const div = document.createElement('div');
                div.dataset.menuCol = i;
                div.className = 'gm-sub-menu';
                div.style.left = `${menuItem.html.offsetLeft}px`;

                childItemsForMenuItem.forEach(childItem => div.appendChild(childItem.html));

                this.insertContent(this.body, i - 1, div);
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

        getCssProp = (prop) => getComputedStyle(this.body.parentElement).getPropertyValue(`--${prop}`);

        getPixelCssProp = (prop) => this.pixelToNumber(this.getCssProp(prop));

        pixelToNumber = (pixel) => parseInt(pixel.trim().split('px')[0]);

        vh = (viewHeight) => viewHeight * (Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) / 100;

        vw = (viewWidth) => viewWidth * (Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100;
    }
    return new GridMenu();
}()