window.onload = () => {

const alert_ = document.createElement('div');
alert_.style.color = 'white';
alert_.style.textAlign = 'center';
alert_.style.width = `${window.innerWidth * 0.5}px`;
alert_.style.marginLeft = `${window.innerWidth * 0.25}px`;
alert_.style.display = 'none';
alert_.style.padding = '20px';
alert_.style.borderRadius = '10px';
alert_.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
alert_.style.position = 'absolute';
alert_.style.left = '25%';
alert_.style.top = '5%';
alert_.style.opacity = '0';
alert_.style.zIndex = '999999999';
alert_.style.transition = 'opacity 0.5s ease-in-out';
alert_.style.fontSize = `${window.innerWidth * 0.01}px`
alert_.style.transform = 'translate(-50%, -50%)';
setTimeout(() => {
document.body.appendChild(alert_);
}, 1000);

const documentAlert = (label, color, timeout = 2000) => {
    alert_.textContent = label;
    alert_.style.backgroundColor = color;
    alert_.style.display = 'block';

    setTimeout(() => {
        alert_.style.opacity = '1';
        setTimeout(() => {
            fadeOut(500);
        }, timeout);
    }, 500);
};

function fadeOut(duration = 500) {
    alert_.style.opacity = '0';
    setTimeout(() => {
        alert_.style.display = 'none';
    }, duration);
};

class GuifyCreator {
    constructor (settings) {
        var link = document.createElement('link');

        var googleFont = "";
        for (let i = 0; i < settings.theme.font.family.length; i++) googleFont += (settings.theme.font.family[i] == " " ? "+" : settings.theme.font.family[i]);

        link.href = `https://fonts.googleapis.com/css?family=${googleFont}`;
        link.rel = 'stylesheet';

        document.head.appendChild(link);

        this.title = settings.title;
        this.colors = settings.theme.colors;
        this.fonts = settings.theme.font;
        this.alignment = settings.align ?? 'left';
        this.width = settings.width ?? 500;
        this.opacity = settings.opacity ?? 1;
        this.open = settings.open ?? false;
        this.type = settings.type ?? 'container';
        this.draggable = settings.draggable ?? false;
        this.logo = settings.logo ?? undefined;

        this.gui = undefined;
        this.titleElement = undefined;
        this.folders = [];
        this.objectType = undefined;
        this.objectsToCheck = [];
        this.wasDragged = false;
        this.nodeList = [];

        const error = this.checkContents();

        this.fonts.size = Number(this.fonts.size.split('px')[0]);

        if (error) throw new Error(`Please specify the correct contents: [ ${error} ]`);

        this.createGui();
    }

    checkContents() {
        if (!this.title) return 'TITLE';

        if (!this.colors) return 'COLORS';
        if (!this.colors.guiBackground) return 'GUI BACKGROUND';
        if (!this.colors.textColor) return 'TEXT COLOR';
        if (!this.colors.componentForeground) return 'COMPONENT FOREGROUND COLOR';
        if (!this.colors.componentBackground) return 'COMPONENT BACKGROUND COLOR';
        if (!this.colors.folderBackground) return 'FOLDER BACKGROUND COLOR';
        if (!this.colors.folderText) return 'FOLDER TEXT COLOR';

        if (!this.fonts.family) return 'FONT FAMILY';
        if (!this.fonts.size) return 'FONT SIZE';
    }

    createGui() {
        this.gui = document.createElement('div');
        this.gui.id = 'guify_';
        this.gui.style.width = `${this.width}px`;
        this.gui.style.backgroundColor = this.colors.guiBackground;
        this.gui.style.color = this.colors.textColor;
        this.gui.style.fontFamily = this.fonts.family;
        this.gui.style.fontSize = `${this.fonts.size}px`;
        this.gui.style.opacity = this.opacity;
        this.gui.style.position = 'fixed';
        this.gui.style[this.alignment] = '0';
        this.gui.style.top = '0';
        this.gui.style.display = this.open ? 'block' : 'none';
        this.gui.style.borderRadius = '5px'
        this.gui.style.userSelect = 'none';
        this.gui.style.zIndex = '99999999999'

        document.body.appendChild(this.gui);

        this.createType();
        this.createTitle();
        this.injectStyles();
        this.startIntervals();
    };

    startIntervals() {
        setInterval(() => {
            for (let i = 0; i < this.objectsToCheck.length; i++) {
                const Type = this.objectsToCheck[i].type;

                switch (Type) {
                    case 'display':
                        if (this.objectsToCheck[i].settings[0][this.objectsToCheck[i].settings[1]].toString() == this.objectsToCheck[i].object.textContent.split(`${this.objectsToCheck[i].label} `)[1]) continue;
                        this.objectsToCheck[i].object.textContent = `${this.objectsToCheck[i].label} ${this.objectsToCheck[i].settings[0][this.objectsToCheck[i].settings[1]]}`;
                        break;
                    case 'switch':
                        this.objectsToCheck[i].object.checked = this.objectsToCheck[i].settings[0][this.objectsToCheck[i].settings[1]];
                        break;
                };
            };
        }, 100);
    };

    makeTitleDraggable() {
        this.titleElement.classList.add('draggable');

        let isDragging = false;
        let guiOffsetX, guiOffsetY;

        const onMouseDown = (e) => {
            e.stopPropagation();
            isDragging = true;
            guiOffsetX = e.clientX - this.gui.getBoundingClientRect().left;
            guiOffsetY = e.clientY - this.gui.getBoundingClientRect().top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            e.stopPropagation();
            if (!isDragging) return;

            let newGuiLeft = e.clientX - guiOffsetX;
            let newGuiTop = e.clientY - guiOffsetY;

            newGuiLeft = Math.max(0, Math.min(window.innerWidth - this.gui.offsetWidth, newGuiLeft));
            newGuiTop = Math.max(0, Math.min(window.innerHeight - this.gui.offsetHeight, newGuiTop));

            this.gui.style.left = `${newGuiLeft}px`;
            this.gui.style.top = `${newGuiTop}px`;

            if (this.alignment == 'right') this.objectType.style.left = `${newGuiLeft + this.width - 15}px`;
            else this.objectType.style.left = `${newGuiLeft + 2.5}px`;

            this.objectType.style.top = `${newGuiTop + 2.5}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        this.titleElement.addEventListener('mousedown', onMouseDown);
    };

    makeTypeDraggable() {
        let isDragging = false;
        let ObjectOffsetX, ObjectOffsetY;

        const onMouseDown = (e) => {
            isDragging = true;
            ObjectOffsetX = e.clientX - this.objectType.getBoundingClientRect().left;
            ObjectOffsetY = e.clientY - this.objectType.getBoundingClientRect().top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            this.wasDragged = true;

            var ObjectLeft = e.clientX - ObjectOffsetX;
            var ObjectTop = e.clientY - ObjectOffsetY;

            ObjectLeft = Math.max(0, Math.min(window.innerWidth - this.objectType.offsetWidth, ObjectLeft));
            ObjectTop = Math.max(0, Math.min(window.innerHeight - this.objectType.offsetHeight, ObjectTop));

            this.objectType.style.left = `${ObjectLeft}px`;
            this.objectType.style.top = `${ObjectTop}px`;

            if (this.alignment == 'right') this.gui.style.left = `${ObjectLeft - this.width + 15}px`;
            else this.gui.style.left = `${ObjectLeft - 2.5}px`;

            this.gui.style.top = `${ObjectTop - 2.5}px`;
        };

        const onMouseUp = () => {
            isDragging = false;

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        this.objectType.addEventListener('mousedown', onMouseDown);

        document.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            this.wasDragged = false;
        });
    };

    createType() {
        this.objectType = document.createElement('button');

        switch (this.type) {
            case 'container': {
                this.objectType.style.position = 'absolute';
                this.objectType.style[this.alignment] = '3px';
                this.objectType.style.top = '3px';
                this.objectType.style.height = '10px';
                this.objectType.style.width = '10px';
                this.objectType.style.backgroundColor = this.colors.componentForeground;
                this.objectType.style.zIndex = '999999999999';
                this.objectType.style.cursor = 'pointer';
                this.objectType.style.border = 'none';
                this.objectType.style.outline = `3px solid ${this.colors.componentBackground}`;
                this.objectType.style.transition = 'backgroundColor 0.5s';

                this.objectType.addEventListener('click', () => {
                    if (!this.wasDragged) {
                        const x = Number(this.objectType.style.left.split('px')[0]);
                        const y = window.innerHeight - Number(this.objectType.style.top.split('px')[0]);

                        this.gui.style.display = this.gui.style.display === 'none' ? 'block' : 'none';

                        if (x < this.gui.offsetWidth) {
                            this.gui.style.left = '0';
                            if (this.alignment == 'right') {
                                this.objectType.style.left = `${this.width - 15}px`;
                            };
                        };

                        if (y < this.gui.offsetHeight) {
                            this.gui.style.top = window.innerHeight - this.gui.offsetHeight + 'px';
                            this.objectType.style.top = `${(window.innerHeight - this.gui.offsetHeight) + 2.5}px`;
                        };
                    };
                });

                this.objectType.addEventListener('mouseover', () => {
                    this.objectType.style.backgroundColor = this.colors.componentBackground;
                });

                this.objectType.addEventListener('mouseout', () => {
                    this.objectType.style.backgroundColor = this.colors.componentForeground;
                });

                break;
            };
        };

        if (this.draggable) {
            this.makeTypeDraggable();
        };

        document.body.appendChild(this.objectType);
    };

    injectStyles() {
        const height = `${this.fonts.size * 1.8}px`;
        const styles = `
            .toggle-checkbox {
                position: relative;
                width: 100%;
                height: ${this.fonts.size + 6}px;
                cursor: pointer;
            }
            .toggle-input {
                opacity: 0;
                width: 0;
                height: 0;
                cursor: pointer;
            }
            .toggle-label {
                position: absolute;
                width: ${(this.fonts.size + 2) * 2}px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${this.colors.componentBackground};
                border-radius: 25px;
                cursor: pointer;
                transition: background-color 0.3s;
                cursor: pointer;
            }
            .toggle-label::before {
                content: "";
                position: absolute;
                width: ${this.fonts.size + 2}px;
                height: ${this.fonts.size + 2}px;
                left: 2px;
                bottom: 2px;
                background-color: ${this.colors.textColor};
                border-radius: 50%;
                transition: transform 0.3s;
            }
            .toggle-input:checked + .toggle-label {
                background-color: ${this.colors.componentBackground};
            }
            .toggle-input:checked + .toggle-label::before {
                transform: translateX(${this.fonts.size - 2}px);
            }
            .draggable {
                cursor: move;
            }

            .arrow--up {
                bottom: 55%;
                border-bottom: 5px solid  #de00ff;
                border-top: 0px transparent;
            }

            .arrow--up-highlight {
                border-bottom-color: black;
            }

            .arrow--down {
                top: 55%;
                border-top: 5px solid #de00ff;
                border-bottom: 0px transparent;
            }

            .arrow--dpwn-highlight {
                border-top-color: black;
            }
            input[type=range] {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: ${height};
                background: ${this.colors.componentForeground};
                outline: none;
            }
            
            input[type=range]:hover {
                opacity: 1;
            }
            
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: ${this.fonts.size / 2}px;
                height: ${height};
                background: ${this.colors.componentForeground};
                cursor: ew-resize;
            }
            
            input[type=range]::-moz-range-thumb {
                width: ${this.fonts.size / 2}px;
                height: ${height};
                background: ${this.colors.componentForeground};
                cursor: ew-resize;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };

    createTitle() {
        this.titleElement = document.createElement('div');
        this.titleElement.textContent = this.title;
        this.titleElement.style.padding = '4px';
        this.titleElement.style.fontSize = `${this.fonts.size * 1.5}px`;
        this.titleElement.style.backgroundColor = this.colors.guiBackground;
        this.titleElement.style.color = this.colors.textColor;
        this.titleElement.style.textAlign = 'center';
        this.titleElement.style.borderBottom = `1px solid ${this.colors.guiBackground}`;

        if (this.draggable) {
            this.makeTitleDraggable();
        };

        this.gui.appendChild(this.titleElement);
    };

    transitionColor(folderLabel, color) {
        for (let i = 0; i < this.folders.length; i++) {
            if (this.folders[i].label === folderLabel) {
                for (let a = 0; a < this.folders[i].elements.length; a++) {
                    if (this.folders[i].elements[a].style.padding === '4px') {
                        let newLabel = this.folders[i].elements[a].innerText.split('\n')[0];
                        newLabel = newLabel.substring(2);

                        this.folders[i].elements[a].style.transition = `background-color ${this.colors.hoverTime}s`;
                        this.folders[i].elements[a].style.backgroundColor = color;

                        this.transitionColor(newLabel, color);
                    } else {
                        this.folders[i].elements[a].style.transition = `background-color ${this.colors.hoverTime}s`;
                        this.folders[i].elements[a].style.backgroundColor = color;
                    };
                };
            };
        };
    };

    createFolder(label, open) {
        const folder = document.createElement('div');
        folder.textContent = `${open == true ? "▾" : "▸"} ${label}`;
        folder.style.fontSize = `${this.fonts.size}px`;
        folder.style.padding = '4px';
        folder.style.backgroundColor = this.colors.folderBackground;
        folder.style.color = this.colors.folderText;
        folder.style.textAlign = 'left';
        folder.style.borderBottom = `1px solid ${this.colors.guiBackground}`;
        folder.style.display = 'block';

        if (this.colors.hoverTime && this.colors.hoverColor) {
            folder.style.transition = `background-color ${this.colors.hoverTime}s`;

            folder.addEventListener('mouseover', () => {
                folder.style.backgroundColor = this.colors.hoverColor;
                this.transitionColor(label, this.colors.hoverColor);
            });
            folder.addEventListener('mouseout', () => {
                folder.style.backgroundColor = this.colors.folderBackground;
                this.transitionColor(label, this.colors.folderBackground);
            });
        };

        folder.addEventListener('click', () => {
            for (let i = 0; i < this.folders.length; i++) {
                if (this.folders[i].label == label) {
                    this.folders[i].open = !this.folders[i].open;

                    folder.textContent = `${this.folders[i].open == true ? "▾" : "▸"} ${label}`;

                    this.updateFolder(this.folders[i]);
                };
            };
        });

        this.folders.push({ label: label, html: folder, open: open, elements: [] });

        this.gui.appendChild(folder);
    };

    addToFolder(folder, element) {
        if (folder && element) {
            folder.elements.push(element);
            if (folder.open) folder.html.appendChild(element);
        };
    };

    updateFolder(folder) {
        var open = folder.open;

        for (let i = 0; i < folder.elements.length; i++) {
            var element = folder.elements[i];
            if (open) folder.html.appendChild(element);
        };
    };

    appendSwitch(label, [object, property], folderLabel, funct) {

        var changed = true;

        const container = document.createElement('div');
        container.style.display = 'block';
        container.style.position = 'relative';
        container.style.marginBottom = '5px';

        const toggleSwitch = document.createElement('div');
        toggleSwitch.classList.add('toggle-checkbox');
        toggleSwitch.style.marginRight = "4%";
        toggleSwitch.style.marginLeft = `46%`;
        toggleSwitch.style.marginBottom = '5px';
        toggleSwitch.style.marginTop = '5px';

        const labelText = document.createElement('div');
        labelText.textContent = label;
        labelText.style.position = 'absolute';
        labelText.style.width = '47%';
        labelText.style.fontFamily = this.fonts.family;
        labelText.style.fontSize = `${this.fonts.size}px`;
        labelText.style.border = 'none';
        labelText.style.height = `${this.fonts.size + 6}px`;
        labelText.style.marginLeft = "3%";

        labelText.style.marginBottom = '5px';
        labelText.style.marginTop = `-${this.fonts.size / 4}px`;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = label;
        input.classList.add('toggle-input');

        const toggleLabel = document.createElement('label');
        toggleLabel.htmlFor = label;
        toggleLabel.classList.add('toggle-label');

        toggleSwitch.appendChild(input);
        toggleSwitch.appendChild(toggleLabel);
        container.appendChild(labelText)
        container.appendChild(toggleSwitch);

        toggleSwitch.addEventListener('click', function (event) {
            changed = !changed;
            event.stopPropagation();
            if (!changed) {
                object[property] = !object[property];
                if (funct) funct(object[property]);
            };
        });

        if (this.colors.hoverTime && this.colors.componentHighlight) {
            container.style.transition = `background-color ${this.colors.hoverTime}s`;

            container.addEventListener('mouseover', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.componentHighlight;
            });
            container.addEventListener('mouseout', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.folderBackground;
            });
        };

        const folder = this.folders.find(f => f.label === folderLabel);

        if (folder) {
            this.addToFolder(folder, container);
        };

        this.objectsToCheck.push({ type: 'switch', object: input, label: label, settings: [object, property] });
    };

    appendFolder(label, open, folderLabel) {
        const folder = document.createElement('div');
        folder.textContent = `${open == true ? "▾" : "▸"} ${label}`;
        folder.style.padding = '4px';
        folder.style.backgroundColor = this.colors.folderBackground;
        folder.style.color = this.colors.folderText;
        folder.style.textAlign = 'left';
        folder.style.borderBottom = `1px solid ${this.colors.guiBackground}`;
        folder.style.display = 'block';
        folder.style.border = "none";

        if (this.colors.hoverTime && this.colors.hoverColor) {
            folder.style.transition = `background-color ${this.colors.hoverTime}s`;

            folder.addEventListener('mouseover', (event) => {
                event.stopPropagation();
                folder.style.backgroundColor = this.colors.hoverColor;
                this.transitionColor(label, this.colors.hoverColor);
            });

            folder.addEventListener('mouseout', (event) => {
                event.stopPropagation();
                folder.style.backgroundColor = this.colors.folderBackground;
                this.transitionColor(label, this.colors.folderBackground);
            });
        };

        folder.addEventListener('click', (event) => {
            event.stopPropagation();
            for (let i = 0; i < this.folders.length; i++) {
                if (this.folders[i].label == label) {
                    this.folders[i].open = !this.folders[i].open;

                    folder.textContent = `${this.folders[i].open == true ? "▾" : "▸"} ${label}`;

                    this.updateFolder(this.folders[i]);
                };
            };
        });

        this.folders.push({ label: label, html: folder, open: open, elements: [] });

        const findFolder = this.folders.find(f => f.label === folderLabel);

        if (findFolder.open) findFolder.html.appendChild(folder);
        findFolder.elements.push(folder);
    };

    appendDisplay(label, [object, property], folderLabel) {
        const container = document.createElement('div');
        container.style.display = 'block';
        container.style.position = 'relative';
        container.style.marginBottom = '5px';

        const displayElement = document.createElement('div');

        displayElement.style.display = 'block';
        displayElement.textContent = `${label} ${object[property].toString()}`;
        displayElement.style.border = "none";
        displayElement.style.fontFamily = this.fonts.family;
        displayElement.style.fontSize = `${this.fonts.size}px`;
        displayElement.style.height = `${this.fonts.size * 1.8}px`;
        displayElement.style.marginLeft = "3%";

        if (this.colors.hoverTime && this.colors.componentHighlight) {
            container.style.transition = `background-color ${this.colors.hoverTime}s`;

            container.addEventListener('mouseover', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.componentHighlight;
            });
            container.addEventListener('mouseout', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.folderBackground;
            });
        };

        const folder = this.folders.find(f => f.label === folderLabel);

        container.appendChild(displayElement);

        this.addToFolder(folder, container);

        this.objectsToCheck.push({ type: 'display', object: displayElement, label: label, settings: [object, property] });
    };

    appendSelect(label, options, [object, property], folderLabel, funct) {
        const container = document.createElement('div');
        container.style.display = 'block';
        container.style.position = 'relative';
        container.style.marginBottom = '5px';

        const labelText = document.createElement('div');
        labelText.textContent = label;
        labelText.style.position = 'absolute';
        labelText.style.fontFamily = this.fonts.family;
        labelText.style.fontSize = `${this.fonts.size}px`;
        labelText.style.color = this.colors.textColor
        labelText.style.border = 'none';
        labelText.style.width = `${(this.width / 2) - 10}px`;
        labelText.style.height = `${this.fonts.size * 1.8}px`;
        labelText.style.marginRight = (this.width / 2.1) + "px";
        labelText.style.marginLeft = "3%";

        labelText.style.marginTop = '5px';
        labelText.style.marginBottom = '5px';

        const selectButton = document.createElement('button');
        selectButton.style.color = this.colors.componentForeground;
        selectButton.textContent = object[property];
        selectButton.style.fontFamily = this.fonts.family;
        selectButton.style.fontSize = `${this.fonts.size}px`;
        selectButton.style.backgroundColor = this.colors.componentBackground;
        selectButton.style.border = 'none';
        selectButton.style.width = `${this.width / 2}px`;
        selectButton.style.height = `${this.fonts.size * 1.8}px`;
        selectButton.style.cursor = 'pointer';
        selectButton.style.transition = `background-color .3s`;
        selectButton.style.marginLeft = (this.width / 2.1) - 10 + "px";
        selectButton.style.marginRight = "3%";
        selectButton.style.borderRadius = `${this.fonts.size / 4}px`;

        selectButton.style.marginTop = '5px';
        selectButton.style.marginBottom = '5px';

        const dropDownWrapper = document.createElement('div');
        dropDownWrapper.style.position = 'relative';
        dropDownWrapper.style.display = 'inline-block';
        dropDownWrapper.style.flexGrow = '1';
        dropDownWrapper.style.fontFamily = this.fonts.family;
        dropDownWrapper.style.fontSize = `${this.fonts.size}px`;

        const dropDownMenu = document.createElement('div');
        dropDownMenu.style.display = "none";
        dropDownMenu.style.position = "absolute";
        dropDownMenu.style.zIndex = "999999999999";
        dropDownMenu.style.fontFamily = this.fonts.family;
        dropDownMenu.style.fontSize = `${this.fonts.size}px`;
        dropDownMenu.style.borderRadius = `${this.fonts.size / 2}px`;
        dropDownMenu.style.overflow = 'hidden';
        dropDownMenu.style.width = `${this.width / 2}px`;
        dropDownMenu.style.cursor = 'pointer';
        dropDownMenu.style.boxShadow = "0px 8px 16px 0px rgba(0,0,0,0.2)";
        dropDownMenu.style.border = "none";
        dropDownMenu.style.top = `${this.fonts.size * 2}px`;
        dropDownMenu.style.right = "0";

        dropDownMenu.style.marginTop = '10px';

        options.forEach(optionLabel => {
            const option = document.createElement('button');
            option.textContent = optionLabel;
            option.style.color = this.colors.componentForeground;
            option.style.width = "100%";
            option.style.height = `${this.fonts.size * 1.8}px`;
            option.style.backgroundColor = this.colors.componentBackground;
            option.style.textAlign = "center";
            option.style.cursor = 'pointer';
            option.style.fontFamily = this.fonts.family;
            option.style.fontSize = `${this.fonts.size}px`;
            option.style.border = "none";

            option.addEventListener('mouseover', (event) => {
                event.stopPropagation();
                option.style.color = this.colors.textColor;
                option.style.backgroundColor = this.colors.hoverColor;
            });

            option.addEventListener('mouseout', (event) => {
                event.stopPropagation();
                option.style.color = this.colors.componentForeground;
                option.style.backgroundColor = this.colors.componentBackground;
            });

            option.addEventListener('click', (event) => {
                event.stopPropagation();
                object[property] = optionLabel;
                selectButton.textContent = optionLabel;
                dropDownMenu.style.display = "none";

                if (funct) funct(optionLabel);
            });

            dropDownMenu.appendChild(option);
        });

        selectButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropDownMenu.style.display = dropDownMenu.style.display === "none" ? "block" : "none";
        });

        const arrowContainer = document.createElement('div');
        arrowContainer.style.display = 'flex';
        arrowContainer.style.flexDirection = 'column';
        arrowContainer.style.alignItems = 'center';
        arrowContainer.style.fontFamily = this.fonts.family;
        arrowContainer.style.fontSize = `${this.fonts.size}px`;
        arrowContainer.style.position = 'absolute';
        arrowContainer.style.top = `-${this.fonts.size / 4}px`;
        arrowContainer.style.justifyContent = 'center';
        arrowContainer.style.marginRight = "3%";
        arrowContainer.style.right = '10px';

        const arrowUp = document.createElement('span');
        arrowUp.innerHTML = "&#9652;";
        arrowUp.style.color = this.colors.componentForeground;
        arrowUp.style.cursor = 'pointer';
        arrowUp.style.fontFamily = this.fonts.family;
        arrowUp.style.fontSize = `${this.fonts.size}px`;
        arrowUp.style.marginBottom = `-${this.fonts.size}px`;

        const arrowDown = document.createElement('span');
        arrowDown.innerHTML = "&#9662;";
        arrowDown.style.color = this.colors.componentForeground;
        arrowDown.style.cursor = 'pointer';
        arrowDown.style.fontFamily = this.fonts.family;
        arrowDown.style.fontSize = `${this.fonts.size}px`;
        arrowDown.style.marginTop = `${this.fonts.size / 6}px`;

        selectButton.addEventListener('mouseover', (event) => {
            event.stopPropagation();
            selectButton.style.color = this.colors.componentBackground;
            arrowUp.style.color = this.colors.componentBackground;
            arrowDown.style.color = this.colors.componentBackground;
            selectButton.style.backgroundColor = this.colors.componentForeground;
        });

        selectButton.addEventListener('mouseout', (event) => {
            event.stopPropagation();
            selectButton.style.color = this.colors.componentForeground;
            arrowUp.style.color = this.colors.componentForeground;
            arrowDown.style.color = this.colors.componentForeground;
            selectButton.style.backgroundColor = this.colors.componentBackground;
        });

        arrowContainer.appendChild(arrowUp);
        arrowContainer.appendChild(arrowDown);

        dropDownWrapper.appendChild(labelText);
        dropDownWrapper.appendChild(selectButton);
        dropDownWrapper.appendChild(dropDownMenu);

        container.appendChild(dropDownWrapper);
        container.appendChild(arrowContainer);

        if (this.colors.hoverTime && this.colors.componentHighlight) {
            container.style.transition = `background-color ${this.colors.hoverTime}s`;

            container.addEventListener('mouseover', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.componentHighlight;
            });
            container.addEventListener('mouseout', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.folderBackground;
            });
        };

        const folder = this.folders.find(f => f.label === folderLabel);
        this.addToFolder(folder, container);
    }

    appendButton(label, folderLabel, funct) {
        const container = document.createElement('div');
        container.style.display = 'block';
        container.style.position = 'relative';
        container.style.marginBottom = '5px';

        const button = document.createElement('button');
        button.style.color = this.colors.componentForeground;
        button.textContent = label;
        button.style.textAlign = "center";
        button.style.fontFamily = this.fonts.family;
        button.style.fontSize = `${this.fonts.size}px`;
        button.style.backgroundColor = this.colors.componentBackground;
        button.style.border = 'none';
        button.style.borderRadius = `${this.fonts.size}px`;
        button.style.width = `70%`;
        button.style.marginLeft = `15%`;
        button.style.height = `${this.fonts.size * 1.8}px`;
        button.style.cursor = 'pointer';
        button.style.transition = `background-color .3s`;

        button.style.marginBottom = '5px';
        button.style.marginTop = '5px';

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!funct) return;
            funct(event);
        });

        button.addEventListener('mouseover', (event) => {
            event.stopPropagation();
            button.style.color = this.colors.componentBackground;
            button.style.backgroundColor = this.colors.componentForeground;
        });

        button.addEventListener('mouseout', (event) => {
            event.stopPropagation();
            button.style.color = this.colors.componentForeground;
            button.style.backgroundColor = this.colors.componentBackground;
        });

        if (this.colors.hoverTime && this.colors.componentHighlight) {
            container.style.transition = `background-color ${this.colors.hoverTime}s`;

            container.addEventListener('mouseover', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.componentHighlight;
            });
            container.addEventListener('mouseout', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.folderBackground;
            });
        };

        container.appendChild(button);

        const folder = this.folders.find(f => f.label === folderLabel);
        this.addToFolder(folder, container);
    }
    appendSlider(label, options, folderLabel, funct) {
        if (!options.value) options.value = (options.max - options.min) / 2;
        const container = document.createElement('div');
        container.style.display = 'block';
        container.style.position = 'relative';
        container.style.marginBottom = '5px';

        const label_ = document.createElement('label');
        label_.style.position = "absolute";
        label_.style.color = this.colors.textColor;
        label_.textContent = label;
        label_.style.fontFamily = this.fonts.family;
        label_.style.fontSize = `${this.fonts.size}px`;
        label_.style.width = `44%`;
        label_.style.height = `${this.fonts.size * 1.8}px`;

        label_.style.marginTop = '5px';
        label_.style.marginBottom = '5px';
        label_.style.marginLeft = "3%";

        const textInput = document.createElement('input');
        textInput.style.color = this.colors.componentForeground;
        textInput.style.textAlign = "left";
        textInput.value = options.value;
        textInput.style.fontFamily = this.fonts.family;
        textInput.style.fontSize = `${this.fonts.size}px`;
        textInput.style.backgroundColor = this.colors.componentBackground;
        textInput.style.border = 'none';
        textInput.style.width = `9%`;
        textInput.style.marginLeft = `88%`;
        textInput.style.height = `${this.fonts.size * 1.8}px`;
        textInput.style.cursor = 'text';
        textInput.style.boxSizing = "border-box";

        textInput.style.marginTop = `5px`;
        textInput.style.marginBottom = '5px';
        textInput.style.marginRight = "3%";

        var numberValue = textInput.value;

        textInput.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        const slider = document.createElement('input');
        slider.type = "range";
        slider.min = options.min;
        slider.max = options.max;
        slider.step = options.step;
        slider.style.position = "absolute";
        slider.style.color = this.colors.componentForeground;
        slider.value = options.value;
        slider.style.fontFamily = this.fonts.family;
        slider.style.fontSize = `${this.fonts.size}px`;
        slider.style.backgroundColor = this.colors.componentBackground;
        slider.style.borderRadius = `${this.fonts.size / 2}px`;
        slider.style.border = 'none';
        slider.style.width = `38%`;
        slider.style.height = `${this.fonts.size * 1.8}px`;
        slider.style.marginLeft = `47%`;

        slider.style.marginTop = '5px';
        slider.style.marginBottom = `5px`;

        textInput.addEventListener('input', (event) => {
            event.stopPropagation();
            if (!isNaN(event.value) && (Number(textInput.value) <= Number(options.max))) {
                numberValue = textInput.value;
                slider.value = numberValue;
                if (funct) funct(textInput.value);
            } else if (!isNaN(event.value) && Number(textInput.value) > Number(options.max)) {
                numberValue = options.max;
                slider.value = numberValue;
                textInput.value = options.max;
                if (funct) funct(textInput.value);
            } else if (!isNaN(event.value)) {
                if (funct) funct(textInput.value);
            } else {
                textInput.value = numberValue;
            };
        });

        slider.addEventListener('input', function (event) {
            event.stopPropagation();
            textInput.value = this.value;
            if (funct) funct(textInput.value);
        });

        slider.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        if (this.colors.hoverTime && this.colors.componentHighlight) {
            container.style.transition = `background-color ${this.colors.hoverTime}s`;

            container.addEventListener('mouseover', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.componentHighlight;
            });
            container.addEventListener('mouseout', (event) => {
                event.stopPropagation();
                container.style.backgroundColor = this.colors.folderBackground;
            });
        };

        container.appendChild(label_);
        container.appendChild(slider);
        container.appendChild(textInput);

        const folder = this.folders.find(f => f.label === folderLabel);
        this.addToFolder(folder, container);
    };

    async appendPrompt(label, options, funct) {

        const childNodes = Array.from(this.gui.childNodes);

        for (let i = 0; i < childNodes.length; i++) {
            if (i == 0) continue;
            this.nodeList.push(childNodes[i]);
            this.gui.removeChild(childNodes[i]);
        };

        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'block';
        container.style.marginTop = '3px';
        container.style.marginBottom = `${this.width / 35}px`;

        const label_ = document.createElement('div');
        label_.textContent = label;
        label_.style.width = '67%';
        label_.style.marginLeft = '3%';
        label_.style.fontSize = this.fonts.size + 'px';
        label_.style.whiteSpace = 'normal';
        label_.style.wordBreak = 'break-word';

        const input = document.createElement('input');
        input.placeholder = options.placeholder;
        input.style.width = '30%';
        input.style.marginRight = '3%';
        input.style.marginLeft = '67%';
        input.style.height = `${this.fonts.size * 1.8}px`;
        input.style.textAlign = 'center';
        input.style.fontFamily = this.fonts.family;
        input.style.fontSize = this.fonts.size + 'px';
        input.style.display = 'block';
        input.style.top = `${this.fonts.size / 10}px`;
        input.style.position = 'absolute';

        var navigator_info = window.navigator;
        var screen_info = window.screen;
        var uid = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent.replace(/\D+/g, '');
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';

        var uid_ = btoa(btoa(btoa(uid.toString()))),
            uidCode = 0,
            secondUID = btoa(uid.toString()),
            secondCode = 0;

        const res = await fetch('https://api.ipify.org');
        const ip = await res.text();

        if (!options.allowPAV) {

            let response = await fetch(`https://vpnapi.io/api/${ip}?key=315eac7b69be4d22a05e84a1ebc28adf`);
            response = await response.json();

            if (response.security.proxy || response.security.vpn || response.security.tor || response.security.relay) {
                return documentAlert("Please do not mask your IP!", "#ffb732", 2000);
            };
        };

        if (options.remember) {
            const lastKey = localStorage.getItem(btoa(uid));
            if (lastKey == options.key) this.unlock();
        };

        if (options.autoinput) {
            const previousInput = localStorage.getItem(btoa(uid));
            input.value = previousInput ?? "";
        };

        if (options.allowOOD) {
            for (let i = 0; i < uid_.length; i++) uidCode += uid_.charCodeAt(i);
            for (let i = 0; i < secondUID.length; i++) secondCode += secondUID.charCodeAt(i);

            const UUID = (Math.pow(Math.floor(uidCode), Math.floor(secondCode / 100)));

            const responseCode = localStorage.getItem(UUID);

            if (responseCode !== uid && localStorage.getItem('os_systems') == 'true') return documentAlert("Please don't tamper with information!", '#ffb732', 2000);
            if (!responseCode) {
                localStorage.setItem(UUID, uid);
                localStorage.setItem('os_systems', 'true');
            };
        };

        input.addEventListener('keypress', (event) => {
            if (event.key == 'Enter') {
                if (funct) funct(input.value);
            };
        });

        input.addEventListener('input', (event) => {
            event.stopPropagation();

            if (options.store) {
                localStorage.setItem(btoa(uid), (input.value).toString());
            };
        });

        container.appendChild(label_);
        container.appendChild(input);

        this.gui.appendChild(container);
    };

    unlock() {
        setTimeout(() => {
            const childNodes = Array.from(this.gui.childNodes);


            if (this.gui) {
                this.gui.removeChild(childNodes[1]);
                this.nodeList.forEach(child => {
                    this.gui.appendChild(child);
                });
            }
        }, 50);
    };

    create(settings) {
        if (!Array.isArray(settings)) {
            if (settings.type == 'folder') this.createFolder(settings.label, settings.open);
            if (settings.type == 'prompt') {
                const label = settings.label;
                const options = settings;
                var funct = settings.onEnter;
                if (!funct) funct = null;
                this.appendPrompt(label, options, funct);
            };
        } else {
            var folderLabel = settings[settings.length - 1][0].folder;

            if (!folderLabel) throw new Error("Please specify the correct folder: [ FOLDER ]");

            for (let i = 0; i < settings.length - 1; i++) {

                if (settings[i][0]) continue;

                const type = settings[i].type;

                if (!type) throw new Error(`Please specify the correct settings: [ TYPE ] | Type given: [ ${type} ]`);

                switch (type) {
                    case 'switch': {
                        const label = settings[i].label;
                        const object = settings[i].object;
                        const property = settings[i].property;
                        var funct = settings[i].onChange;
                        if (!funct) funct = null;
                        this.appendSwitch(label, [object, property], folderLabel, funct);
                        break;
                    };

                    case 'folder': {
                        const label = settings[i].label;
                        const open = settings[i].open;
                        this.appendFolder(label, open, folderLabel);
                        break;
                    };

                    case 'display': {
                        const label = settings[i].label;
                        const object = settings[i].object;
                        const property = settings[i].property;
                        this.appendDisplay(label, [object, property], folderLabel);
                        break;
                    };

                    case 'select': {
                        const label = settings[i].label;
                        const object = settings[i].object;
                        const property = settings[i].property;
                        const options = settings[i].options;
                        var funct = settings[i].onSelect;
                        if (!funct) funct = null;
                        this.appendSelect(label, options, [object, property], folderLabel, funct);
                        break;
                    }

                    case 'button': {
                        const label = settings[i].label;
                        var funct = settings[i].onClick;
                        if (!funct) funct = null;
                        this.appendButton(label, folderLabel, funct);
                        break;
                    }

                    case 'slider': {
                        const label = settings[i].label;
                        const options = settings[i];
                        var funct = settings[i].onSlide;
                        if (!funct) funct = null;
                        this.appendSlider(label, options, folderLabel, funct);
                        break;
                    };

                    default: throw new Error(`Please specify the correct settings: [ TYPE ] | Type given: [ ${type} ]`);
                };
            };
        };
    };
};
};
