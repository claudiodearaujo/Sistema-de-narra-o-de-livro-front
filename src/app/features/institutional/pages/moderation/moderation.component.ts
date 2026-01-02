import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moderation.component.html',
  styleUrl: './moderation.component.css'
})
export class ModerationComponent {
  reportReasons = [
    'Violação de direitos autorais',
    'Conteúdo ofensivo ou de ódio',
    'Assédio ou perseguição',
    'Conteúdo ilegal',
    'Spam ou conteúdo enganoso',
    'Informações pessoais expostas',
    'Outro motivo'
  ];
}
