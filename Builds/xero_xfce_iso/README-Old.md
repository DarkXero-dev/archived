# XeroXFCE ISO Repo

This here is a Spin using the **XFCE** Desktop Environment, not to be confused with the **KDE** flagship, [Click Here](https://forum.xerolinux.xyz/thread-258.html) for full release info.

A Spin is a side-project not main one, which means when it comes to the DE it uses, support is limited since I do not use it myself, however you might get some support from our community. You can either build it yourselves for *free* following the guide below, which will net you the latest version/packages available as of build time, or if you can't for whatever reason, you will be able to download a pre-built ISO for a small fee. Please scroll down for more info on how you can do that.

<p align="center">
    <img width="300" src="https://i.imgur.com/QWqMIsr.png" alt="logo">
</p>

<h1 align="center">Must be on an *Arch* based Distro to build ISO.</h1>

<h3 align="center">||| Note |||<br />
Not all *Arch* based Distros are supported.<br />
Script was tested on <a href="https://archlinux.org">Arch</a>/<a href="https://xerolinux.xyz">XeroLinux</a>/<a href="https://https://arcolinux.com/">ArcoLinux</a> & <a href="https://endeavouros.com/">EndeavourOS</a>
</h3>

<p align="center">
    <img width="100%" src="https://i.imgur.com/86Q3kVf.jpg" alt="logo">
</p>

<h1 align="center">How to build XeroXFCE</h1>

## Note before building

If you already are on any version of **XeroLinux**, you do not need to do all this, just use our tool, which has a script that will do it for you. Just launch it, go to **Post-Install System Config** and click on the **ISO Builder** button, select option *3* **XeroLinux XFCE  Spin** and watch it do its magic. Keep a close eye on it while it builds, because you will be prompted for root password, please type it so it can clean up the build environment. Finally your ISO is ready in `~/XeroCE-Out/` Have fun ! Otherwise follow the guide below...

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
cd ~ && git clone https://github.com/xerolinux/xero_xfce_iso.git
```

### Step 2 - Building the XeroXFCE ISO :

Now that we have build environment on our system, it's time to build it.

**Build ISO :**
```
cd ~/xero_xfce_iso/ && ./build.sh
```

Build will take some time depending on your machine's specs, once done you will be prompted for root password, please type it so it can clean up the build environment. Finally your ISO is ready in `~/XeroCE-Out/` Have fun !

### Getting the ISOs

You can grab the Pre-built ISO by *"buying"* it from our new [**Ko-Fi Shop**](https://ko-fi.com/s/cb8ec99afa), or by donating any amount from $6 upwards on [**FundRazr**](https://fundrazr.com/xerolinux). Please Read below to know more...

### Why is the ISO paywalled ?

I am charging for my time **Not** the code...

A lot of hard work, and sleepless nights went into the creation of this awesome Distro/Spin, and with the current situation in **Lebanon** not being so great, I am limited on time & reources, and with no other means of income to cover server fees for hosting the sites and repos, I solely rely on your generous contributions. Any amount will go a long way making sure the project continues to thrive. So if you can, please show the project some love, it would be appreciated.

### Support the team...

If you feel like being extra awesome, please show [**TeddyBearKilla**](https://ko-fi.com/teddybearkilla) and [**Ripl3yPlays**](https://ko-fi.com/ripleyplays) the same love you would show the project, by buying them a **Coffee** or two, they deserve it, thanks...

*May You Live Long & Prosper*...

I hope this helps.. In case of other issues kindly find me on [**Discord**](https://discord.gg/Xg6T78ahtK)

Happy building
