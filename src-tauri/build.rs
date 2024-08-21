fn main() {
    #[cfg(target_os = "windows")]
    copy_libusb_share();

    tauri_build::build()
}

#[cfg(target_os = "windows")]
fn copy_libusb_share() {
    use std::{fs, path::Path};
    let src = Path::new("binaries/libusb_shared.dll");
    let dest = Path::new("libusb_shared.dll");
    fs::copy(src, dest).unwrap();
}
