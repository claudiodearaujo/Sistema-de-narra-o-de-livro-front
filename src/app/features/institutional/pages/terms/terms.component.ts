import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';
import { StructuredDataService } from '../../../../core/services/structured-data.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent implements OnInit {
  private seoService = inject(SeoService);
  private structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.seoService.setInstitutionalPage(
      'Termos de Uso',
      'Leia os termos de uso da LIVRIA. Regras e condições para utilizar nossa plataforma de forma segura e respeitosa.'
    );

    this.structuredDataService.setBreadcrumbSchema([
      { name: 'Home', url: 'https://livria.com.br/' },
      { name: 'Termos de Uso', url: 'https://livria.com.br/institutional/terms' }
    ]);
  }

  lastUpdated = '02 de Janeiro de 2026';
}
