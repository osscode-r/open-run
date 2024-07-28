use std::env;

#[derive(Clone)]
pub struct Config {
    pub server_addr: String,
    pub server_port: u16,
    pub file_storage_path: String,
    pub jwt_secret: String,
    pub hash_secret: String,
    pub db_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            server_addr: env::var("SERVER_ADDR").expect("SERVER_ADDR must be set"),
            server_port: env::var("SERVER_PORT")
                .expect("SERVER_PORT must be set")
                .parse()
                .expect("SERVER_PORT must be a valid port number"),
            file_storage_path: env::var("FILE_STORAGE_PATH")
                .expect("FILE_STORAGE_PATH must be set"),
            jwt_secret: env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
            hash_secret: env::var("HASH_SECRET").expect("HASH_SECRET must be set"),
            db_url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
        }
    }
}
