use std::{
    fs::File,
    io::{BufRead, BufReader},
};
use tauri::{Manager, Runtime};

#[tauri::command]
async fn file_md5<R: Runtime>(
    _: tauri::AppHandle<R>,
    _: tauri::Window<R>,
    path: String,
) -> Result<String, String> {
    let file = File::open(path).unwrap();
    let len = file.metadata().unwrap().len();
    let buf_len = len.min(1_000_000) as usize;
    let mut buf = BufReader::with_capacity(buf_len, file);
    let mut context = md5::Context::new();
    loop {
        let part = buf.fill_buf().unwrap();
        if part.is_empty() {
            break;
        }
        context.consume(part);
        let part_len = part.len();
        buf.consume(part_len);
    }
    let digest = context.compute();
    Ok(format!("{:x}", digest))
}

fn show_window(app: &tauri::AppHandle) {
    let windows = app.webview_windows();
    windows
        .values()
        .next()
        .expect("Sorry, no window found")
        .set_focus()
        .expect("Can't Bring Window to Focus");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            let _ = show_window(app);
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .invoke_handler(tauri::generate_handler![file_md5])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
