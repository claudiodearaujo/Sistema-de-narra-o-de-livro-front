import { Component, signal, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';

/**
 * Conversation Component
 * 
 * Direct message conversation between two users.
 */
@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    AvatarModule,
    InputTextModule
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  loading = signal(true);
  otherUser = signal<any>(null);
  messages = signal<any[]>([]);
  newMessage = '';
  
  private shouldScroll = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];
    this.loadConversation(userId);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private loadConversation(userId: string): void {
    setTimeout(() => {
      this.otherUser.set({
        id: userId,
        name: 'Maria Silva',
        username: 'mariasilva',
        initials: 'MS',
        isOnline: true
      });

      this.messages.set([
        { id: '1', senderId: userId, content: 'Oi! Vi que você começou um novo livro.', time: '10:30', isMe: false },
        { id: '2', senderId: 'me', content: 'Oi Maria! Sim, estou trabalhando em um suspense.', time: '10:32', isMe: true },
        { id: '3', senderId: userId, content: 'Que legal! Eu adoro suspense. Posso ler os primeiros capítulos?', time: '10:33', isMe: false },
        { id: '4', senderId: 'me', content: 'Claro! Vou te enviar o link assim que publicar.', time: '10:35', isMe: true },
        { id: '5', senderId: userId, content: 'Perfeito! Mal posso esperar 📚', time: '10:36', isMe: false },
      ]);

      this.loading.set(false);
      this.shouldScroll = true;
    }, 500);
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      senderId: 'me',
      content: this.newMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    this.messages.update(msgs => [...msgs, newMsg]);
    this.newMessage = '';
    this.shouldScroll = true;
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  goBack(): void {
    this.router.navigate(['/social/messages']);
  }

  goToProfile(): void {
    this.router.navigate(['/social/profile', this.otherUser()?.username]);
  }
}
