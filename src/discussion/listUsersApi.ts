import { ErrorCallback,  UserInfos} from "../model/common";
import {CustomError} from "../model/CustomError";

export function getAllUser(id: number, onResult: (users: UserInfos[]) => void, onError: ErrorCallback) {  
      fetch("/api/userlist",
        {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(async (response) => {
            if (response.ok) {
                const userFetched: UserInfos[] = await response.json();
        
                // Filtrer la liste des utilisateurs pour exclure l'utilisateur actuel (id)
                const list = userFetched.filter((user) => user.userId !== id);
              
                onResult(list);
              } else {
                const error = await response.json() as CustomError;
                onError(error);
                console.log("Status:", response.status);
      console.log("Error message:", await response.text());
              }
        }, onError);
}