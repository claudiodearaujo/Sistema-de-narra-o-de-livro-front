import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../core/models/character.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { CharacterFormComponent } from '../character-form/character-form.component';
import { VoicePreviewComponent } from '../voice-preview/voice-preview.component';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-character-list',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TagModule,
        ConfirmDialogModule,
        ToastModule,
        VoicePreviewComponent,
        SelectModule,
        FormsModule
    ],
    providers: [DialogService, MessageService, ConfirmationService],
    templateUrl: './character-list.component.html',
    styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnInit {
    @Input() bookId: string = '';
    selectedBookId: string | null = null;
    characters: Character[] = [];
    books: Book[] = [];
    ref: DynamicDialogRef<CharacterFormComponent> | undefined | null;

    constructor(
        private route: ActivatedRoute,
        private characterService: CharacterService,
        private bookService: BookService,
        private dialogService: DialogService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        // Se bookId não vier via @Input, tentar pegar da rota atual ou pai
        if (!this.bookId) {
            this.bookId = this.route.snapshot.paramMap.get('id') || '';
        }
        
        if (!this.bookId && this.route.parent) {
             this.bookId = this.route.parent.snapshot.paramMap.get('id') || '';
        }

        console.log('Final resolved bookId:', this.bookId);

        if (this.bookId) {
            this.selectedBookId = this.bookId;
            this.loadCharacters();
        } else {
            // Se não tem bookId na rota, carrega a lista de livros para o filtro
            // O próprio loadBooks se encarregará de selecionar o primeiro e carregar os personagens
            this.loadBooks();
        }
    }

    loadBooks() {
        this.bookService.getAll(1, 1000).subscribe({
            next: (response) => {
                this.books = response.data;
                // Se temos livros e nenhum livro foi pré-selecionado (via rota), seleciona o primeiro
                if (this.books.length > 0 && !this.bookId) {
                    this.selectedBookId = this.books[0].id;
                    this.bookId = this.selectedBookId;
                    this.loadCharacters();
                }
            },
            error: (error) => {
                console.error('Error loading books:', error);
            }
        });
    }

    onBookChange() {
        this.bookId = this.selectedBookId || '';
        this.loadCharacters();
    }

    loadCharacters() {
        if (this.bookId) {
            console.log('Loading characters for book:', this.bookId);
            this.characterService.getByBookId(this.bookId).subscribe({
                next: (data) => {
                    console.log('Characters loaded:', data);
                    console.log('First character voice data:', data[0]?.voice);
                    console.log('First character voiceId:', data[0]?.voiceId);
                    this.characters = data;
                },
                error: (error) => {
                    console.error('Error loading characters:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar personagens.' });
                }
            });
        } else {
            console.log('Loading all characters (global list)');
            this.characterService.getAll().subscribe({
                next: (data) => {
                    console.log('All characters loaded:', data);
                    console.log('First character voice data:', data[0]?.voice);
                    console.log('First character voiceId:', data[0]?.voiceId);
                    this.characters = data;
                },
                error: (error) => {
                    console.error('Error loading all characters:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar todos os personagens.' });
                }
            });
        }
    }

    getPercentageSeverity(percentage: number | undefined): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
        if (percentage === undefined) return 'secondary';
        if (percentage < 30) return 'danger';
        if (percentage < 70) return 'warn';
        return 'success';
    }

    openNew() {
        this.ref = this.dialogService.open(CharacterFormComponent, {
            header: 'Novo Personagem',
            width: '90%',
            style: { 'max-width': '1200px' },
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: { bookId: this.bookId }
        });

        if (this.ref) {
            this.ref.onClose.subscribe((character: Character) => {
                if (character) {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Personagem criado' });
                    this.loadCharacters();
                }
            });
        }
    }

    editCharacter(character: Character) {
        this.ref = this.dialogService.open(CharacterFormComponent, {
            header: 'Editar Personagem',
            width: '90%',
            style: { 'max-width': '1200px' },
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: { bookId: this.bookId, character: character }
        });

        if (this.ref) {
            this.ref.onClose.subscribe((updatedCharacter: Character) => {
                if (updatedCharacter) {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Personagem atualizado' });
                    this.loadCharacters();
                }
            });
        }
    }

    deleteCharacter(character: Character) {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja excluir ${character.name}?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.characterService.delete(character.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Personagem excluído' });
                        this.loadCharacters();
                    },
                    error: (error) => {
                        console.error('Error deleting character:', error);
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir personagem.' });
                    }
                });
            }
        });
    }
}
