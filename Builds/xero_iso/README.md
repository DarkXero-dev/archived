# XeroLinux ISO Repo

This is **XeroLinux**. An Arch-Based Distro that uses the **KDE Plasma** Desktop environment [Click Here](https://forum.xerolinux.xyz/thread-4.html) for full release info.

You can either build it yourselves following the guide below, that way you always have the latest version available as of build time, if you can't, or prefer not to, you can download the pre-built ISO from the [Official Site](https://xerolinux.xyz).

<p align="center">
    <img width="300" src="https://i.imgur.com/QWqMIsr.png" alt="logo">
</p>

<h1 align="center">Must be on an *Arch* based Distro to build the ISO.</h1>

<h3 align="center">||| Note |||<br />
Not all *Arch* based Distros have been *Tested*.<br />
Distros Script was tested on <a href="https://archlinux.org">Arch</a>/<a href="https://xerolinux.xyz">XeroLinux</a>/<a href="https://https://arcolinux.com/">ArcoLinux</a> & <a href="https://endeavouros.com/">EndeavourOS</a>
</h3>

![Xero](https://i.imgur.com/ujPgkvC.png)

<h1 align="center">How to build XeroLinux</h1>

## Note before building

If you're already rockin' **XeroLinux**, no sweat! Our tool’s got your back. Just fire it up, head to **Post-Install System Config**, hit the ISO Builder button, and watch the enchantment unfold. Keep a hawk-eye on the process when prompted for root password, key it in for a clean build scape. Boom! Your ISO emerges triumphantly in `~/Xero-Out/`. Ready to dive into the fun zone! If not, here's your map to glory...

### Distrobox Option

In case you are on something other than **Arch**, or don't want to install Arch to build, you always have **Distrobox** as an option.

Follow the [**Official Guide**](https://distrobox.it/compatibility/#host-distros) to install it on your specific system, then follow steps below to get the **XeroBuilder** **Arch** container up & running.

Afterwards, follow steps 1 & 2 to build the ISO...

- Create The Container :
```
distrobox create -i quay.io/toolbx-images/archlinux-toolbox -n "xerobuilder"
```

- Enter the Container :
```
distrobox enter xerobuilder
```

- Install necessary packages :
```
sudo pacman -Syyu && sudo pacman -S --noconfirm neofetch git archiso base base-devel nano vim
```

That's it. Now follow below steps to build XeroLinux...

-----------------------------------------------------------------------------------------------

### Step 1 - Clone Build Repo :

Grab the build environment. Just note that you will need Git installed in order to do that.

**Grab Build Env.**
```
cd ~ && git clone https://github.com/xerolinux/xero_iso.git
```

### Step 2 - Building the Xero ISO :

Now that we have build environment on our system, it's time to build it.

**Build the ISO :**
```
cd ~/xero_iso/ && ./build.sh
```

The build process might chug a bit, hinging on your rig's specs. Once it wraps, brace for the root password prompt to tidy up the buildscape. Voila! Your ISO emerges victorious in `~/Xero-Out/`. Time to dive in and unleash the fun!

### Support

The creation of the Distro & build script was akin to embarking on an epic quest, fueled by coding crusades and marathon debugging sessions. However, navigating Lebanon's challenging landscape leaves server sustainability hanging in the balance. Your epic loot contributions via [**Ko-Fi**](https://ko-fi.com/xerolinux), [**FundRazr**](https://fundrazr.com/xerolinux) or as a [**Github Sponsor**](https://github.com/sponsors/xerolinux) are the legendary items needed to fortify this project's arsenal, ensuring it thrives amidst the digital battlegrounds!

I hope this helps.. In case of other issues kindly find me on [**Discord**](https://discord.gg/Xg6T78ahtK)

Happy building

*May You Live Long & Prosper*...
