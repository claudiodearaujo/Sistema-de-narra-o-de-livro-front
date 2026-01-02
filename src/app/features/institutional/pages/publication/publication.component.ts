import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.css'
})
export class PublicationComponent {
  monetizationMethods = [
    {
      icon: 'pi-heart',
      title: 'Apoio dos Leitores',
      description: 'Receba apoio financeiro diretamente dos seus fãs através de Livras.'
    },
    {
      icon: 'pi-lock',
      title: 'Conteúdo Premium',
      description: 'Ofereça capítulos exclusivos para assinantes.'
    },
    {
      icon: 'pi-book',
      title: 'Vendas Diretas',
      description: 'Venda suas obras completas na plataforma.'
    },
    {
      icon: 'pi-building',
      title: 'Parcerias Editoriais',
      description: 'Conecte-se com editoras parceiras para publicação.'
    }
  ];
}
