import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { userInfosSelector } from '../../features/loginSlice';
import { CustomError } from '../../model/CustomError';
import { MessageInfos, Message } from '../../model/common';
import { getMessage } from './getMessagesApi';
import { newMSGSelector } from '../../features/messageSlice';
import { formatTimestamp } from '../../model/common';
import {
  Box,
  List,
  ListItem,
  Typography,
  Paper,
  Alert,
  Avatar
} from '@mui/material';

const MessageList: React.FC<{ receiverId: number, receiverName: string, receiverType: 'user' | 'group' | null }> = ({ receiverId, receiverName,receiverType }) => {
  const newMSGcounter = useSelector(newMSGSelector);
  const userInfos = useSelector(userInfosSelector);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [error, setError] = useState({} as CustomError);
  const [messageRecus, setMessageRecus] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = () => {
      const messageInfosEnvoyes = { senderId: userInfos.userId, receiverId,receiverType } as MessageInfos;
      const messageInfosRecus = { senderId: receiverId, receiverId: userInfos.userId, receiverType } as MessageInfos;

      getMessage(
        messageInfosEnvoyes,
        (resultEnvoyes: Message[]) => {
          setError(new CustomError(""));
          setMessageList(resultEnvoyes);
        },
        (loginError: CustomError) => {
          setError(loginError);
        }
      );

      getMessage(
        messageInfosRecus,
        (resultRecus: Message[]) => {
          setError(new CustomError(""));
          setMessageRecus(resultRecus);
        },
        (loginError: CustomError) => {
          setError(loginError);
        }
      );
    };

    fetchMessages();

    // Ajoutez un écouteur pour les notifications push
    const sw = navigator.serviceWorker;
    if (sw != null) {
      sw.onmessage = (event) => {
        console.log("Got event from sw: " + JSON.stringify(event.data));
        fetchMessages(); // Actualiser les messages affichés
      };
    }
  }, [userInfos.userId, receiverId, newMSGcounter]);

  const combinedMessages = [...messageList, ...messageRecus].sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return 0;
  });

  useEffect(() => {
    if (scrollRef.current && combinedMessages.length > 0) {
      const lastMessage = scrollRef.current.lastChild as HTMLDivElement;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    }
  }, [combinedMessages]);
  console.log("ha les mess", combinedMessages)

  return (
    <Paper elevation={6} sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" component="div" textAlign="center" sx={{ color: '#f1226a', mb: 2 }}>
        Conversation avec {receiverName}
      </Typography>
      <Box width="100%" bgcolor="#f0f0f0" p={2} sx={{ overflowY: 'auto', maxHeight: '70vh' }} ref={scrollRef}>
        {combinedMessages.length > 0 ? (
          <List>
            {combinedMessages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  marginBottom: '8px',
                  display: 'flex',
                  flexDirection: message.senderId === userInfos.userId ? 'row-reverse' : 'row',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ bgcolor: message.senderId === userInfos.userId ? '#000' : '#f1226a', marginRight: message.senderId === userInfos.userId ? 0 : 2, marginLeft: message.senderId === userInfos.userId ? 2 : 0 }}>
                  {message.senderName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{
                  display: 'inline-block',
                  maxWidth: '75%',
                  backgroundColor: message.senderId === userInfos.userId ? '#e0e0e0' : '#f1226a',
                  borderRadius: '15px',
                  padding: '10px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  color: message.senderId === userInfos.userId ? '#000' : '#fff',
                }}>
                  <Typography variant="body2" sx={{ marginBottom: '4px', fontWeight: 'bold' }}>
                    {message.senderName}
                  </Typography>
                  <Typography variant="body1">{message.messageContent}</Typography>
                  {message.timestamp && (
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" textAlign="center">Pas de Messages</Typography>
        )}
        {error.message && <Alert severity="error" sx={{ mt: 2 }}>{error.message}</Alert>}
      </Box>
    </Paper>
  );
};

export default MessageList;
