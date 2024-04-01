use clap::ValueEnum;
use rustube::{Id, Video};
use std::path::PathBuf;

use crate::utils::{get_default_downloads_dir, remove_parenthesized_text};

#[derive(Copy, Clone, Debug, PartialEq, Eq, PartialOrd, Ord, ValueEnum)]
pub enum LogLevel {
    /// disable all output to stdout
    Silent,
    /// log to stdout on success
    Normal,
    /// print debugging information to stdout
    Verbose,
}

#[derive(Debug)]
pub struct DownloadOptions {
    pub output_dir: Option<String>,
    pub log_level: Option<LogLevel>,
}

pub async fn download_song(url: &str, options: DownloadOptions) -> Result<String, String> {
    let output_dir: PathBuf = match &options.output_dir {
        Some(value) => {
            let buf = PathBuf::from(value);
            if !buf.is_dir() {
                return Err(format!("Not a directory: {}", buf.display()));
            }
            buf
        }
        None => get_default_downloads_dir(),
    };

    let id = Id::from_raw(url).expect(&format!("Failed to convert URL into ID: {}", url));
    let video = Video::from_id(id.into_owned())
        .await
        .expect("Failed to create video fetcher");
    let details = video.video_details();

    let base_filename = {
        let base = remove_parenthesized_text(&details.title);
        let mut result = String::new();
        for char in base.trim().to_lowercase().chars() {
            if char.is_alphanumeric() {
                result.push(char)
            } else if char.is_whitespace() && !result.ends_with('_') {
                result.push('_');
            }
        }
        result
    };

    let output_filepath = output_dir.join(format!("{base_filename}.mp4"));
    if output_filepath.exists() {
        println!(
            "File '{}' already exists, will attempt to convert to mp3",
            output_filepath.display()
        )
    } else {
        println!(
            "Attempting to download video '{}' to filepath: {}",
            details.title,
            output_filepath.display()
        );
        video
            .best_audio()
            .unwrap()
            .download_to(output_filepath)
            .await
            .expect("Failed to download video");
        println!("Success!");
    }

    Ok(String::from("success"))
}

#[cfg(test)]
mod tests {
    use super::*;

    const URL: &str = "https://www.youtube.com/watch?v=9MXUHYGvBVY";

    #[tokio::test]
    async fn it_works() {
        let result = download_song(
            URL,
            DownloadOptions {
                output_dir: None,
                log_level: None,
            },
        )
        .await;
        assert!(!result.unwrap().is_empty());
    }
}
