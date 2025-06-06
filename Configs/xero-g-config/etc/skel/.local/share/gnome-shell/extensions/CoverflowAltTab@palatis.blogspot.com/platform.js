/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

/*
    This file is part of CoverflowAltTab.

    CoverflowAltTab is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    CoverflowAltTab is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with CoverflowAltTab.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
 * CoverflowAltTab::Platform
 *
 * Originally, created to be helper classes to handle Gnome Shell and Cinnamon differences.
 */

import St from 'gi://St';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Clutter from 'gi://Clutter';
import Shell from 'gi://Shell';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Background from 'resource:///org/gnome/shell/ui/background.js';
import {__ABSTRACT_METHOD__} from './lib.js'

import {Switcher} from './switcher.js';
import {CoverflowSwitcher} from './coverflowSwitcher.js';
import {TimelineSwitcher} from './timelineSwitcher.js';

const POSITION_TOP = 1;
const POSITION_BOTTOM = 7;
const DESKTOP_INTERFACE_SCHEMA = 'org.gnome.desktop.interface';
const KEY_TEXT_SCALING_FACTOR = 'text-scaling-factor';

const TRANSITION_TYPE = 'easeOutQuad';

const modes = [
    Clutter.AnimationMode.EASE_IN_BOUNCE,
    Clutter.AnimationMode.EASE_OUT_BOUNCE,
    Clutter.AnimationMode.EASE_IN_OUT_BOUNCE,
    Clutter.AnimationMode.EASE_IN_BACK,
    Clutter.AnimationMode.EASE_OUT_BACK,
    Clutter.AnimationMode.EASE_IN_OUT_BACK,
    Clutter.AnimationMode.EASE_IN_ELASTIC,
    Clutter.AnimationMode.EASE_OUT_ELASTIC,
    Clutter.AnimationMode.EASE_IN_OUT_ELASTIC,
    Clutter.AnimationMode.EASE_IN_QUAD,
    Clutter.AnimationMode.EASE_OUT_QUAD,
    Clutter.AnimationMode.EASE_IN_OUT_QUAD,
    Clutter.AnimationMode.EASE_IN_CUBIC,
    Clutter.AnimationMode.EASE_OUT_CUBIC,
    Clutter.AnimationMode.EASE_IN_OUT_CUBIC,
    Clutter.AnimationMode.EASE_IN_QUART,
    Clutter.AnimationMode.EASE_OUT_QUART,
    Clutter.AnimationMode.EASE_IN_OUT_QUART,
    Clutter.AnimationMode.EASE_IN_QUINT,
    Clutter.AnimationMode.EASE_OUT_QUINT,
    Clutter.AnimationMode.EASE_IN_OUT_QUINT,
    Clutter.AnimationMode.EASE_IN_SINE,
    Clutter.AnimationMode.EASE_OUT_SINE,
    Clutter.AnimationMode.EASE_IN_OUT_SINE,
    Clutter.AnimationMode.EASE_IN_EXPO,
    Clutter.AnimationMode.EASE_OUT_EXPO,
    Clutter.AnimationMode.EASE_IN_OUT_EXPO,
    Clutter.AnimationMode.EASE_IN_CIRC,
    Clutter.AnimationMode.EASE_OUT_CIRC,
    Clutter.AnimationMode.EASE_IN_OUT_CIRC,
    Clutter.AnimationMode.LINEAR
];

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

class AbstractPlatform {
    enable() { __ABSTRACT_METHOD__(this, this.enable) }
    disable() { __ABSTRACT_METHOD__(this, this.disable) }

    getWidgetClass() { __ABSTRACT_METHOD__(this, this.getWidgetClass) }
    getWindowTracker() { __ABSTRACT_METHOD__(this, this.getWindowTracker) }
    getPrimaryModifier(mask) { __ABSTRACT_METHOD__(this, this.getPrimaryModifier) }

    getSettings() { __ABSTRACT_METHOD__(this, this.getSettings) }

    tween(actor, params) { __ABSTRACT_METHOD__(this, this.tween) }
    removeTweens(actor) { __ABSTRACT_METHOD__(this, this.removeTweens) }

    getDefaultSettings() {
        return {
            animation_time: 0.2,
            randomize_animation_times: false,
            dim_factor: 0,
            title_position: POSITION_BOTTOM,
            icon_style: 'Classic',
            icon_has_shadow: false,
            overlay_icon_size: 128,
            overlay_icon_opacity: 1,
            text_scaling_factor: 1,
            offset: 0,
            hide_panel: true,
            enforce_primary_monitor: true,
            switcher_class: Switcher,
            easing_function: 'ease-out-cubic',
            current_workspace_only: '1',
            switch_per_monitor: false,
            preview_to_monitor_ratio: 0.5,
            preview_scaling_factor: 0.75,
            bind_to_switch_applications: true,
            bind_to_switch_windows: true,
            perspective_correction_method: "Move Camera",
            highlight_mouse_over: false,
            raise_mouse_over: true,
            switcher_looping_method: 'Flip Stack',
            switch_application_behaves_like_switch_windows: false,
            blur_sigma: 4,
            desaturate_factor: 0.0,
            tint_color: (0., 0., 0., 0.),
            use_theme_color_for_tint_color: false,
            use_glitch_effect: false,
            use_tint: false,
            invert_swipes: false,
        };
    }

    initBackground() {
    	this._background = Meta.BackgroundActor.new_for_screen(global.screen);
		this._background.hide();
        global.overlay_group.add_actor(this._background);
    }

    dimBackground() {
        this._background.show();
        this.tween(this._background, {
            dim_factor: this._settings.dim_factor,
            time: this._settings.animation_time,
            transition: TRANSITION_TYPE
      });
    }

    removeBackground() {
    	global.overlay_group.remove_actor(this._background);
    }
}

export class PlatformGnomeShell extends AbstractPlatform {
    constructor(settings, ...args) {
        super(...args);

        this._settings = null;
        this._connections = null;
        this._extensionSettings = settings;
        this._desktopSettings = null;
        this._settings_changed_callbacks = null;
    }

    enable() {
        this._settings_changed_callbacks = [];

        if (this._desktopSettings == null)
            this._desktopSettings = new Gio.Settings({ schema_id: DESKTOP_INTERFACE_SCHEMA });

        let keys = [
            "animation-time",
            "randomize-animation-times",
            "dim-factor",
            "position",
            "icon-style",
            "icon-has-shadow",
            "overlay-icon-size",
            "overlay-icon-opacity",
            "offset",
            "hide-panel",
            "enforce-primary-monitor",
            "easing-function",
            "current-workspace-only",
            "switch-per-monitor",
            "switcher-style",
            "preview-to-monitor-ratio",
            "preview-scaling-factor",
            "bind-to-switch-applications",
            "bind-to-switch-windows",
            "perspective-correction-method",
            "highlight-mouse-over",
            "raise-mouse-over",
            "desaturate-factor",
            "blur-sigma",
            "switcher-looping-method",
            "switch-application-behaves-like-switch-windows",
            "use-tint",
            "tint-color",
            "use-theme-color-for-tint-color",
            "use-glitch-effect",
            "invert-swipes",
        ];

        let dkeys = [
            KEY_TEXT_SCALING_FACTOR,
        ];

        this._connections = [];
        for (let key of keys) {
            let bind = this._onSettingsChanged.bind(this, key);
            this._connections.push(this._extensionSettings.connect('changed::' + key, bind));
        }

        this._dconnections = [];
        for (let dkey of dkeys) {
            let bind = this._onSettingsChanged.bind(this, dkey);
            this._dconnections.push(this._desktopSettings.connect('changed::' + dkey, bind));
        }

        this._settings = this._loadSettings();
    }

    disable() {
        this.showPanels(0);
        if (this._connections) {
            for (let connection of this._connections) {
                this._extensionSettings.disconnect(connection);
            }
            this._connections = null;
        }
        if (this._dconnections) {
            for (let dconnection of this._dconnections) {
                this._desktopSettings.disconnect(dconnection);
            }
        }
        this._settings = null;
    }

    getWidgetClass() {
        return St.Widget;
    }

    getWindowTracker() {
        return Shell.WindowTracker.get_default();
    }

    getPrimaryModifier(mask) {
        if (mask === 0)
            return 0;
    
        let primary = 1;
        while (mask > 1) {
            mask >>= 1;
            primary <<= 1;
        }
        return primary;
    }

    getSettings() {
        if (!this._settings) {
            this._settings = this._loadSettings();
        }
        return this._settings;
    }

    addSettingsChangedCallback(cb) {
        cb(this._extensionSettings);
        this._settings_changed_callbacks.push(cb);
    }

    _onSettingsChanged(key) {
        this._settings = null;
        for (let cb of this._settings_changed_callbacks) {
            cb(this._extensionSettings, key);
        }
    }


    _loadSettings() {
        try {
            let settings = this._extensionSettings;
            let dsettings = this._desktopSettings;
            let tint_color = settings.get_value("tint-color").deep_unpack();
            return {
                animation_time: settings.get_double("animation-time"),
                randomize_animation_times: settings.get_boolean("randomize-animation-times"),
                dim_factor: clamp(settings.get_double("dim-factor"), 0, 1),
                title_position: (settings.get_string("position") == 'Top' ? POSITION_TOP : POSITION_BOTTOM),
                icon_style: (settings.get_string("icon-style") == 'Overlay' ? 'Overlay' : 'Classic'),
                icon_has_shadow: settings.get_boolean("icon-has-shadow"),
                overlay_icon_size: clamp(settings.get_double("overlay-icon-size"), 0, 1024),
                overlay_icon_opacity: clamp(settings.get_double("overlay-icon-opacity"), 0, 1),
                text_scaling_factor: dsettings.get_double(KEY_TEXT_SCALING_FACTOR),
                offset: settings.get_int("offset"),
                hide_panel: settings.get_boolean("hide-panel"),
                enforce_primary_monitor: settings.get_boolean("enforce-primary-monitor"),
                easing_function: settings.get_string("easing-function"),
                switcher_class: settings.get_string("switcher-style") === 'Timeline'
                    ? TimelineSwitcher : CoverflowSwitcher,
                current_workspace_only: settings.get_string("current-workspace-only"),
                switch_per_monitor: settings.get_boolean("switch-per-monitor"),
                preview_to_monitor_ratio: clamp(settings.get_double("preview-to-monitor-ratio"), 0, 1),
                preview_scaling_factor: clamp(settings.get_double("preview-scaling-factor"), 0, 1),
                bind_to_switch_applications: settings.get_boolean("bind-to-switch-applications"),
                bind_to_switch_windows: settings.get_boolean("bind-to-switch-windows"),
                perspective_correction_method: settings.get_string("perspective-correction-method"),
                highlight_mouse_over: settings.get_boolean("highlight-mouse-over"),
                raise_mouse_over: settings.get_boolean("raise-mouse-over"),
                desaturate_factor: settings.get_double("desaturate-factor") === 1.0 ? 0.999 : settings.get_double("desaturate-factor"),
                blur_sigma: settings.get_int("blur-sigma"),
                switcher_looping_method: settings.get_string("switcher-looping-method"),
                switch_application_behaves_like_switch_windows: settings.get_boolean("switch-application-behaves-like-switch-windows"),
                tint_color: settings.get_value("tint-color").deep_unpack(),
                use_theme_color_for_tint_color: settings.get_boolean("use-theme-color-for-tint-color"),
                use_glitch_effect: settings.get_boolean("use-glitch-effect"),
                use_tint: settings.get_boolean("use-tint"),
                invert_swipes: settings.get_boolean("invert-swipes"),
            };
        } catch (e) {
            global.log(e);
        }

        return this.getDefaultSettings();
    }

    tween(actor, params) {
        params.duration = params.time * 1000;
        if (params.transition == 'userChoice' && this.getSettings().easing_function == 'random' ||
            params.transition == 'Random') {
            params.mode = modes[Math.floor(Math.random()*modes.length)];
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-bounce" ||
            params.transition == 'easeInBounce') {
            params.mode = Clutter.AnimationMode.EASE_IN_BOUNCE;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-bounce" ||
            params.transition == 'easeOutBounce') {
            params.mode = Clutter.AnimationMode.EASE_OUT_BOUNCE;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-bounce" ||
            params.transition == 'easeInOutBounce') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_BOUNCE;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-back" ||
            params.transition == 'easeInBack') {
            params.mode = Clutter.AnimationMode.EASE_IN_BACK;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-back" ||
            params.transition == 'easeOutBack') {
            params.mode = Clutter.AnimationMode.EASE_OUT_BACK;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-back" ||
            params.transition == 'easeInOutBack') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_BACK;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-elastic" ||
            params.transition == 'easeInElastic') {
            params.mode = Clutter.AnimationMode.EASE_IN_ELASTIC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-elastic" ||
            params.transition == 'easeOutElastic') {
            params.mode = Clutter.AnimationMode.EASE_OUT_ELASTIC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-elastic" ||
            params.transition == 'easeInOutElastic') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_ELASTIC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-quad" ||
            params.transition == 'easeInQuad') {
            params.mode = Clutter.AnimationMode.EASE_IN_QUAD;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out_quad" ||
            params.transition == 'easeOutQuad') {
            params.mode = Clutter.AnimationMode.EASE_OUT_QUAD;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-quad" ||
            params.transition == 'easeInOutQuad') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_QUAD;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-cubic" ||
            params.transition == 'easeInCubic') {
            params.mode = Clutter.AnimationMode.EASE_IN_CUBIC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-cubic" ||
            params.transition == 'easeOutCubic') {
            params.mode = Clutter.AnimationMode.EASE_OUT_CUBIC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-cubic" ||
            params.transition == 'easeInOutCubic') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_CUBIC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-quart" ||
            params.transition == 'easeInQuart') {
            params.mode = Clutter.AnimationMode.EASE_IN_QUART;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-quart" ||
            params.transition == 'easeOutQuart') {
            params.mode = Clutter.AnimationMode.EASE_OUT_QUART;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-quart" ||
            params.transition == 'easeInOutQuart') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_QUART;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-quint" ||
            params.transition == 'easeInQuint') {
            params.mode = Clutter.AnimationMode.EASE_IN_QUINT;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-quint" ||
            params.transition == 'easeOutQuint') {
            params.mode = Clutter.AnimationMode.EASE_OUT_QUINT;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-quint" ||
            params.transition == 'easeInOutQuint') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_QUINT;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-sine" ||
            params.transition == 'easeInSine') {
            params.mode = Clutter.AnimationMode.EASE_IN_SINE;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-sine" ||
            params.transition == 'easeOutSine') {
            params.mode = Clutter.AnimationMode.EASE_OUT_SINE;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-sine" ||
            params.transition == 'easeInOutSine') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_SINE;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-expo" ||
            params.transition == 'easeInExpo') {
            params.mode = Clutter.AnimationMode.EASE_IN_EXPO;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-expo" ||
            params.transition == 'easeOutExpo') {
            params.mode = Clutter.AnimationMode.EASE_OUT_EXPO;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-expo" ||
            params.transition == 'easeInOutExpo') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_EXPO;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-circ" ||
            params.transition == 'easeInCirc') {
            params.mode = Clutter.AnimationMode.EASE_IN_CIRC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-out-circ" ||
            params.transition == 'easeOutCirc') {
            params.mode = Clutter.AnimationMode.EASE_OUT_CIRC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-in-out-circ" ||
            params.transition == 'easeInOutCirc') {
            params.mode = Clutter.AnimationMode.EASE_IN_OUT_CIRC;
        } else if (params.transition == 'userChoice' && this.getSettings().easing_function == "ease-linear" ||
            params.transition == 'easeLinear') {
            params.mode = Clutter.AnimationMode.LINEAR;
        } else {
            global.log("Could not find Clutter AnimationMode", params.transition, this.getSettings().easing_function);
        }

        if (params.onComplete) {
            if (params.onCompleteParams && params.onCompleteScope) {
                params.onComplete = params.onComplete.bind(params.onCompleteScope, ...params.onCompleteParams);
            } else if (params.onCompleteParams) {
                params.onComplete = params.onComplete.bind(null, params.onCompleteParams);
            } else if (params.onCompleteScope) {
                params.onComplete = params.onComplete.bind(params.onCompleteScope);
            }
        }

        actor.ease(params);
    }

    removeTweens(actor) {
        actor.remove_all_transitions();
    }

    initBackground() {
    	this._backgroundGroup = new Meta.BackgroundGroup();
        Main.layoutManager.uiGroup.add_child(this._backgroundGroup);
    	if (this._backgroundGroup.lower_bottom) {
	        this._backgroundGroup.lower_bottom();
        } else {
	        Main.uiGroup.set_child_below_sibling(this._backgroundGroup, null);
        }
        
        this._backgroundShade = new Clutter.Actor({ 
            opacity: 0, 
            reactive: false
        });

        let constraint = Clutter.BindConstraint.new(this._backgroundGroup,
            Clutter.BindCoordinate.ALL, 0);
        this._backgroundShade.add_constraint(constraint);

        let shade = new MyRadialShaderEffect({name: 'shade'});
        shade.brightness = 1;
        shade.sharpness = 1 - this._settings.dim_factor;

        this._backgroundShade.add_effect(shade);
        
        this._backgroundGroup.add_actor(this._backgroundShade);
        this._backgroundGroup.set_child_above_sibling(this._backgroundShade, null);
    
        this._backgroundGroup.hide();
        for (let i = 0; i < Main.layoutManager.monitors.length; i++) {
            new Background.BackgroundManager({
                container: this._backgroundGroup,
                monitorIndex: i,
                vignette: false,
            });
        }
    }

    hidePanels() {
        let panels = this.getPanels();
        for (let panel of panels) {
            try {
                let panelActor = (panel instanceof Clutter.Actor) ? panel : panel.actor;
                panelActor.set_reactive(false);
                this.tween(panelActor, {
                    opacity: 0,
                    time: this._settings.animation_time,
                    transition: 'easeInOutQuint'
                });
            } catch (e) {
                log(e);
                // ignore fake panels
            }
        }
    }

     dimBackground() {
        if (this._settings.hide_panel) {
            this.hidePanels();
        }
        // hide gnome-shell legacy tray
        try {
            if (Main.legacyTray) {
                Main.legacyTray.actor.hide();
            }
        } catch (e) {
            // ignore missing legacy tray
        }
        this._backgroundGroup.show();
        this.tween(this._backgroundShade, {
            opacity: 255,
            time: this._settings.animation_time,
            transition: 'easeInOutQuint',
        });
    }

    showPanels(time) {
        // panels
        let panels = this.getPanels();
        for (let panel of panels){
            try {
                let panelActor = (panel instanceof Clutter.Actor) ? panel : panel.actor;
                panelActor.set_reactive(true);
                if (this._settings.hide_panel) {
                    this.removeTweens(panelActor);
                    this.tween(panelActor, {
                        opacity: 255,
                        time: time,
                        transition: 'easeInOutQuint'
                    });
                }
            } catch (e) {
                //ignore fake panels
            }
        }
    }

    lightenBackground() {
        if (this._settings.hide_panel) {
            this.showPanels(this._settings.animation_time);
        }
        // show gnome-shell legacy trayconn
        try {
            if (Main.legacyTray) {
                Main.legacyTray.actor.show();
            }
        } catch (e) {
            //ignore missing legacy tray
        }

        this.tween(this._backgroundShade, {
            time: this._settings.animation_time * 0.95,
            transition: 'easeInOutQuint',
            opacity: 0,
        });

    }

    removeBackground() {
        this._backgroundGroup.destroy();
    }

    getPanels() {
        let panels = [Main.panel];
        if (Main.panel2)
            panels.push(Main.panel2);
        // gnome-shell dash
        if (Main.overview._dash)
            panels.push(Main.overview._dash);
        return panels;
    }


}

const VIGNETTE_DECLARATIONS = '                                              \
uniform float brightness;                                                  \n\
uniform float vignette_sharpness;                                          \n\
float rand(vec2 p) {                                                       \n\
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);        \n\
}                                                                          \n';

const VIGNETTE_CODE = '                                                      \
cogl_color_out.a = cogl_color_in.a;                                        \n\
cogl_color_out.rgb = vec3(0.0, 0.0, 0.0);                                  \n\
vec2 position = cogl_tex_coord_in[0].xy - 0.5;                             \n\
float t = clamp(length(1.41421 * position), 0.0, 1.0);                     \n\
float pixel_brightness = mix(1.0, 1.0 - vignette_sharpness, t);            \n\
cogl_color_out.a *= 1.0 - pixel_brightness * brightness;                   \n\
cogl_color_out.a += (rand(position) - 0.5) / 100.0;                        \n';

const MyRadialShaderEffect = GObject.registerClass({
    Properties: {
        'brightness': GObject.ParamSpec.float(
            'brightness', 'brightness', 'brightness',
            GObject.ParamFlags.READWRITE,
            0, 1, 1),
        'sharpness': GObject.ParamSpec.float(
            'sharpness', 'sharpness', 'sharpness',
            GObject.ParamFlags.READWRITE,
            0, 1, 0),
    },
}, class MyRadialShaderEffect extends Shell.GLSLEffect {
    _init(params) {
        this._brightness = undefined;
        this._sharpness = undefined;

        super._init(params);

        this._brightnessLocation = this.get_uniform_location('brightness');
        this._sharpnessLocation = this.get_uniform_location('vignette_sharpness');

        this.brightness = 1.0;
        this.sharpness = 0.0;
    }

    vfunc_build_pipeline() {
        this.add_glsl_snippet(Shell.SnippetHook.FRAGMENT,
            VIGNETTE_DECLARATIONS, VIGNETTE_CODE, true);
    }

    get brightness() {
        return this._brightness;
    }

    set brightness(v) {
        if (this._brightness === v)
            return;
        this._brightness = v;
        this.set_uniform_float(this._brightnessLocation,
            1, [this._brightness]);
        this.notify('brightness');
    }

    get sharpness() {
        return this._sharpness;
    }

    set sharpness(v) {
        if (this._sharpness === v)
            return;
        this._sharpness = v;
        this.set_uniform_float(this._sharpnessLocation,
            1, [this._sharpness]);
        this.notify('sharpness');
    }
});
