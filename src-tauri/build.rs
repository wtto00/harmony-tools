fn main() {
    #[cfg(target_os = "macos")]
    copy_libusb_share();

    tauri_build::build()
}

#[cfg(target_os = "macos")]
fn copy_libusb_share() {
    use std::{fs, path::Path};

    #[cfg(target_arch = "x86_64")]
    {
        let src = Path::new("resources/libusb_shared/libusb_shared.dylib-x86_64-apple-darwin");
        let dest = Path::new("libusb_shared.dylib");
        fs::copy(src, dest).unwrap();
    }

    #[cfg(target_arch = "aarch64")]
    {
        let src = Path::new("resources/libusb_shared/libusb_shared.dylib-aarch64-apple-darwin");
        let dest = Path::new("libusb_shared.dylib");
        fs::copy(src, dest).unwrap();
    }
}
