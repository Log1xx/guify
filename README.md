# ~ Vortex Guify ~
I made my new guify, this start as a mini project for Starve.io now it's avaible for anyone willing to use it!

# How to use:
You have to initiliaze some options first we want to load up to GUI.
```
let GUI = new GuifyCreator({
    title: "MultiHack",
    theme: {
        colors: {
            guiBackground: "#C22BBB",
            componentBackground: "grey",
            componentForeground: "white",
            textColor: "white",
            folderBackground: "#C22BBB",
            folderText: "white",
            hoverColor: '#E497E0',
            hoverTime: 1,
            componentHighlight: '#CAC3CA'
        },
        font: {
            family: "Baloo Paaji",
            size: "20px",
        }
    },
    opacity: .8,
    align: "right",
    width: 550,
    type: 'container',
    open: true,
    draggable: false
});
```
# Gui Options

Title - The title of the gui.<br />
Gui Background - The background color of the gui.<br />
Component Background - The background color of each component.<br />
Component Foreground - The foreground color of each component.<br />
Text Color - The text's color.<br />
Folder Background - The background color of each folder.<br />
Folder Text - The text's color inside each folder.<br />
Hover Color - The color that the folder background shifts to when the mouse is over that folder.<br />
Hover Time - The transition time from the folder's background color to the Hover Color.<br />
Component Highlight - The color that the components background shifts to when the mouse is over that folder ( The transition time is also the Hover Time ).<br />

# Fonts:
All fonts are loaded into automatically.<br />
Family - Font family.<br />
Size - Font size.<br />

# Other Options
Opacity - The gui's opacity ( transparency ).<br />
Aligh - Where to align ( left or right ).<br />
Width - The gui's overall width.<br />
Type - The type of element that closes the gui ( current option is only container ).<br />
Open - Is the gui open when it loads.<br />
Draggable - Is the gui able to be moved.<br />

# Initializing Components

# Folders:
```
GUI.create({ label: 'Hack', open: true, type: 'folder' });
```
Open - Is the folder open when it's created.<br />
Label - Folder name.<br />

# Switches
```
GUI.create({ label: 'Xray', type: 'switch', object: Settings.Xray, property: 'on', onChange(currentStatus) {} });
```
Label - The components name.<br />
Object - The object that the component is assigned to ( Examples listed below ).<br />
Property - The property of that object ( Examples listed below ).<br />
onChange Function - 1 param and it's either true or false depending on the switch.<br />

# Buttons
```
GUI.create({ label: 'Xray', type: 'button', onClick(currentStatus) {} });
```
Label - The components name.<br />
onClick Function - 1 param and it's the document's data that is retrieved from the user's click.<br />

# Displays
```
GUI.create({ label: 'Xray Key:', type: 'display', object: Settings.Xray, property: 'key' });
```
Label - The components name.<br />
Object - The object that the component is assigned to ( Examples listed below ).<br />
Property - The property of that object ( Examples listed below ).<br />

# Sliders
GUI.create({ label: 'Xray Opacity:', type: 'slider', object: Settings.Xray, property: 'opacity', step: .1, min: .1, max: 1, value: .5, onSlide(opacity) { Settings.Xray.opacity = opacity } });

Label - The components name.<br />
Object - The object that the component is assigned to ( Examples listed below ).<br />
Property - The property of that object ( Examples listed below ).<br />
Step - The amount that the slider changes by when it's moved once.<br />
Min - The minimum value that the slider can go to.<br />
Max - The maxium value that the slider can go to.<br />
Value - The slider's value that it's set to ( Other wise it's automatically set in the middle ).<br />
onSlider Function - Returns the value in 1 param in which the value is a number that states what the slider is currently set on.<br />

# Prompts
```
GUI.create({ type: "prompt", label: 'Please enter your password:', placeholder: 'Password', allowPAV: true, autoinput: true, store: true, allowOOD: true, remember: true, key: "new gui", onEnter(e) { if (e == "new gui") { initalizeScript(); GUI.unlock(); } } });
```
Label - The question being asked.<br />
Placeholder - The placeholder inside the input / text box.<br />
AllowPAV - Stands for Allow Proxy and Vpn, do we allow people to mask their ips when logging in.<br />
Autoinput - Do we auto input the last answer that the user inputted.<br />
Store: Do we store the answers that the user inputted.<br />
AllowOOD - Stands for Allow Only One, allows only one device to use this key no matter the ip and makes sure that no information is tampered with.<br />
Remember - If the user inputs the correct password, do we automatically log them back in.<br />
Key - Set the key so we know if the user inputs the correct one ( Used for the Remember property ).<br />
onEnter Function - The answer the user gives to your question.<br />
GUI.unlock() - Once you open a prompt ( basically a login ), once they input the type of information you are looking for, you can use GUI.unlock() to unlock the gui and all the folders will return to the state in which they are loaded, if you don't use this function then the gui will seem to not change.<br />

# Selects
```
GUI.create({ label: 'Select', type: 'select', options: ['option 1', 'option 2'], object: Settings.Xray, property: 'type', onSelect(e) { console.log('Option was selected', e) } });
```
Label - The components name.<br />
Object - The object that the component is assigned to ( Examples listed below ).<br />
Property - The property of that object ( Examples listed below ).<br />
Options - An array of options that you give the user to choose from.<br />
onSelect Function - Returns the option that the user chose.<br />

# FAQ
How can I append multiple componenets?<br />
Example:
```
GUI.create([
    { label: 'Xray', type: 'switch', object: Settings.Xray, property: 'on' },
    { label: 'Set Xray Key', type: 'button', onClick() { setKeyBind(Settings.Xray) } },
    [{ folder: 'Hack' }]
  ]);
```
This appends a switch and a button below it in the same folder that needs to be created first, the folder is 'Hack'.<br />

Is it possible to append a folder within a folder?<br />
Yes, first you must create the main folder.
```
GUI.create({ label: 'Hack', open: true, type: 'folder' });
```
Next you can do almost the same thing as above.
```
GUI.create([{ label: 'Mini Hack', open: true, type: 'folder' }, [{ folder: 'Hack' }]]);
```

Do the components automatically update?<br />
Yes, the components automatically update, lets say you switch component is hooked to a certain object[property] that is false, but then set to true, the component automatically updates along with that.<br />
Certain components update: Displays and Switches, they are the only ones that need to update, the rest are static.

# Example of entire usage
```
let GUI = new GuifyCreator({
    title: "MultiHack",
    theme: {
        colors: {
            guiBackground: "#C22BBB",
            componentBackground: "grey",
            componentForeground: "white",
            textColor: "white",
            folderBackground: "#C22BBB",
            folderText: "white",
            hoverColor: '#E497E0',
            hoverTime: 1,
            componentHighlight: '#CAC3CA'
        },
        font: {
            family: "Baloo Paaji",
            size: "20px",
        }
    },
    opacity: .8,
    align: "right",
    width: 550,
    type: 'container',
    open: true,
    draggable: false
});

var Settings = {
    Xray: {
        on: false,
        key: 'Backquote',
        opacity: .5
    },
    Ads: {
        video: true,
        box: true,
        ReCAPTCHA: false
    }
};

GUI.create({ label: 'Hack', open: true, type: 'folder' });

GUI.create({ type: "prompt", label: 'Please enter your password:', placeholder: 'Password', allowPAV: true, autoinput: true, store: true, allowOOD: true, remember: true, key: "new gui", onEnter(e) { if (e == "new gui") { GUI.unlock(); initalizeScript(); } } });

GUI.create([
    { label: 'Xray', type: 'switch', object: Settings.Xray, property: 'on' },
    { label: 'Set Xray Key', type: 'button', onClick() { setKeyBind(Settings.Xray) } },
    { label: 'Xray Key:', type: 'display', object: Settings.Xray, property: 'key' },
    { label: 'Xray Opacity:', type: 'slider', object: Settings.Xray, property: 'opacity', step: .1, min: .1, max: 1, value: .5, onSlide(opacity) { Settings.Xray.opacity = opacity } },

    { label: 'Video Ad Blocker', type: 'switch', object: Settings.Ads, property: 'video', onChange(e) {  } },
    { label: 'Box Ad Blocker', type: 'switch', object: Settings.Ads, property: 'box', onChange(e) {  }  },
    { label: 'Remove ReCAPTCHA', type: 'switch', object: Settings.Ads, property: 'ReCAPTCHA', onChange(e) {  }  },
    [{ folder: 'Hack' }]
]);
```
