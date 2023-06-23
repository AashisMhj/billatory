// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod state;

use state::{AppState, ServiceAccess};
use tauri::{AppHandle, Manager, State};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(my_name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", my_name)
}

#[tauri::command]
fn add_settings(app_handle: AppHandle,organization_name: &str,contact_no: &str, email: &str, pan_no: &str  ) -> String {
    app_handle.db(|db| database::add_item(organization_name, contact_no, email, pan_no, db)).unwrap();
    let items = app_handle.db(|db| database::get_all(db)).unwrap();
    let items_string = items.join(" | ");

    format!("{}", items_string)
}


fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![greet, add_settings])
        .setup(|app| {
            let handle = app.handle();
            print!("this is it");
            let app_state: State<AppState> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Data initialize should be succeed");
            *app_state.db.lock().unwrap() = Some(db);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
