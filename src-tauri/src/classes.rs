use rusqlite::{params, Connection, Result};
use serde::Serialize;
use crate::helpers::get_current_date_time;


#[derive(Debug, Serialize)]
pub struct Class {
    pub id: i32,
    pub class: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ClassMini{
    pub id: i32, 
    pub class: String
}

#[derive(Debug, Serialize)]
pub struct ClassTable {
    pub id: i32,
    pub class: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
    pub male_count: i32,
    pub female_count: i32
}


// class
pub fn add_class(class: String, db: &Connection) -> Result<(), rusqlite::Error> {
    let current_date = get_current_date_time();
    let class_obj = Class {
        class: class,
        id: 0,
        created_at: None,
        updated_at: Some(current_date),
    };
    db.execute(
        "
    INSERT INTO class(class, updated_at) values(?1, ?2);
    ",
        params![class_obj.class, class_obj.updated_at],
    )?;

    Ok(())
}

pub fn get_class(page: i32, limit: i32, db: &Connection) -> Result<Vec<ClassTable>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<ClassTable> = Vec::new();
    let mut statement = db.prepare("Select *, (select count(id) from students where gender = 'male' and class.id = students.class_id) as male_count, (select count(id) from students where gender = 'female' and class.id = students.class_id) as female_count from class order by id desc limit ?1 offset ?2;")?;
    let class_iter = statement.query_map(params![limit, offset_value], |row| {
        Ok(ClassTable {
            class: row.get("class")?,
            id: row.get("id")?,
            created_at: row.get("created_at")?,
            updated_at: row.get("updated_at")?,
            male_count: row.get("male_count")?,
            female_count: row.get("female_count")?,
        })
    })?;
    for item in class_iter {
        data.push(item.unwrap());
    }
    Ok(data)
}

pub fn get_class_only( db: &Connection) -> Result<Vec<ClassMini>, rusqlite::Error> {
    let mut data: Vec<ClassMini> = Vec::new();
    let mut statement = db.prepare("Select class, id from class order by id desc;")?;
    let class_iter = statement.query_map(params![], |row| {
        Ok(ClassMini {
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
    let current_date = get_current_date_time();
    db.execute(
        "UPDATE class SET class = ?1, updated_at = ?3 where id = ?2",
        params![class, id, current_date],
    )?;
    Ok(())
}

pub fn count_class_rows(db: &Connection) -> Result<i32, rusqlite::Error> {
    let mut statement = db.prepare("SELECT count(id) as count from class limit 1;")?;
    let count = statement.query_row([], |row| row.get::<&str, i32>("count"))?;

    Ok(count)
}