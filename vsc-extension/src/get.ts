import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });
console.log(path.join(__dirname, '.env'));

const bucketName = process.env.bucket_name;
const region = process.env.region;

export function get() {
    // グラフURLを取得
    const graphUrl = `http://${bucketName}.s3.${region}.amazonaws.com/graph.png`;
    vscode.window.showInformationMessage(graphUrl);
}