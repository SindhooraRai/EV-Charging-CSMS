import asyncio
import unittest
from unittest.mock import AsyncMock, MagicMock, patch

# We adjust sys.path to ensure we can import app, utils, and services directly
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import HTTPException
from app.routers.payments import create_checkout_order, verify_checkout_payment, get_payments
from app.schemas.payment import CreateOrderRequest, VerifyPaymentRequest
from app.models.transaction import Transaction
from app.models.payment import Payment


class TestPaymentRouter(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.mock_user = {
            "id": 1,
            "email": "driver@voltgrid.com",
            "role": "driver"
        }

    @patch("app.routers.payments.create_razorpay_order")
    async def test_create_checkout_order_success(self, mock_create_order):
        # Setup mocks
        mock_create_order.return_value = {
            "id": "order_test_123",
            "amount": 50000,
            "currency": "INR"
        }

        # Mock database session methods
        mock_db = AsyncMock()
        
        # Mock transaction
        mock_transaction = Transaction(
            id=123,
            user_id=1,
            station_id=1,
            amount=500.0,
            energy_used=30.0,
            payment_status="Unpaid"
        )
        mock_db.get.return_value = mock_transaction

        # Mock select query for existing payments
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = []
        mock_db.execute.return_value = mock_result

        # Call endpoint action
        payload = CreateOrderRequest(transaction_id=123)
        res = await create_checkout_order(
            payload=payload,
            db=mock_db,
            current_user=self.mock_user
        )

        # Assertions
        self.assertEqual(res.order_id, "order_test_123")
        self.assertEqual(res.amount, 500.0)
        self.assertEqual(res.currency, "INR")
        self.assertIsNotNone(res.key_id)
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called()

    async def test_create_checkout_order_not_found(self):
        # Mock database
        mock_db = AsyncMock()
        mock_db.get.return_value = None  # Transaction not found

        payload = CreateOrderRequest(transaction_id=999)
        with self.assertRaises(HTTPException) as context:
            await create_checkout_order(
                payload=payload,
                db=mock_db,
                current_user=self.mock_user
            )
        
        self.assertEqual(context.exception.status_code, 404)
        self.assertIn("Transaction log not found", context.exception.detail)

    async def test_create_checkout_order_already_paid(self):
        # Mock database
        mock_db = AsyncMock()
        mock_transaction = Transaction(
            id=123,
            user_id=1,
            station_id=1,
            amount=500.0,
            payment_status="Paid"
        )
        mock_db.get.return_value = mock_transaction

        payload = CreateOrderRequest(transaction_id=123)
        with self.assertRaises(HTTPException) as context:
            await create_checkout_order(
                payload=payload,
                db=mock_db,
                current_user=self.mock_user
            )

        self.assertEqual(context.exception.status_code, 400)
        self.assertIn("already been paid", context.exception.detail)

    @patch("app.routers.payments.verify_razorpay_signature")
    async def test_verify_checkout_payment_success(self, mock_verify_signature):
        mock_verify_signature.return_value = True

        mock_db = AsyncMock()
        
        # Mock payment reference log fetch
        mock_payment = Payment(
            id=1,
            transaction_id=123,
            payment_id="order_test_123",
            amount=500.0,
            status="Pending",
            method="Razorpay"
        )
        mock_result = MagicMock()
        mock_result.scalars.return_value.first.return_value = mock_payment
        mock_db.execute.return_value = mock_result

        # Mock transaction update fetch
        mock_transaction = Transaction(
            id=123,
            user_id=1,
            amount=500.0,
            payment_status="Unpaid"
        )
        mock_db.get.return_value = mock_transaction

        payload = VerifyPaymentRequest(
            transaction_id=123,
            razorpay_order_id="order_test_123",
            razorpay_payment_id="pay_test_456",
            razorpay_signature="sig_test_789"
        )

        res = await verify_checkout_payment(
            payload=payload,
            db=mock_db,
            current_user=self.mock_user
        )

        # Assertions
        self.assertEqual(res["status"], "success")
        self.assertEqual(mock_payment.status, "Success")
        self.assertEqual(mock_payment.payment_id, "pay_test_456")
        self.assertEqual(mock_transaction.payment_status, "Paid")
        mock_db.commit.assert_called()

    @patch("app.routers.payments.verify_razorpay_signature")
    async def test_verify_checkout_payment_invalid_signature(self, mock_verify_signature):
        mock_verify_signature.return_value = False

        mock_db = AsyncMock()
        payload = VerifyPaymentRequest(
            transaction_id=123,
            razorpay_order_id="order_test_123",
            razorpay_payment_id="pay_test_456",
            razorpay_signature="invalid_sig"
        )

        with self.assertRaises(HTTPException) as context:
            await verify_checkout_payment(
                payload=payload,
                db=mock_db,
                current_user=self.mock_user
            )

        self.assertEqual(context.exception.status_code, 400)
        self.assertIn("signature verification failed", context.exception.detail)


if __name__ == "__main__":
    unittest.main()
