'use strict';

// TopHat: An elegant system resource monitor for the GNOME shell
// Copyright (C) 2020 Todd Kulesza <todd@dropline.net>

// This file is part of TopHat.

// TopHat is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// TopHat is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with TopHat. If not, see <https://www.gnu.org/licenses/>.

/* exported init, enable, disable */


import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Cpu from './lib/cpu.js';
import * as Mem from './lib/mem.js';
import * as Net from './lib/net.js';
import * as FS from './lib/fs.js';
import * as Config from './lib/config.js';
import * as Container from './lib/container.js';
import * as Problem from './lib/problem.js';

let depFailures = [];
let missingLibs = [];

const MenuPosition = {
    LEFT_EDGE: 0,
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3,
    RIGHT_EDGE: 4,
};

// Declare `tophat` in the scope of the whole script so it can
// be accessed in both `enable()` and `disable()`
let tophat = null;

class TopHat {
    constructor(settings, metadata) {
        this.configHandler = new Config.ConfigHandler(settings, metadata);
        this.container = new Container.TopHatContainer();
        this.cpu = new Cpu.CpuMonitor(this.configHandler);
        this.mem = new Mem.MemMonitor(this.configHandler);
        this.net = new Net.NetMonitor(this.configHandler);
        this.fs = new FS.FileSystemMonitor(this.configHandler);
        this.container.addMonitor(this.cpu);
        this.container.addMonitor(this.mem);
        this.container.addMonitor(this.fs);
        this.container.addMonitor(this.net);
        this.configHandler.connect_void('position-in-panel', () => {
            this.moveWithinPanel();
        });
    }

    addToPanel() {
        let pref = this._getPreferredPanelBoxAndPosition();
        Main.panel.addToStatusArea('TopHat', this.container, pref.position, pref.box);
        this.container.monitors.forEach(monitor => {
            // log(`Adding menu to manager for ${monitor.name}`);
            Main.panel.menuManager.addMenu(monitor.menu);
            monitor.refresh();
        });
    }

    moveWithinPanel() {
        let pref = this._getPreferredPanelBoxAndPosition();
        let boxes = {
            left: Main.panel._leftBox,
            center: Main.panel._centerBox,
            right: Main.panel._rightBox,
        };
        let boxContainer = boxes[pref.box] || this._rightBox;
        Main.panel._addToPanelBox('TopHat', this.container, pref.position, boxContainer);
    }

    _getPreferredPanelBoxAndPosition() {
        let box = 'right';
        let position = 0;
        switch (this.configHandler.positionInPanel) {
        case MenuPosition.LEFT_EDGE:
            box = 'left';
            position = 0;
            break;
        case MenuPosition.LEFT:
            box = 'left';
            position = -1;
            break;
        case MenuPosition.CENTER:
            box = 'center';
            position = 1;
            break;
        case MenuPosition.RIGHT:
            box = 'right';
            position = 0;
            break;
        case MenuPosition.RIGHT_EDGE:
            box = 'right';
            position = -1;
            break;
        }
        return {box, position};
    }

    destroy() {
        this.container.destroy();
        this.configHandler.destroy();
    }
}

export default class TopHatExt extends Extension
{
    constructor(metadata) {
        super(metadata);
        this.initTranslations();
    }

    enable() {
        log(`[${this.metadata.name}] enabling version ${this.metadata.version}`);

        if (depFailures.length > 0) {
            log(`[${this.metadata.name}] missing dependencies, showing problem reporter instead`);
            tophat = new Problem.TopHatProblemReporter(this.metadata);

            let msg = _(`It looks like your computer is missing GIRepository (gir) bindings for the following libraries: ${missingLibs.join(', ')}\n\nAfter installing them, you'll need to restart your computer.`);
            tophat.setMessage(msg);
            tophat.setDetails(depFailures.join('\n'));

            Main.panel.addToStatusArea(`${this.metadata.name} Problem Reporter`, tophat);
        } else {
            tophat = new TopHat(this.getSettings(), this.metadata);
            tophat.addToPanel();
        }

        log(`[${this.metadata.name}] enabled`);
    }

    disable() {
        if (tophat !== null) {
            tophat.destroy();
            tophat = null;
        }
    }
}
