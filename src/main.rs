mod core;
mod utils;

use clap::Parser;
use core::{download_song, DownloadOptions, LogLevel};

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None )]
struct Cli {
    /// url of video to download
    url: String,
    /// path to output directory
    #[arg(short = 'o', long)]
    output_dir: Option<String>,
    /// the level of logging to enable
    #[arg(short = 'l', long)]
    log_level: Option<LogLevel>,
}

#[tokio::main]
async fn main() {
    let args = Cli::parse();
    let result = download_song(
        args.url.as_str(),
        DownloadOptions {
            output_dir: args.output_dir,
            log_level: args.log_level,
        },
    )
    .await;
    println!("Success! Output file: {result}");
}
