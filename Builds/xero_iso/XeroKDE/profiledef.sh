#!/usr/bin/env bash
# shellcheck disable=SC2034

iso_name="xerolinux"
iso_label="XERO_$(date --date="@${SOURCE_DATE_EPOCH:-$(date +%s)}" +%Y%m)"
iso_publisher="DarkXero"
iso_application="xerolinux"
iso_version="$(date --date="@${SOURCE_DATE_EPOCH:-$(date +%s)}" +%Y.%m)"
install_dir="arch"
buildmodes=('iso')
bootmodes=('bios.syslinux.mbr' 'bios.syslinux.eltorito'
           'uefi-ia32.grub.esp' 'uefi-x64.grub.esp'
           'uefi-ia32.grub.eltorito' 'uefi-x64.grub.eltorito')
arch="x86_64"
pacman_conf="pacman.conf"
airootfs_image_type="squashfs"
airootfs_image_tool_options=('-comp' 'xz' '-Xbcj' 'x86' '-b' '1M' '-Xdict-size' '1M')
file_permissions=(
  ["/etc/shadow"]="0:0:400"
  ["/root"]="0:0:750"
  ["/etc/polkit-1/rules.d"]="0:0:750"
  ["/etc/sudoers.d"]="0:0:750"
  ["/root/.automated_script.sh"]="0:0:755"
  ["/root/.gnupg"]="0:0:700"
  ["/usr/local/bin/vcheck"]="0:0:755"
  ["/usr/local/bin/choose-mirror"]="0:0:755"
  ["/usr/local/bin/dmcheck"]="0:0:755"
  ["/usr/local/bin/xerolinux-before"]="0:0:755"
  ["/usr/local/bin/skel"]="0:0:755"
  ["/usr/local/bin/all-cores"]="0:0:755"
  ["/usr/local/bin/xerolinux-final"]="0:0:755"
  ["/usr/local/bin/services"]="0:0:755"
  ["/usr/local/bin/ucode"]="0:0:755"
  ["/usr/local/bin/fsprogschk"]="0:0:755"
  )
