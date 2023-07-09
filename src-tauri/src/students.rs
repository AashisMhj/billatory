use rusqlite::{params, Connection, Result};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct StudentMinType{
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub class_id: i32
}

pub fn get_all_active_students(db: &Connection)-> Result<Vec<StudentMinType>, rusqlite::Error>{
    let query = "SELECT id, first_name, last_name, class_id FROM students where is_active = true;";
    let mut statement = db.prepare(query)?;
    let students_iter = statement.query_map([], |row|{
        Ok(StudentMinType{
            id: row.get("id")?,
            first_name: row.get("first_name")?,
            last_name: row.get("last_name")?,
            class_id: row.get("class_id")?,
        })
    })?;
    let mut data: Vec<StudentMinType> = Vec::new();
    for item in students_iter{
        data.push(item.unwrap())
    }

    Ok(data)
}