import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private socket!: WebSocket;

    // Свързване към WebSocket сървъра
    connect(userId: string): void {
        this.socket = new WebSocket('ws://localhost:5000');

        this.socket.onopen = () => {
            console.log('WebSocket connected');
            // Изпращаме ID на потребителя, за да го регистрираме на сървъра
            this.socket.send(JSON.stringify({ type: 'INIT', userId }));
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
        };
    }

    // Изпращане на съобщение
    sendMessage(senderId: string, recipientId: string, content: string): void {
        const message = {
            type: 'MESSAGE',
            senderId,
            recipientId,
            content,
        };
        this.socket.send(JSON.stringify(message));
    }

    // Обработване на получени съобщения
    onMessage(callback: (data: any) => void): void {
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            callback(data);
        };
    }
}
