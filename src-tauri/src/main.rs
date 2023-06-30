// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod state;

use std::fmt::format;

use serde_json;
use state::{AppState, ServiceAccess};
use tauri::{App, AppHandle, Manager, State};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(my_name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", my_name)
}

#[tauri::command]
fn add_settings_data(
    app_handle: AppHandle,
    organization_name: String,
    phone_no: String,
    email: Option<String>,
    pan_no: i32,
    location: String,
    image: String
) -> String {
    let setting_data = database::Setting {
        organization_name: organization_name,
        phone_no: phone_no,
        email: email,
        pan_no: pan_no,
        image: image,
        location: location,
    };
    let result = app_handle.db(|db| database::add_settings(db, setting_data));
    match result{
        Ok(_value)=>{
            let items = app_handle.db(|db| database::get_settings(db)).unwrap();
            // let items_string = items.join(" | ");
            let setting_string = serde_json::to_string(&items).unwrap();
        
            format!("{}", setting_string)
        }
        Err(_error)=>{
            format!("Error")
        }
    }
}

#[tauri::command]
fn get_settings_data(app_handle: AppHandle) -> Result<String, String> {
    let setting_data = app_handle.db(|db| database::get_settings(db));
    match setting_data{
        Ok(value) =>{
            let setting_string = serde_json::to_string(&value).unwrap();
            Ok(setting_string)
        },
        Err(error) =>{
            Err(format!("Error {}", error))
        }
    }
}

// class commands
#[tauri::command]
fn get_class_data(app_handle: AppHandle, page: i32, limit: i32) -> String {
    // app_handle.db(|db | database::get_class(1, 10, db)).unwrap();
    let items: Vec<database::Class> = app_handle
        .db(|db| database::get_class(page, limit, db))
        .unwrap();
    let items_string = serde_json::to_string(&items).unwrap();
    format!("{}", items_string)
}

#[tauri::command]
fn add_class_data(app_handle: AppHandle, class: &str) -> String {
    app_handle
        .db(|db| database::add_class(class.to_string(), db))
        .unwrap();
    format!("OK")
}

#[tauri::command]
fn update_class_data(app_handle: AppHandle, class: &str, id: i32) -> String {
    app_handle
        .db(|db| database::update_class(db, id, class.to_string()))
        .unwrap();

    format!("Class Updated")
}

#[tauri::command]
fn count_class_rows(app_handler: AppHandle) -> String {
    let count = app_handler.db(|db| database::count_class_rows(db)).unwrap();
    format!("{}", count)
}

// student commands
#[tauri::command]
fn get_student_data(app_handle: AppHandle, page: i32, limit: i32) -> String {
    let items: Vec<database::Student> = app_handle
        .db(|db| database::get_student(db, page, limit))
        .unwrap();
    let items_string = serde_json::to_string(&items).unwrap();
    format!("{}", items_string)
}

#[tauri::command]
fn add_student_data(
    app_handle: AppHandle,
    first_name: String,
    mid_name: String,
    last_name: String,
    address: String,
    father_name: String,
    mother_name: String,
    date_of_birth: Option<String>,
    gender: String,
    phone_no: Option<String>,
    email: Option<String>,
    guardian_name: Option<String>,
    guardian_relation: Option<String>,
    emergency_contact: Option<String>,
    is_active: bool,
    class_id: i32,
    roll_no: i32
) -> i32 {
    let student_data = database::Student {
        id: 0,
        first_name: first_name,
        mid_name: mid_name,
        last_name: last_name,
        address: address,
        father_name: father_name,
        mother_name: mother_name,
        date_of_birth: date_of_birth,
        gender: gender,
        roll_no: roll_no,
        phone_no: phone_no,
        email: email,
        created_at: None,
        updated_at: None,
        guardian_name: guardian_name,
        guardian_relation: guardian_relation,
        emergency_contact: emergency_contact,
        is_active: is_active,
        class_id: class_id,
        class: None,
    };
    let result =app_handle
        .db(|db| database::add_student(db, student_data));
    match result{
        Ok(_value)=>{
            return 200;
        }
        Err(_error)=>{
            return 500;
        }
    }
}

#[tauri::command]
fn get_student_detail_data(app_handle: AppHandle, id: i32) -> String {
    let student = app_handle
        .db(|db| database::get_student_detail(db, id))
        .unwrap();
    let student_string = serde_json::to_string(&student).unwrap();
    format!("{}", student_string)
}

#[tauri::command]
fn update_student_data(
    app_handle: AppHandle,
    id: i32,
    first_name: String,
    mid_name: String,
    last_name: String,
    address: String,
    father_name: String,
    mother_name: String,
    date_of_birth: Option<String>,
    gender: String,
    phone_no: Option<String>,
    email: Option<String>,
    guardian_name: Option<String>,
    guardian_relation: Option<String>,
    emergency_contact: Option<String>,
    is_active: bool,
    class_id: i32,
    roll_no: i32
) -> String {
    let student_data = database::Student {
        id: id,
        first_name: first_name,
        mid_name: mid_name,
        last_name: last_name,
        address: address,
        father_name: father_name,
        mother_name: mother_name,
        date_of_birth: date_of_birth,
        gender: gender,
        roll_no: roll_no,
        phone_no: phone_no,
        email: email,
        created_at: None,
        updated_at: None,
        guardian_name: guardian_name,
        guardian_relation: guardian_relation,
        emergency_contact: emergency_contact,
        is_active: is_active,
        class_id: class_id,
        class: None,
    };
    app_handle
        .db(|db| database::update_student_detail(db, student_data, id))
        .unwrap();
    format!("OK")
}

#[tauri::command]
fn count_student_row(app_handler: AppHandle) -> String {
    let count = app_handler
        .db(|db| database::count_student_row(db))
        .unwrap();
    format!("{}", count)
}

#[tauri::command]
fn change_student_status_data(app_handle: AppHandle, student_id: i32, new_status: bool)-> i32{
    let result = app_handle.db(|db| database::change_student_status(db, new_status, student_id));
    match result{
        Ok(_value)=>{
            return 200;
        }
        Err(_error)=>{
            return 500;
        }
    }
}

#[tauri::command]
fn get_student_charges_data(app_handle: AppHandle, student_id: i32)-> Vec<database::StudentCharges>{
    let result = app_handle.db(|db| database::get_student_charges(db, student_id));
    match result{
        Ok(value)=>{
            return value;
        }
        Err(_err)=>{
            let empty_student_charges:Vec<database::StudentCharges> = Vec::new();
            return empty_student_charges;
        }
    }
}

// charges command
#[tauri::command]
fn add_charge_data(
    app_handle: AppHandle,
    charge_title: String,
    amount: f32,
    classes: Vec<i32>,
    is_regular: bool,
) -> String {
    app_handle
        .db_mut(|db| database::add_charge(db, charge_title, amount, classes, is_regular))
        .unwrap();
    format!("Ok")
}

#[tauri::command]
fn get_charge_data(app_handler: AppHandle, page: i32, limit: i32) -> String {
    let charge_data = app_handler
        .db(|db| database::get_charges(db, page, limit))
        .unwrap();
    let charge_data_string = serde_json::to_string(&charge_data).unwrap();
    format!("{}", charge_data_string)
}

// apply charges
#[tauri::command]
fn apply_charges_data(app_handle: AppHandle, charge_id: i32)-> i32{
    let result = app_handle.db_mut(|db| database::apply_charges(db, charge_id));
    match result{
        Ok(_value)=>{
            return 200
        }
        Err(error)=>{
            println!("{}",error);
            return 500;
        }
    }
}

#[tauri::command]
fn count_charges_row(app_handle: AppHandle) -> i32 {
    let count = app_handle.db(|db| database::count_charges_row(db)).unwrap();
    return count;
}

// fees commands
#[tauri::command]
fn add_fee_data(app_handle: AppHandle,amount: f32,charge_id:i32, student_id: i32 ) -> i32{
    let fees_data = database::Fees{
        amount: amount,
        charge_id: charge_id,
        student_id: student_id,
        charge_title: None,
        created_at: " ".to_string(),
        description: None,
        student_first_name: None,
        student_last_name: None,
        id: 0,
        title: None,
        updated_at: None,
        payment_id: None
    };
    let result = app_handle.db(|db| database::add_fees(db,fees_data ));

    match result{
        Ok(_value)=>{
            return 200
        }
        Err(_error)=>{
            return 500
        }
    }

}

#[tauri::command]
fn get_fee_data(app_handle: AppHandle, page: i32, limit: i32, remaining:bool, student_id: Option<i32>)-> Vec<database::Fees>{
    let result = app_handle.db(|db| database::get_fees(db, page, limit, remaining, student_id));
    match result{
        Ok(value)=>{
            return value;
            // let fees_string = serde_json::to_string(&value).unwrap();
            // format!("{}", fees_string)
        }
        Err(error)=>{
            println!("{}", error);
            return Vec::new();
        }
    }
}

#[tauri::command]
fn count_fees_row(app_handle: AppHandle, remaining: bool, student_id: Option<i32>)->i32{
    let result = app_handle.db(|db| database::count_fees_row(db, remaining, student_id));
    match result{
        Ok(value)=>{
            return value;
        }
        Err(_error)=>{
            return 0;
        }
    }
}

// payment commands
#[tauri::command]
fn add_payment_data(app_handle: AppHandle, amount: f32, student_id: i32, remarks: Option<String> )->i32{
    let payment_data = database::Payment { 
        id: 0, 
        student_id: student_id, 
        student_first_name: None, 
        student_last_name: None, 
        created_at: "".to_string(), 
        amount: amount, 
        remarks: remarks
    };
    let result = app_handle.db_mut(|db| database::add_payment(db, payment_data));

    match result{
        Ok(_value)=>{
            return 200;
        }
        Err(_error)=>{
            return 500;
        }
    }
}

#[tauri::command]
fn get_payment_data(app_handle: AppHandle, page: i32, limit: i32, student_id: Option<i32>)-> String{
    let result = app_handle.db(|db| database::get_payment(db, page, limit, student_id));
    match result{
        Ok(data)=>{
            let payment_string = serde_json::to_string(&data).unwrap();
            return payment_string;
        }
        Err(_error)=>{
            return "[]".to_string();
        }
    }
}

#[tauri::command]
fn count_payment_rows(app_handle: AppHandle, student_id: Option<i32>) -> i32{
    let result = app_handle.db(|db| database::count_payment_rows(db, student_id));
    match result{
        Ok(value)=>{
            return value;
        }
        Err(_error)=>{
            return 0;
        }
    }
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            // settings command
            add_settings_data,
            get_settings_data,
            // class commands
            get_class_data,
            add_class_data,
            update_class_data,
            count_class_rows,
            // student commands
            get_student_data,
            add_student_data,
            get_student_detail_data,
            change_student_status_data,
            update_student_data,
            get_student_charges_data,
            count_student_row,
            // charges commands
            add_charge_data,
            get_charge_data,
            count_charges_row,
            apply_charges_data,
            // fees
            add_fee_data,
            get_fee_data,
            count_fees_row,
            // payment
            add_payment_data,
            get_payment_data,
            count_payment_rows,
        ])
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
