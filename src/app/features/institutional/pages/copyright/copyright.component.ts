import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-copyright',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './copyright.component.html',
  styleUrl: './copyright.component.css'
})
export class CopyrightComponent {
  lastUpdated = '02 de Janeiro de 2026';
}
