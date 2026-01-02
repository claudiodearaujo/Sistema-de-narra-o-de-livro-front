import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent {
  lastUpdated = '02 de Janeiro de 2026';
  
  securityMeasures = [
    {
      icon: 'pi-lock',
      title: 'Criptografia',
      description: 'Todos os dados sensíveis são criptografados em trânsito e em repouso.'
    },
    {
      icon: 'pi-server',
      title: 'Infraestrutura Segura',
      description: 'Servidores protegidos com firewalls e monitoramento 24/7.'
    },
    {
      icon: 'pi-key',
      title: 'Autenticação Forte',
      description: 'Suporte a autenticação de dois fatores para proteção adicional.'
    },
    {
      icon: 'pi-sync',
      title: 'Backups Regulares',
      description: 'Backups automáticos para garantir a recuperação de dados.'
    }
  ];
}
