import asyncio
from datetime import timedelta
import unittest
from unittest.mock import AsyncMock, MagicMock

# We adjust sys.path to ensure we can import app, utils, and services directly
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)
from services.auth_service import AuthService


class TestSecurityUtils(unittest.TestCase):
    def test_password_hashing(self):
        password = "secure_password_123"
        hashed = get_password_hash(password)
        
        # Hash should not be equal to plain text
        self.assertNotEqual(password, hashed)
        
        # Verification should succeed with correct password
        self.assertTrue(verify_password(password, hashed))
        
        # Verification should fail with incorrect password
        self.assertFalse(verify_password("wrong_password", hashed))

    def test_jwt_token_flow(self):
        data = {"sub": "123", "email": "test@voltgrid.com", "role": "admin"}
        
        # Test basic creation and decoding
        token = create_access_token(data)
        decoded = decode_access_token(token)
        
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded["sub"], "123")
        self.assertEqual(decoded["email"], "test@voltgrid.com")
        self.assertEqual(decoded["role"], "admin")
        self.assertIn("exp", decoded)

    def test_token_expiration(self):
        data = {"sub": "123"}
        # Create a token that expired 1 second ago
        token = create_access_token(data, expires_delta=timedelta(seconds=-1))
        decoded = decode_access_token(token)
        self.assertIsNone(decoded)


class TestAuthService(unittest.IsolatedAsyncioTestCase):
    async def test_authenticate_user_success(self):
        # Plain pass and hashed matching pass
        password = "mysecretpassword"
        hashed = get_password_hash(password)
        
        # Mock database session mapping
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_mapping = MagicMock()
        
        # Return hashed password matching the credentials
        mock_mapping.first.return_value = {
            "id": 1,
            "email": "driver@voltgrid.com",
            "hashed_password": hashed,
            "role": "driver",
            "is_active": True
        }
        mock_result.mappings.return_value = mock_mapping
        mock_db.execute.return_value = mock_result
        
        # Execute auth
        user = await AuthService.authenticate_user(mock_db, "driver@voltgrid.com", password)
        
        self.assertIsNotNone(user)
        self.assertEqual(user["id"], 1)
        self.assertEqual(user["email"], "driver@voltgrid.com")
        self.assertEqual(user["role"], "driver")
        
    async def test_authenticate_user_wrong_password(self):
        password = "correct_password"
        hashed = get_password_hash(password)
        
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_mapping = MagicMock()
        
        mock_mapping.first.return_value = {
            "id": 1,
            "email": "driver@voltgrid.com",
            "hashed_password": hashed,
            "role": "driver",
            "is_active": True
        }
        mock_result.mappings.return_value = mock_mapping
        mock_db.execute.return_value = mock_result
        
        # Authentication with wrong password should fail and return None
        user = await AuthService.authenticate_user(mock_db, "driver@voltgrid.com", "wrong_password")
        self.assertIsNone(user)

    async def test_login_user_success(self):
        password = "correct_password"
        hashed = get_password_hash(password)
        
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_mapping = MagicMock()
        
        mock_mapping.first.return_value = {
            "id": 10,
            "email": "admin@voltgrid.com",
            "hashed_password": hashed,
            "role": "admin",
            "is_active": True
        }
        mock_result.mappings.return_value = mock_mapping
        mock_db.execute.return_value = mock_result
        
        # Execute login
        res = await AuthService.login_user(mock_db, "admin@voltgrid.com", password)
        
        self.assertIsNotNone(res)
        self.assertIn("access_token", res)
        self.assertEqual(res["token_type"], "bearer")
        self.assertEqual(res["user"]["email"], "admin@voltgrid.com")
        self.assertEqual(res["user"]["role"], "admin")
        
        # Verify access token is valid
        payload = decode_access_token(res["access_token"])
        self.assertIsNotNone(payload)
        self.assertEqual(payload["sub"], "10")
        self.assertEqual(payload["email"], "admin@voltgrid.com")

    async def test_get_current_user_from_token(self):
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_mapping = MagicMock()
        
        mock_mapping.first.return_value = {
            "id": 5,
            "email": "user5@voltgrid.com",
            "role": "user",
            "is_active": True
        }
        mock_result.mappings.return_value = mock_mapping
        mock_scalars = MagicMock()
        mock_scalars.first.return_value = None
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute.return_value = mock_result
        
        # Generate token first
        token_data = {"sub": "5", "email": "user5@voltgrid.com", "role": "user"}
        token = create_access_token(token_data)
        
        # Fetch current user
        user = await AuthService.get_current_user(mock_db, token)
        
        self.assertIsNotNone(user)
        self.assertEqual(user["id"], 5)
        self.assertEqual(user["email"], "user5@voltgrid.com")
        self.assertEqual(user["role"], "user")


if __name__ == "__main__":
    unittest.main()
