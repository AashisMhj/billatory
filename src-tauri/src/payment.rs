use rusqlite::{params, Connection, Result};
use serde::Serialize;


#[derive(Debug, Serialize)]
pub struct Payment {
    pub id: i32,
    pub student_id: i32,
    pub student_first_name: Option<String>,
    pub student_last_name: Option<String>,
    pub created_at: String,
    pub amount: f32,
    pub remarks: Option<String>,
}



// payment
pub fn add_payment(db: &mut Connection, payment_data: Payment) -> Result<(), rusqlite::Error> {
    let transaction = db.transaction()?;
    transaction.execute(
        "
    INSERT INTO payment (amount, student_id, remarks) values (?1, ?2, ?3);
    ",
        params![
            payment_data.amount,
            payment_data.student_id,
            payment_data.remarks
        ],
    )?;
    let id = transaction.last_insert_rowid();
    // TODO important the logic
    transaction.execute(
        "
    INSERT INTO fees (student_id, amount, title, payment_id) VALUES (?1, ?2, ?3, ?4);
    ",
        params![payment_data.student_id, payment_data.amount, "Payment", id],
    )?;
    transaction.commit()?;
    Ok(())
}

pub fn get_payment(
    db: &Connection,
    page: i32,
    limit: i32,
    student_id: Option<i32>,
) -> Result<Vec<Payment>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Payment> = Vec::new();
    match student_id {
        Some(value) => {
            let  query = "Select * from payment inner join students on payment.student_id = students.id where student_id = ?3 limit ?1 offset ?2";
            let mut statement = db.prepare(query)?;
            let payment_iter = statement.query_map(params![limit, offset_value, value], |row| {
                Ok(Payment {
                    id: row.get("id")?,
                    student_id: row.get("student_id")?,
                    student_first_name: row.get("first_name")?,
                    student_last_name: row.get("last_name")?,
                    amount: row.get("amount")?,
                    created_at: row.get("created_at")?,
                    remarks: row.get("remarks")?,
                })
            })?;
            for payment in payment_iter {
                data.push(payment.unwrap());
            }
            Ok(data)
        }
        None => {
            let query = "Select * from payment inner join students on payment.student_id = students.id limit ?1 offset ?2";
            let mut statement = db.prepare(query)?;
            let payment_iter = statement.query_map(params![limit, offset_value], |row| {
                Ok(Payment {
                    id: row.get("id")?,
                    student_id: row.get("student_id")?,
                    student_first_name: row.get("first_name")?,
                    student_last_name: row.get("last_name")?,
                    amount: row.get("amount")?,
                    created_at: row.get("created_at")?,
                    remarks: row.get("remarks")?,
                })
            })?;
            for payment in payment_iter {
                data.push(payment.unwrap());
            }
            Ok(data)
        }
    }
}
pub fn get_payment_detail(db: &Connection, id: i32) -> Result<Payment, rusqlite::Error> {
    let mut statement = db.prepare("Select * from payment join students on payment.student_id = students.id where payment.id = ?1 limit 1;")?;
    let data = statement.query_row(params![id], |row| {
        Ok(Payment {
            id: row.get("id")?,
            amount: row.get("amount")?,
            created_at: row.get("created_at")?,
            remarks: row.get("remarks")?,
            student_first_name: row.get("first_name")?,
            student_id: row.get("student_id")?,
            student_last_name: row.get("last_name")?,
        })
    })?;
    Ok(data)
}
pub fn count_payment_rows(
    db: &Connection,
    student_id: Option<i32>,
) -> Result<i32, rusqlite::Error> {
    match student_id {
        Some(value) => {
            let mut statement =
                db.prepare("Select count(id) as count from payment where student_id = ?1 limit 1")?;
            let count = statement.query_row(params![value], |row| row.get::<&str, i32>("count"))?;
            Ok(count)
        }
        None => {
            let mut statement = db.prepare("Select count(id) as count from payment limit 1")?;
            let count = statement.query_row([], |row| row.get::<&str, i32>("count"))?;
            Ok(count)
        }
    }
}