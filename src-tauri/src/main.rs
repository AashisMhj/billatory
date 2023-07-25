// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod state;
mod charges;
mod fees;
mod students;
mod helpers;
mod classes;
mod settings;
mod payment;


use log::{info, error,};
use serde_json;
use state::{AppState, ServiceAccess};
use tauri::{AppHandle, Manager, State};
use tauri_plugin_log::LogTarget;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(my_name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", my_name)
}

#[tauri::command]
fn get_log_data(app_handle: AppHandle) -> Result<String, String>{
    let log_path = app_handle.path_resolver().app_log_dir().unwrap();
    let result = settings::get_app_log(log_path.join("student-billing.log"));
    match result{
        Ok(value)=>{
            return Ok(value);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }
}

#[tauri::command]
fn backup_data(app_handle: AppHandle) -> Result<String, String>{
    let result = app_handle.db(|_db| database::backup( &app_handle));
    match result{
        Ok((_u, file_path)) => {
            info!("Back Up created");
            let path = format!("{}", file_path.display());
            return Ok(path);
        }
        Err(error) => {
            error!("Error");
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_backup_files_data(app_handle: AppHandle) -> Result<Vec<database::BackUpFileType>, String>{
    let result = database::get_backup_files(&app_handle);
    match result{
        Ok(value) =>{
            Ok(value)
        }
        Err(error) =>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn add_settings_data(
    app_handle: AppHandle,
    organization_name: String,
    phone_no: String,
    email: Option<String>,
    pan_no: i32,
    location: String,
    image: String,
    password: String
) -> Result<settings::Setting, String> {
    let setting_data = settings::Setting {
        organization_name: organization_name,
        phone_no: phone_no,
        email: email,
        pan_no: pan_no,
        image: image,
        location: location,
        password: password,
        updated_at: None,
        created_at: None
    };
    let result = app_handle.db(|db| settings::add_settings(db, setting_data));
    match result{
        Ok(_value)=>{
            let items = app_handle.db(|db| settings::get_settings(db));
            match items{
                Ok(setting)=>{
                    info!("Added Settings");
                    return Ok(setting)
                }
                Err(error) => {
                    error!("{}",error.to_string());
                    Err(error.to_string())
                }
            }
        }
        Err(error)=>{
            error!("{}", error.to_string());
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_settings_data(app_handle: AppHandle) -> Result<String, String> {
    let setting_data = app_handle.db(|db| settings::get_settings(db));
    match setting_data{
        Ok(value) =>{
            let setting_string = serde_json::to_string(&value).unwrap();
            Ok(setting_string)
        },
        Err(error) =>{
            error!("{}", error.to_string());
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn update_settings_data(app_handle: AppHandle,
    organization_name: String,
    phone_no: String,
    email: Option<String>,
    pan_no: i32,
    location: String,
    image: String ) -> Result<i32, String>{
    let settings_data = settings::Setting{
        organization_name: organization_name,
        phone_no: phone_no,
        email: email,
        pan_no: pan_no,
        image: image,
        location: location,
        password: "".to_string(),
        updated_at: None,
        created_at: None
    };
    let result = app_handle.db(|db| settings::update_settings(db, settings_data));
    match result{
        Ok(_value)=>{
            info!("Updated Settings Data");
            return Ok(200);
        }
        Err(error)=>{
            error!("{}", error.to_string());
            return Err(error.to_string());
        }
    }
}

// class commands
#[tauri::command]
fn get_class_data(app_handle: AppHandle, page: i32, limit: i32) -> Result<String, String> {
    // app_handle.db(|db | database::get_class(1, 10, db)).unwrap();
    let items = app_handle
        .db(|db| classes::get_class(page, limit, db));
    match items{
        Ok(value)=>{
            let items_string = serde_json::to_string(&value).unwrap();
            Ok(items_string)
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }
}
#[tauri::command]
fn update_password_data(app_handle: AppHandle, old_password: String, new_password: String) -> Result<i32, String>{
    let result = app_handle.db(|db| settings::update_password(db, old_password, new_password));
    match result{
        Ok(value)=>{
            if value{
                Ok(200)
            }else{
                Err("Password Incorrect".to_string())
            }
        }
        Err(error) =>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn verify_user_data(app_handle: AppHandle, password:String)-> Result<i32, String>{
    let result = app_handle.db(|db| settings::sign_in(db, password));
    match result{
        Ok(value)=>{
            if value {
                Ok(200)
            }else{
                Err("Password Incorrect".to_string())
            }
        }
        Err(error)=>{
            error!("{}",error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_class_only_data(app_handle: AppHandle) -> Result<Vec<classes::ClassMini>, String> {
    let items = app_handle
        .db(|db| classes::get_class_only( db));
    match items{
        Ok(value)=>{
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }
}


#[tauri::command]
fn add_class_data(app_handle: AppHandle, class: &str) -> Result<i32, String> {
    let result = app_handle
        .db(|db| classes::add_class(class.to_string(), db));
    match result{
        Ok(_value)=>{
            info!("Added Class");
            return Ok(200);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }
}

#[tauri::command]
fn update_class_data(app_handle: AppHandle, class: &str, id: i32) -> Result<i32, String> {
    let result= app_handle.db(|db| classes::update_class(db, id, class.to_string()));
    match result{
        Ok(_value)=>{
            let msg = format!("Updated class {}", id);
            info!("{}", msg);
            return Ok(200)
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }
}

#[tauri::command]
fn count_class_rows(app_handler: AppHandle) -> Result<i32, String> {
    let count = app_handler.db(|db| classes::count_class_rows(db));
    match count{
        Ok(value) =>{
            return Ok(value);
        } 
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string());
        }
    }
}

// student commands
#[tauri::command]
fn get_all_active_students_data(app_handle: AppHandle) -> Result<Vec<students::StudentMinType>, String> {
    let result = app_handle.db(|db| students::get_all_active_students(db));
    match result{
        Ok(value) =>{
            Ok(value)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_student_data(app_handle: AppHandle, page: i32, limit: i32,is_active: bool, class_id: Option<i32> ) -> Result<String, String> {
    let items = app_handle
        .db(|db| students::get_student(db, page, limit,is_active, class_id));
    match items{
        Ok(students)=>{
            let items_string = serde_json::to_string(&students).unwrap();
            Ok(items_string)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
    
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
) -> Result<i32, String> {
    let student_data = students::Student {
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
        .db(|db| students::add_student(db, student_data));
    match result{
        Ok(_value)=>{
            info!("Student Added");
            return Ok(200);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string());
        }
    }
}

#[tauri::command]
fn get_student_detail_data(app_handle: AppHandle, id: i32) -> Result<String, String> {
    let student = app_handle
        .db(|db| students::get_student_detail(db, id));
    match student{
        Ok(value)=>{
            let student_string = serde_json::to_string(&value).unwrap();
            Ok(student_string)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
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
) -> Result<i32, String> {
    let student_data = students::Student {
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
    let result = app_handle.db(|db| students::update_student_detail(db, student_data, id));
    match result{
        Ok(_value)=>{
            let msg = format!("Student updated id: {}", id);
            info!("{}",msg);
            return Ok(200)
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }

}

#[tauri::command]
fn bulk_update_student_class_data(app_handle: AppHandle, class_id: i32, student_ids: Vec<i32>) -> Result<i32, String>{
    let result = app_handle.db(|db| students::bulk_update_student_class(db, class_id, student_ids));
    match result{
        Ok(_value) => {
            info!("Bulk Updated student classes to {}", class_id);
            Ok(200)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn bulk_update_student_status_data(app_handle: AppHandle, new_status: bool, student_ids: Vec<i32>) -> Result<i32, String>{
    let result = app_handle.db(|db| students::bulk_update_student_status(db, new_status, student_ids));
    match result{
        Ok(_value) => {
            info!("Bulk Updated student classes to {}", new_status);
            Ok(200)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn count_student_row(app_handler: AppHandle, is_active: bool, class_id: Option<i32>) -> Result<i32, String> {
    let count = app_handler.db(|db| students::count_student_row(db, is_active, class_id));
    match count{
        Ok(value) => {
            return Ok(value);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string());
        }
    }
}

#[tauri::command]
fn change_student_status_data(app_handle: AppHandle, student_id: i32, new_status: bool)-> i32{
    let result = app_handle.db(|db| students::change_student_status(db, new_status, student_id));
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
fn get_student_charges_data(app_handle: AppHandle, student_id: i32)-> Result<Vec<database::StudentCharges>, String>{
    let result = app_handle.db(|db| database::get_student_charges(db, student_id));
    match result{
        Ok(value)=>{
            return Ok(value);
        }
        Err(err)=>{
            Err(err.to_string())
        }
    }
}

#[tauri::command]
fn add_student_charge_data(app_handle: AppHandle, student_id: i32, charge_id: i32)-> Result<i32, String>{
    let result = app_handle.db(|db| database::add_student_charge(db, student_id, charge_id));
    match result{
        Ok(_value) => {
            Ok(200)
        }
        Err(err)=>{
            Err(err.to_string())
        }
    }
}

#[tauri::command]
fn get_student_previous_due_data(app_handle: AppHandle, student_id: i32, nepali_month: i32, nepali_year: i32)-> Result<f32, String>{
    let result = app_handle.db(|db| fees::get_student_previous_due(db, student_id, nepali_month, nepali_year));
    match result{
        Ok(value)=>{
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_current_month_student_fee_data(app_handle: AppHandle, student_id: i32,  nepali_month: i32, nepali_year: i32) -> Result<Vec<fees::Fees>, String>{
    let result = app_handle.db(|db| fees::get_current_month_student_fee(db, student_id, nepali_month, nepali_year));
    match result{
        Ok(value)=>{
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn remove_student_charge_data(app_handle: AppHandle, id: i32) -> Result<i32,String>{
    let result = app_handle.db(|db| database::remove_student_charge(db, id));
    match result{
        Ok(_value)=>{
            Ok(200)
        }
        Err(err) => {
            Err(err.to_string())
        }
    }
}

// charges command
#[tauri::command]
fn add_charge_bulk_data(
    app_handle: AppHandle,
    charge_title: String,
    amount: f32,
    classes: Vec<i32>
) -> Result<i32, String> {
    let result = app_handle.db_mut(|db| database::add_charge_bulk(db, charge_title, amount, classes));

    match result{
        Ok(_value)=>{
            Ok(200)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn add_charge_data(app_handle: AppHandle, charge_title: String, amount: f32, class_id: i32) -> Result<i32, String>{
    let result = app_handle.db(|db| database::add_charge(db, amount, charge_title, class_id));

    match result{
        Ok(_value) =>{
            Ok(200)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_charge_detail_data(app_handle: AppHandle, charge_id: i32) -> Result<charges::Charge, String>{
    let result = app_handle.db(|db| charges::get_charge_detail(db, charge_id));
    match result{
        Ok(value) =>{
            Ok(value)
        }
        Err(error) =>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_charge_data(app_handler: AppHandle, page: i32, limit: i32, class_id: Option<i32>) -> Result<String, String> {
    let charge_data = app_handler
        .db(|db| database::get_charges(db, page, limit, class_id));
    match charge_data{
        Ok(value)=>{
            let charge_data_string = serde_json::to_string(&value).unwrap();
            return Ok(charge_data_string);
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn disable_fee_data(app_handle: AppHandle, charge_id: i32) -> Result<i32, String>{
    let result = app_handle.db(|db| charges::delete_charge(db, charge_id));
    match result{
        Ok(_value) =>{
            Ok(200)
        }
        Err(error) =>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_charges_students_data(app_handle: AppHandle, charge_id: i32) -> Result<Vec<charges::ChargeOfStudent>, String>{
    let result = app_handle.db(|db| charges::get_student_of_charge(db, charge_id));
    match result{
        Ok(value)=>{
            return Ok(value)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }
}
#[tauri::command]
fn update_charge_data(app_handle: AppHandle, charge_id: i32, charge_title:String, amount: f32) -> Result<i32, String>{
    let result = app_handle.db(|db| database::update_charge(db, charge_id, amount, charge_title));
    match result{
        Ok(_value)=>{
            let msg = format!("Charge Updated {}",charge_id );
            info!("{}",msg);
            return Ok(200)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn update_student_charges_data(app_handle: AppHandle, student_id: i32, charges_id: Vec<i32>)-> Result<i32, String>{
    let result = app_handle.db_mut(|db| database::update_student_charges(db, student_id, charges_id));
    match result{
        Ok(_value)=>{
            info!("Updated Student Charges {}", student_id);
            return Ok(200)
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }
}

// apply charges
#[tauri::command]
fn apply_charges_student_data(app_handle: AppHandle, charge_id: i32, amount: f32, charge_title: String, student_ids: Vec<i32>, nepali_month: i32, nepali_year: i32) -> Result<i32, String>{
    let result = app_handle.db_mut(|db| charges::apply_charges_student(db, charge_id, amount, charge_title, student_ids, nepali_month, nepali_year));
    // TODO set the length of vector in msg
    match result{
        Ok(_value) => {
            let msg = format!("Charge {} ", charge_id);
            info!("{}", msg);
            Ok(200)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }
}
// apply charges directly
#[tauri::command]
fn apply_charges_data(app_handle: AppHandle, charge_id: i32)-> Result<i32, String>{
    let result = app_handle.db_mut(|db| database::apply_charges(db, charge_id));
    match result{
        Ok(_value)=>{
            info!("Charges Applied");
            return Ok(200)
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string());
        }
    }
}

#[tauri::command]
fn count_charges_row(app_handle: AppHandle, class_id: Option<i32>) -> Result<i32, String> {
    let count = app_handle.db(|db| database::count_charges_row(db, class_id));
    match count{
        Ok(value)=>{
            return Ok(value);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }
}

// fees commands
#[tauri::command]
fn add_fee_data(app_handle: AppHandle,amount: f32,charge_id:i32, student_id: i32, charge_title: String, nepali_year: i32, nepali_month: i32 ) -> Result<i32, String>{
    let fees_data = fees::Fees{
        amount: amount,
        charge_id: Some(charge_id),
        student_id: student_id,
        charge_title: Some(charge_title),
        created_at: " ".to_string(),
        year: nepali_year,
        month: nepali_month,
        description: None,
        student_first_name: None,
        student_last_name: None,
        id: 0,
        title: None,
        updated_at: None,
        payment_id: None
    };
    let result = app_handle.db(|db| fees::add_fees(db,fees_data ));

    match result{
        Ok(_value)=>{
            info!("Fee Added");
            return Ok(200);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }

}

#[tauri::command]
fn update_fee_data(app_handle: AppHandle, amount: f32, id: i32, charge_title: String, month: i32, year: i32 ) -> Result<i32, String>{
    
    let fees_data = fees::Fees{
        amount: amount,
        month: month,
        year: year,
        charge_id: None,
        student_id: 0,
        charge_title: Some(charge_title),
        created_at: " ".to_string(),
        description: None,
        student_first_name: None,
        student_last_name: None,
        id: id,
        title: None,
        updated_at: None,
        payment_id: None
    };

    let result = app_handle.db(|db| fees::update_fee(db, fees_data));
    match result{
        Ok(_value) => {
            info!(" Fees Updated of id: {}", id);
            Ok(200)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }

} 


#[tauri::command]
fn get_fee_data(app_handle: AppHandle, page: i32, limit: i32,class_id: Option<i32>, year: Option<i32>, month: Option<i32>, charge_id: Option<i32>, student_id: Option<i32>)-> Result<Vec<fees::Fees>, String>{
    let result = app_handle.db(|db| fees::get_fees(db, page, limit, student_id, class_id, year, month, charge_id));
    match result{
        Ok(value)=>{
            return Ok(value);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string());
        }
    }
}


#[tauri::command]
fn count_fees_row(app_handle: AppHandle, class_id: Option<i32>, year: Option<i32>, month: Option<i32>, charge_id: Option<i32>, student_id: Option<i32>)->Result<i32, String>{
    let result = app_handle.db(|db| fees::count_fees_row(db, student_id, class_id, year, month, charge_id));
    match result{
        Ok(value)=>{
            return Ok(value);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string());
        }
    }
}


#[tauri::command]
fn get_monthly_fee_data(app_handle: AppHandle, nepali_month: i32, nepali_year: i32)-> Result<f32, String>{
    let result = app_handle.db(|db| fees::get_monthly_fee(db, nepali_year, nepali_month));
    match result{
        Ok(value)=>{
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_monthly_payment_data(app_handle: AppHandle, nepali_month: i32, nepali_year: i32) -> Result<f32, String>{
    let result = app_handle.db(|db| fees::get_monthly_payment(db,nepali_year, nepali_month ));
    match result{
        Ok(value) => {
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_fee_detail_data(app_handle: AppHandle, id: i32) -> Result<fees::Fees, String>{
    let result = app_handle.db(|db| fees::get_fee_detail(db, id));
    match result{
        Ok(value)=>{
            Ok(value)
        }
        Err(error) => {
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn update_fee_amount_data(app_handle: AppHandle, id: i32, amount: f32) -> Result<i32, String>{
    let result = app_handle.db(|db| fees::update_fee_amount(db, id, amount));
    match result{
        Ok(_value)=>{
            Ok(200)
        }
        Err(error) =>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}
#[tauri::command]
fn get_monthly_fee_stats_data(app_handle: AppHandle, nepali_year: i32) -> Result<Vec<fees::GraphType>, String>{
    let result = app_handle.db(|db| fees::get_monthly_fee_stats(db, nepali_year));
    match result{
        Ok(value) => {
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_monthly_payment_stats_data(app_handle: AppHandle, nepali_year: i32) -> Result<Vec<fees::GraphType>, String>{
    let result = app_handle.db(|db| fees::get_monthly_payment_stats(db, nepali_year));
    match result{
        Ok(value) => {
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_yearly_fee_stats_data(app_handle: AppHandle) -> Result<Vec<fees::GraphType>, String>{
    let result = app_handle.db(|db| fees::get_yearly_fee_stats(db));
    match result{
        Ok(value) => {
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_yearly_payment_stats_data(app_handle: AppHandle) -> Result<Vec<fees::GraphType>, String>{
    let result = app_handle.db(|db| fees::get_yearly_payment_stats(db));
    match result{
        Ok(value) => {
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

// bill
#[tauri::command]
fn add_bill_data(app_handle: AppHandle,student_id: i32, prev_amount: f32, roll_no: i32,student_class: String,particular:String  ) -> Result<i32, String>{
    let bill_data = fees::Bill{
        student_id: student_id,
        created_at: "".to_string(),
        prev_amount: prev_amount,
        roll_no: roll_no,
        student_class: student_class,
        particular: particular
    };
    let result = app_handle.db(|db| fees::add_bill(db, bill_data));
    match result{
        Ok(_value) =>{
            Ok(200)
        }
        Err(error) =>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

// payment commands
#[tauri::command]
fn add_payment_data(app_handle: AppHandle, amount: f32, student_id: i32, payee: String, account_name: String, nepali_year: i32, nepali_month: i32,bill_no: Option<i32>, remarks: Option<String> )->Result<i64, String>{
    let payment_data = payment::Payment { 
        id: 0, 
        student_id: student_id, 
        account_name: account_name,
        payee: payee,
        bill_no: bill_no,
        student_first_name: None, 
        student_last_name: None, 
        year: nepali_year,
        month: nepali_month,
        created_at: "".to_string(), 
        amount: amount, 
        remarks: remarks
    };
    let result = app_handle.db_mut(|db| payment::add_payment(db, payment_data));

    match result{
        Ok(value)=>{
            info!("Added Payment");
            return Ok(value);
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string());
        }
    }
}

#[tauri::command]
fn get_payment_data(app_handle: AppHandle, page: i32, limit: i32, student_id: Option<i32>)-> Result<String, String>{
    let result = app_handle.db(|db| payment::get_payment(db, page, limit, student_id));
    match result{
        Ok(data)=>{
            let payment_string = serde_json::to_string(&data).unwrap();
            return Ok(payment_string);
        }
        Err(error)=>{
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_payment_detail_data(app_handle: AppHandle, id: i32) -> Result<payment::Payment, String>{
    let result = app_handle.db(|db| payment::get_payment_detail(db, id) );
    match result{
        Ok(value)=>{
            Ok(value)
        }
        Err(error)=>{
            error!("{}", error);
            return Err(error.to_string())
        }
    }
}

#[tauri::command]
fn get_bill_count_data(app_handle: AppHandle) -> Result<i32, String>{
    let result = app_handle.db(|db| fees::get_bill_count(db));
    match result{
        Ok(value) =>{
            Ok(value)
        }
        Err(error) =>{
            error!("{}", error);
            Err(error.to_string())
        }
    }
}

#[tauri::command]
fn count_payment_rows(app_handle: AppHandle, student_id: Option<i32>) -> Result<i32, String>{
    let result = app_handle.db(|db| payment::count_payment_rows(db, student_id));
    match result{
        Ok(value)=>{
            return Ok(value);
        }
        Err(error)=>{
            error!("{}",error);
            return Err(error.to_string())
        }
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().targets([
            LogTarget::LogDir,
        ]).build())
        .manage(AppState {
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            // settings command
            add_settings_data,
            get_settings_data,
            update_settings_data,
            backup_data,
            get_log_data,
            get_backup_files_data,
            update_password_data,
            verify_user_data,
            // class commands
            get_class_data,
            add_class_data,
            update_class_data,
            get_class_only_data,
            count_class_rows,
            // student commands
            get_student_data,
            add_student_data,
            get_student_detail_data,
            change_student_status_data,
            update_student_data,
            get_student_previous_due_data,
            get_current_month_student_fee_data,
            get_all_active_students_data,
            bulk_update_student_class_data,
            bulk_update_student_status_data,
            count_student_row,
            // student charges
            get_student_charges_data,
            add_student_charge_data,
            remove_student_charge_data,
            // charges commands
            add_charge_data,
            add_charge_bulk_data,
            get_charge_data,
            count_charges_row,
            apply_charges_data,
            apply_charges_student_data,
            update_charge_data,
            update_student_charges_data,
            get_charges_students_data,
            get_charge_detail_data,
            // fees
            add_fee_data,
            get_fee_data,
            update_fee_data,
            count_fees_row,
            get_monthly_fee_data,
            get_monthly_payment_data,
            update_fee_amount_data,
            get_fee_detail_data,
            get_yearly_fee_stats_data,
            get_yearly_payment_stats_data,
            get_monthly_payment_stats_data,
            get_monthly_fee_stats_data,
            get_bill_count_data,
            disable_fee_data,
            // bill
            add_bill_data,
            // payment
            add_payment_data,
            get_payment_data,
            count_payment_rows,
            get_payment_detail_data
        ])
        .setup(|app| {
            let handle = app.handle();
            let app_state: State<AppState> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Data initialize should be succeed");
            *app_state.db.lock().unwrap() = Some(db);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
