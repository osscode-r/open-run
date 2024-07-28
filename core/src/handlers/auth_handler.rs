use actix_web::{post, web, HttpResponse, Responder};
use crate::models::auth::{LoginRequest, LoginResponse, NewUser, SignupRequest, SignupResponse};
use crate::repository::auth_repository::{create_user, verify_credentials};
use crate::app_utils::jwt::generate_token;
use crate::AppState;

#[post("/login")]
async fn login(
    info: web::Json<LoginRequest>,
    data: web::Data<AppState>,
) -> impl Responder {
    if info.username_or_email.is_empty() || info.password.is_empty() {
        return HttpResponse::BadRequest().json(LoginResponse {
            success: false,
            message: "Username/Email and password are required".to_string(),
            token: None,
            data: None,
        });
    }

    match verify_credentials(&data.db, info.username_or_email.clone(), info.password.clone()).await {
        Ok(Some(user)) => {
            match generate_token(user.id, &data.config.jwt_secret) {
                Ok(token) => HttpResponse::Ok().json(LoginResponse {
                    success: true,
                    message: "Login successful".to_string(),
                    token: Some(token),
                    data: Some(user),
                }),
                Err(_) => HttpResponse::InternalServerError().json(LoginResponse {
                    success: false,
                    message: "Failed to generate token".to_string(),
                    token: None,
                    data: None,
                }),
            }
        },
        Ok(None) => {
            HttpResponse::Unauthorized().json(LoginResponse {
                success: false,
                message: "Invalid credentials".to_string(),
                token: None,
                data: None,
            })
        },
        Err(_) => {
            HttpResponse::InternalServerError().json(LoginResponse {
                success: false,
                message: "An error occurred during login".to_string(),
                token: None,
                data: None,
            })
        }
    }
}

#[post("/signup")]
pub async fn signup(
    body: web::Json<SignupRequest>,
    data: web::Data<AppState>,
) -> impl Responder {
    let SignupRequest { username, password, email } = body.into_inner();
    println!("Username: {}, Password: {}, Email: {:?}", username, password, email);
    if username.is_empty() || password.is_empty() {
        return HttpResponse::BadRequest().json(SignupResponse {
            success: false,
            message: "Username and password are required".to_string(),
            data: None,
            token: None,
        });
    }

    let new_user = NewUser {
        username,
        password,
        email,
    };

    match create_user(&data.db, &new_user).await {
        Ok(user) => {
            match generate_token(user.id, &data.config.jwt_secret) {
                Ok(token) => HttpResponse::Created().json(SignupResponse {
                    success: true,
                    message: "User created successfully".to_string(),
                    data: Some(user),
                    token: Some(token),
                }),
                Err(_) => HttpResponse::InternalServerError().json(SignupResponse {
                    success: false,
                    message: "User created but failed to generate token".to_string(),
                    data: Some(user),
                    token: None,
                }),
            }
        },
        Err(e) => {
            log::error!("Failed to create user: {:?}", e);
            HttpResponse::InternalServerError().json(SignupResponse {
                success: false,
                message: "Failed to create user".to_string(),
                data: None,
                token: None,
            })
        }
    }
}