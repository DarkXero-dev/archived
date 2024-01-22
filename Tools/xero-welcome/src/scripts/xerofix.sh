#!/bin/bash
#set -e
##################################################################################################################
# Written to be used on 64 bits computers
# Author 	: 	DarkXero
# Website 	: 	http://xerolinux.xyz
##################################################################################################################
tput setaf 3
echo "#################################################"
echo "#             XeroLinux Fixes/Tweaks            #"
echo "#################################################"
tput sgr0
echo
echo "Hello $USER, what would you like to do today ?"
echo
echo "################## Troubleshooting ##################"
echo
echo "1. Apply The Samba Share Fix."
echo "2. Clear Pacman Cache (Free Space)."
echo "3. Restart PipeWire/PipeWire-Pulse."
echo "4. Install/Activate Arch-Update/Notifier."
echo "5. Unlock Pacman DB (In case of DB error)."
echo "6. Enable SuperGFX Hybrid GPU Control System."
echo "7. TKG Kernel/nVidia Scripts (Advanced use only)."
echo "8. Apply AppMenu Meta-Key Fix (For KDE-Plasma Only)."
echo "9. Apply Wayland Screen/Window Sharing Fix (Flatpak PKG)."
echo
echo "Type Your Selection. To Exit, just close Window."
echo

while :; do

read CHOICE

case $CHOICE in

    1 )
      echo
      sleep 2
      sh /usr/local/bin/smbfix
      sleep 2
      clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;

    2 )
      echo
	  sleep 2
      sudo pacman -Scc
      sleep 2
      echo
      clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;


    3 )
      echo
	  sleep 2
	  sh /usr/local/bin/rpipe
	  sleep 2
      clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;

    4 )
      echo
	  echo "Installing Arch-Update & Activating Notifications"
      sleep 2
      echo
      sudo pacman -Sy arch-update
      sleep 2
      systemctl --user enable --now arch-update.timer
      echo
      echo "All done, reboot and select Gnome from Login options."
	  sleep 3
      clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;

    5 )
      echo
	  sleep 2
	  sudo rm /var/lib/pacman/db.lck
	  sleep 2
      clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;

    6 )
      echo
      echo "Installing Necessary Packages."
	  sleep 2
	  sudo pacman -Syy --noconfirm supergfxctl plasma5-applets-supergfxctl
	  sleep 2
	  echo "Activating SuperGFX Service"
	  sudo systemctl enable --now supergfxd.service
	  sleep 2
	  echo
	  echo "All done, reboot and select Gnome from Login options."
	  sleep 2
	  clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;

    7 )
      echo
	  sleep 2
	  sh /usr/local/bin/tkg
      echo
	  sleep 3
      clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;
 
    8 )
      echo
	  sleep 2
	  echo "Applying Meta-Key AppMenu fix..."
      echo
      kwriteconfig5 --file ~/.config/kwinrc --group ModifierOnlyShortcuts --key Meta "org.kde.plasmashell,/PlasmaShell,org.kde.PlasmaShell,activateLauncherMenu"
      sleep 3
      echo "Relaunching Kwin..."
      qdbus org.kde.KWin /KWin reconfigure
      echo
      echo "All done, should work now !"
	  sleep 3
      clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;

    9 )
      echo
	  sleep 2
	  echo "Installing XWayland Bridge..."
	  echo
      sudo pacman -S --noconfirm --needed xwaylandvideobridge-bin
      sleep 3
      echo
      echo "All done, please reboot for good measure !"
	  sleep 3
      clear && sh /usr/share/xerowelcome/scripts/xerofix.sh

      ;;

    * )
      echo "#################################"
      echo "    Choose the correct number    "
      echo "#################################"
      ;;
esac
done
