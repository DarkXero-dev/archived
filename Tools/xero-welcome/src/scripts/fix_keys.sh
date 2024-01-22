#!/usr/bin/bash

_miniheader() {
    local text="${1:-}"
    local -i sleepduration="${2:-1}"
    ((sleepduration)) && sleep "$sleepduration"
    local maxlen=34
    local headstr='####################################'
    ((${#text} % 2)) && text="$text "
    local padlen=$(((maxlen - ${#text}) / 2))
    printf "\n$headstr\n#%${padlen}s%s%${padlen}s#\n$headstr\n\n" '' "$text" ''
}
[[ ${1-} =~ (--dry-run|-d) ]] && SUDO='echo sudo'

#set -e
_miniheader 'Fixing Pacman Databases..' 0
_miniheader 'Deleting Existing Keys..'

${SUDO:=sudo} rm /var/lib/pacman/sync/*

_miniheader 'Deleting gnupg files..'

$SUDO rm -r /etc/pacman.d/gnupg/*

_miniheader 'Populating Keys..'

$SUDO pacman-key --init && $SUDO pacman-key --populate

_miniheader 'Adding Ubuntu keyserver..'

echo "keyserver hkp://keyserver.ubuntu.com:80" | $SUDO tee --append /etc/pacman.d/gnupg/gpg.conf

_miniheader 'Updating ArchLinux Keyring..'

$SUDO pacman -Sy --noconfirm archlinux-keyring

_miniheader 'Done! Try Update now & Report'
