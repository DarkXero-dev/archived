use crate::application_browser::ApplicationBrowser;
use crate::config::PKGDATADIR;
use crate::utils;
use gtk::{glib, Builder};
//use subprocess::Exec;

use gtk::prelude::*;

use std::str;

pub fn create_postinstall_page(builder: &Builder) {
    let install: gtk::Button = builder.object("postinstallBrowser").unwrap();
    install.set_visible(true);

    let viewport = gtk::Viewport::new(gtk::Adjustment::NONE, gtk::Adjustment::NONE);
    let image = gtk::Image::from_icon_name(Some("go-previous"), gtk::IconSize::Button);
    let page_builder: Builder =
        Builder::from_file(format!("{}/ui/post_install_page.glade", PKGDATADIR));
    let back_btn: gtk::Button = page_builder.object("backbutton").unwrap();
    // let back_btn = gtk::Button::new();
    back_btn.set_image(Some(&image));
    back_btn.set_widget_name("home");

    back_btn.connect_clicked(glib::clone!(@weak builder => move |button| {
        let name = button.widget_name();
        let stack: gtk::Stack = builder.object("stack").unwrap();
        stack.set_visible_child_name(&format!("{}page", name));
    }));

    let icon_path = format!("{}/data/img/config-title.png", PKGDATADIR);
    let page_image: gtk::Image =
        page_builder.object("pageimage").expect("Could not get the page image");
    page_image.set_from_file(Some(&icon_path));

    let pagebox: gtk::Box = page_builder.object("pagebox").unwrap();

    let init_snapper_btn: gtk::Button = page_builder.object("init-snapper").unwrap();
    let switch_to_zsh_btn: gtk::Button = page_builder.object("switch-to-zsh").unwrap();
    let apply_defaults_btn: gtk::Button = page_builder.object("apply-defaults").unwrap();
    let pacseek_btn: gtk::Button = page_builder.object("pacseek").unwrap();
    let iso_builder_btn: gtk::Button = page_builder.object("iso-builder").unwrap();
    let xero_rice_btn: gtk::Button = page_builder.object("xero-rices").unwrap();
    let plasma_firewall_btn: gtk::Button = page_builder.object("plasma-firewall").unwrap();
    let distrobox_btn: gtk::Button = page_builder.object("dbox").unwrap();
    let xerofix_btn: gtk::Button = page_builder.object("xerofix").unwrap();

    xerofix_btn.connect_clicked(on_xerofix_btn_clicked);
    distrobox_btn.connect_clicked(on_distrobox_btn_clicked);
    switch_to_zsh_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/switch_to_zsh.sh"),
            false,
        );
    });
    plasma_firewall_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/firewalled.sh"),
            false,
        );
    });
    pacseek_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/bin/pacseek"),
            false,
        );
    });
    init_snapper_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/init_snapper.sh"),
            false,
        );
    });
    apply_defaults_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/apply_defaults.sh"),
            false,
        );
    });
    iso_builder_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/iso_builder.sh"),
            false,
        );
    });
    xero_rice_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/xero_rices.sh"),
            false,
        );
    });

    // let options_section_box = create_options_section();
    // let fixes_section_box = create_fixes_section();
    // let apps_section_box = create_apps_section();

    // let grid = gtk::Grid::new();
    // grid.set_hexpand(true);
    // grid.set_margin_start(10);
    // grid.set_margin_end(10);
    // grid.set_margin_top(5);
    // grid.set_margin_bottom(5);
    // grid.attach(&back_btn, 0, 1, 1, 1);
    // let box_collection = gtk::Box::new(gtk::Orientation::Vertical, 5);

    // box_collection.pack_start(&options_section_box, false, false, 10);
    // box_collection.pack_start(&fixes_section_box, false, false, 10);
    // box_collection.pack_end(&apps_section_box, false, false, 10);

    // box_collection.set_valign(gtk::Align::Center);
    // box_collection.set_halign(gtk::Align::Center);
    // grid.attach(&box_collection, 1, 2, 5, 1);
    viewport.add(&pagebox);
    viewport.show_all();

    let stack: gtk::Stack = builder.object("stack").unwrap();
    let child_name = "postinstallBrowserpage";
    stack.add_named(&viewport, child_name);
}

pub fn create_appbrowser_page(builder: &Builder) {
    let install: gtk::Button = builder.object("appBrowser").unwrap();
    install.set_visible(true);

    let viewport = gtk::Viewport::new(gtk::Adjustment::NONE, gtk::Adjustment::NONE);
    let image = gtk::Image::from_icon_name(Some("go-previous"), gtk::IconSize::Button);
    let back_btn = gtk::Button::new();
    back_btn.set_image(Some(&image));
    back_btn.set_label("Back");
    back_btn.set_widget_name("home");

    back_btn.connect_clicked(glib::clone!(@weak builder => move |button| {
        let name = button.widget_name();
        let stack: gtk::Stack = builder.object("stack").unwrap();
        stack.set_visible_child_name(&format!("{}page", name));
    }));

    let grid = gtk::Grid::new();
    grid.set_hexpand(true);
    grid.set_margin_start(10);
    grid.set_margin_end(10);
    grid.set_margin_top(5);
    grid.set_margin_bottom(5);
    grid.attach(&back_btn, 0, 1, 1, 1);

    let app_browser_ref = ApplicationBrowser::default_impl().lock().unwrap();
    let app_browser_box = app_browser_ref.get_page();
    grid.attach(app_browser_box, 0, 2, 1, 1);

    // Add grid to the viewport
    // NOTE: we might eliminate that?
    viewport.add(&grid);
    viewport.show_all();

    let stack: gtk::Stack = builder.object("stack").unwrap();
    let child_name = "appBrowserpage";
    stack.add_named(&viewport, child_name);
}

pub fn create_drivers_page(builder: &Builder) {
    let install: gtk::Button = builder.object("driversBrowser").unwrap();
    install.set_visible(true);

    let viewport = gtk::Viewport::new(gtk::Adjustment::NONE, gtk::Adjustment::NONE);
    let image = gtk::Image::from_icon_name(Some("go-previous"), gtk::IconSize::Button);

    let page_builder: Builder = Builder::from_file(format!("{}/ui/drivers_page.glade", PKGDATADIR));
    let back_btn: gtk::Button = page_builder.object("backbutton").unwrap();
    // let back_btn = gtk::Button::new();
    back_btn.set_image(Some(&image));
    back_btn.set_widget_name("home");

    back_btn.connect_clicked(glib::clone!(@weak builder => move |button| {
        let name = button.widget_name();
        let stack: gtk::Stack = builder.object("stack").unwrap();
        stack.set_visible_child_name(&format!("{}page", name));
    }));

    let icon_path = format!("{}/data/img/logo-gpu.png", PKGDATADIR);
    let page_image: gtk::Image =
        page_builder.object("pageimage").expect("Could not get the page image");
    page_image.set_from_file(Some(&icon_path));

    let pagebox: gtk::Box = page_builder.object("pagebox").unwrap();

    let nonfree_drivers_btn: gtk::Button = page_builder.object("nonfree-drivers").unwrap();
    let free_drivers_btn: gtk::Button = page_builder.object("free-drivers").unwrap();
    let switch_dm_btn: gtk::Button = page_builder.object("switch-dm").unwrap();
    let hw_service_btn: gtk::Button = page_builder.object("hw-service").unwrap();
    let asus_rog_tools_btn: gtk::Button = page_builder.object("asus-rog-tools").unwrap();
    let optimus_discord_btn: gtk::Button = page_builder.object("optimus-discord").unwrap();

    nonfree_drivers_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/nVidia_drivers.sh"),
            false,
        );
    });
    free_drivers_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/amd_drivers.sh"),
            false,
        );
    });
    switch_dm_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/switch_dm.sh"),
            false,
        );
    });
    hw_service_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/hw_service.sh"),
            false,
        );
    });
    asus_rog_tools_btn.connect_clicked(move |_| {
        let uri = "https://asus-linux.org/";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    optimus_discord_btn.connect_clicked(move |_| {
        let uri = "https://discord.gg/4ZKGd7Un5t";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });

    // let drivers_type_section_box = create_drivers_type_section();

    // let grid = gtk::Grid::new();
    // grid.set_hexpand(true);
    // grid.set_margin_start(10);
    // grid.set_margin_end(10);
    // grid.set_margin_top(5);
    // grid.set_margin_bottom(5);
    // grid.attach(&back_btn, 0, 1, 1, 1);
    // let box_collection = gtk::Box::new(gtk::Orientation::Vertical, 5);

    // box_collection.pack_start(&drivers_type_section_box, false, false, 10);

    // box_collection.set_valign(gtk::Align::Center);
    // box_collection.set_halign(gtk::Align::Center);
    // grid.attach(&box_collection, 1, 2, 5, 1);
    viewport.add(&pagebox);
    viewport.show_all();

    let stack: gtk::Stack = builder.object("stack").unwrap();
    let child_name = "driversBrowserpage";
    stack.add_named(&viewport, child_name);
}

pub fn create_faq_page(builder: &Builder) {
    let install: gtk::Button = builder.object("faqBrowser").unwrap();
    install.set_visible(true);

    let viewport = gtk::Viewport::new(gtk::Adjustment::NONE, gtk::Adjustment::NONE);
    let image = gtk::Image::from_icon_name(Some("go-previous"), gtk::IconSize::Button);

    let page_builder: Builder = Builder::from_file(format!("{}/ui/faq_page.glade", PKGDATADIR));
    let back_btn: gtk::Button = page_builder.object("backbutton").unwrap();
    // let back_btn = gtk::Button::new();
    back_btn.set_image(Some(&image));
    back_btn.set_widget_name("home");

    back_btn.connect_clicked(glib::clone!(@weak builder => move |button| {
        let name = button.widget_name();
        let stack: gtk::Stack = builder.object("stack").unwrap();
        stack.set_visible_child_name(&format!("{}page", name));
    }));

    let icon_path = format!("{}/data/img/faq-img.png", PKGDATADIR);
    let page_image: gtk::Image =
        page_builder.object("pageimage").expect("Could not get the page image");
    page_image.set_from_file(Some(&icon_path));

    let pagebox: gtk::Box = page_builder.object("pagebox").unwrap();

    // First
    let build_iso_btn: gtk::Button = page_builder.object("build-iso").unwrap();
    let auto_mount_btn: gtk::Button = page_builder.object("auto-mount").unwrap();
    let dualboot_btn: gtk::Button = page_builder.object("dualboot").unwrap();
    let kde_btn: gtk::Button = page_builder.object("kde").unwrap();
    let notfound_linux_btn: gtk::Button = page_builder.object("notfound-linux").unwrap();

    // Second
    let failed_mirrors_btn: gtk::Button = page_builder.object("failed-mirrors").unwrap();
    let pacman_back_btn: gtk::Button = page_builder.object("pacman-back").unwrap();
    let downgrade_btn: gtk::Button = page_builder.object("downgrade").unwrap();
    let grub_issue_btn: gtk::Button = page_builder.object("grub-issue").unwrap();
    let snap_btn: gtk::Button = page_builder.object("snap").unwrap();

    build_iso_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-118.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    auto_mount_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-95.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    dualboot_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-5.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    kde_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-144.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    notfound_linux_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-90.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    failed_mirrors_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-87.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    pacman_back_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-115.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    downgrade_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-37.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    grub_issue_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-164.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });
    snap_btn.connect_clicked(move |_| {
        let uri = "https://forum.xerolinux.xyz/thread-308.html";
        let _ = gtk::show_uri_on_window(gtk::Window::NONE, uri, 0);
    });

    // let faq_section_box = create_faq_section();

    // let grid = gtk::Grid::new();
    // grid.set_hexpand(true);
    // grid.set_margin_start(10);
    // grid.set_margin_end(10);
    // grid.set_margin_top(5);
    // grid.set_margin_bottom(5);
    // grid.attach(&back_btn, 0, 1, 1, 1);
    // let box_collection = gtk::Box::new(gtk::Orientation::Vertical, 5);

    // box_collection.pack_start(&faq_section_box, false, false, 10);

    // box_collection.set_valign(gtk::Align::Center);
    // box_collection.set_halign(gtk::Align::Center);
    // grid.attach(&box_collection, 1, 2, 5, 1);
    viewport.add(&pagebox);
    viewport.show_all();

    let stack: gtk::Stack = builder.object("stack").unwrap();
    let child_name = "faqBrowserpage";
    stack.add_named(&viewport, child_name);
}

pub fn init_mirrorlist_main_button(builder: &Builder) {
    let rank_mirrors_btn: gtk::Button = builder.object("update-arch-mirrorlist").unwrap();
    rank_mirrors_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/rank_mirrors.sh"),
            false,
        );
    });
}

pub fn init_gpg_main_button(builder: &Builder) {
    let fix_keys_btn: gtk::Button = builder.object("fix-gpg-keys").unwrap();
    fix_keys_btn.connect_clicked(move |_| {
        let _ = utils::run_cmd_terminal(
            String::from("/usr/share/xerowelcome/scripts/fix_keys.sh"),
            false,
        );
    });
}

pub fn init_update_sys_main_button(builder: &Builder) {
    let update_system_btn: gtk::Button = builder.object("update-system").unwrap();
    update_system_btn.connect_clicked(on_update_system_btn_clicked);
}

fn on_xerofix_btn_clicked(_: &gtk::Button) {
    let _ = utils::run_cmd_terminal(
        String::from("/usr/share/xerowelcome/scripts/xerofix.sh"),
        false,
    );
}

fn on_distrobox_btn_clicked(_: &gtk::Button) {
    let _ = utils::run_cmd_terminal(
        String::from("/usr/share/xerowelcome/scripts/dbox.sh"),
        false,
    );
}

fn on_update_system_btn_clicked(_: &gtk::Button) {
    let _ = utils::run_cmd_terminal(
        String::from("/usr/share/xerowelcome/scripts/update_system.sh"),
        false,
    );
}
