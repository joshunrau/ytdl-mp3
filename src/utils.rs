use directories::UserDirs;
use regex::Regex;
use std::path::PathBuf;

pub fn remove_parenthesized_text(input: &str) -> String {
    let re = Regex::new(r"\[[^\]]*?\]|\([^\)]*?\)").unwrap();
    re.replace_all(input, "").to_string()
}

pub fn get_default_downloads_dir() -> PathBuf {
    if let Some(user_dirs) = UserDirs::new() {
        if let Some(download_dir) = user_dirs.download_dir() {
            return download_dir.to_path_buf();
        }
    }
    panic!("Failed to detect download directory for your operating system")
}
