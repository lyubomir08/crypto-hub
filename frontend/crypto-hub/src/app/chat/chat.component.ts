import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from './websocket.service';
import { UserService } from '../user/user.service'; // Импортираме UserService
import { UserForAuth } from '../types/user';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule, CommonModule, DatePipe],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
    currentUser: UserForAuth | null = null;
    recipientId!: string; // ID на получателя (ще го вземем от URL)
    messages: any[] = []; // Списък със съобщения
    newMessage: string = ''; // Съобщението, което потребителят пише в момента

    constructor(
        private route: ActivatedRoute,
        private websocketService: WebSocketService,
        private userService: UserService // Добавяме UserService
    ) { }

    ngOnInit(): void {
        // Зареждаме текущия потребител
        this.userService.getProfile().subscribe({
            next: (user) => {
                this.currentUser = user;

                // След като текущият потребител е зареден, свързваме WebSocket
                this.websocketService.connect(this.currentUser?._id as any);
            },
            error: (err) => {
                console.error('Error loading current user:', err);
            },
        });

        // Вземаме ID на получателя от URL параметъра
        this.recipientId = this.route.snapshot.paramMap.get('recipientId') || '';

        // Регистрираме обработка на получени съобщения
        this.websocketService.onMessage((data) => {
            // Добавяме ново съобщение към списъка, ако е за текущия чат
            if (data.senderId === this.recipientId || data.recipientId === this.recipientId) {
                this.messages.push(data);
            }
        });
    }

    sendMessage(): void {
        if (!this.newMessage.trim() || !this.recipientId) {
          console.error('Recipient ID is missing or message is empty');
          return;
        }
      
        this.websocketService.sendMessage(
          this.currentUser?._id as any,
          this.recipientId, // Увери се, че този ID не е null или undefined
          this.newMessage
        );
      
        // Добавяме съобщението в UI
        this.messages.push({
          senderId: this.currentUser?._id as any,
          recipientId: this.recipientId,
          content: this.newMessage,
          timestamp: new Date(),
        });
      
        this.newMessage = ''; // Изчистване на текстовото поле
      }
      
}
