import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';

interface Conversation {
  id: string;
  participant: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    isOnline: boolean;
  };
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: Date;
  };
  unreadCount: number;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonModule,
    AvatarModule,
    SkeletonModule,
    InputTextModule,
    BadgeModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  loading = signal(true);
  conversations = signal<Conversation[]>([]);
  searchQuery = signal('');
  totalUnread = signal(0);

  ngOnInit() {
    this.loadConversations();
  }

  async loadConversations() {
    this.loading.set(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participant: {
          id: '2',
          username: 'joao_leitor',
          displayName: 'João Santos',
          avatar: null,
          isOnline: true
        },
        lastMessage: {
          content: 'Obrigado pela recomendação do livro!',
          senderId: '2',
          createdAt: new Date(Date.now() - 300000)
        },
        unreadCount: 2
      },
      {
        id: '2',
        participant: {
          id: '3',
          username: 'ana_books',
          displayName: 'Ana Costa',
          avatar: null,
          isOnline: true
        },
        lastMessage: {
          content: 'Adorei o seu último capítulo!',
          senderId: '3',
          createdAt: new Date(Date.now() - 3600000)
        },
        unreadCount: 0
      },
      {
        id: '3',
        participant: {
          id: '4',
          username: 'pedro_fantasia',
          displayName: 'Pedro Lima',
          avatar: null,
          isOnline: false
        },
        lastMessage: {
          content: 'Vamos fazer uma collab?',
          senderId: '1',
          createdAt: new Date(Date.now() - 86400000)
        },
        unreadCount: 0
      },
      {
        id: '4',
        participant: {
          id: '5',
          username: 'carla_escritora',
          displayName: 'Carla Mendes',
          avatar: null,
          isOnline: false
        },
        lastMessage: {
          content: 'Claro, podemos conversar sobre isso!',
          senderId: '5',
          createdAt: new Date(Date.now() - 172800000)
        },
        unreadCount: 1
      }
    ];
    
    this.conversations.set(mockConversations);
    this.totalUnread.set(mockConversations.reduce((sum, c) => sum + c.unreadCount, 0));
    this.loading.set(false);
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('pt-BR');
  }

  filteredConversations(): Conversation[] {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      return this.conversations();
    }
    
    return this.conversations().filter(c => 
      c.participant.displayName.toLowerCase().includes(query) ||
      c.participant.username.toLowerCase().includes(query) ||
      c.lastMessage.content.toLowerCase().includes(query)
    );
  }

  truncateMessage(content: string, maxLength: number = 50): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}
