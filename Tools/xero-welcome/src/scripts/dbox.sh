#!/bin/bash
#set -e
##################################################################################################################
# Written to be used on 64 bits computers
# Author 	: 	DarkXero
# Website 	: 	http://xerolinux.xyz
##################################################################################################################
tput setaf 3
echo "#################################################"
echo "#           XeroLinux Distrobox Tool.           #"
echo "#################################################"
tput sgr0
echo
echo "Hello $USER, what would you like to do today ?"
echo
echo "################## Distrobox & Docker Setup ##################"
echo
echo "i. Install/Configure Distrobox & Docker (Automatically)."
echo "d. Distrobox Documentaion on Github (Will open browser)."
echo
echo "################### Top 5 Container Images ###################"
echo
echo "1. Debian."
echo "2. Fedora."
echo "3. Void Linux."
echo "4. OpenSuse Tumbleweed."
echo "5. Gentoo Linux (For Advanced Users)."
echo
echo "u. Update all Containers (Might take a while)."
echo
echo "Type Your Selection. To Exit, just close Window."
echo

while :; do

read CHOICE

case $CHOICE in

    i )
      echo
      sleep 2
      echo "Installing packages..."
      echo
      sudo pacman -S --noconfirm distrobox docker docker-compose
      sleep 2
      echo
      echo "Enabling Services & Adding you to group"
      echo
      sudo systemctl enable --now docker
      sudo usermod -aG docker $USER
      sleep 2
      echo
      # Prompt the user to reboot
        tput setaf 1
        read -p "All done. Reboot is required. Reboot now? (y/n): " reboot_response
        tput setaf 0
      echo
        # Check the user's response
        if [[ $reboot_response == "y" || $reboot_response == "yes" ]]; then
          sudo reboot
        else
          echo
          tput setaf 2
          echo "Please manually reboot your system before using Distrobox."
          sleep 6
          clear && sh /usr/share/xerowelcome/scripts/dbox.sh
          tput sgr0
        fi

      ;;

    d )
      echo
      sleep 2
      echo "Opening Distrobox Documentation In Your Default Browser..."
      echo
      xdg-open 'https://github.com/89luca89/distrobox/tree/main/docs#quick-start' &>/dev/null;
      sleep 6
      echo
      clear && sh /usr/share/xerowelcome/scripts/dbox.sh

      ;;
    
    1 )
      echo
      sleep 2
      echo "Pulling Latest Debian Image with label XeroDeb, Please Wait..."
      echo
      distrobox create -i quay.io/toolbx-images/debian-toolbox:latest -n "XeroDeb"
      sleep 10
      echo
      clear && sh /usr/share/xerowelcome/scripts/dbox.sh

      ;;

    2 )
      echo
      sleep 2
      echo "Pulling Latest Fedora Image with label XeroDora, Please Wait..."
      echo
      distrobox create -i registry.fedoraproject.org/fedora-toolbox:latest -n "XeroDora"
      sleep 10
      echo
      clear && sh /usr/share/xerowelcome/scripts/dbox.sh

      ;;

    3 )
      echo
      sleep 2
      echo "Pulling Latest Void Linux Image with label XeroVoid, Please Wait..."
      echo
      distrobox create -i ghcr.io/void-linux/void-linux:latest-full-x86_64 -n "XeroVoid"
      sleep 10
      echo
      clear && sh /usr/share/xerowelcome/scripts/dbox.sh

      ;;
    
    4 )
      echo
      sleep 2
      echo "Pulling Latest OpenSuse Tumbleweed Image with label XeroSuse..."
      echo
      distrobox create -i registry.opensuse.org/opensuse/tumbleweed:latest -n "XeroSuse"
      sleep 10
      echo
      clear && sh /usr/share/xerowelcome/scripts/dbox.sh

      ;;

    5 )
      echo
      sleep 2
      echo "Pulling Latest Gentoo Linux Image with label XeroGen..."
      echo
      distrobox create -i docker.io/gentoo/stage3:latest -n "XeroGen"
      sleep 10
      echo
      clear && sh /usr/share/xerowelcome/scripts/dbox.sh

      ;;

    u )
      echo
      sleep 2
      echo "Upgrading all Containers Please Wait..."
      echo
      distrobox-upgrade --all
      sleep 3
      echo
      clear && sh /usr/share/xerowelcome/scripts/dbox.sh

      ;;

    * )
      echo "#################################"
      echo "    Choose the correct number    "
      echo "#################################"
      ;;
esac
done
