import { ErrorCallback,  Message} from "../../model/common";
import {CustomError} from "../../model/CustomError";

export function addMessage(message : Message, onResult: (success: boolean) => void, onError: ErrorCallback) {  
    fetch("/api/ajouterMessages",
    {
        method: "POST", // ou 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
        .then(async (response) => { 
            if (response.ok) { 
                onResult(true);
            } else {
              const error = await response.json() as CustomError;
              onError(error);
              onResult(false); // Signalise l'échec de la création du message
            }
        }, onError);
}

export function sendNotif(message : Message, onResult: (success: boolean) => void, onError: ErrorCallback) { 

    fetch("/api/sendnotification",
    {
        method: "POST", // ou 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
        .then(async (response) => { 
            if (response.ok) { 
                onResult(true);
            } else {
              const error = await response.json() as CustomError;
              onError(error);
              onResult(false); // Signalise l'échec de la création du message
            }
        }, onError);

}

