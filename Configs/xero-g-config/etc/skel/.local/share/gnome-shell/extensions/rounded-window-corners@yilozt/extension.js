// imports.gi
import Graphene      from 'gi://Graphene'
import Clutter      from 'gi://Clutter'
import Meta      from 'gi://Meta'
import GObject      from 'gi://GObject'

// gnome-shell modules
import { WindowPreview } from 'resource:///org/gnome/shell/ui/windowPreview.js'
import { overview, layoutManager } from 'resource:///org/gnome/shell/ui/main.js'
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import { WorkspaceAnimationController } from 'resource:///org/gnome/shell/ui/workspaceAnimation.js'

// local modules
import { constants } from './utils/constants.js'
import { stackMsg, _log } from './utils/log.js'
import * as UI from './utils/ui.js'
import { connections } from './utils/connections.js'
import { init_settings, settings } from './utils/settings.js'
import { Services } from './dbus/services.js'
import { LinearFilterEffect } from './effect/linear_filter_effect.js'
import { RoundedCornersEffect } from './effect/rounded_corners_effect.js'
import { WindowActorTracker } from './manager/effect_manager.js'


// --------------------------------------------------------------- [end imports]

export default class RoundedWindowCorners extends Extension {
  constructor () {
    super (...arguments)

    this._services = null
    this._window_actor_tracker = null
  }

  enable () {
    init_settings (this.getSettings ())

    // Restore original methods, those methods will be restore when
    // extensions is disabled
    this._orig_add_window = WindowPreview.prototype._addWindow
    this._orig_prep_worksapce_swt =
      WorkspaceAnimationController.prototype._prepareWorkspaceSwitch
    this._orig_finish_workspace_swt =
      WorkspaceAnimationController.prototype._finishWorkspaceSwitch

    this._services = new Services ()
    this._window_actor_tracker = new WindowActorTracker ()

    this._services.export ()

    // Enable rounded corners effects when gnome-shell is ready
    //
    // https://github.com/aunetx/blur-my-shell/blob/
    //  21d4bbde15acf7c3bf348f7375a12f7b14c3ab6f/src/extension.js#L87

    if (layoutManager._startingUp) {
      const id = layoutManager.connect ('startup-complete', () => {
        this._window_actor_tracker?.enable ()
        if (settings ().enable_preferences_entry) {
          UI.SetupBackgroundMenu ()
        }
        layoutManager.disconnect (id)
      })
    } else {
      this._window_actor_tracker?.enable ()
      if (settings ().enable_preferences_entry) {
        UI.SetupBackgroundMenu ()
      }
    }

    const self = this

    // WindowPreview is a widgets that show content of window in overview.
    // this widget also contain a St.Label (show title of window), icon and
    // close button for window.
    //
    // When there is new window added into overview, this function will be
    // called. We need add our shadow actor and blur actor of rounded
    // corners window into overview.
    //
    WindowPreview.prototype._addWindow = function (window) {
      // call original method from gnome-shell
      self._orig_add_window.apply (this, [window])

      // Make sure patched method only be called in _init() of
      // WindowPreview
      // https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js
      // /ui/windowPreview.js#L42

      const stack = stackMsg ()
      if (
        stack === undefined ||
        stack.indexOf ('_updateAttachedDialogs') !== -1 ||
        stack.indexOf ('addDialog') !== -1
      ) {
        return
      }

      // If the window don't have rounded corners and shadows,
      // just return
      let cfg = null
      let has_rounded_corners = false
      const window_actor = window.get_compositor_private ()
      const shadow = window_actor.__rwc_rounded_window_info?.shadow
      if (shadow) {
        cfg = UI.ChoiceRoundedCornersCfg (
          settings ().global_rounded_corner_settings,
          settings ().custom_rounded_corner_settings,
          window
        )
        has_rounded_corners = UI.ShouldHasRoundedCorners (window, cfg)
      }
      if (!has_rounded_corners || !shadow) {
        return
      }

      _log (`Add shadow for ${window.title} in overview`)

      // WindowPreview.window_container used to show content of window
      const window_container = this.window_container
      let first_child = window_container.first_child

      // Set linear filter to let it looks better
      first_child?.add_effect (new LinearFilterEffect ())

      // Add a clone of shadow to overview
      const shadow_clone = new OverviewShadowActor (shadow, this)
      for (const prop of ['scale-x', 'scale-y']) {
        window_container.bind_property (prop, shadow_clone, prop, 1)
      }
      this.insert_child_below (shadow_clone, window_container)
      let rounded_effect_of_window_actor = null
      if (UI.shell_version () >= 43) {
        // Name of rounded corners effect added to preview window
        const name = 'Rounded Corners Effect (Overview)'

        // Disabled rounded corners of window temporarily when enter overview
        rounded_effect_of_window_actor =
          UI.get_rounded_corners_effect (window_actor)
        rounded_effect_of_window_actor?.set_enabled (false)

        // Add rounded corners effect to preview window actor
        first_child?.add_effect_with_name (name, new RoundedCornersEffect ())

        // Update uniform variables of rounded corners effect when size of
        // preview windows in overview changed.
        const c = connections.get ()
        c.connect (this, 'notify::width', () => {
          const rounded_effect_of_preview_window = first_child?.get_effect (name)
          if (!rounded_effect_of_preview_window) {
            return
          }

          const buf_rect = window.get_buffer_rect ()
          const frame_rect = window.get_frame_rect ()
          const scaled = this.window_container.get_width () / frame_rect.width
          const x1 = (frame_rect.x - buf_rect.x) * scaled
          const y1 = (frame_rect.y - buf_rect.y) * scaled
          const x2 = x1 + frame_rect.width * scaled
          const y2 = y1 + frame_rect.height * scaled

          const scale_factor = UI.WindowScaleFactor (window) * scaled
          let pixel_step = undefined
          if (
            UI.shell_version () >= 43.1 &&
            window.get_client_type () == Meta.WindowClientType.WAYLAND
          ) {
            const surface = window.get_compositor_private ().first_child
            pixel_step = [
              1.0 / (scale_factor * surface.get_width ()),
              1.0 / (scale_factor * surface.get_height ()),
            ]
          }
          rounded_effect_of_preview_window.update_uniforms (
            scale_factor,
            settings ().global_rounded_corner_settings,
            { x1, y1, x2, y2 },
            { width: 0, color: [0, 0, 0, 0] },
            pixel_step
          )
        })
      }

      // Disconnect all signals when Window preview in overview is destroy
      c.connect (this, 'destroy', () => {
        shadow_clone.destroy ()
        first_child?.clear_effects ()
        first_child = null

        // Enabled rounded corners of window actor when leaving overview,
        // works for gnome 43.
        if (overview._overview.controls._workspacesDisplay._leavingOverview) {
          rounded_effect_of_window_actor?.set_enabled (true)
        }

        c.disconnect_all (this)
      })
    }

    // Just Like the monkey patch when enter overview, need to add cloned shadow
    // actor when switching workspaces on Desktop
    WorkspaceAnimationController.prototype._prepareWorkspaceSwitch = function (
      workspaceIndices
    ) {
      self._orig_prep_worksapce_swt.apply (this, [workspaceIndices])
      for (const monitor of this._switchData.monitors) {
        for (const workspace of monitor._workspaceGroups) {
          // Let shadow actor always behind the window clone actor when we
          // switch workspace by Ctrl+Alt+Left/Right
          //
          // Fix #55
          const restacked_id = global.display.connect ('restacked', () => {
            workspace._windowRecords.forEach (({ clone }) => {
              const shadow = clone._shadow_clone
              if (shadow) {
                workspace.set_child_below_sibling (shadow, clone)
              }
            })
          })
          const destroy_id = workspace.connect ('destroy', () => {
            global.display.disconnect (restacked_id)
            workspace.disconnect (destroy_id)
          })

          workspace._windowRecords.forEach (({ windowActor: actor, clone }) => {
            const win = actor.meta_window
            const frame_rect = win.get_frame_rect ()
            const shadow = actor.__rwc_rounded_window_info?.shadow
            const enabled = UI.get_rounded_corners_effect (actor)?.enabled
            if (shadow && enabled) {
              // Only create shadow actor when window should have rounded
              // corners when switching workspace

              // Copy shadow actor to workspace group, so that to see
              // shadow when switching workspace
              const shadow_clone = new Clutter.Clone ({ source: shadow })
              const paddings =
                constants.SHADOW_PADDING * UI.WindowScaleFactor (win)

              shadow_clone.width = frame_rect.width + paddings * 2
              shadow_clone.height = frame_rect.height + paddings * 2
              shadow_clone.x = clone.x + frame_rect.x - actor.x - paddings
              shadow_clone.y = clone.y + frame_rect.y - actor.y - paddings

              // Should works well work Desktop Cube extensions
              clone.connect (
                'notify::translation-z',
                () => (shadow_clone.translation_z = clone.translation_z - 0.05)
              )
              clone._shadow_clone = shadow_clone
              clone.bind_property ('visible', shadow_clone, 'visible', 0)
              workspace.insert_child_below (shadow_clone, clone)
            }
          })
        }
      }
    }

    WorkspaceAnimationController.prototype._finishWorkspaceSwitch = function (
      switchData
    ) {
      for (const monitor of this._switchData.monitors) {
        for (const workspace of monitor._workspaceGroups) {
          workspace._windowRecords.forEach (({ clone }) => {
            clone._shadow_clone?.destroy ()
            delete clone._shadow_clone
          })
        }
      }
      self._orig_finish_workspace_swt.apply (this, [switchData])
    }

    const c = connections.get ()

    // Gnome-shell will not disable extensions when _logout/shutdown/restart
    // system, it means that the signal handlers will not be cleaned when
    // gnome-shell is closing.
    //
    // Now clear all resources manually before gnome-shell closes
    c.connect (global.display, 'closing', () => {
      _log ('Clear all resources because gnome-shell is shutdown')
      this.disable ()
    })

    // Watch changes of GSettings
    c.connect (settings ().g_settings, 'changed', (_, k) => {
      switch (k) {
      case 'enable-preferences-entry':
        settings ().enable_preferences_entry
          ? UI.SetupBackgroundMenu ()
          : UI.RestoreBackgroundMenu ()
        break
      }
    })

    _log ('Enabled')
  }

  disable () {
    // Restore patched methods
    WindowPreview.prototype._addWindow = this._orig_add_window
    WorkspaceAnimationController.prototype._prepareWorkspaceSwitch =
      this._orig_prep_worksapce_swt
    WorkspaceAnimationController.prototype._finishWorkspaceSwitch =
      this._orig_finish_workspace_swt

    // Remove the item to open preferences page in background menu
    UI.RestoreBackgroundMenu ()

    this._services?.unexport ()
    this._window_actor_tracker?.disable ()

    // Disconnect all signals in global connections.get()
    connections.get ().disconnect_all ()
    connections.del ()

    // Set all props to null
    this._window_actor_tracker = null
    this._services = null

    _log ('Disabled')
  }
}

/**
 * Copy shadow of rounded corners window and show it in overview.
 * This actor will be created when window preview has created for overview
 */
const OverviewShadowActor = GObject.registerClass (
  {},
  class extends Clutter.Clone {
    /**
     * Create shadow actor for WindowPreview in overview
     * @param source the shadow actor create for rounded corners shadow
     * @param window_preview the window preview has shown in overview
     */
    _init (source, window_preview) {
      super._init ({
        source,
        name: constants.OVERVIEW_SHADOW_ACTOR,
        pivot_point: new Graphene.Point ({ x: 0.5, y: 0.5 }),
      })

      this._window_preview = window_preview
    }

    /**
     * Recompute the position and size of shadow in overview
     * This virtual function will be called when we:
     * - entering/closing overview
     * - dragging window
     * - position and size of window preview in overview changed
     * @param box The bound box of shadow actor
     */
    vfunc_allocate (box) {
      const leaving_overview =
        overview._overview.controls._workspacesDisplay._leavingOverview

      // The window container that shown in overview
      const window_container_box = leaving_overview
        ? this._window_preview.window_container.get_allocation_box ()
        : this._window_preview.get_allocation_box ()

      // Meta.Window contain the all information about a window
      const meta_win = this._window_preview._windowActor.get_meta_window ()
      if (!meta_win) {
        return
      }

      // As we known, preview shown in overview has been scaled
      // in overview
      const container_scaled =
        window_container_box.get_width () / meta_win.get_frame_rect ().width
      const paddings =
        constants.SHADOW_PADDING *
        container_scaled *
        UI.WindowScaleFactor (meta_win)

      // Setup bounds box of shadow actor
      box.set_origin (-paddings, -paddings)
      box.set_size (
        window_container_box.get_width () + 2 * paddings,
        window_container_box.get_height () + 2 * paddings
      )

      // Make bounds box effect actor
      super.vfunc_allocate (box)
    }
  }
)
