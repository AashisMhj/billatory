use rusqlite::{Connection, named_params};
use tauri::AppHandle;
use std::fs;

const CURRENT_DB_VERSION: u32 = 1;

pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error>{
    let app_dir = app_handle.path_resolver().app_data_dir().expect(" The app data  directory should exist.");
    fs::create_dir_all(&app_dir).expect(" The app directory should be created");
    let sqlite_path = app_dir.join("db.sqlite");
    print!(" Database file {}", sqlite_path.to_string_lossy());
    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row |{ Ok(row.get(0)?)})?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

pub fn upgrade_database_if_needed(db: &mut Connection, existing_version: u32) -> Result<(), rusqlite::Error>{
    if existing_version < CURRENT_DB_VERSION{
        db.pragma_update(None, "journal_mode", "WAL")?;
        let tx = db.transaction()?;

        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

        tx.execute_batch(
            " CREATE TABLE settings (
                id int PRIMARY KEY,
                organization_name text not null,
                pan_no int not null,
                email text not null,
                phone_no text not null,
                image text
            )"
        )?;

        tx.commit()?;
    }
    Ok(())
}

pub fn add_item(organization_name: &str, contact_no: &str, email: &str, pan_no: &str, db: &Connection) -> Result<(), rusqlite::Error>{
    let mut statement = db.prepare("INSERT INTO settings VALUES (@title)")?;
    statement.execute(named_params! {
        "@organization_name": organization_name, 
        "@contact_no": contact_no,
        "@email": email,
        "@pan_no": pan_no
    })?;

    Ok(())
}

pub fn get_all(db: &Connection) -> Result<Vec<String>, rusqlite::Error>{
    let mut statement = db.prepare("SELECT * FROM settings")?;
    let mut rows = statement.query([])?;
    let mut items = Vec::new();
    while let Some(row) = rows.next()?{
        let title: String = row.get("organization_name")?;
        items.push(title)
    }

    Ok(items)
}