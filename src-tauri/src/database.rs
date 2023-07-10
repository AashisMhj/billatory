use crate::helpers::{get_current_date, get_current_date_time};
use rusqlite::{params, Connection, Result};
use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;

//
const CURRENT_DB_VERSION: u32 = 1;

// Note: The Fees table is the main table which contains all the transactions/records teh ones with charge id are charges and ones with payment id are payment

#[derive(Debug, Serialize)]
pub struct Charges {
    id: i32,
    pub class_id: i32,
    pub charge_title: String,
    pub amount: f32,
    pub is_regular: bool,
    pub class: Option<String>,
}

/*
Represent the join table for student_charges, charges and class
The id is of the charge table
 */
#[derive(Debug, Serialize)]
pub struct StudentCharges {
    pub id: i32,
    pub class_id: i32,
    pub charge_title: String,
    pub student_id: Option<i32>,
    pub student_charge_id: Option<i32>, // the id of the student charge table
    pub amount: Option<f32>,
    pub class: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct StudentChargeTable {
    pub id: i32,
    pub student_id: i32,
    pub charge_id: i32,
    pub class_id: i32,
    pub is_regular: bool,
    pub amount: f32,
    pub charge_title: String,
}

const FILE_PATH: &str = "db.sqlite";
const BACKUP_DIR: &str = "backup";

pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect(" The app data  directory should exist.");
    fs::create_dir_all(&app_dir).expect(" The app directory should be created");
    let backup_path = app_dir.join(BACKUP_DIR);
    fs::create_dir_all(backup_path).expect("Back Up Dir should be created");
    let sqlite_path = app_dir.join(FILE_PATH);
    // print!(" Database file {}", sqlite_path.to_string_lossy());
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
                email char(250),
                location char(250) not null,
                phone_no char(250) not null,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at datetime,
                image text
            )",
        )?;

        tx.execute(
            "
        CREATE TABLE IF NOT EXISTS class(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class char(250) not null,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted boolean default false,
            updated_at DATETIME
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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME,
            deleted boolean default false,
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
            roll_no integer not null,
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
            is_active boolean default true,
            class_id INTEGER NOT NULL,
            FOREIGN KEY(class_id) REFERENCES class(id)
        )
        ",
            (),
        )?;

        // many to many relation between students and charges
        tx.execute(
            "
        CREATE TABLE IF NOT EXISTS student_charges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            charge_id INTEGER NOT NULL,
            deleted boolean default false,
            FOREIGN KEY(student_id) references students(id),
            FOREIGN KEY(charge_id) references charge(id),
            unique(student_id, charge_id)
        )
        ",
            (),
        )?;

        tx.execute(
            "
        CREATE TABLE IF NOT EXISTS payment(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            created_at datetime default current_timestamp,
            amount real not null,
            remarks text,
            deleted boolean default false,
            FOREIGN KEY(student_id) references students(id)
        );
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
            payment_id INTEGER DEFAULT NULL,
            title text,
            description text,
            charge_id integer,
            deleted boolean default false,
            FOREIGN key(student_id) references students(id),
            FOREIGN KEY(charge_id) REFERENCES charge(id),
            FOREIGN KEY(payment_id) REFERENCES payment(id)
        )
        ",
            (),
        )?;

        tx.commit()?;
    }
    Ok(())
}

// student charges
pub fn get_student_charges(
    db: &Connection,
    student_id: i32,
) -> Result<Vec<StudentCharges>, rusqlite::Error> {
    // let mut statement = db.prepare("select charge.*, student_charges.*, class.*, student_charges.id as sc_id from charge left join student_charges on charge.id = student_charges.charge_id inner join class on charge.class_id = class.id  where (student_id = ?1 or student_id is null ) ;")?;
    // let mut statement = db.prepare("select ch.id, ch.class_id, ch.charge_title, ch.amount, ch.is_regular, stc.id, stc.student_id, stc.charge_id, cl.id, cl.class from charge as ch left join student_charges as stc on ch.id = stc.charge_id inner join class as cl on ch.class_id = cl.id  where (stc.student_id = ?1 or stc.student_id is null ) ;")?;
    let mut statement = db.prepare(
        "select *, sc.id as sc_id from charge left join (
        select distinct student_id, charge_id, id from student_charges where student_id = ?1
    ) as sc on charge.id = sc.charge_id left join class on charge.class_id = class.id ;",
    )?;
    let student_charges_iter = statement.query_map(params![student_id], |row| {
        Ok(StudentCharges {
            id: row.get("id")?,
            student_charge_id: row.get("sc_id")?,
            student_id: row.get("student_id")?,
            class_id: row.get("class_id")?,
            charge_title: row.get("charge_title")?,
            amount: row.get("amount")?,
            class: row.get("class")?,
        })
    })?;

    let mut student_charges_items: Vec<StudentCharges> = Vec::new();
    for item in student_charges_iter {
        student_charges_items.push(item.unwrap());
    }

    Ok(student_charges_items)
}

pub fn update_student_charges(
    db: &mut Connection,
    student_id: i32,
    charges_id: Vec<i32>,
) -> Result<(), rusqlite::Error> {
    let transaction = db.transaction()?;
    transaction.execute(
        "CREATE TEMPORARY TABLE temp_table (charge_id, student_id);",
        [],
    )?;
    for charge in charges_id {
        transaction.execute(
            "INSERT INTO temp_table (charge_id, student_id) VALUES (?1, ?2);",
            params![charge, student_id],
        )?;
    }

    transaction.execute(
        "INSERT OR IGNORE INTO student_charges (student_id, charge_id)
         SELECT student_id, charge_id
         FROM temp_table",
        [],
    )?;

    transaction.execute(
        "DELETE FROM student_charges
         WHERE student_id = ?1 AND NOT EXISTS (
             SELECT 1 FROM temp_table
             WHERE student_charges.charge_id = temp_table.charge_id
         )",
        [],
    )?;

    transaction.commit()?;

    Ok(())
}

pub fn add_student_charge(
    db: &Connection,
    student_id: i32,
    charge_id: i32,
) -> Result<(), rusqlite::Error> {
    db.execute(
        "INSERT INTO student_charges(student_id, charge_id) values(?1, ?2);",
        params![student_id, charge_id],
    )?;
    Ok(())
}

pub fn remove_student_charge(db: &Connection, id: i32) -> Result<(), rusqlite::Error> {
    db.execute("DELETE FROM student_charges where id = ?1 ", params![id])?;
    Ok(())
}

// charges
pub fn get_charges(
    db: &Connection,
    page: i32,
    limit: i32,
) -> Result<Vec<Charges>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Charges> = Vec::new();
    let mut statement = db.prepare(
        "Select * from charge inner join class on charge.class_id = class.id limit ?1 offset ?2;",
    )?;
    let charge_iter = statement.query_map(params![limit, offset_value], |row| {
        Ok(Charges {
            id: row.get("id")?,
            amount: row.get("amount")?,
            class_id: row.get("class_id")?,
            charge_title: row.get("charge_title")?,
            is_regular: row.get("is_regular")?,
            class: row.get("class")?,
        })
    })?;
    for charge in charge_iter {
        data.push(charge.unwrap());
    }
    Ok(data)
}

pub fn add_charge_bulk(
    db: &mut Connection,
    charge_title: String,
    amount: f32,
    classes: Vec<i32>,
    is_regular: bool,
) -> Result<(), rusqlite::Error> {
    let transaction = db.transaction()?;

    for class_id in classes {
        transaction.execute(
            "INSERT INTO charge (amount, class_id, charge_title, is_regular) VALUES (?1, ?2, ?3, ?4);",
            params![amount, class_id, charge_title, is_regular],
        )?;
    }
    transaction.commit()?;
    Ok(())
}

pub fn add_charge(
    db: &Connection,
    amount: f32,
    charge_title: String,
    class_id: i32,
) -> Result<(), rusqlite::Error> {
    db.execute(
        "INSERT INTO charges(amount, charge_title, class_id) values(?1, ?2, ?3);",
        params![amount, charge_title, class_id],
    )?;
    Ok(())
}

pub fn update_charge(
    db: &Connection,
    id: i32,
    amount: f32,
    charge_title: String,
) -> Result<(), rusqlite::Error> {
    let current_date = get_current_date_time();
    db.execute(
        "UPDATE charge set amount= ?1, charge_title = ?2, updated_at = ?3 where id = ?4",
        params![amount, charge_title, current_date, id],
    )?;
    Ok(())
}

pub fn count_charges_row(db: &Connection) -> Result<i32, rusqlite::Error> {
    let mut statement = db.prepare("Select count(id) as count from charge")?;
    let count = statement.query_row([], |row| row.get::<&str, i32>("count"))?;
    Ok(count)
}

pub fn apply_charges(db: &mut Connection, charge_id: i32) -> Result<(), rusqlite::Error> {
    let transaction = db.transaction()?;
    let mut student_statement = transaction.prepare("select * from student_charges inner join charge on student_charges.charge_id = charge.id where charge_id = ?1")?;
    let student_ids_iter = student_statement.query_map(params![charge_id], |row| {
        Ok(StudentChargeTable {
            id: row.get("id")?,
            charge_id: row.get("id")?,
            class_id: row.get("class_id")?,
            is_regular: row.get("is_regular")?,
            student_id: row.get("student_id")?,
            amount: row.get("amount")?,
            charge_title: row.get("charge_title")?,
        })
    })?;
    let student_ids: Vec<_> = student_ids_iter
        .map(|charge| charge.unwrap())
        .collect::<Vec<_>>();

    drop(student_statement);
    for charge in student_ids {
        transaction.execute(
            "
        INSERT INTO fees (student_id, amount, title, charge_id) VALUES (?1, ?2, ?3, ?4);
        ",
            params![
                charge.student_id,
                charge.amount,
                charge.charge_title,
                charge.charge_id
            ],
        )?;
    }

    transaction.commit()?;

    Ok(())
}

pub fn backup(app_handle: &AppHandle) -> Result<(u64, PathBuf), std::io::Error> {
    let mut app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist");
    let db_path = app_dir.join(FILE_PATH);
    let current_data = get_current_date();
    app_dir.push(BACKUP_DIR);
    let file = format!("{}.sqlite", current_data);
    let backup_path = app_dir.join(file);
    let result = fs::copy(db_path, &backup_path)?;
    Ok((result, backup_path))
}
