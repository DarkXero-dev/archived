#!/usr/bin/bash
echo
echo "##########################################"
echo "     Updating Mirrors To Fastest Ones     "
echo "##########################################"
echo
sudo reflector --verbose -phttps -f10 -l10 --sort rate --save /etc/pacman.d/mirrorlist && sudo pacman -Syy
echo
echo "##################################"
echo " Done ! Updating should go faster "
echo "##################################"
