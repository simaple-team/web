import { getSDK } from "@simaple/sdk";

export const sdk = getSDK({ baseUrl: "http://localhost:8000", fetchFn: fetch });
