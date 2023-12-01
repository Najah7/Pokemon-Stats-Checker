import axios from "axios";

export async function getImageUrl(userName: string) {
  const endpoint =
    "https://laa1e0jhs0.execute-api.eu-north-1.amazonaws.com/dev/graph/mygraph";
  const apiKey = "SESNJGvOsE161xSXG5k3A6jNbLwGUiLNanolZbIa"; // ここにAPIキーを設定

  // GETリクエストを送信
  return await axios.get(endpoint, {
    params: {
      userName: userName,
    },
    headers: {
      "x-api-key": apiKey,
    },
  });
}
