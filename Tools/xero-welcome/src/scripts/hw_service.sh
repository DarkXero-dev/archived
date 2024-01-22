#!/bin/bash
#set -e
##################################################################################################################
# Written to be used on 64 bits computers
# Author 	: 	DarkXero
# Website 	: 	http://xerolinux.xyz
##################################################################################################################
tput setaf 3
echo "###############################################################################"
echo "#                         XeroLinux Hardware Service                          #"
echo "###############################################################################"
tput sgr0
echo
echo "Hello $USER, What shall we do today ?"
echo
echo "1.  List Hardware Config via inxi."
echo "2.  Probe & Upload System Config for Sharing."
echo
echo "Type Your Selection. To Exit, just close Window."
echo

while :; do

read CHOICE

case $CHOICE in

    1 )
      echo
      echo "###########################################"
      echo "       Check System Config via inxi        "
      echo "###########################################"
			sleep 2
			inxi -b
			sleep 2
      echo "###########################################"
      echo "         Share Screenshot for help         "
      echo "###########################################"

      ;;

    2 )
      echo
      echo "############################################"
      echo "         Probing config & Uploading         "
      echo "############################################"
      echo
			sleep 2
			sudo -E hw-probe -all -upload
			sleep 2
      echo
      echo "###############################################"
      echo "      Ctrl+Click to open link for sharing      "
      echo "###############################################"

      ;;

    * )
      echo "#################################"
      echo "    Choose the correct number    "
      echo "#################################"
      ;;
esac
done
