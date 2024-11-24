import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfosSelector } from '../../features/loginSlice';
import { CustomError } from '../../model/CustomError';
import { Message } from '../../model/common';
import { addMessage } from './ajouterMessageApi';
import { Grid, TextField, IconButton, Paper, Alert } from '@mui/material';
import { setnewMSG } from '../../features/messageSlice';
import { AppDispatch } from '../../app/store';
import SendIcon from '@mui/icons-material/Send';

const AddMessage: React.FC<{ receiverId: number, receiverType: 'user' | 'group' | null }> = ({ receiverId, receiverType }) => {
    const dispatch = useDispatch<AppDispatch>();
    const userInfos = useSelector(userInfosSelector);
    const [messageSent, setMessageSent] = useState('');
    const [error, setError] = useState({} as CustomError);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // State pour l'URL de l'image téléchargée
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Référence pour l'input de fichier

    // Fonction de gestion de l'input texte
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageSent(e.target.value);
    };

    // Fonction de gestion du fichier image
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Appel à l'API pour télécharger l'image
            const formData = new FormData();
            formData.append('file', file);
            const contentType = 'multipart/form-data';
            const arrayBuffer = await file.arrayBuffer(); // Convertir le fichier en ArrayBuffer
            fetch(`/api/image?filename=${encodeURIComponent(file.name)}&contentType=multipart/form-data`, { // Remplacez '/api/uploadImage' par l'URL de votre API de téléchargement
                method: 'POST',
                body: arrayBuffer,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data?.url) {
                        setImageUrl(data.url); // Stocke l'URL de l'image renvoyée par l'API
                    }
                })
                .catch((error) => {
                    console.error('Erreur lors de l\'upload de l\'image:', error);
                });
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (receiverId !== -1) {
            const message: Message = {
                senderId: userInfos.userId,
                receiverId: receiverId,
                messageContent: messageSent,
                senderName: userInfos.username,
                receiverType: receiverType,
                imageUrl: imageUrl,
            };
            addMessage(
                message,
                (result: boolean) => {
                    if (result === true) {
                        dispatch(setnewMSG());
                        setMessageSent('');
                        setImageUrl(undefined); // Réinitialise l'image après l'envoi
                        setError(new CustomError(''));
                    } else {
                        console.error('La création de message a échoué.');
                    }
                },
                (messageError: CustomError) => {
                    console.log(messageError);
                    setError(messageError);
                }
            );
        }
    };

    return (
        <Paper elevation={6} sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Grid container alignItems="center">
                <Grid item xs={10} sx={{ paddingRight: 2 }}>
                    <TextField
                        name="messageSent"
                        label="Message"
                        placeholder="Saisissez votre message"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={messageSent}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                        multiline
                        maxRows={2}
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <IconButton
                        type="submit"
                        color="primary"
                        aria-label="send"
                        onClick={handleSubmit}
                        sx={{ backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#333' } }}
                    >
                        <SendIcon />
                    </IconButton>
                </Grid>

                {/* Ajouter un bouton pour télécharger l'image */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileUpload"
                        ref={fileInputRef}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-black text-white rounded-lg px-4 py-2 ml-2 w-[10%]"
                    >
                        Upload Image
                    </button>
                </Grid>

                {error.message && (
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Alert severity="error">{error.message}</Alert>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default AddMessage;
