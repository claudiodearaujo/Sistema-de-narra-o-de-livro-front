import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-writer-area',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './writer-area.component.html',
  styleUrl: './writer-area.component.css'
})
export class WriterAreaComponent {
  features = [
    {
      icon: 'pi-pencil',
      title: 'Publicar textos e histórias',
      description: 'Compartilhe suas criações com uma comunidade engajada de leitores.'
    },
    {
      icon: 'pi-comments',
      title: 'Receber feedback da comunidade',
      description: 'Obtenha opiniões construtivas e melhore sua escrita.'
    },
    {
      icon: 'pi-users',
      title: 'Participar de grupos de divulgação',
      description: 'Conecte-se com outros autores e amplie seu alcance.'
    },
    {
      icon: 'pi-microphone',
      title: 'Ferramentas de áudio e imagem',
      description: 'Transforme suas histórias em experiências imersivas.'
    },
    {
      icon: 'pi-book',
      title: 'Apoio para publicação editorial',
      description: 'Receba orientação para publicar seu livro.'
    }
  ];
}
