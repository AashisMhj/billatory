extern crate bcrypt;

use bcrypt::{hash, verify};
use rusqlite::{params, Connection, Result};
use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use crate::helpers::get_current_date_time;

#[derive(Debug, Serialize)]
pub struct Setting {
    pub organization_name: String,
    pub pan_no: i32,
    pub email: Option<String>,
    pub phone_no: String,
    pub location: String,
    pub image: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
    pub password: String,
}

pub fn get_app_log(path: PathBuf) -> Result<String, std::io::Error> {
    let file_content = fs::read_to_string(path);
    return file_content;
}

pub fn update_password(db: &Connection, old_password:String, new_password: String)-> Result<bool, rusqlite::Error>{
    let mut statement = db.prepare("Select password from settings limit 1")?;
    let current_hash_password = statement.query_row([], |row| row.get::<&str, String>("password"))?;
    let is_verified = verify(old_password, &current_hash_password).unwrap();
    if is_verified {
        let new_hashed_password = hash(new_password, bcrypt::DEFAULT_COST).unwrap();
        let current_date = get_current_date_time();
        db.execute("UPDATE settings SET password = ?1, updated_at = ?2", params![new_hashed_password, current_date])?;
        Ok(true)
    }else{
        Ok(false)
    }
}
pub fn add_settings(db: &Connection, setting_data: Setting) -> Result<(), rusqlite::Error> {
    let hashed_password = hash(setting_data.password, bcrypt::DEFAULT_COST).unwrap();
    db.execute(
        "
    INSERT INTO settings (organization_name, pan_no, location, phone_no, image, email, password) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
    ",
        params![
            setting_data.organization_name,
            setting_data.pan_no,
            setting_data.location,
            setting_data.phone_no,
            setting_data.image,
            setting_data.email,
            hashed_password
        ],
    )?;

    Ok(())
}

pub fn sign_in(db: &Connection, password: String) -> Result<bool, rusqlite::Error>{
    let mut statement = db.prepare("Select password from settings limit 1")?;
    let hash_password = statement.query_row([], |row| row.get::<&str, String>("password"))?;
    let is_verified = verify(password, &hash_password).unwrap();
    Ok(is_verified)
}

pub fn get_settings(db: &Connection) -> Result<Setting, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM settings limit 1")?;
    let setting_result = statement.query_row::<Setting, _, _>([], |row| {
        Ok(Setting {
            organization_name: row.get("organization_name")?,
            image: row.get("image")?,
            email: row.get("email")?,
            location: row.get("location")?,
            pan_no: row.get("pan_no")?,
            phone_no: row.get("phone_no")?,
            created_at: row.get("created_at")?,
            updated_at: row.get("updated_at")?,
            password: row.get("password")?,
        })
    })?;
    Ok(setting_result)
}

pub fn update_settings(db: &Connection, setting_data: Setting) -> Result<(), rusqlite::Error> {
    let current_date = get_current_date_time();
    db.execute("UPDATE settings SET organization_name = ?1, image = ?2, email = ?3, location = ?4, pan_no = ?5, phone_no = ?6, updated_at = ?7;", 
    params![setting_data.organization_name, setting_data.image, setting_data.email, setting_data.location, setting_data.pan_no, setting_data.phone_no, current_date])?;
    Ok(())
}