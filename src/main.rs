use clap::{Parser, ValueEnum};

#[derive(Copy, Clone, Debug, PartialEq, Eq, PartialOrd, Ord, ValueEnum)]
enum LogLevel {
    /// disable all output to stdout
    Silent,
    /// log to stdout on success
    Normal,
    /// print debugging information to stdout
    Verbose,
}

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None )]
struct Cli {
    /// url of video to download
    url: String,

    /// path to output directory
    #[arg(short = 'o', long)]
    output_dir: Option<String>,

    #[arg(short = 'l', long)]
    log_level: Option<LogLevel>,
}

#[tokio::main]
async fn main() {
    let args = Cli::parse();
    println!("{:#?}", args);
    let url = "https://www.youtube.com/watch?v=9MXUHYGvBVY";
    println!(
        "downloaded video to {:?}",
        rustube::download_best_quality(&url).await.unwrap()
    );
}
