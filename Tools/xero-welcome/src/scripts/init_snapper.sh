#!/usr/bin/bash
#set -e

RED='[0;31m'
GREEN='[0;32m'
BLUE='[0;34m'
NC='[0m'

SUDO=sudo
[[ ${1-} =~ (--dry-run|-d) ]] && SUDO='echo sudo'

echo "#####################################
       XeroLinux Snapper Setup
#####################################
"

# Welcome message
echo "${GREEN}Hi, ${USER:=$(whoami)}! Checking for BTRFS.${NC}
"
sleep 1
# Check if the file system is BTRFS
if lsblk -f | grep -q "btrfs"; then
    echo "${GREEN}BTRFS partitions found. Adding Necessary Modules, Installing Packages & Initializing Root/Home.${NC}

Installing Packages & Updating mkinitcpio configuration"
    $SUDO pacman -Sy --noconfirm btrfs-assistant btrfs-du snapper-support btrfsmaintenance
    echo
    sleep 2
    $SUDO sed -Ei 's/^(MODULES="[^"]*)btrfs([^"]*)/\1\2/; s/^MODULES="([^"]*)/MODULES="\1 btrfs/g' /etc/mkinitcpio.conf &&
        $SUDO mkinitcpio -P
    sleep 3
    echo "
Initializing snapper for root subvolume"
    $SUDO snapper -c root create-config /
    $SUDO snapper -c root create
    sleep 3
    echo "
Initializing snapper for home subvolume"
    $SUDO snapper -c home create-config /home
    $SUDO snapper -c home create
    # sleep 3
    echo "
${BLUE}Snapper installed and initialized. Reboot required.${NC}
"
else
    echo "${RED}No BTRFS Partitions found. Exiting...${NC}"
    exit 1
fi
