use chrono::{Datelike, Utc};

pub fn get_current_date_time() -> String {
    let current_data = Utc::now();
    return current_data.format("%Y-%m-%d %H:%M:%S").to_string();
}

pub fn get_current_date() -> String {
    let current_data = Utc::now();
    return current_data.format("%Y-%m-%d").to_string();
}

pub fn get_current_month() -> u32 {
    let current_data = Utc::now();
    return current_data.month();
}
