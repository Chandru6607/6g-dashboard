// Custom Hook for WebSocket Events

import { useEffect, useState } from 'react';
import socketService from '../services/socketService';

export const useSocket = (event, initialValue = null) => {
    const [data, setData] = useState(initialValue);

    useEffect(() => {
        const handleData = (newData) => {
            setData(newData);
        };

        socketService.on(event, handleData);

        return () => {
            socketService.off(event, handleData);
        };
    }, [event]);

    return data;
};

export const useSocketEmit = () => {
    return (event, data) => {
        socketService.emit(event, data);
    };
};
