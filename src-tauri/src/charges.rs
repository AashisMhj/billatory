
use rusqlite::{params, Connection, Result};
use serde::Serialize;

use crate::helpers::get_current_date_time;

#[derive(Debug, Serialize)]
pub struct ChargeOfStudent{
    pub id: i32, 
    pub first_name: String,
    pub mid_name: Option<String>,
    pub last_name: String,
    pub charge_id: Option<i32>,
    pub class: String,
    pub class_id: i32
}

#[derive(Debug, Serialize)]
pub struct Charge {
    pub id: i32,
    pub class_id: i32,
    pub charge_title: String,
    pub amount: f32,
    pub is_regular: Option<bool>,
    pub class: Option<String>,
}


pub fn get_student_of_charge(db: &Connection, charge_id:i32)-> Result<Vec<ChargeOfStudent>, rusqlite::Error>{
    let query = "
    Select students.id as id, first_name, mid_name,last_name, class_id, sc.charge_id as charge_id, class from students left join (
        SELECT DISTINCT student_id, charge_id
           FROM student_charges
           WHERE charge_id = ?1
       ) AS sc on students.ID = sc.student_id left join class on students.class_id = class.id;
    ";
    let mut statement = db.prepare(query)?;

    let student_iter = statement.query_map([charge_id], |row|{
        Ok(ChargeOfStudent{
            id: row.get("id")?,
            class_id: row.get("class_id")?,
            first_name: row.get("first_name")?,
            mid_name: row.get("mid_name")?,
            last_name: row.get("last_name")?,
            charge_id: row.get("charge_id")?,
            class: row.get("class")?,
        })
    })?;
    let mut data: Vec<ChargeOfStudent> = Vec::new();
    for item in student_iter{
        data.push(item.unwrap())
    }
    Ok(data)
}

pub fn get_charge_detail(db: &Connection, charge_id:i32) -> Result<Charge, rusqlite::Error>{
    let query = "Select *, charge.id as id from charge left join class on class.id = charge.class_id where charge.id = ?1 limit 1";
    let mut statement = db.prepare(query)?;
    let charge_detail = statement.query_row(params![charge_id], |row|{
        Ok(Charge{
            amount: row.get("amount")?,
            charge_title: row.get("charge_title")?,
            class: row.get("class")?,
            class_id: row.get("class_id")?,
            id: row.get("id")?,
            is_regular: row.get("is_regular")?,
        })
    })?;
    Ok(charge_detail)
}

pub fn apply_charges_student(db: &mut Connection, charge_id: i32,amount:f32, charge_title:String, student_ids: Vec<i32>, nepali_month: i32, nepali_year: i32) -> Result<(), rusqlite::Error>{
    let transaction = db.transaction()?;
    for student_id in student_ids{
        transaction.execute("INSERT INTO fees (student_id, amount, title, charge_id, year, month) VALUES (?1, ?2, ?3, ?4, ?5, ?6);", params![student_id, amount, charge_title,charge_id, nepali_year, nepali_month ])?;
    }
    transaction.commit()?;
    Ok(())
}


pub fn delete_charge(db: &Connection, charge_id: i32) -> Result<(), rusqlite::Error>{
    let current_date_time = get_current_date_time();
    println!("{}",charge_id);
    db.execute("UPDATE charge set deleted = true, updated_at = ?1 where id = ?2", params![current_date_time, charge_id])?;
    Ok(())
}