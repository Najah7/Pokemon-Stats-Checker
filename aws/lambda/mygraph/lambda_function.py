import base64
import boto3
from botocore.exceptions import NoCredentialsError
from io import BytesIO
import json
import matplotlib.pyplot as plt
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import numpy as np
import os
from PIL import Image
import requests

def upload_to_s3(bucket, key, image_data):
    """
    S3に画像をアップロードする関数
    """
    s3 = boto3.client('s3')
    acl = 'public-read'

    try:
        s3.put_object(Bucket=bucket, Key=key, Body=image_data, ContentType='image/png', ACL=acl)
        return True
    except NoCredentialsError:
        print("S3 upload error: Credentials not available")
        return False
    except Exception as e:
        print(f"S3 upload error: {str(e)}")
        return False

def get_pokemon_data(pokemon_id):
    """
    ポケモンのデータを取得する関数
    """
    # ポケモン情報取得のURL
    pokemon_api_url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}"

    # GETリクエストを送信
    response = requests.get(pokemon_api_url)

    if response.status_code == 200:
        # JSONデータを取得
        pokemon_data = response.json()

        # ステータス情報を取得
        stats = pokemon_data.get('stats', [])
        data_pokemon = [stat['base_stat'] for stat in stats]
        data_pokemon += data_pokemon[:1]

        # 画像URLを取得
        front_default_url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pokemon_id}.png"

        # 画像を取得
        img_response = requests.get(front_default_url)
        if img_response.status_code == 200:
            img_pokemon = BytesIO(img_response.content)
            return Image.open(img_pokemon), data_pokemon

    return None, None

def generate_radar_chart(data_pokemon, img_pokemon, data_user, labels, color):
    """
    レーダーチャートを生成する関数
    """
    transparency = 0.3
    size = 0.8
    fill_color = color.get('fillColor', 'gold')
    line_color = color.get('lineColor', 'yellow')

    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]  # 最初と最後に同じ角度を追加して閉じる

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.fill(angles, data_pokemon, color=fill_color, alpha=transparency)
    ax.plot(angles, data_pokemon, color=line_color, linewidth=2)
    ax.fill(angles, data_user, alpha=transparency)
    ax.plot(angles, data_user, linewidth=2)

    if img_pokemon:
        imagebox = OffsetImage(img_pokemon, zoom=size, alpha=transparency)
        ab = AnnotationBbox(imagebox, (0.5, 0.5), frameon=False, xycoords='axes fraction', boxcoords="axes fraction")
        ax.add_artist(ab)

    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])  # Remove the last element to match the number of labels
    ax.set_xticklabels(labels)

    # メモリ上で画像を保持
    image_data = BytesIO()
    plt.savefig(image_data, format='png')
    image_data.seek(0)
    plt.close()

    return image_data

def get_object_url(user_name):
    """
    S3オブジェクトのURLを取得する関数
    """
    if not user_name:
        return {
            'statusCode': 400,
            'body': 'userName parameter is missing'
        }

    # AWSリージョンを環境変数から取得
    aws_region = os.environ.get('AWS_REGION')

    # バケット名とオブジェクトキーを構築
    bucket_name = "graph-bucket-sugiyama"
    object_key = f"{user_name}/graph.png"

    # Boto3 S3クライアントを作成
    s3_client = boto3.client('s3', region_name=aws_region)

    try:
        # オブジェクトが存在するか確認
        s3_client.head_object(Bucket=bucket_name, Key=object_key)

        # オブジェクトのURLを構築
        object_url = f"https://{bucket_name}.s3.{aws_region}.amazonaws.com/{object_key}"

        return object_url
    except Exception as e:
        return False

def lambda_handler(event, context):
    """
    Lambdaハンドラ関数
    """
    try:
        # POSTリクエストかGETリクエストかを判断
        if event['httpMethod'] == 'POST':
            # POSTリクエストからデータを取得
            request_body = json.loads(event['body'])
            base_stats = request_body.get('baseStats', {})
            user_name = request_body.get('userName', '')
            pokemon_id = request_body.get('pokemonID', 0)
            color = request_body.get('color', 0)

            img_pokemon, data_pokemon = get_pokemon_data(pokemon_id)

            # 必要なデータを作成
            data_user = [
                base_stats.get('hp', 0),
                base_stats.get('attack', 0),
                base_stats.get('defense', 0),
                base_stats.get('specialAttack', 0),
                base_stats.get('specialDefense', 0),
                base_stats.get('speed', 0)
            ]
            data_user += data_user[:1]
            labels = [
                'HP',
                'Attack',
                'Defense',
                'Special-Attack',
                'Special-Defense',
                'Speed'
            ]

            # レーダーチャートを生成し、S3にアップロード
            s3_bucket = 'graph-bucket-sugiyama'
            s3_key = f'sugiyama/graph.png'
            image_data = generate_radar_chart(data_pokemon, img_pokemon, data_user, labels, color)

            if upload_to_s3(s3_bucket, s3_key, image_data):
                object_url = get_object_url(user_name)
                print(f"{object_url}")
                return {
                    'statusCode': 200,
                    'body': f'{object_url}'
                }
        elif event['httpMethod'] == 'GET':
            # クエリパラメーターからuserNameを受け取る
            user_name = event['queryStringParameters']['userName']
            object_url = get_object_url(user_name)

            print(f"{object_url}")
            return {
                'statusCode': 200,
                'body': f'{object_url}'
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Unsupported HTTP method'}),
            }

    except Exception as e:
        error_message = f"Error processing the request: {str(e)}"
        print(error_message)

        return {
            'statusCode': 500,
            'headers': {'content-type': 'text'},
            'body': json.dumps({'error': error_message}),
        }
