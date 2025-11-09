import hashlib
import os

def verify_password(plain_password, hashed_password):
    salt = hashed_password[:32] # Salt is 32 bytes (64 hex characters)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        plain_password.encode('utf-8'),
        salt.encode('ascii'),
        100000
    )
    return key.hex() == hashed_password[32:]

def get_password_hash(password):
    salt = os.urandom(16) # Generate a random salt
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000
    )
    return salt.hex() + key.hex()
