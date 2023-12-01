import os
import boto3

def lambda_handler(event, context):
    # クエリパラメーターからuserNameを受け取る
    user_name = event['queryStringParameters']['userName']

    if not user_name:
        return {
            'statusCode': 400,
            'body': 'userName parameter is missing'
        }

    # AWSリージョンを環境変数から取得
    aws_region = os.environ.get('AWS_REGION')

    # バケット名とオブジェクトキーを構築
    bucket_name = f"graph-bucket-sugiyama"
    object_key = f"{user_name}/graph.png"

    # Boto3 S3クライアントを作成
    s3_client = boto3.client('s3', region_name=aws_region)

    try:
        # オブジェクトが存在するか確認
        response = s3_client.head_object(Bucket=bucket_name, Key=object_key)
        
        # オブジェクトのURLを構築
        object_url = f"https://{bucket_name}.s3.{aws_region}.amazonaws.com/{object_key}"

        print(f"Object {object_key} exists in bucket {bucket_name}: {object_url}")
        return {
            'statusCode': 200,
            'body': f'{object_url}'
        }
    except Exception as e:
        # オブジェクトが存在しない場合のエラーハンドリング
        print(f"Object {object_key} does not exist in bucket {bucket_name}")
        return {
            'statusCode': 404,
            'body': f"Object {object_key} does not exist in bucket {bucket_name}"
        }
