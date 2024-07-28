use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use std::sync::Arc;
use sqlx::postgres::PgPoolOptions;
use sqlx::Pool;
use serde::{Deserialize, Serialize};
use log::{info, error, debug};
use uuid::Uuid;

mod config;
mod errors;
mod handlers;
mod models;
mod services;
mod middleware;
mod repository;
mod app_utils;

pub struct AppState {
    db: Pool<sqlx::Postgres>,
    config: Arc<config::Config>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct TokenClaims {
    sub: Uuid,
    exp: usize,
    iat: usize,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    
    std::env::set_var("RUST_LOG", "debug,actix_web=debug,sqlx=debug");
    env_logger::init();

    debug!("Logger initialized");

    let config = Arc::new(config::Config::from_env());
    debug!("Configuration loaded");

    let server_addr = config.server_addr.clone();
    let server_port = config.server_port;

    info!("Starting server at {}:{}", server_addr, server_port);

    let db_pool = match PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.db_url)
        .await
    {
        Ok(pool) => {
            info!("Successfully connected to the database");
            pool
        },
        Err(e) => {
            error!("Failed to connect to the database: {:?}", e);
            std::process::exit(1);
        }
    };

    // sqlx::migrate!("./migrations").run(&db_pool).await.unwrap();

    info!("Database pool created, starting HTTP server");

    HttpServer::new(move || {
        let config = Arc::clone(&config);
        App::new()
            .app_data(web::Data::new(AppState {
                db: db_pool.clone(),
                config: config.clone(),
            }))
            .configure(handlers::config)
    })
    .bind((server_addr, server_port))?
    .run()
    .await
}