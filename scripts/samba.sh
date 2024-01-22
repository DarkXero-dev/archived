#!/bin/bash
set -e
##################################################################################################################
# Author	:	DarkXero
# Website	:	https://xldb.techxero.com
##################################################################################################################
#
#   DO NOT JUST RUN THIS. EXAMINE AND JUDGE. RUN AT YOUR OWN RISK.
#
##################################################################################################################

echo "################################################################"
echo "#########       enabling samba software         ################"
echo "################################################################"

sudo pacman -S --noconfirm --needed samba
sudo wget "https://git.samba.org/samba.git/?p=samba.git;a=blob_plain;f=examples/smb.conf.default;hb=HEAD" -O /etc/samba/smb.conf.original
sudo wget "https://raw.githubusercontent.com/arcolinux/arcolinux-system-config/master/etc/samba/smb.conf.arcolinux" -O /etc/samba/smb.conf.arcolinux
sudo wget "https://raw.githubusercontent.com/TechXero/ArcoLinux/main/Configs/smb.conf" -O /etc/samba/smb.conf
sudo systemctl enable smb.service
sudo systemctl start smb.service
sudo systemctl enable nmb.service
sudo systemctl start nmb.service

##Change your username here
read -p "What is your login? It will be used to add this user to smb : " choice
sudo smbpasswd -a $choice

#access samba share windows
sudo pacman -S --noconfirm --needed gvfs-smb

echo "################################################################"
echo "#########       samba  software enabled         ################"
echo "################################################################"
sleep 5
echo "Network Discovery"

sudo pacman -S --noconfirm --needed avahi
sudo systemctl enable avahi-daemon.service
sudo systemctl start avahi-daemon.service

#shares on a mac
sudo pacman -S --noconfirm --needed nss-mdns

#shares on a linux
sudo pacman -S --noconfirm --needed gvfs-smb

#change nsswitch.conf for access to nas servers
#original line comes from the package filesystem
#hosts: files mymachines myhostname resolve [!UNAVAIL=return] dns
#ArcoLinux line
#hosts: files mymachines resolve [!UNAVAIL=return] mdns dns wins myhostname

#first part
sudo sed -i 's/files mymachines myhostname/files mymachines/g' /etc/nsswitch.conf
#last part
sudo sed -i 's/\[\!UNAVAIL=return\] dns/\[\!UNAVAIL=return\] mdns dns wins myhostname/g' /etc/nsswitch.conf

echo "################################################################"
echo "####       network discovery  software installed        ########"
echo "################################################################"
sleep 5
echo "Network Shares"

if pacman -Qi samba &> /dev/null; then
  echo "###################################################################"
  echo "Samba is installed"
  echo "###################################################################"
else
  tput setaf 1;echo "###################################################################"
  echo "First use our scripts to install samba and/or network discovery"
  echo "###################################################################";tput sgr0
  exit 1
fi

#checking if filemanager is installed then install extra packages
if pacman -Qi dolphin &> /dev/null; then
  sudo pacman -S --noconfirm --needed kdenetwork-filesharing
fi
if pacman -Qi thunar &> /dev/null; then
  sudo pacman -S --noconfirm --needed thunar-shares-plugin
fi

FILE=/etc/samba/smb.conf

if test -f "$FILE"; then
    echo "/etc/samba/smb.conf has been found"
else
  tput setaf 1;echo "###################################################################"
  echo "We did not find /etc/samba/smb.conf"
  echo "First use our scripts to install samba and/or network discovery"
  echo "###################################################################";tput sgr0
  exit 1
fi

sleep 5

echo "################################################################"
echo "#########         Some ArcoLinux Magic          ################"
echo "################################################################"

file="/etc/samba/smb.conf"

sudo sed -i '/^\[global\]/a \
\
usershare allow guests = true \
usershare max shares =  100 \
usershare owner only = no \
usershare path = /var/lib/samba/usershares' $file

sudo mkdir -p /var/lib/samba/usershares
sudo groupadd -r sambashare
sudo gpasswd -a $USER sambashare
sudo chown root:sambashare /var/lib/samba/usershares
sudo chmod 1770 /var/lib/samba/usershares

tput setaf 1;echo "###################################################################"
echo "Now reboot before sharing folders"
echo "###################################################################";tput sgr0
