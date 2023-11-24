import * as request from 'request';

export function post(H: number, A: number, B: number, C: number, D: number, S: number) {
    // APIエンドポイント
    const apiUrl = 'http://localhost:5000/create-graph';

    // POSTするデータ
    const postData = {
        H: H,
        A: A,
        B: B,
        C: C,
        D: D,
        S: S,
    };

    // リクエストオプション
    const requestOptions: request.CoreOptions = {
        json: true,
        body: postData,
    };

    // POSTリクエスト
    request.post(apiUrl, requestOptions, (error, response, body) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('API Response:', body);
        }
    });
}