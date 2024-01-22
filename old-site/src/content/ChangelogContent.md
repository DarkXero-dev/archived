# <center>.:: XeroLinux Changelog ::.</center>

<br />

Below is a list of changes/issues. Fresh install is no longer needed if you are already on **XeroLinux** unless stated otherwise. Hope you enjoy our latest release. ;)

#### - Important Changes :
<br />

- **Arch Kernel** updated to version **6.6.3**.
- **XeroTool** scripts updated thanks to my pal *@VLK*.
- **nVidia/AMD** Driver scripts optimized for better **Wayland** Support.
- **XWayland-Bridge** OOTB for Screen/Window Sharing on **Wayland**.

#### - KDE Plasma updates :
<br />

- **KDE Plasma 5** updated to version **5.27.9**.
- **KDE 5 Frameworks** updated to version **5.112**.
- **Wayland** updated to latest version & tidied up a bit.

### <center>.:: Plasma Wayland Status ::.</center>
<br />

Despite our best efforts in optimizing the **Plasma Wayland Session**, a few unresolved issues still persist. As we eagerly await the release of **Plasma 6**, we're hopeful that the **KDE** developers will address these concerns. Nevertheless, during the gradual transition to **Wayland**, we still highly recommend you stick with the **X11** session for daily use due to its reliability and application compatibility.

##### - Issues caught by the community :
<br />

- **Plasma Dock** becomes unresponsive when app is in focus.
- Some apps **Flicker** for no reason especially on **Intel/AMD** iGPUs.
- **Compact Shutsdown** Plasmoid (Top Right) can become unusable.

Feel free to notify us on **Discord** about any overlooked bugs, allowing us to document them for everyone's benefit. Thank you!

##### <center>"symbol grub_is_shim_lock_enabled not found" error ?<br/><a href="https://forum.xerolinux.xyz/thread-164.html" target="_blank">Click here for fix.</a></center>
