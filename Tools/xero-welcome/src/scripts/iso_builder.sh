#!/bin/bash
#set -e
##################################################################################################################
# Written to be used on 64 bits computers
# Author 	: 	DarkXero
# Website 	: 	http://xerolinux.xyz
##################################################################################################################
tput setaf 3
echo "###############################################################################"
echo "#                            XeroLinux ISO Builder                            #"
echo "###############################################################################"
tput sgr0
echo
read -p "Hello $USER, ready to build the ISO ? (y/yes/enter/n/no): " proceed_response
if [[ $proceed_response == "y" || $proceed_response == "yes" || $proceed_response == "" ]]; then
echo
tput setaf 4
echo "###########################################"
echo "            Building XeroLinux.            "
echo " This might take a while, depends on specs "
echo "###########################################"
tput sgr0
echo
sleep 2
cd ~ && git clone https://github.com/xerolinux/xero_iso.git
sleep 2
echo
cd ~/xero_iso/ && ./build.sh
sleep 3
cd ~ && rm -rf ~/xero_iso/
echo
tput setaf 4
echo "###########################################"
echo "      Done ! Check Home Folder for ISO     "
echo "###########################################"
tput sgr0
else
echo
tput setaf 1
echo "###############################################################################"
echo "#                     Ok then, you can close this window.                     #"
echo "###############################################################################"
tput sgr0
fi
