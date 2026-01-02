import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content-guidelines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './content-guidelines.component.html',
  styleUrl: './content-guidelines.component.css'
})
export class ContentGuidelinesComponent {
  lastUpdated = '02 de Janeiro de 2026';
  
  allowed = [
    'Ficção de todos os gêneros',
    'Poesia e prosa',
    'Biografias e memórias',
    'Textos informativos e educacionais',
    'Roteiros e dramaturgia',
    'Textos opinativos (respeitosos)',
    'Fanfics (respeitando direitos)'
  ];
  
  notAllowed = [
    'Pornografia envolvendo menores',
    'Incitação ao ódio ou violência',
    'Conteúdo difamatório ou calunioso',
    'Plágio ou violação de direitos autorais',
    'Promoção de atividades ilegais',
    'Spam ou conteúdo enganoso',
    'Informações pessoais de terceiros'
  ];
}
