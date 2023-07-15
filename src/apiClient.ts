import axios from "axios";
import axiosRetry from "axios-retry";

const AccessKey = process.env.REACT_APP_ACCESS_KEY;
const ClientID = process.env.REACT_APP_CLIENT_ID;
const DeviceID = process.env.REACT_APP_DEVICE_ID;
const AccessClientBaseURL = process.env.REACT_APP_ACCESS_CLIENT_BASE_URL;
const BonusClientBaseURL = process.env.REACT_APP_BONUS_CLIENT_BASE_URL;

axiosRetry(axios, {
  retries: 3,
  retryDelay: () => {
    return 1000; // linear backoff
  },
  retryCondition: (error) => {
    if (error && error.response) {
      return error.response.status >= 500;
    }
    return false;
  },
});

const accessClient = axios.create({
  baseURL: AccessClientBaseURL,
  timeout: 5000,
});

export async function fetchAccessToken(): Promise<string> {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return accessToken;
  }

  const response = await accessClient("/api/v3/clients/accesstoken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      AccessKey,
    },
    data: {
      idClient: `{${ClientID}}`,
      paramValue: `{${DeviceID}}`,
      paramName: "device",
    },
  });

  if (response.status !== 200) {
    throw Error(`Unexpected status code: ${response.status}`);
  }

  const apiStatus = response.data.result.status;
  if (apiStatus !== 0) {
    throw Error(`Unexpected Access API status code: ${apiStatus}`);
  }

  const freshAccessToken = response.data.accessToken;
  localStorage.setItem("accessToken", freshAccessToken);

  return freshAccessToken;
}

const bonusClient = axios.create({
  baseURL: BonusClientBaseURL,
  timeout: 5000,
});

export interface BonusGeneralInfo {
  typeBonusName: string;
  currentQuantity: number;
  forBurningQuantity: number;
  dateBurning: string;
}

export async function fetchBonusGeneralInfo(
  accessToken: string
): Promise<BonusGeneralInfo> {
  const response = await bonusClient(
    `/api/v3/ibonus/generalinfo/${accessToken}`,
    {
      headers: {
        AccessKey,
      },
    }
  );

  if (response.status !== 200) {
    throw Error(`Unexpected status code: ${response.status}`);
  }

  const apiStatus = response.data.resultOperation.status;
  if (apiStatus !== 0) {
    throw Error(`Unexpected Access API status code: ${apiStatus}`);
  }

  return response.data.data;
}
