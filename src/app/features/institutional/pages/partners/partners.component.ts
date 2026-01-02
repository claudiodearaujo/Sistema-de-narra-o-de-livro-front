import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.css'
})
export class PartnersComponent {
  benefits = [
    'Orientação para publicação',
    'Revisão e preparação de originais',
    'Conexão com editoras parceiras',
    'Apoio em campanhas de divulgação',
    'Respeito à decisão final do autor'
  ];
}
