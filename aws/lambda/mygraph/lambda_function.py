import boto3
from io import BytesIO
import json
import matplotlib.pyplot as plt
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import numpy as np
import os
from PIL import Image
import requests

def get_pokemon_data(pokemon_id):
    """
    ポケモンのデータを取得する関数
    """
    # ポケモン情報取得のURL
    poke_api_url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}"

    # 画像URLを取得
    poke_img_url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pokemon_id}.png"

    # GETリクエストを送信
    response = requests.get(poke_api_url)

    # JSONデータを取得
    poke_data = response.json()

    # スタッツを取得
    stats = poke_data.get('stats', [])
    poke_stats = [stat['base_stat'] for stat in stats]
    poke_stats += poke_stats[:1]

    # 画像を取得
    img_response = requests.get(poke_img_url)
    poke_img = BytesIO(img_response.content)

    return Image.open(poke_img), poke_stats

def generate_chart(request, poke_stats, poke_img):
    """
    レーダーチャートを生成する関数
    """
    alpha = 0.3
    size = 0.8
    linewidth = 2
    base_stats = request.get('baseStats', {})
    color = request.get('color', {})
    fill_color = color.get('fillColor', '')
    line_color = color.get('lineColor', '')

    # ユーザースタッツを作成
    user_stats = [
        base_stats.get('hp', 0),
        base_stats.get('attack', 0),
        base_stats.get('defense', 0),
        base_stats.get('specialAttack', 0),
        base_stats.get('specialDefense', 0),
        base_stats.get('speed', 0)
    ]
    user_stats += user_stats[:1]

    # グラフラベルを作成
    labels = [
        'HP',
        'Attack',
        'Defense',
        'Special-Attack',
        'Special-Defense',
        'Speed'
    ]

    # 回転軸の設定
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]

    # グラフ描画
    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.fill(angles, poke_stats, color=fill_color, alpha=alpha)
    ax.plot(angles, poke_stats, color=line_color, linewidth=linewidth)
    ax.fill(angles, user_stats, alpha=alpha)
    ax.plot(angles, user_stats, linewidth=linewidth)

    # 背景にポケモン画像を配置
    imagebox = OffsetImage(poke_img, zoom=size, alpha=alpha)
    ab = AnnotationBbox(imagebox, (0.5, 0.5), frameon=False, xycoords='axes fraction', boxcoords="axes fraction")
    ax.add_artist(ab)

    # 軸設定
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)

    # メモリ上で画像を保持
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return img


def lambda_handler(event, context):
    """
    Lambdaハンドラ関数
    """
    try:
        # S3クライアントの作成
        s3 = boto3.client('s3')

        # バケット名
        bucket = "graph-bucket-sugiyama"

        # AWSリージョンを環境変数から取得
        aws_region = os.environ.get('AWS_REGION')

        # POSTリクエストの場合
        if event['httpMethod'] == 'POST':
            # パラメータ取得
            request = json.loads(event['body'])
            user_name = request.get('userName', '')
            pokemon_id = request.get('pokemonID', 0)

            # オブジェクトキー
            object_key = f"{user_name}/graph.png"

            # ポケモンデータを取得
            poke_img, poke_stats = get_pokemon_data(pokemon_id)

            # レーダーチャートを生成し、S3にアップロード
            img = generate_chart(request, poke_stats, poke_img)

            s3.put_object(
                Bucket=bucket,
                Key=object_key,
                Body=img,
                ContentType='image/png'
            )
            return {
                'statusCode': 200,
                'body': f"https://{bucket}.s3.{aws_region}.amazonaws.com/{object_key}"
            }

        # GETリクエストの場合
        elif event['httpMethod'] == 'GET':
            # クエリパラメーターからuserNameを受け取る
            user_name = event['queryStringParameters']['userName']

            # オブジェクトキー
            object_key = f"{user_name}/graph.png"

            return {
                'statusCode': 200,
                'body': f"https://{bucket}.s3.{aws_region}.amazonaws.com/{object_key}"
            }

    # サーバーエラー
    except Exception as e:
        return {
            'statusCode': 500,
            'body': e
        }

