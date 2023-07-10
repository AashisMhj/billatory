use rusqlite::{params, Connection, Result};
use serde::Serialize;
use crate::helpers::{get_current_date_time};


#[derive(Debug, Serialize)]
pub struct Class {
    pub id: i32,
    pub class: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
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

pub fn get_class(page: i32, limit: i32, db: &Connection) -> Result<Vec<Class>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Class> = Vec::new();
    let mut statement = db.prepare("Select * from class order by id desc limit ?1 offset ?2;")?;
    let class_iter = statement.query_map(params![limit, offset_value], |row| {
        Ok(Class {
            class: row.get("class")?,
            id: row.get("id")?,
            created_at: row.get("created_at")?,
            updated_at: row.get("updated_at")?,
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