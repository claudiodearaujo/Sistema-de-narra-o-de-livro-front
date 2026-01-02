import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {
  values = [
    {
      icon: 'pi-comments',
      title: 'Trocas Honestas',
      description: 'Opiniões sinceras e respeitosas que ajudam no crescimento.'
    },
    {
      icon: 'pi-heart',
      title: 'Apoio Mútuo',
      description: 'Criadores se apoiam mutuamente em suas jornadas.'
    },
    {
      icon: 'pi-book',
      title: 'Leitura Consciente',
      description: 'Valorizamos histórias diversas e pontos de vista únicos.'
    },
    {
      icon: 'pi-users',
      title: 'Inclusão',
      description: 'Um espaço para todos, independente de experiência.'
    }
  ];
}
