use bcrypt::{hash, verify, DEFAULT_COST};
use crate::models::auth::{NewUser, User};
use sqlx::PgPool;
use chrono::Utc;

pub async fn create_user(pool: &PgPool, user: &NewUser) -> Result<User, sqlx::Error> {
    let hashed_password = hash(&user.password, DEFAULT_COST)
        .map_err(|_| sqlx::Error::Protocol("Password hashing failed".into()))?;

    let row = sqlx::query!(
        r#"
        INSERT INTO users (username, password, email)
        VALUES ($1, $2, $3)
        RETURNING id, username,  email, last_login, created_at, updated_at, role
        "#,
        user.username,
        hashed_password,
        user.email.as_deref()
    )
    .fetch_one(pool)
    .await?;

    Ok(User {
        id: row.id,
        username: row.username,
        email: row.email,
        last_login: row.last_login,
        created_at: row.created_at.unwrap_or_else(|| Utc::now()),
        updated_at: row.updated_at.unwrap_or_else(|| Utc::now()),
        role: row.role.unwrap_or_else(|| "user".to_string()),
        password:String::new(),
    })
}


pub async fn get_user_by_username(pool: &PgPool, username: &str) -> Result<User, sqlx::Error> {
    let row = sqlx::query!(
        r#"
        SELECT id, username, email, last_login, created_at, updated_at, role
        FROM users
        WHERE username = $1
        "#,
        username
    )
    .fetch_one(pool)
    .await?;

    Ok(User {
        id: row.id,
        username: row.username,
        email: row.email,
        last_login: row.last_login,
        created_at: row.created_at.unwrap_or_else(|| Utc::now()),
        updated_at: row.updated_at.unwrap_or_else(|| Utc::now()),
        role: row.role.unwrap_or_else(|| "user".to_string()),
        password: String::new(),
    })
}

pub async fn get_user_by_id(pool: &PgPool, id: uuid::Uuid) -> Result<User, sqlx::Error> {
    let row = sqlx::query!(
        r#"
        SELECT id, username, email, last_login, created_at, updated_at, role
        FROM users
        WHERE id = $1
        "#,
        id
    )
    .fetch_one(pool)
    .await?;

    Ok(User {
        id: row.id,
        username: row.username,
        email: row.email,
        last_login: row.last_login,
        created_at: row.created_at.unwrap_or_else(|| Utc::now()),
        updated_at: row.updated_at.unwrap_or_else(|| Utc::now()),
        role: row.role.unwrap_or_else(|| "user".to_string()),
        password: String::new(),
    })
}

pub async fn update_user_last_login(pool: &PgPool, id: uuid::Uuid) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        UPDATE users
        SET last_login = now()
        WHERE id = $1
        "#,
        id
    )
    .execute(pool)
    .await?;
    Ok(())
}

pub async fn verify_credentials(pool: &PgPool, username_or_email: String, password: String) -> Result<Option<User>, sqlx::Error> {
    let user = sqlx::query!(
        r#"
        SELECT id, username, email, password, role, last_login, created_at, updated_at
        FROM users 
        WHERE username = $1 OR email = $1
        "#,
        username_or_email
    )
    .fetch_optional(pool)
    .await?;

    if let Some(user) = user {
        if verify(&password, &user.password).unwrap_or(false) {
            Ok(Some(User {
                id: user.id,
                username: user.username,
                email: user.email,
                password: String::new(),
                role: user.role.unwrap_or_else(|| "user".to_string()),
                last_login: user.last_login,
                created_at: user.created_at.unwrap_or_else(|| Utc::now()),
                updated_at: user.created_at.unwrap_or_else(|| Utc::now()),
            }))
        } else {
            Ok(None)
        }
    } else {
        Ok(None)
    }
}