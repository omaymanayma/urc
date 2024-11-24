import { ErrorCallback,  RoomInfos} from "../model/common";
import {CustomError} from "../model/CustomError";

export function getAllRoom(id: number, onResult: (rooms: RoomInfos[]) => void, onError: ErrorCallback) {  
    const token = sessionStorage.getItem('token');
    if (!token) {
      return ('Token missing');
    }
      fetch("/api/roomlist",
        {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                Authentication: `Bearer ${token}`,
            },
        })
        .then(async (response) => {
            if (response.ok) {
                const roomFetched: RoomInfos[] = await response.json();
        
                // Filtrer la liste des utilisateurs pour exclure l'utilisateur actuel (id)
                const list = roomFetched;
              console.log("ha liste dyal rooms hihi", list);
                onResult(list);
              } else {
                const error = await response.json() as CustomError;
                onError(error);
                console.log("Status:", response.status);
      console.log("Error message:", await response.text());
              }
        }, onError);
}