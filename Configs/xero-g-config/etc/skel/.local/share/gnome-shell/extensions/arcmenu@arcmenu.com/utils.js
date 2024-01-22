/* eslint-disable jsdoc/require-jsdoc */
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Pango from 'gi://Pango';
import Shell from 'gi://Shell';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Constants from './constants.js';
import {getLoginManager} from 'resource:///org/gnome/shell/misc/loginManager.js';

import {ArcMenuManager} from './arcmenuManager.js';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const InterfaceXml = `<node>
  <interface name="com.Extensions.ArcMenu">
    <method name="ToggleArcMenu"/>
  </interface>
</node>`;

export const DBusService = class {
    constructor() {
        this.ToggleArcMenu = () => {};

        this._dbusExportedObject = Gio.DBusExportedObject.wrapJSObject(InterfaceXml, this);

        const onBusAcquired = (connection, _name) => {
            try {
                this._dbusExportedObject.export(connection, '/com/Extensions/ArcMenu');
            } catch (error) {
                global.log(`ArcMenu Error - onBusAcquired export failed: ${error}`);
            }
        };

        function onNameAcquired() { }

        function onNameLost() { }

        this._ownerId = Gio.bus_own_name(Gio.BusType.SESSION, 'com.Extensions.ArcMenu', Gio.BusNameOwnerFlags.NONE,
            onBusAcquired, onNameAcquired, onNameLost);
    }

    destroy() {
        this._dbusExportedObject.unexport();
        Gio.bus_unown_name(this._ownerId);
    }
};

export function activateHibernateOrSleep(powerType) {
    const loginManager = getLoginManager();
    let callName, activateCall;

    if (powerType === Constants.PowerType.HIBERNATE) {
        callName = 'CanHibernate';
        activateCall = 'Hibernate';
    } else if (powerType === Constants.PowerType.HYBRID_SLEEP) {
        callName = 'CanHybridSleep';
        activateCall = 'HybridSleep';
    }

    if (!loginManager._proxy) {
        Main.notifyError(`ArcMenu - ${activateCall} Error!`, `System unable to ${activateCall}.`);
        return;
    }

    canHibernateOrSleep(callName, result => {
        if (!result) {
            Main.notifyError(`ArcMenu - ${activateCall} Error!`, `System unable to ${activateCall}.`);
            return;
        }

        loginManager._proxy.call(activateCall,
            GLib.Variant.new('(b)', [true]),
            Gio.DBusCallFlags.NONE,
            -1, null, null);
    });
}

export function canHibernateOrSleep(callName, asyncCallback) {
    const loginManager = getLoginManager();

    if (!loginManager._proxy)
        asyncCallback(false);

    loginManager._proxy.call(callName, null, Gio.DBusCallFlags.NONE, -1, null, (proxy, asyncResult) => {
        let result, error;

        try {
            result = proxy.call_finish(asyncResult).deep_unpack();
        } catch (e) {
            error = e;
        }

        if (error)
            asyncCallback(false);
        else
            asyncCallback(result[0] === 'yes');
    });
}

export const SettingsConnectionsHandler = class ArcMenuSettingsConnectionsHandler {
    constructor(settings) {
        this._connections = new Map();
        this._eventPrefix = 'changed::';
        this._settings = settings;
    }

    connect(...args) {
        const callback = args.pop();
        for (const event of args)
            this._connections.set(this._settings.connect(this._eventPrefix + event, callback), this._settings);
    }

    destroy() {
        this._connections.forEach((object, id) => {
            object.disconnect(id);
            id = null;
        });

        this._connections = null;
    }
};

export function convertToButton(item) {
    item.tooltipLocation = Constants.TooltipLocation.BOTTOM_CENTERED;
    item.remove_child(item._ornamentLabel);
    item.remove_child(item.label);
    item.set({
        x_expand: false,
        x_align: Clutter.ActorAlign.CENTER,
        y_expand: false,
        y_align: Clutter.ActorAlign.CENTER,
        style_class: 'popup-menu-item arcmenu-button',
    });
}

export function convertToGridLayout(item) {
    const menuLayout = item._menuLayout;
    const icon = item._iconBin;

    const {settings} = ArcMenuManager;

    const iconSizeEnum = settings.get_enum('menu-item-grid-icon-size');
    const defaultIconSize = menuLayout.icon_grid_size;
    const {width, height, iconSize_} = getGridIconSize(iconSizeEnum, defaultIconSize);

    if (item._ornamentLabel)
        item.remove_child(item._ornamentLabel);

    item.add_style_class_name('ArcMenuIconGrid');
    item.set({
        vertical: true,
        tooltipLocation: Constants.TooltipLocation.BOTTOM_CENTERED,
        style: `width: ${width}px; height: ${height}px;`,
    });

    icon?.set({
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
    });

    if (item._indicator) {
        item.remove_child(item._indicator);
        item.insert_child_at_index(item._indicator, 0);
        item._indicator.set({
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.START,
            y_expand: false,
        });
    }

    if (!settings.get_boolean('multi-lined-labels'))
        return;

    icon?.set({
        y_align: Clutter.ActorAlign.TOP,
        y_expand: false,
    });

    const clutterText = item.label.get_clutter_text();
    clutterText.set({
        line_wrap: true,
        line_wrap_mode: Pango.WrapMode.WORD_CHAR,
    });
}

export function getIconSize(iconSizeEnum, defaultIconSize) {
    switch (iconSizeEnum) {
    case Constants.IconSize.DEFAULT:
        return defaultIconSize;
    case Constants.IconSize.EXTRA_SMALL:
        return Constants.EXTRA_SMALL_ICON_SIZE;
    case Constants.IconSize.SMALL:
        return Constants.SMALL_ICON_SIZE;
    case Constants.IconSize.MEDIUM:
        return Constants.MEDIUM_ICON_SIZE;
    case Constants.IconSize.LARGE:
        return Constants.LARGE_ICON_SIZE;
    case Constants.IconSize.EXTRA_LARGE:
        return Constants.EXTRA_LARGE_ICON_SIZE;
    case Constants.IconSize.HIDDEN:
        return Constants.ICON_HIDDEN;
    default:
        return defaultIconSize;
    }
}

export function getGridIconSize(iconSizeEnum, defaultIconSize) {
    const {settings} = ArcMenuManager;

    if (iconSizeEnum === Constants.GridIconSize.CUSTOM) {
        const {width, height, iconSize} = settings.get_value('custom-grid-icon-size').deep_unpack();
        return {width, height, iconSize};
    }

    if (iconSizeEnum === Constants.GridIconSize.DEFAULT)
        iconSizeEnum = defaultIconSize;

    let width, height, iconSize;
    Constants.GridIconInfo.forEach(info => {
        if (iconSizeEnum === info.ENUM) {
            width = info.WIDTH;
            height = info.HEIGHT;
            iconSize = info.ICON_SIZE;
        }
    });
    return {width, height, iconSize};
}

export function getCategoryDetails(currentCategory) {
    const extensionPath = ArcMenuManager.extension.path;

    let name, gicon, fallbackIcon = null;

    for (const entry of Constants.Categories) {
        if (entry.CATEGORY === currentCategory) {
            name = entry.NAME;
            gicon = Gio.icon_new_for_string(entry.ICON);
            return [name, gicon, fallbackIcon];
        }
    }

    if (currentCategory === Constants.CategoryType.HOME_SCREEN) {
        name = _('Home');
        gicon = Gio.icon_new_for_string('computer-symbolic');
        return [name, gicon, fallbackIcon];
    } else {
        name = currentCategory.get_name();
        const categoryIcon = currentCategory.get_icon();
        const fallbackIconDirectory = `${extensionPath}/icons/category-icons/`;

        if (!categoryIcon) {
            gicon = null;
            fallbackIcon = Gio.icon_new_for_string(`${fallbackIconDirectory}applications-other-symbolic.svg`);
            return [name, gicon, fallbackIcon];
        }

        const categoryIconName = categoryIcon.to_string();
        const symbolicName = `${categoryIconName}-symbolic`;
        const symbolicIconFile = `${symbolicName}.svg`;

        gicon = categoryIcon;

        fallbackIcon = Gio.icon_new_for_string(`${fallbackIconDirectory}${symbolicIconFile}`);
        return [name, gicon, fallbackIcon];
    }
}

export function getPowerTypeFromShortcutCommand(command) {
    switch (command) {
    case Constants.ShortcutCommands.LOG_OUT:
        return Constants.PowerType.LOGOUT;
    case Constants.ShortcutCommands.LOCK:
        return Constants.PowerType.LOCK;
    case Constants.ShortcutCommands.POWER_OFF:
        return Constants.PowerType.POWER_OFF;
    case Constants.ShortcutCommands.RESTART:
        return Constants.PowerType.RESTART;
    case Constants.ShortcutCommands.SUSPEND:
        return Constants.PowerType.SUSPEND;
    case Constants.ShortcutCommands.HYBRID_SLEEP:
        return Constants.PowerType.HYBRID_SLEEP;
    case Constants.ShortcutCommands.HIBERNATE:
        return Constants.PowerType.HIBERNATE;
    case Constants.ShortcutCommands.SWITCH_USER:
        return Constants.PowerType.SWITCH_USER;
    default:
        return Constants.PowerType.POWER_OFF;
    }
}

export function getMenuButtonIcon(path) {
    const extensionPath = ArcMenuManager.extension.path;
    const {settings} = ArcMenuManager;

    const iconType = settings.get_enum('menu-button-icon');
    const iconDirectory = `${extensionPath}/icons/hicolor/16x16/actions/`;

    if (iconType === Constants.MenuIconType.CUSTOM) {
        if (path && GLib.file_test(path, GLib.FileTest.IS_REGULAR))
            return path;
    } else if (iconType === Constants.MenuIconType.DISTRO_ICON) {
        const iconEnum = settings.get_int('distro-icon');
        const iconPath = `${iconDirectory + Constants.DistroIcons[iconEnum].PATH}.svg`;
        if (GLib.file_test(iconPath, GLib.FileTest.IS_REGULAR))
            return iconPath;
    } else {
        const iconEnum = settings.get_int('arc-menu-icon');
        const iconPath = `${iconDirectory + Constants.MenuIcons[iconEnum].PATH}.svg`;
        if (Constants.MenuIcons[iconEnum].PATH === 'view-app-grid-symbolic')
            return 'view-app-grid-symbolic';
        else if (GLib.file_test(iconPath, GLib.FileTest.IS_REGULAR))
            return iconPath;
    }

    log('ArcMenu Error - Failed to set menu button icon. Set to System Default.');
    return 'start-here-symbolic';
}

export function findSoftwareManager() {
    const appSys = Shell.AppSystem.get_default();

    for (const softwareManagerID of Constants.SoftwareManagerIDs) {
        if (appSys.lookup_app(softwareManagerID))
            return softwareManagerID;
    }

    return 'ArcMenu_InvalidShortcut.desktop';
}

export function areaOfTriangle(p1, p2, p3) {
    return Math.abs((p1[0] * (p2[1] - p3[1]) + p2[0] * (p3[1] - p1[1]) + p3[0] * (p1[1] - p2[1])) / 2.0);
}

// modified from GNOME shell's ensureActorVisibleInScrollView()
export function ensureActorVisibleInScrollView(actor, axis = Clutter.Orientation.VERTICAL) {
    let box = actor.get_allocation_box();
    let {y1} = box, {y2} = box;
    let {x1} = box, {x2} = box;

    let parent = actor.get_parent();
    while (!(parent instanceof St.ScrollView)) {
        if (!parent)
            return;

        box = parent.get_allocation_box();
        y1 += box.y1;
        y2 += box.y1;
        x1 += box.x1;
        x2 += box.x1;
        parent = parent.get_parent();
    }

    const isVertical = axis === Clutter.Orientation.VERTICAL;
    const {adjustment} = isVertical ? parent.vscroll : parent.hscroll;
    const [startPoint, endPoint] = isVertical ? [y1, y2] : [x1, x2];
    const [value, lower_, upper, stepIncrement_, pageIncrement_, pageSize] = adjustment.get_values();

    let offset = 0;
    let newValue;

    const fade = parent.get_effect('fade');
    if (fade)
        offset = isVertical ? fade.fade_margins.top : fade.fade_margins.left;

    if (startPoint < value + offset)
        newValue = Math.max(0, startPoint - offset);
    else if (endPoint > value + pageSize - offset)
        newValue = Math.min(upper, endPoint + offset - pageSize);
    else
        return;

    adjustment.ease(newValue, {
        mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        duration: 100,
    });
}

export function openPrefs(uuid) {
    const extension = Extension.lookupByUUID(uuid);
    if (extension !== null)
        extension.openPreferences();
}

export function getDashToPanelPosition(settings, index) {
    var positions = null;
    var side = 'NONE';

    try {
        positions = JSON.parse(settings.get_string('panel-positions'));
        side = positions[index];
    } catch (e) {
        log(`Error parsing Dash to Panel positions: ${e.message}`);
    }

    if (side === 'TOP')
        return St.Side.TOP;
    else if (side === 'RIGHT')
        return St.Side.RIGHT;
    else if (side === 'BOTTOM')
        return St.Side.BOTTOM;
    else if (side === 'LEFT')
        return St.Side.LEFT;
    else
        return St.Side.BOTTOM;
}
