import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  likesCount: number;
  isLiked: boolean;
  createdAt: Date;
  replies: Comment[];
}

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  author: Author;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  comments: Comment[];
}

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonModule,
    AvatarModule,
    TextareaModule,
    SkeletonModule,
    MenuModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  loading = signal(true);
  post = signal<Post | null>(null);
  commentText = signal('');
  replyingTo = signal<string | null>(null);
  
  menuItems: MenuItem[] = [
    { label: 'Compartilhar', icon: 'pi pi-share-alt' },
    { label: 'Salvar', icon: 'pi pi-bookmark' },
    { label: 'Denunciar', icon: 'pi pi-flag' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const postId = params['id'];
      this.loadPost(postId);
    });
  }

  async loadPost(postId: string) {
    this.loading.set(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.post.set({
      id: postId,
      content: 'Acabei de terminar de ler "O Nome do Vento" e estou completamente apaixonada! A forma como Patrick Rothfuss constrói o universo e desenvolve o personagem de Kvothe é simplesmente magistral. Alguém mais aqui é fã da Crônica do Matador do Rei?',
      imageUrl: null,
      author: {
        id: '1',
        username: 'maria_escritora',
        displayName: 'Maria Silva',
        avatar: null
      },
      likesCount: 156,
      commentsCount: 23,
      sharesCount: 12,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 3600000),
      comments: [
        {
          id: '1',
          content: 'Também amo esse livro! O segundo volume é ainda melhor na minha opinião.',
          author: {
            id: '2',
            username: 'joao_leitor',
            displayName: 'João Santos',
            avatar: null
          },
          likesCount: 12,
          isLiked: false,
          createdAt: new Date(Date.now() - 1800000),
          replies: [
            {
              id: '1-1',
              content: 'Concordo! "O Temor do Sábio" é incrível.',
              author: {
                id: '3',
                username: 'ana_books',
                displayName: 'Ana Costa',
                avatar: null
              },
              likesCount: 5,
              isLiked: false,
              createdAt: new Date(Date.now() - 900000),
              replies: []
            }
          ]
        },
        {
          id: '2',
          content: 'Ainda estou esperando o terceiro livro... 😅',
          author: {
            id: '4',
            username: 'pedro_fantasia',
            displayName: 'Pedro Lima',
            avatar: null
          },
          likesCount: 45,
          isLiked: true,
          createdAt: new Date(Date.now() - 600000),
          replies: []
        }
      ]
    });
    
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

  toggleLike() {
    const p = this.post();
    if (p) {
      this.post.set({
        ...p,
        isLiked: !p.isLiked,
        likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1
      });
    }
  }

  toggleBookmark() {
    const p = this.post();
    if (p) {
      this.post.set({
        ...p,
        isBookmarked: !p.isBookmarked
      });
    }
  }

  toggleCommentLike(comment: Comment) {
    comment.isLiked = !comment.isLiked;
    comment.likesCount += comment.isLiked ? 1 : -1;
  }

  startReply(commentId: string) {
    this.replyingTo.set(commentId);
  }

  cancelReply() {
    this.replyingTo.set(null);
    this.commentText.set('');
  }

  submitComment() {
    if (!this.commentText().trim()) return;
    
    // TODO: Submit comment to API
    console.log('Submitting comment:', this.commentText(), 'replyingTo:', this.replyingTo());
    
    this.commentText.set('');
    this.replyingTo.set(null);
  }

  goBack() {
    history.back();
  }
}
