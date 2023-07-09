
use rusqlite::{params, Connection, Result};
use serde::Serialize;
use crate::helpers::{get_current_date_time};


#[derive(Debug, Serialize)]
pub struct Fees {
    pub id: i32,
    pub student_id: i32,
    pub student_first_name: Option<String>,
    pub student_last_name: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub amount: f32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub charge_id: Option<i32>,
    pub payment_id: Option<i32>,
    pub charge_title: Option<String>,
}


// fees
pub fn add_fees(db: &Connection, fee_data: Fees) -> Result<(), rusqlite::Error> {
    db.execute("
    INSERT INTO fees (student_id, amount, title, description, charge_id) VALUES (?1, ?2 , ?3, ?4, ?5);
    ", params![fee_data.student_id, fee_data.amount, fee_data.charge_title, fee_data.description, fee_data.charge_id]).unwrap();
    Ok(())
}

pub fn get_fees(
    db: &Connection,
    page: i32,
    limit: i32,
    remaining: bool,
    student_id: Option<i32>,
) -> Result<Vec<Fees>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Fees> = Vec::new();

    let map_row = |row: &rusqlite::Row| -> Result<Fees>{
        Ok(Fees {
            id: row.get("id")?,
            amount: row.get("amount")?,
            charge_id: row.get("charge_id")?,
            description: row.get("description")?,
            created_at: row.get("created_at")?,
            student_id: row.get("student_id")?,
            student_first_name: row.get("first_name")?,
            student_last_name: row.get("last_name")?,
            title: row.get("title")?,
            updated_at: row.get("updated_at")?,
            charge_title: None,
            payment_id: row.get("payment_id")?,
        })
    };

    match student_id {
        Some(_value) => {
            let query;
            if remaining {
                query = "select * from fees left join students on fees.student_id = students.id where student_id = ?3 order by id desc limit ?1 offset ?2 "
            } else {
                query ="select * from fees left join students on fees.student_id = students.id where student_id = ?3 order by id desc limit ?1 offset ?2 "
            }
            let mut statement = db.prepare(query)?;
            let fees_iter =
                statement.query_map(params![limit, offset_value, student_id], map_row)?;
            for fee in fees_iter {
                data.push(fee.unwrap());
            }
            Ok(data)
        }
        None => {
            let query;
            if remaining {
                query = "select * from fees left join students on fees.student_id = students.id order by id desc limit ?1 offset ?2 "
            } else {
                query ="select * from fees left join students on fees.student_id = students.id order by id desc limit ?1 offset ?2 "
            }
            let mut statement = db.prepare(query)?;
            let fees_iter = statement.query_map(params![limit, offset_value], map_row)?;
            for fee in fees_iter {
                data.push(fee.unwrap());
            }
            Ok(data)
        }
    }
}

pub fn count_fees_row(
    db: &Connection,
    remaining: bool,
    student_id: Option<i32>,
) -> Result<i32, rusqlite::Error> {
    match student_id {
        Some(value) => {
            let query;
            if remaining {
                query = "Select count(id) as count from fees where student_id = ?1 limit 1;"
            } else {
                query = "Select count(id) as count from fees where student_id = ?1 limit 1;"
            }
            let mut statement = db.prepare(query)?;
            let count = statement.query_row([value], |row| row.get::<&str, i32>("count"))?;
            Ok(count)
        }
        None => {
            let query;
            if remaining {
                query = "Select count(id) as count from fees limit 1;"
            } else {
                query = "Select count(id) as count from fees limit 1;"
            }
            let mut statement = db.prepare(query)?;
            let count = statement.query_row([], |row| row.get::<&str, i32>("count"))?;
            Ok(count)
        }
    }
}

pub fn get_monthly_fee(db: &Connection) -> Result<f32, rusqlite::Error> {
    let mut statement = db.prepare("Select  sum(amount) as sum from fees WHERE strftime('%m', created_at) = strftime('%m', 'now') and charge_id not null limit 1;")?;
    let sum = statement.query_row([], |row| row.get::<&str, f32>("sum"))?;
    Ok(sum)
}

pub fn get_monthly_payment(db: &Connection) -> Result<f32, rusqlite::Error> {
    let mut statement = db.prepare("Select  sum(amount) as sum from fees WHERE strftime('%m', created_at) = strftime('%m', 'now') and payment_id not null limit 1;")?;
    let sum = statement.query_row([], |row| row.get::<&str, f32>("sum"))?;
    Ok(sum)
}


pub fn get_current_month_student_fee(
    db: &Connection,
    student_id: i32,
) -> Result<Vec<Fees>, rusqlite::Error> {
    let mut statement = db.prepare("select * from fees left join students on fees.student_id = students.id where student_id = ?1 and strftime('%m', fees.created_at) < strftime('%m', 'now');")?;
    let fees_iter = statement.query_map([student_id], |row| {
        Ok(Fees {
            id: row.get("id")?,
            amount: row.get("amount")?,
            charge_id: row.get("charge_id")?,
            description: row.get("description")?,
            created_at: row.get("created_at")?,
            student_id: row.get("student_id")?,
            student_first_name: row.get("first_name")?,
            student_last_name: row.get("last_name")?,
            title: row.get("title")?,
            updated_at: row.get("updated_at")?,
            charge_title: None,
            payment_id: row.get("payment_id")?,
        })
    })?;
    let mut data: Vec<Fees> = Vec::new();
    for items in fees_iter {
        data.push(items.unwrap())
    }
    Ok(data)
}

pub fn update_fee(db: &Connection, fees_data: Fees)-> Result<(), rusqlite::Error>{
    let current_date_time = get_current_date_time();
    db.execute("UPDATE fees SET student_id = ?1, amount = ?2, title = ?3, description = ?4, charge_id = ?5, updated_at = ?6 where id = ?7 ", 
    params![fees_data.student_id, fees_data.amount, fees_data.title, fees_data.description, fees_data.charge_id,current_date_time, fees_data.id])?;
    Ok(())
}

