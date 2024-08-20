fn main() {
    // copy_libusb_share();

    tauri_build::build()
}

fn copy_libusb_share() {
    use std::{fs, path::Path};
    let (src, dest) = {
        #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
        {
            (
                Path::new("resources/libusb_shared/libusb_shared.dylib-x86_64-apple-darwin"),
                Path::new("libusb_shared.dylib"),
            )
        }
        #[cfg(all(target_os = "macos", target_arch = "aarch64"))]
        {
            (
                Path::new("resources/libusb_shared/libusb_shared.dylib-aarch64-apple-darwin"),
                Path::new("libusb_shared.dylib"),
            )
        }
        #[cfg(target_os = "windows")]
        {
            (
                Path::new("resources/libusb_shared/libusb_shared.dll"),
                Path::new("libusb_shared.dll"),
            )
        }
        #[cfg(target_os = "linux")]
        {
            (
                Path::new("resources/libusb_shared/libusb_shared.so"),
                Path::new("libusb_shared.so"),
            )
        }
    };
    fs::copy(src, dest).unwrap();
}
