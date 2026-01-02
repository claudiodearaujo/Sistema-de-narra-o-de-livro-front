import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.css'
})
export class CareersComponent {
  values = [
    { icon: 'pi-book', title: 'Paixão por Literatura' },
    { icon: 'pi-code', title: 'Inovação Tecnológica' },
    { icon: 'pi-palette', title: 'Criatividade' },
    { icon: 'pi-heart', title: 'Empatia' }
  ];
  
  areas = [
    {
      title: 'Engenharia',
      description: 'Desenvolvedores, DevOps, QA',
      icon: 'pi-cog'
    },
    {
      title: 'Produto',
      description: 'Product Managers, UX/UI Designers',
      icon: 'pi-box'
    },
    {
      title: 'Conteúdo',
      description: 'Editores, Curadores, Community Managers',
      icon: 'pi-file-edit'
    },
    {
      title: 'Marketing',
      description: 'Growth, Social Media, Parcerias',
      icon: 'pi-megaphone'
    }
  ];
}
