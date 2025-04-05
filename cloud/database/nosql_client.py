import boto3
import os
import time
from decimal import Decimal
from dotenv import load_dotenv

load_dotenv()

def convert_floats_to_decimal(item):
    """
    Recursively convert floats in the given item (which may be a dict or list) to Decimal.
    """
    if isinstance(item, float):
        return Decimal(str(item))
    elif isinstance(item, dict):
        return {k: convert_floats_to_decimal(v) for k, v in item.items()}
    elif isinstance(item, list):
        return [convert_floats_to_decimal(i) for i in item]
    else:
        return item

class DynamoDBClient:
    def __init__(self):
        self.table_name = os.getenv("DYNAMODB_TABLE", "glassmind_sensor_data")
        self.region = os.getenv("AWS_REGION", "us-east-1")
        # When running on an EC2 instance with an attached IAM role, no explicit credentials are needed.
        self.dynamodb = boto3.resource('dynamodb', region_name=self.region)
        self.table = self.dynamodb.Table(self.table_name)

    def put_sensor_data(self, device_id, data_type, payload):
        # Generate a timestamp as a string (since your table expects a string)
        timestamp = str(int(time.time() * 1000))
        # Convert any float values in the payload to Decimal
        payload = convert_floats_to_decimal(payload)
        item = {
            'device_id': device_id,
            'timestamp': timestamp,
            'data_type': data_type,
            'payload': payload
        }
        response = self.table.put_item(Item=item)
        return response

    def get_recent_sensor_data(self, device_id, limit=10):
        response = self.table.query(
            KeyConditionExpression='device_id = :device_id',
            ExpressionAttributeValues={':device_id': device_id},
            ScanIndexForward=False,  # Latest items first
            Limit=limit
        )
        return response.get('Items', [])