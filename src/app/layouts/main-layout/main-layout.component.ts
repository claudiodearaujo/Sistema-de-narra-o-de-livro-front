import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../core/auth/services/auth.service';

/**
 * Main layout for authenticated areas of the application.
 * Contains navigation menu, user avatar dropdown, and footer.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MenubarModule,
    AvatarModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  
  currentUser = computed(() => this.authService.currentUser());

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.initMenuItems();
    this.initUserMenuItems();
  }

  private initMenuItems(): void {
    this.menuItems = [
      {
        label: 'Área do Escritor',
        icon: 'pi pi-pencil',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => this.router.navigate(['/writer'])
          },
          {
            label: 'Meus Livros',
            icon: 'pi pi-book',
            command: () => this.router.navigate(['/writer/books'])
          },
          {
            label: 'Personagens',
            icon: 'pi pi-users',
            command: () => this.router.navigate(['/writer/characters'])
          },
          {
            label: 'Vozes',
            icon: 'pi pi-volume-up',
            command: () => this.router.navigate(['/writer/voices'])
          }
        ]
      },
      {
        label: 'Rede Social',
        icon: 'pi pi-globe',
        disabled: true, // Future module
        items: [
          {
            label: 'Feed',
            icon: 'pi pi-th-large',
            disabled: true
          },
          {
            label: 'Explorar',
            icon: 'pi pi-search',
            disabled: true
          },
          {
            label: 'Mensagens',
            icon: 'pi pi-envelope',
            disabled: true
          }
        ]
      }
    ];
  }

  private initUserMenuItems(): void {
    this.userMenuItems = [
      {
        label: 'Meu Perfil',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/auth/profile'])
      },
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/settings'])
      },
      {
        separator: true
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user?.name) return '?';
    
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
