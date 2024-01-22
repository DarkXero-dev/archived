#!/bin/bash
#set -e
##################################################################################################################
# Written to be used on 64 bits computers
# Author 	: 	DarkXero
# Website 	: 	http://xerolinux.xyz
##################################################################################################################

gpus="$(lspci | grep -oP '^.*VGA[^:]+:\s*\K.*(ATI|AMD).*' | grep -v '^\s*$' || :)"
if [[ -n ${gpus:-} ]]; then
    gpus="Hello ${USER:=$(whoami)}, you have the following ATI/AMD GPU(s):

$gpus"
else
    gpus="Hello ${USER:=$(whoami)}, you don't seem to have any ATI/AMD GPU(s)."
fi

header_text="[33m\
#################################################################
#         XeroLinux Free (Open Source) Driver Installer         #
#                                                               #
#                      !!! ATTENTION !!!                        #
#                                                               #
#    This Will Install GPU Drivers For Any ATI or AMD GPUs      #
#                                                               #
#           Carefully Select The Appropriate Drivers.           #
#################################################################
[0m
$gpus

############# Open Source Drivers #############

1: Modern AMD GPU/APU.
2: ATI (Legacy RadeonHD) GPU.

Type Your Selection. To Exit, press [1mq[0m or close Window.
"
# glxinfo | grep -E "OpenGL vendor|OpenGL renderer*"

driver_install() {
    # This function requires the scalar variable $choicetext and the array variable $packages to be defined
    [[ -n ${choicetext:-} && ${#packages[@]} -gt 0 ]] || return 1

    local ctsurround
    ctsurround="[1m#$(
        # 😡😡😡 https://www.shellcheck.net/wiki/SC2051
        for ((i = 0; i < ${#choicetext}; i++)); do
            echo -n '#'
        done
    )#[0m"

    printf '%s\n' \
        '' \
        "$ctsurround" \
        " $choicetext " \
        "$ctsurround"

    echo $'Installing packages\n'"[1m${packages[*]}[0m"
    read -r -t 3 -p "[2m(Pausing 3 seconds for readability)[0m"
    echo -en "\e[2K\r" # Erase the text and return cursor position to normal

    $SUDO pacman -S --noconfirm "${packages[@]}"

    read -r -p "Done! Press ENTER to continue"
}

SUDO='sudo'
case "${1:-}" in
'') : ;;
'--dry-run' | -d) SUDO='echo sudo' ;;
*)
    echo "${0##*/} [--dry-run (-d)]
run ${0##*/} with no args to run the script as usual"
    exit 1
    ;;
esac

while :; do
    CHOICE=''
    choicetext=''
    declare -a packages=()

    clear
    read -r -n 1 -p "$header_text
${INVALID_OPTION_STR:-}[1|2|q] > [1m" CHOICE
    echo '[0m'

    INVALID_OPTION_STR=''

    case "${CHOICE:=}" in
    1)
        choicetext='Installing AMD GPU Free Drivers'
        packages=(xf86-video-amdgpu libvdpau-va-gl vulkan-swrast libva-vdpau-driver libclc vulkan-radeon lib32-vulkan-radeon vulkan-icd-loader lib32-vulkan-icd-loader egl-wayland)

        ans=''
        read -r -p "\
##################################################################################
              Do you want to include ROCM HIP & OpenCL Runtime libraries?
                  [1mWARNING[0m: This takes a LOT of disk space!!!
##################################################################################
[y/N] > " ans
        [[ ${ans-} =~ [yY] ]] && packages+=(rocm-opencl-runtime rocm-hip-runtime)
        # [[ ${ans-} =~ [yY] ]] && packages+=(
        #     rocm-language-runtime
        #     rocm-opencl-runtime
        #     rocminfo rocm-smi-lib
        #     rocm-clang-ocl
        #     rocm-ml-libraries
        #     rocm-opencl-sdk
        # )

        driver_install
        ;;

    2)
        choicetext='Installing ATI GPU Free Drivers'
        packages=(xf86-video-ati vulkan-radeon lib32-vulkan-radeon libvdpau-va-gl vulkan-swrast libva-vdpau-driver libclc)
        driver_install
        ;;
    [qQ])
        exit 0
        ;;
    *)
        INVALID_OPTION_STR="Invalid option: '${CHOICE:-}' "
        ;;
    esac
done
