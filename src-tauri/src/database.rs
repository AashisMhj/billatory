use rusqlite::{ params, Connection, Result};
use std::{time::{SystemTime, UNIX_EPOCH}};
use serde::Serialize;
use std::fs;
use tauri::AppHandle;

use crate::state;

const CURRENT_DB_VERSION: u32 = 2;
#[derive(Debug, Serialize)]
pub struct Setting {
    pub organization_name: String,
    pub pan_no: i32,
    pub email: String,
    pub phone_no: String,
    pub location: String,
    // pub image: Option<Vec<u8>>,
    pub image: String,
}

#[derive(Debug, Serialize)]
pub struct Class {
    pub id: i32,
    pub class: String,
}

#[derive(Debug, Serialize)]
pub struct Charges {
    pub class_id: i32,
    pub charge_title: String,
    pub amount: f32,
    pub is_regular: bool,
    pub class: Option<String>
}

#[derive(Debug, Serialize)]
pub struct Student {
    pub id: i32,
    pub first_name: String,
    pub mid_name: String,
    pub last_name: String,
    pub address: String,
    pub father_name: String,
    pub mother_name: String,
    pub date_of_birth: Option<String>,
    pub gender: String,
    pub phone_no: Option<String>,
    pub email: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
    pub guardian_name: Option<String>,
    pub guardian_relation: Option<String>,
    pub emergency_contact: Option<String>,
    pub is_active: bool,
    pub class_id: i32,
    pub class: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct Fees {
    pub id: i32,
    pub student_id: i32,
    pub created_at: String,
    pub updated_at: String,
    pub amount: f32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub charge_id: i32,
    pub paid: bool,
    pub charge_title: Option<String>
}

#[derive(Debug, Serialize)]
pub struct Payment{
    pub id: i32,
    pub student_id: i32,
    pub student_first_name: Option<String>,
    pub student_last_name: Option<String>,
    pub created_at: String,
    pub amount: f32,
    pub remarks: Option<String>
}

pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect(" The app data  directory should exist.");
    fs::create_dir_all(&app_dir).expect(" The app directory should be created");
    let sqlite_path = app_dir.join("db.sqlite");
    print!(" Database file {}", sqlite_path.to_string_lossy());
    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| Ok(row.get(0)?))?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

pub fn upgrade_database_if_needed(
    db: &mut Connection,
    existing_version: u32,
) -> Result<(), rusqlite::Error> {
    if existing_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;
        let tx = db.transaction()?;

        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

        tx.execute_batch(
            " CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                organization_name char(500) not null,
                pan_no int not null,
                email char(250) not null,
                location char(250) not null,
                phone_no char(250) not null,
                image text
            )",
        )?;

        tx.execute(
            "
        CREATE TABLE IF NOT EXISTS class(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class char(250) not null
        );
        ",
            (),
        )?;

        tx.execute(
            "
        CREATE TABLE IF NOT EXISTS charge(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER NOT NULL,
            charge_title text not null,
            amount REAL NOT NULL,
            is_regular boolean,
            FOREIGN KEY(class_id) REFERENCES class(id)
        )
        ",
            (),
        )?;
        tx.execute(
            "
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name char(250) NOT NULL,
            mid_name char(250),
            last_name char(250) NOT NULL,
            address char(250) not null,
            father_name char(250) NOT NULL,
            mother_name char(250) NOT NULL,
            date_of_birth datetime,
            gender char(250) NOT NULL,
            phone_no char(250),
            email char(250) default null,
            created_at DATETIME default CURRENT_TIMESTAMP,
            updated_at DATETIME,
            guardian_name char(250),
            guardian_relation char(250),
            emergency_contact char(250),
            is_active boolean,
            class_id INTEGER NOT NULL,
            FOREIGN KEY(class_id) REFERENCES class(id)
        )
        ",
            (),
        )?;

        tx.execute(
            "
        CREATE TABLE IF NOT EXISTS fees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            created_at datetime default current_timestamp,
            updated_at datetime,
            amount real not null,
            title text,
            description text,
            charge_id integer,
            FOREIGN key(student_id) references student(id),
            FOREIGN KEY(charge_id) REFERENCES charge(id)
        )
        ",())?;

        tx.execute("
        CREATE TABLE IF NOT EXISTS payment(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            created_at datetime default current_timestamp,
            amount real not null,
            remarks text
        );
        ", ())?;

        tx.commit()?;
    }
    Ok(())
}

pub fn add_settings(
    db: &Connection,
    setting_data: Setting
) -> Result<(), rusqlite::Error> {
    db.execute("
    INSERT INTO settings (organization_name, pan_no, location, phone_no, image)
    ", params![setting_data.organization_name,setting_data.pan_no, setting_data.location, setting_data.phone_no, setting_data.image])?;

    Ok(())
}

pub fn get_settings(db: &Connection) -> Result<Setting, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM settings limit 1")?;
    let setting_result = statement.query_row::<Setting, _, _>([], |row| {
        Ok(Setting{
            organization_name: row.get("organization_name")?,
            image: row.get("image")?,
            email: row.get("email")?,
            location: row.get("location")?,
            pan_no: row.get("pan_no")?,
            phone_no: row.get("phone_no")?
        })
    })?;
    // TODO check if the row is returned or not
    Ok(setting_result)
    // let mut rows = statement.query([])?;
    // let mut items = Vec::new();
    // while let Some(row) = rows.next()? {
    //     let title: String = row.get("organization_name")?;
    //     items.push(title)
    // }

    // Ok(items)
}

// class
pub fn add_class(class: String, db: &Connection) -> Result<(), rusqlite::Error> {
    let class_obj = Class {
        class: class,
        id: 0,
    };
    db.execute(
        "
    INSERT INTO class(class) values(?1);
    ",
        (class_obj.class,),
    )?;

    Ok(())
}

pub fn get_class(page: i32, limit: i32, db: &Connection) -> Result<Vec<Class>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Class> = Vec::new();
    let mut statement = db.prepare("Select * from class limit ?1 offset ?2;")?;
    let class_iter = statement.query_map(params![limit, offset_value], |row| {
        Ok(Class {
            class: row.get("class")?,
            id: row.get("id")?,
        })
    })?;
    for item in class_iter {
        data.push(item.unwrap());
    }
    Ok(data)
}

pub fn update_class(db: &Connection, id: i32, class: String) -> Result<(), rusqlite::Error> {
    db.execute(
        "UPDATE class SET class = ?1 where id = ?2",
        params![class, id],
    )?;
    Ok(())
}

pub fn count_class_rows(db: &Connection) -> Result<i32, rusqlite::Error> {
    let mut statement = db.prepare("SELECT count(id) as count from class limit 1;")?;
    let count = statement.query_row([], |row| row.get::<&str, i32>("count"))?;

    Ok(count)
}
// student

pub fn add_student(db: &Connection,student_data: Student) -> Result<(), rusqlite::Error> {
    db.execute("
    INSERT INTO students (first_name, mid_name, last_name, address, father_name, mother_name, date_of_birth, phone_no, email, guardian_name,guardian_relation, emergency_contact, class_id, gender)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)
    ", (student_data.first_name, student_data.mid_name, student_data.last_name, student_data.address, student_data.father_name, student_data.mother_name, student_data.date_of_birth, student_data.phone_no, student_data.email, student_data.guardian_name, student_data.guardian_relation, student_data.emergency_contact, student_data.class_id, student_data.gender))?;
    Ok(())
}

pub fn get_student(
    db: &Connection,
    page: i32,
    limit: i32,
) -> Result<Vec<Student>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Student> = Vec::new();
    let mut statement = db.prepare("Select * from students inner join class on students.class_id = class.id limit ?1 offset ?2;")?;
    let student_iter = statement.query_map(params![limit, offset_value], |row| {
        Ok(Student {
            id: row.get("id")?,
            class: row.get("class")?,
            first_name: row.get("first_name")?,
            last_name: row.get("last_name")?,
            mid_name: row.get("mid_name")?,
            address: row.get("address")?,
            father_name: row.get("father_name")?,
            // is_active: row.get("is_active")?,
            is_active: true,
            class_id: row.get("class_id")?,
            mother_name: row.get("mother_name")?,
            gender: row.get("gender")?,
            date_of_birth: row.get("date_of_birth")?,
            phone_no: None,
            email: None,
            created_at: None,
            updated_at: None,
            guardian_name: None,
            emergency_contact: None,
            guardian_relation: None,
        })
    })?;
    for student in student_iter {
        data.push(student.unwrap());
    }
    Ok(data)
}

pub fn get_student_detail(db: &Connection, id: i32) -> Result<Student, rusqlite::Error>{
    let mut statement = db.prepare("SELECT * FROM students where id = ?1")?;
    let student_detail = statement.query_row(params![id], |row| {
        Ok(Student{
            id: row.get("id")?,
            // class: row.get("class")?,
            class: None,
            first_name: row.get("first_name")?,
            last_name: row.get("last_name")?,
            mid_name: row.get("mid_name")?,
            address: row.get("address")?,
            father_name: row.get("father_name")?,
            // is_active: row.get("is_active")?,
            is_active: true,
            class_id: row.get("class_id")?,
            mother_name: row.get("mother_name")?,
            gender: row.get("gender")?,
            date_of_birth: row.get("date_of_birth")?,
            phone_no: row.get("phone_no")?,
            email: row.get("email")?,
            created_at: row.get("created_at")?,
            updated_at: row.get("updated_at")?,
            guardian_name: row.get("guardian_name")?,
            emergency_contact: row.get("emergency_contact")?,
            guardian_relation: row.get("guardian_relation")?,
        })
    })?;

    Ok(student_detail)

}
pub fn update_student_detail(db: &Connection, student_data: Student, student_id: i32) -> Result<(), rusqlite::Error> {
    let date_string = get_current_date();
    db.execute(
        "UPDATE students SET first_name = ?1, mid_name = ?2, last_name = ?3, address = ?4, father_name = ?5, mother_name = ?6, date_of_birth = ?7, phone_no = ?8, email = ?9, updated_at = ?10, guardian_name = ?11, emergency_contact = ?12  where id = ?13 ", 
        params![student_data.first_name, student_data.mid_name, student_data.last_name, student_data.address, student_data.father_name, student_data.mother_name, student_data.date_of_birth, student_data.phone_no, student_data.email, date_string, student_data.guardian_name, student_data.emergency_contact, student_id])?;
    Ok(())
}

pub fn change_student_status(db: &Connection, new_status: bool, student_id: i32)-> Result<(), rusqlite::Error>{
    let date_string = get_current_date();
    db.execute("
    UPDATE students SET is_active = ?1, updated_at = ?2 where id = ?3
    ", params![new_status, date_string, student_id])?;
    Ok(())
}

pub fn count_student_row(db: &Connection) -> Result<i32, rusqlite::Error>{
    let mut statement = db.prepare(" Select count(id) as count from students limit 1;")?;
    let mut count = 0;
    count= statement.query_row([], |row| row.get::<&str, i32>("count"))?;
    Ok(count)
}

// charges
pub fn get_charges(db: &Connection, page: i32, limit: i32) -> Result<Vec<Charges>, rusqlite::Error>{
    let offset_value = (page -1 ) * limit;
    let mut data: Vec<Charges> = Vec::new();
    let mut statement = db.prepare("Select * from charge inner join class on charge.class_id = class.id limit ?1 offset ?2;")?;
    let charge_iter = statement.query_map(params![limit, offset_value], |row|{
        Ok(Charges{
            amount: row.get("amount")?,
            class_id: row.get("class_id")?,
            charge_title: row.get("charge_title")?,
            is_regular: row.get("is_regular")?,
            class: row.get("class")?
        })
    })?;
    for charge in charge_iter{
        data.push(charge.unwrap());
    }
    Ok(data)
}

pub fn add_charge(db: &mut Connection, charge_title:String, amount: f32,classes:Vec<i32>, is_regular:bool) -> Result<(), rusqlite::Error>{
    let transaction = db.transaction()?;

    for class_id in  classes{
        transaction.execute("
        INSERT INTO charge (amount, class_id, charge_title, is_regular) VALUES (?1, ?2, ?3, ?4)
        ", params![amount, class_id, charge_title, is_regular])?;
    }
    transaction.commit()?;
    Ok(())
}

pub fn count_charges_row(db: &Connection) -> Result<i32, rusqlite::Error>{
    let mut statement = db.prepare("Select count(id) as count from charge")?;
    let count = statement.query_row([], |row| row.get::<&str, i32>("count"))?;
    Ok(count)
}
// fees
pub fn add_fees(db: &Connection, fee_data: Fees)-> Result<(), rusqlite::Error>{
    db.execute("
    INSERT INTO fees (student_id, amount, title, description, charge_id) VALUES (?1, ?2 , ?3, ?4, ?5);
    ", params![fee_data.student_id, fee_data.amount, fee_data.title, fee_data.description, fee_data.charge_id]).unwrap();
    Ok(())
}

pub fn get_fees(db: &Connection,page: i32, limit: i32, remaining: bool)-> Result<Vec<Fees>, rusqlite::Error>{
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Fees> = Vec::new();
    let mut query = "";
    if remaining{
        query = "select * from fees where paid = true inner join charge on fees.charge_id = charge.id limit ?1 offset ?2"
    }else{
        query = "select * from fees inner join charge on fees.charge_id = charge.id limit ?1 offset ?2"
    }
    let mut statement = db.prepare(query)?;
    let fees_iter = statement.query_map(params![limit, offset_value], |row|{
        Ok(Fees{
            id: row.get("id")?,
            amount: row.get("amount")?,
            charge_id: row.get("")?,
            description: row.get("description")?,
            created_at: row.get("created_at")?,
            student_id: row.get("student_id")?,
            title: row.get("title")?,
            updated_at: row.get("updated_at")?,
            charge_title: row.get("charge_title")?,
            paid: row.get("paid")?,
        })
    })?;
    for fee in fees_iter{
        data.push(fee.unwrap());
    }
    Ok(data)
}

pub fn count_fees_row(db: &Connection) -> Result<i32, rusqlite::Error>{
    let mut statement = db.prepare("Select count(id) as count from payment limit 1;")?;
    let count =  statement.query_row([], |row| row.get::<&str, i32>("count"))?;
    Ok(count)
}

// payment
pub fn add_payment(db: &Connection, payment_data: Payment) -> Result<(), rusqlite::Error>{
    db.execute("
    INSERT INTO fees (amount, student_id, remarks) values (?1, ?2, ?2);
    ", params![payment_data.amount, payment_data.student_id, payment_data.remarks])?;
    Ok(())
}

pub fn get_payment(db: &Connection, page: i32, limit: i32, student_id: Option<i32>) -> Result<Vec<Payment>, rusqlite::Error>{
    let offset_value = (page -1 ) * limit;
    let mut data: Vec<Payment> = Vec::new();
    let mut query = "";
    match student_id{
        Some(value) => {
            query = "Select * from payment inner join students on payment.student_id = student.id where student_id = ?3 limit ?1 offset ?2";
            let mut statement = db.prepare(query)?;
            let payment_iter = statement.query_map(params![limit, offset_value, value], |row|{
                Ok(Payment{
                    id: row.get("id")?,
                    student_id: row.get("student_id")?,
                    student_first_name: row.get("first_name")?,
                    student_last_name: row.get("last_name")?,
                    amount: row.get("amount")?,
                    created_at: row.get("created_at")?,
                    remarks: row.get("remarks")?
                })
            })?;
            for payment in payment_iter{
                data.push(payment.unwrap());
            }
            Ok(data)
        }
        None => {
            query = "Select * from payment inner join students on payment.student_id = student.id limit ?1 offset ?2";
            let mut statement = db.prepare(query)?;
            let payment_iter = statement.query_map(params![limit, offset_value], |row|{
                Ok(Payment{
                    id: row.get("id")?,
                    student_id: row.get("student_id")?,
                    student_first_name: row.get("first_name")?,
                    student_last_name: row.get("last_name")?,
                    amount: row.get("amount")?,
                    created_at: row.get("created_at")?,
                    remarks: row.get("remarks")?
                })
            })?;
            for payment in payment_iter{
                data.push(payment.unwrap());
            }
            Ok(data)
        }
    }

    
}

pub fn count_payment_rows(db: &Connection,student_id: Option<i32> ) -> Result<i32, rusqlite::Error>{
    match student_id {
        Some(value) =>{
            let mut statement = db.prepare("Select count(id) as count from payment where student_id = ?1 limit 1")?;
            let count = statement.query_row(params![value], |row| row.get::<&str, i32>("count"))?;
            Ok(count)
        }
        None =>{
            let mut statement = db.prepare("Select count(id) as count from payment limit 1")?;
            let count = statement.query_row([], |row| row.get::<&str, i32>("count"))?;
            Ok(count)
        }
    }
}


// Helper functions

pub fn get_current_date() -> String{
    let current_time = SystemTime::now();
    let since_epoch = current_time.duration_since(UNIX_EPOCH).expect("Time went backwards");
    let seconds = since_epoch.as_secs();

    let days = seconds / 86400;
    let remaining_seconds = seconds % 86400;
    let hours = remaining_seconds / 3600;
    let remaining_seconds = remaining_seconds % 3600;
    let minutes = remaining_seconds / 60;

    let date_string = format!("{}-{}-{}", days, hours, minutes);
    return date_string;

}