#!/bin/bash
#set -e
##################################################################################################################
# Written to be used on 64 bits computers
# Author 	: 	DarkXero
# Website 	: 	http://xerolinux.xyz
##################################################################################################################
tput setaf 3

echo "#################################################"
echo "#          The XeroLinux Rice Installer         #"
echo "#      The Following Script is for KDE Only     #"
echo "#################################################"
tput sgr0
echo
echo "Hello $USER, which rice would you like to apply today ?"
echo
echo "################# Rice Selector #################"
echo
echo "1. The Catppuccin Rice (Teddy)."
echo "2. The Dunes Rice (GamerKing)."
echo "3. The Nord Rice (DarkXero)."
echo "4. The Sweet Rice (Teddy)."
echo
echo "################# Ricing Tweaks #################"
echo
echo "5. Reset config back to Pure Vanilla KDE."
echo "6. Activate Flatpak Theming (Required If used)."
echo "7. Update Default System Theme (Layan KDE/GTK)."
echo
echo "Type Your Selection. To Exit, just close Window."
echo

while :; do

read CHOICE

case $CHOICE in

    1 )
      echo
      echo "#################################################"
      echo "#             Applying Selected Rice            #"
      echo "#################################################"
      echo
			sleep 2
			cd ~ && git clone https://github.com/xerolinux/xero-catppuccin-git && cd ~/xero-catppuccin-git/ && ./install.sh
			sleep 3
      # Prompt the user to reboot
        tput setaf 4
        read -p "Customization Restored. Reboot recommended. Reboot now? (y/n): " reboot_response
        tput setaf 0
      echo
        # Check the user's response
        if [[ $reboot_response == "y" || $reboot_response == "yes" ]]; then
          sudo reboot
        else
          echo
          tput setaf 4
          echo "Please manually reboot your system to apply changes."
          tput sgr0
        fi
        exit 0

      ;;

    2 )
      echo
      echo "#################################################"
      echo "#             Applying Selected Rice            #"
      echo "#################################################"
      echo
			sleep 2
			cd ~ && git clone https://github.com/xerolinux/xero-dunes-git.git && cd ~/xero-dunes-git/ && ./install.sh
			sleep 3
      echo
      # Prompt the user to reboot
        tput setaf 4
        read -p "Customization Restored. Reboot recommended. Reboot now? (y/n): " reboot_response
        tput sgr0
      echo
        # Check the user's response
        if [[ $reboot_response == "y" || $reboot_response == "yes" ]]; then
          sudo reboot
        else
          echo
          echo "Please manually reboot your system to apply changes."
        fi
        exit 0

      ;;

    3 )
      echo
      echo "#################################################"
      echo "#             Applying Selected Rice            #"
      echo "#################################################"
      echo
			sleep 2
			cd ~ && git clone https://github.com/xerolinux/xero-nord-git.git && cd ~/xero-nord-git/ && ./install.sh
			sleep 3
      echo
      # Prompt the user to reboot
        tput setaf 4
        read -p "Customization Restored. Reboot recommended. Reboot now? (y/n): " reboot_response
        tput setaf 0
      echo
        # Check the user's response
        if [[ $reboot_response == "y" || $reboot_response == "yes" ]]; then
          sudo reboot
        else
          echo
          tput setaf 4
          echo "Please manually reboot your system to apply changes."
          tput sgr0
        fi
        exit 0

      ;;

    4 )
      echo
      echo "#################################################"
      echo "#             Applying Selected Rice            #"
      echo "#################################################"
      echo
			sleep 2
			cd ~ && git clone https://github.com/xerolinux/xero-sweet-git.git && cd ~/xero-sweet-git/ && ./install.sh
			sleep 3
      echo
      # Prompt the user to reboot
        tput setaf 4
        read -p "Customization Restored. Reboot recommended. Reboot now? (y/n): " reboot_response
        tput setaf 0
      echo
        # Check the user's response
        if [[ $reboot_response == "y" || $reboot_response == "yes" ]]; then
          sudo reboot
        else
          echo
          tput setaf 4
          echo "Please manually reboot your system to apply changes."
          tput sgr0
        fi
        exit 0

      ;;

    5 )
      echo
      echo "#################################################"
      echo "#            Resetting to Vanilla KDE           #"
      echo "#                                               #"
      echo "#     Warning, will undo current settings !     #"
      echo "# This will revert settings to Pure Vanilla KDE #"
      echo "#################################################"
      echo
			sleep 6
			cp -Rf ~/.config ~/.config-backup-$(date +%Y.%m.%d-%H.%M.%S) && rm -Rf ~/.config/
			sudo sed -i "s/GRUB_THEME/#GRUB_THEME/g" /etc/default/grub
            sudo grub-mkconfig -o /boot/grub/grub.cfg
			sleep 3
			echo
        # Prompt the user to reboot
        tput setaf 4
        read -p "Customization Restored. Reboot recommended. Reboot now? (y/n): " reboot_response
        tput setaf 0
         echo
        # Check the user's response
        if [[ $reboot_response == "y" || $reboot_response == "yes" ]]; then
          sudo reboot
        else
          echo
          tput setaf 4
          echo "Please manually reboot your system to apply changes."
          tput sgr0
        fi
        exit 0

      ;;

    6 )
      echo
      sleep 2
      sh /usr/local/bin/flatfix
      sleep 2
      clear && sh /usr/share/xerowelcome/scripts/xero_rices.sh

      ;;

    7 )
      echo
      sleep 2
      sh /usr/local/bin/stup
      sleep 2
      clear && sh /usr/share/xerowelcome/scripts/xero_rices.sh

      ;;

    * )
      echo "#################################"
      echo "    Choose the correct number    "
      echo "#################################"
      ;;
esac
done
