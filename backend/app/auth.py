from .core.security import create_access_token, decode_token, hash_password, verify_password


# One-line auth swap path:
# Set AUTH_MODE=oidc and wire Authlib Login.gov client in your dependency layer.
