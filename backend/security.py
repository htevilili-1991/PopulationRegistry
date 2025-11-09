import hashlib
import os

def verify_password(plain_password, hashed_password):
    print(f"DEBUG: verify_password called with plain_password='{plain_password}', hashed_password='{hashed_password}'")
    if len(hashed_password) < 32:
        print(f"DEBUG: hashed_password too short: {len(hashed_password)} bytes")
        return False
    salt_hex = hashed_password[:32] # Salt is 16 bytes (32 hex characters)
    stored_key_hex = hashed_password[32:]

    try:
        salt = bytes.fromhex(salt_hex)
    except ValueError:
        print(f"DEBUG: Invalid hex salt: {salt_hex}")
        return False

    key = hashlib.pbkdf2_hmac(
        'sha256',
        plain_password.encode('utf-8'),
        salt,
        100000
    )
    computed_key_hex = key.hex()
    print(f"DEBUG: Salt (hex): {salt_hex}")
    print(f"DEBUG: Stored Key (hex): {stored_key_hex}")
    print(f"DEBUG: Computed Key (hex): {computed_key_hex}")
    return computed_key_hex == stored_key_hex

def get_password_hash(password):
    salt = os.urandom(16) # Generate a random salt (16 bytes)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000
    )
    return salt.hex() + key.hex()
