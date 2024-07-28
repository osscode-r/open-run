use actix_web::dev::ServiceRequest;
use actix_web::web;
use actix_web::Error;
use actix_web::HttpMessage;
use actix_web_httpauth::extractors::bearer::BearerAuth;
use hmac::{Hmac, Mac};
use jwt::VerifyWithKey;
use sha2::Sha256;

use crate::AppState;
use crate::TokenClaims;

pub async fn validator(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (Error, ServiceRequest)> {
    let config = req.app_data::<web::Data<AppState>>().unwrap().config.clone();
    let jwt_secret = config.jwt_secret.clone();
    let key: Hmac<Sha256> = Hmac::new_from_slice(jwt_secret.as_bytes()).unwrap();

    let token_string = credentials.token();
    let claims: Result<TokenClaims, &str> = token_string.verify_with_key(&key).map_err(|_| "Invalid Token");

    match claims {
        Ok(value) => {
            req.extensions_mut().insert(value);
            Ok(req)
        }
        Err(_) => {
            let config = req.app_data::<actix_web_httpauth::extractors::bearer::Config>()
                .cloned()
                .unwrap_or_default()
                .scope("");
            Err((actix_web_httpauth::extractors::AuthenticationError::from(config).into(), req))
        }
    }
}