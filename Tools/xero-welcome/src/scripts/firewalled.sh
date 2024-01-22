#!/bin/bash
[[ ${1-} =~ (--dry-run|-d) ]] && SUDO='echo sudo'

echo "[0;33m###############################################################################
#                         XeroLinux Firewall Enabler                          #
###############################################################################[0m"

${SUDO:-sudo} pacman -S --noconfirm plasma-firewall firewalld &&
    ${SUDO:-sudo} systemctl enable --now firewalld

echo "###########################################
    Done! Check Status from KDE Settings
###########################################"
