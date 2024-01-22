#!/bin/bash
#set -e
##################################################################################################################
# Written to be used on 64 bits computers
# Author 	: 	DarkXero
# Website 	: 	http://xerolinux.xyz
##################################################################################################################
tput setaf 5
echo "###############################################################################"
echo "#                          XeroLinux System Updater                           #"
echo "#                                                                             #"
echo "#                             !!! Please Note !!!                             #"
echo "#                                                                             #"
echo "#                 AUR Packages Will Build Before Installing..                 #"
echo "#      Which might take some time depending on Package. In case it fails      #"
echo "#                                                                             #"
echo "#    Please do NOT report to us, but to the package maintainer(s) upstream    #"
echo "###############################################################################"
tput sgr0
echo
echo "Hello $USER, Please Select Packages To Update."
echo
echo "########## Package Manager Selector ##########"
echo
echo "1.  Update Arch Packages Only."
echo "2.  Update Arch & A.U.R Packages."
echo "3.  Update Flatpak Packages Only."
echo
echo "4.  Update All in one go. (Not Topgrade)."
echo
echo "Type Your Selection. To Exit, just close Window."
echo

while :; do

read CHOICE

case $CHOICE in

    1 )
      echo
      echo "##########################################"
      echo "          Updating Arch Packages          "
      echo "##########################################"
      sleep 3
      sudo pacman -Syyu
      sleep 3
      echo "#######################################"
      echo "                 Done !                "
      echo "#######################################"
            clear && sh /usr/share/xerowelcome/scripts/update_system.sh
      ;;


    2 )
      echo
      echo "##########################################"
      echo "       Updating Arch & AUR Packages       "
      echo "##########################################"
			sleep 3
			yay -Syyu
			sleep 3
      echo "#######################################"
      echo "                 Done !                "
      echo "#######################################"
            clear && sh /usr/share/xerowelcome/scripts/update_system.sh
      ;;

    3 )
      echo
      echo "##########################################"
      echo "        Updating Flatpak Packages         "
      echo "##########################################"
			sleep 3
			flatpak update
			sleep 3
      echo "#######################################"
      echo "                 Done !                "
      echo "#######################################"
            clear && sh /usr/share/xerowelcome/scripts/update_system.sh
      ;;

    4 )
      echo
      echo "##########################################"
      echo "      Updating Everything in One Go       "
      echo "##########################################"
			sleep 3
			yay -Syyu && flatpak update
			sleep 3
      echo "#######################################"
      echo "                 Done !                "
      echo "#######################################"
            clear && sh /usr/share/xerowelcome/scripts/update_system.sh
      ;;

    * )
      echo "#################################"
      echo "    Choose the correct number    "
      echo "#################################"
      ;;
esac
done
