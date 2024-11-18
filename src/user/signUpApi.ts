import { ErrorCallback, Account } from "../model/common";
import { CustomError } from "../model/CustomError";

export function createUser(account: Account, onResult: (success: boolean) => void, onError: ErrorCallback) {
  fetch("/api/createaccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then(async (response) => {
      if (response.ok) {
        onResult(true);
      } else {
        const error = await response.json() as CustomError;
        onError(error);
        onResult(false);
      }
    })
    .catch((error) => {
      console.error("API call error:", error);
      onError(new CustomError("An error occurred while creating the account"));
      onResult(false);
    });
}
