import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-code-conduct',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './code-conduct.component.html',
  styleUrl: './code-conduct.component.css'
})
export class CodeConductComponent {
  lastUpdated = '02 de Janeiro de 2026';
  
  prohibited = [
    { icon: 'pi-ban', text: 'Discurso de ódio' },
    { icon: 'pi-exclamation-triangle', text: 'Assédio ou perseguição' },
    { icon: 'pi-times-circle', text: 'Conteúdo ilegal' },
    { icon: 'pi-copy', text: 'Plágio ou falsidade autoral' }
  ];
}
