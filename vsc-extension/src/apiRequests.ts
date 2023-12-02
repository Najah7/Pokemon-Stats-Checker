import axios, { AxiosResponse, AxiosError } from "axios";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });
const apiKey = process.env.API_KEY; // ここにAPIキーを設定

export async function getRequest<T>(
  userName: string
): Promise<AxiosResponse<T> | null> {
  const url =
    "https://01q8r9zev4.execute-api.ap-northeast-1.amazonaws.com/prd/graph/mygraph";
  try {
    const response = await axios.get<T>(url, {
      params: {
        userName: userName,
      },
      headers: {
        "x-api-key": apiKey,
      },
    });
    return response;
  } catch (error: any) {
    handleRequestError(error);
    return null;
  }
}

export async function postRequest<T>(
  data?: Record<string, any>
): Promise<AxiosResponse<T> | null> {
  const url =
    "https://01q8r9zev4.execute-api.ap-northeast-1.amazonaws.com/prd/graph/mygraph";
  const apiKey = "API_KEY"; // ここにAPIキーを設定
  const headers = {
    "x-api-key": apiKey,
  };
  try {
    const response = await axios.post<T>(url, data, {
      headers,
      timeout: 20000,
    });
    return response;
  } catch (error: any) {
    handleRequestError(error);
    return null;
  }
}

function handleRequestError(error: AxiosError): void {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error(
      `Request failed with status ${error.response.status}:`,
      error.response.data
    );
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received for the request:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request:", error.message);
  }
}
