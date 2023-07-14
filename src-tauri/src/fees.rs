use crate::helpers::get_current_date_time;
use rusqlite::{params, Connection, Result};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Fees {
    pub id: i32,
    pub student_id: i32,
    pub student_first_name: Option<String>,
    pub student_last_name: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
    pub amount: f32,
    pub year: i32,
    pub month: i32,
    pub title: Option<String>,
    pub description: Option<String>,
    pub charge_id: Option<i32>,
    pub payment_id: Option<i32>,
    pub charge_title: Option<String>,
}

// fees
pub fn add_fees(db: &Connection, fee_data: Fees) -> Result<(), rusqlite::Error> {
    db.execute("
    INSERT INTO fees (student_id, amount, title, description, charge_id, year, month) VALUES (?1, ?2 , ?3, ?4, ?5, ?6, ?7);
    ", params![fee_data.student_id, fee_data.amount, fee_data.charge_title, fee_data.description, fee_data.charge_id, fee_data.year, fee_data.month]).unwrap();
    Ok(())
}

pub fn get_fees(
    db: &Connection,
    page: i32,
    limit: i32,
    student_id: Option<i32>,
    class_id: Option<i32>,
    year: Option<i32>,
    month: Option<i32>,
    charge_id: Option<i32>,
) -> Result<Vec<Fees>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Fees> = Vec::new();

    let map_row = |row: &rusqlite::Row| -> Result<Fees> {
        Ok(Fees {
            id: row.get("id")?,
            amount: row.get("amount")?,
            year: row.get("year")?,
            month: row.get("month")?,
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

    let mut query =
        "select * from fees left join students on fees.student_id = students.id where 1 = 1 "
            .to_string();
    // let mut params: Vec<&dyn rusqlite::ToSql> = Vec::new();

    if let Some(st_id) = student_id {
        let add = format!(" and student_id = {}", st_id);
        query.push_str(add.as_str());
        // params.push(&student_id);
    }

    if let Some(cl_id) = class_id {
        let add = format!(" and class_id = {}", cl_id);
        query.push_str(add.as_str());
    }

    if let Some(ch_id) = charge_id {
        let add = format!(" and  charge_id = {}", ch_id);
        query.push_str(add.as_str());
    }

    if let Some(year) = year {
        let add = format!(" and year = {}", year);
        query.push_str(add.as_str());
        // params.push(&year);
    }

    if let Some(month) = month {
        let add = format!(" and month = {}", month);
        query.push_str(add.as_str());
        // params.push(&month);
    }
    let limit_query = format!(" order by id desc limit {} offset {}", limit, offset_value);
    query.push_str(&limit_query.as_str());

    // let params_clone: Vec<&dyn rusqlite::ToSql> = params.iter().cloned().collect();
    let mut statement = db.prepare(&query)?;
    let fees_iter = statement.query_map(params![], map_row)?;
    for fee in fees_iter {
        data.push(fee.unwrap());
    }

    Ok(data)
}

pub fn count_fees_row(
    db: &Connection,
    student_id: Option<i32>,
    class_id: Option<i32>,
    year: Option<i32>,
    month: Option<i32>,
    charge_id: Option<i32>,
) -> Result<i32, rusqlite::Error> {
    let mut query = "Select count(fees.id) as count from fees left join students on fees.student_id = students.id where 1 = 1 ".to_string();
    // let mut params: Vec<&dyn rusqlite::ToSql> = Vec::new();

    if let Some(st_id) = student_id {
        let add = format!(" and student_id = {}", st_id);
        query.push_str(add.as_str());
        // params.push(&student_id);
    }

    if let Some(cl_id) = class_id {
        let add = format!(" and class_id = {}", cl_id);
        query.push_str(add.as_str());
    }

    if let Some(ch_id) = charge_id {
        let add = format!(" and  charge_id = {}", ch_id);
        query.push_str(add.as_str());
    }

    if let Some(year) = year {
        let add = format!(" and year = {}", year);
        query.push_str(add.as_str());
        // params.push(&year);
    }

    if let Some(month) = month {
        let add = format!(" and month = {}", month);
        query.push_str(add.as_str());
        // params.push(&month);
    }
    let mut statement = db.prepare(&query)?;
    let count = statement.query_row([], |row| row.get::<&str, i32>("count"))?;
    Ok(count)
}

pub fn get_monthly_fee(
    db: &Connection,
    nepali_year: i32,
    nepali_month: i32,
) -> Result<f32, rusqlite::Error> {
    // let mut statement = db.prepare("Select  sum(amount) as sum from fees WHERE strftime('%m', created_at) = strftime('%m', 'now') and charge_id not null limit 1;")?;
    let mut statement = db.prepare("SELECT ifnull( sum(amount), 0) as sum from fees where year = ?1 and month = ?2 and charge_id not null limit 1;")?;
    let sum = statement.query_row([nepali_year, nepali_month], |row| {
        row.get::<&str, f32>("sum")
    })?;
    Ok(sum)
}

pub fn get_monthly_payment(
    db: &Connection,
    nepali_year: i32,
    nepali_month: i32,
) -> Result<f32, rusqlite::Error> {
    let mut statement = db.prepare("SELECT ifnull( sum(amount), 0) as sum from fees where year = ?1 and month = ?2 and payment_id not null limit 1;")?;
    let sum = statement.query_row([nepali_year, nepali_month], |row| {
        row.get::<&str, f32>("sum")
    })?;
    Ok(sum)
}

pub fn get_current_month_student_fee(
    db: &Connection,
    student_id: i32,
    nepali_month: i32,
    nepali_year: i32
) -> Result<Vec<Fees>, rusqlite::Error> {
    let formatted_month = if nepali_month < 10 {
        format!("0{}", nepali_month)
    }else{
        format!("{}", nepali_month)
    };
    let query = format!("select *, case  when payment_id is null then amount else -amount end as fee_amount from fees left join students on fees.student_id = students.id where student_id = ?1  and Date(year || '-' || case WHEN month < 10 THEN '0' || month ELSE CAST(month AS TEXT) END || '-01') = Date('{}' || '-' || '{}'  || '-01') ;", nepali_year, formatted_month);
    let mut statement = db.prepare(query.as_str())?;
    let fees_iter = statement.query_map([student_id], |row| {
        Ok(Fees {
            id: row.get("id")?,
            amount: row.get("fee_amount")?,
            charge_id: row.get("charge_id")?,
            description: row.get("description")?,
            created_at: row.get("created_at")?,
            student_id: row.get("student_id")?,
            year: row.get("year")?,
            month: row.get("month")?,
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

pub fn get_student_previous_due(db: &Connection, student_id: i32, nepali_month: i32, nepali_year: i32) -> Result<f32, rusqlite::Error> {
    let formatted_month = if nepali_month < 10 {
        format!("0{}", nepali_month)
    }else{
        format!("{}", nepali_month)
    };

    let query = format!("select ifnull( sum( case  when payment_id is null then amount else -amount end ), 0) as sum  from fees where student_id = ?1 and Date(year || '-' || case WHEN month < 10 THEN '0' || month ELSE CAST(month AS TEXT) END || '-01') < Date('{}' || '-' || '{}'  || '-01') ;", nepali_year, formatted_month);
    let mut statement = db.prepare(query.as_str())?;
    let amount = statement.query_row(params![student_id], |row| row.get::<&str, f32>("sum"))?;
    Ok(amount)
}

pub fn update_fee(db: &Connection, fees_data: Fees) -> Result<(), rusqlite::Error> {
    let current_date_time = get_current_date_time();
    db.execute("UPDATE fees SET student_id = ?1, amount = ?2, title = ?3, description = ?4, charge_id = ?5, updated_at = ?6, year = ?7, month = ?8 where id = ?9 ", 
    params![fees_data.student_id, fees_data.amount, fees_data.title, fees_data.description, fees_data.charge_id,current_date_time, fees_data.year, fees_data.month, fees_data.id])?;
    Ok(())
}
