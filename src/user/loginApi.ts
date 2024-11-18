import {Session, SessionCallback, ErrorCallback, User} from "../model/common";
import {CustomError} from "../model/CustomError";

export function loginUser(user: User, onResult: SessionCallback, onError: ErrorCallback) {
    console.log("Données de connexion envoyées :", user); // Vérifiez les données envoyées
    
    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
    .then(async (response) => {
        console.log("Réponse du serveur :", response.status); // Voir le statut de la réponse
        
        if (response.ok) {
            const session = await response.json() as Session;
            console.log("Session reçue :", session); // Vérifiez les données de session
            sessionStorage.setItem('token', session.token);
            sessionStorage.setItem('externalId', session.externalId);
            sessionStorage.setItem('username', session.username || "");
            sessionStorage.setItem('id', (session.id || '').toString());
            onResult(session);
        } else {
            const error = await response.json() as CustomError;
            console.error("Erreur de connexion :", error); // Log l'erreur reçue du serveur
            onError(error);
        }
    })
    .catch((fetchError) => {
        console.error("Erreur de requête fetch :", fetchError); // Gérer les erreurs de fetch
        onError(new CustomError("Erreur réseau"));
    });
}
