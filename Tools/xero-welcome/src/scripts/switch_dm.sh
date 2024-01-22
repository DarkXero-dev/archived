#!/bin/bash
#set -e
##################################################################################################################
# Written to be used on 64 bits computers
# Author 	: 	DarkXero
# Website 	: 	http://xerolinux.xyz
##################################################################################################################
tput setaf 3
echo "###############################################################################"
echo "#                     XeroLinux Display Manager Switcher                      #"
echo "###############################################################################"
tput sgr0
echo
echo "Hello $USER, which Display Manager do you want to switch to ?"
echo
echo "########## DM Selector ##########"
echo
echo "1.  LightDM."
echo "2.  KDE SDDM (For KDE use only)."
echo "3.  Gnome GDM (For Gnome use only)."
echo
echo "Type Your Selection. To Exit, just close Window."
echo

while :; do

read CHOICE

case $CHOICE in

    1 )
      echo
      echo "###########################################"
      echo "            Switching to LightDM           "
      echo "###########################################"
	  sleep 2
	  echo
	  echo "Removing Current Display Manager"
      echo "################################"
      sudo pacman -Rdd --noconfirm sddm &>/dev/null; sudo pacman -Rdd --noconfirm sddm-git &>/dev/null; sudo pacman -Rdd --noconfirm sddm-git &>/dev/null; sudo pacman -Rdd --noconfirm sddm-kcm &>/dev/null; sudo pacman -Rdd --noconfirm gdm &>/dev/null
	  sleep 2
	  echo
	  echo "Installing & Enabling LightDM"
      echo "#############################"
      sudo pacman -S --needed --noconfirm lightdm lightdm-gtk-greeter lightdm-gtk-greeter-settings
      sleep 2

      sudo systemctl enable lightdm.service -f
      echo
      echo "###########################################"
      echo "       Done ! Please reboot to apply       "
      echo "###########################################"
      sleep 3
      ;;

    2 )
      echo
      echo "###########################################"
      echo "             Switching to SDDM             "
      echo "###########################################"
	  sleep 2
	  echo
	  echo "Removing Current Display Manager"
      echo "################################"
      sudo pacman -Rdd --noconfirm sddm &>/dev/null; sudo pacman -Rdd --noconfirm lightdm &>/dev/null; sudo pacman -Rdd --noconfirm lightdm-gtk-greeter &>/dev/null; sudo pacman -Rdd --noconfirm lightdm-gtk-greeter-settings &>/dev/null; sudo pacman -Rdd --noconfirm gdm &>/dev/null
	  sleep 2
	  echo
	  echo "Installing & Enabling SDDM"
      echo "##########################"
      yay -S sddm-git --noconfirm
      sudo pacman -S sddm-kcm --needed --noconfirm
      sleep 2
      sudo systemctl enable sddm.service -f
      echo
      echo "###########################################"
      echo "       Done ! Please reboot to apply       "
      echo "###########################################"
      sleep 3
      ;;

    3 )
      echo
      echo "###########################################"
      echo "              Switching to GDM             "
      echo "###########################################"
	  sleep 2
	  echo
	  echo "Removing Current Display Manager"
      echo "################################"
      sudo pacman -Rdd --noconfirm sddm &>/dev/null; sudo pacman -Rdd --noconfirm sddm-git &>/dev/null; sudo pacman -Rdd --noconfirm sddm-kcm &>/dev/null; sudo pacman -Rdd --noconfirm lightdm &>/dev/null; sudo pacman -Rdd --noconfirm lightdm-gtk-greeter &>/dev/null; sudo pacman -Rdd --noconfirm lightdm-gtk-greeter-settings &>/dev/null
	  sleep 2
	  echo
	  echo "Installing & Enabling GDM"
      echo "#########################"
      sudo pacman -S --needed --noconfirm gdm
      sleep 2
      sudo systemctl enable gdm.service -f
      echo
      echo "###########################################"
      echo "       Done ! Please reboot to apply       "
      echo "###########################################"
      sleep 3
      ;;

    * )
      echo "#################################"
      echo "    Choose the correct number    "
      echo "#################################"
      ;;
esac
done
