use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_notification::NotificationExt;

/// 发送系统通知
#[tauri::command]
fn send_notification(app: tauri::AppHandle, title: &str, body: &str) -> Result<(), String> {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .invoke_handler(tauri::generate_handler![send_notification])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
