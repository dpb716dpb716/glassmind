import boto3
import os
import time

class DynamoDBClient:
    def __init__(self):
        self.table_name = os.getenv("DYNAMODB_TABLE", "glassmind_sensor_data")
        # No need to provide aws_access_key_id or aws_secret_access_key; boto3 will use the IAM role's temporary credentials.
        self.client = boto3.resource(
            'dynamodb',
            region_name=os.getenv("AWS_REGION", "us-east-1")
        )
        self.table = self.client.Table(self.table_name)

    def put_sensor_data(self, device_id, data_type, payload):
        timestamp = int(time.time() * 1000)  # current time in milliseconds
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
            ExpressionAttributeValues={
                ':device_id': device_id
            },
            ScanIndexForward=False,  # latest first
            Limit=limit
        )
        return response.get('Items', [])