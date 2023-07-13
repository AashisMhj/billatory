use rusqlite::{params, Connection, Result};
use serde::Serialize;
use crate::helpers::get_current_date_time;

#[derive(Debug, Serialize)]
pub struct StudentMinType{
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub class_id: i32
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
    pub roll_no: i32,
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



// student
pub fn add_student(db: &Connection, student_data: Student) -> Result<(), rusqlite::Error> {
    db.execute("
    INSERT INTO students (first_name, mid_name, last_name, address, father_name, mother_name, date_of_birth, phone_no, email, guardian_name,guardian_relation, emergency_contact, class_id, gender, roll_no)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
    ", (student_data.first_name, student_data.mid_name, student_data.last_name, student_data.address, student_data.father_name, student_data.mother_name, student_data.date_of_birth, student_data.phone_no, student_data.email, student_data.guardian_name, student_data.guardian_relation, student_data.emergency_contact, student_data.class_id, student_data.gender, student_data.roll_no))?;
    Ok(())
}

pub fn get_student(
    db: &Connection,
    page: i32,
    limit: i32, is_active: bool,
    class_id: Option<i32>,
) -> Result<Vec<Student>, rusqlite::Error> {
    let offset_value = (page - 1) * limit;
    let mut data: Vec<Student> = Vec::new();
    let map_row = |row: &rusqlite::Row| -> Result<Student> {
        Ok(Student {
            id: row.get("id")?,
            class: row.get("class")?,
            first_name: row.get("first_name")?,
            last_name: row.get("last_name")?,
            mid_name: row.get("mid_name")?,
            address: row.get("address")?,
            father_name: row.get("father_name")?,
            is_active: row.get("is_active")?,
            class_id: row.get("class_id")?,
            mother_name: row.get("mother_name")?,
            gender: row.get("gender")?,
            roll_no: row.get("roll_no")?,
            date_of_birth: row.get("date_of_birth")?,
            phone_no: None,
            email: None,
            created_at: None,
            updated_at: None,
            guardian_name: None,
            emergency_contact: None,
            guardian_relation: None,
        })
    };
    if let Some(id) = class_id {
        let query = "Select * from students inner join class on students.class_id = class.id where is_active = ?4 and class_id = ?3 limit ?1 offset ?2;";
        let mut statement = db.prepare(query)?;

        let student_iter = statement.query_map(params![limit, offset_value, id, is_active], map_row)?;
        for student in student_iter {
            data.push(student.unwrap());
        }
        return Ok(data);
    } else {
        let query = "Select * from students inner join class on students.class_id = class.id where is_active = ?3 limit ?1 offset ?2;";
        let mut statement = db.prepare(query)?;
        let student_iter = statement.query_map(params![limit, offset_value, is_active], map_row)?;
        for student in student_iter {
            data.push(student.unwrap());
        }
        return Ok(data);
    };
}

pub fn get_student_detail(db: &Connection, id: i32) -> Result<Student, rusqlite::Error> {
    let mut statement = db.prepare(
        "SELECT * FROM students inner join class on students.class_id = class.id where students.id = ?1",
    )?;
    let student_detail = statement.query_row(params![id], |row| {
        Ok(Student {
            id: row.get("id")?,
            class: row.get("class")?,
            first_name: row.get("first_name")?,
            last_name: row.get("last_name")?,
            mid_name: row.get("mid_name")?,
            address: row.get("address")?,
            father_name: row.get("father_name")?,
            is_active: row.get("is_active")?,
            class_id: row.get("class_id")?,
            mother_name: row.get("mother_name")?,
            gender: row.get("gender")?,
            roll_no: row.get("roll_no")?,
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
pub fn update_student_detail(
    db: &Connection,
    student_data: Student,
    student_id: i32,
) -> Result<(), rusqlite::Error> {
    let date_string = get_current_date_time();
    db.execute(
        "UPDATE students SET first_name = ?1, mid_name = ?2, last_name = ?3, address = ?4, father_name = ?5, mother_name = ?6, date_of_birth = ?7, phone_no = ?8, email = ?9, updated_at = ?10, guardian_name = ?11, emergency_contact = ?12, guardian_relation = ?13,  roll_no = ?14, class_id = ?15  where id = ?16; ", 
        params![student_data.first_name, student_data.mid_name, student_data.last_name, student_data.address, student_data.father_name, student_data.mother_name, student_data.date_of_birth, student_data.phone_no, student_data.email, date_string, student_data.guardian_name, student_data.emergency_contact, student_data.guardian_relation, student_data.roll_no, student_data.class_id,  student_id])?;
    Ok(())
}

pub fn change_student_status(
    db: &Connection,
    new_status: bool,
    student_id: i32,
) -> Result<(), rusqlite::Error> {
    let date_string = get_current_date_time();
    db.execute(
        "
    UPDATE students SET is_active = ?1, updated_at = ?2 where id = ?3
    ",
        params![new_status, date_string, student_id],
    )?;
    Ok(())
}

pub fn count_student_row(db: &Connection,is_active: bool, class_id: Option<i32>) -> Result<i32, rusqlite::Error> {
    if let Some(id) = class_id {
        let mut statement = db.prepare(" Select count(id) as count from students where is_active = ?1 and class_id = ?2 limit 1;")?;
        let student_count = statement.query_row(params![is_active, id], |row| row.get::<&str, i32>("count"))?;
        Ok(student_count)
    }else {
        let mut statement = db.prepare(" Select count(id) as count from students where is_active = ?1 limit 1;")?;
        let student_count = statement.query_row(params![is_active], |row| row.get::<&str, i32>("count"))?;
        Ok(student_count)
    }
}


pub fn bulk_update_student_class(db: &Connection, class_id: i32, student_ids: Vec<i32>) -> Result<(), rusqlite::Error>{
    let date_string = get_current_date_time();
    let joined_ids = student_ids.iter().map(|number|  number.to_string()).collect::<Vec<String>>().join(",");
    let query = format!( "UPDATE students set class_id = ?1, updated_at = ?2 where id in ( {} )", joined_ids);
    db.execute(query.as_str(), params![class_id, date_string])?;
    Ok(())
}

pub fn bulk_update_student_status(db: &Connection ,new_status: bool, student_ids: Vec<i32>) -> Result<(), rusqlite::Error>{
    let date_string = get_current_date_time();
    let joined_ids = student_ids.iter().map(|number|  number.to_string()).collect::<Vec<String>>().join(",");
    let query = format!( "UPDATE students set is_active = ?1, updated_at = ?2 where id in ( {} )", joined_ids);
    db.execute(query.as_str(), params![new_status, date_string])?;
    Ok(())
}