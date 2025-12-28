import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CharacterService } from '../../../core/services/character.service';
import { VoiceService } from '../../../core/services/voice.service';
import { BookService } from '../../../services/book.service';
import { Voice } from '../../../core/models/voice.model';
import { Character } from '../../../core/models/character.model';
import { Book } from '../../../models/book.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { VoicePreviewComponent } from '../voice-preview/voice-preview.component';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-character-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        TabViewModule,
        ProgressBarModule,
        InputNumberModule,
        VoicePreviewComponent
    ],
    providers: [MessageService],
    templateUrl: './character-form.component.html',
    styleUrl: './character-form.component.css'
})
export class CharacterFormComponent implements OnInit {
    form: FormGroup;
    voices: Voice[] = [];
    books: Book[] = [];
    bookId: string = '';
    isEditMode = false;
    characterId: string = '';
    loading = false;
    completionPercentage = 0;

    constructor(
        private fb: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private characterService: CharacterService,
        private voiceService: VoiceService,
        private bookService: BookService,
        private messageService: MessageService
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            bookId: ['', Validators.required],
            voiceId: ['', Validators.required],
            voiceDescription: [''],
            identity: this.fb.group({
                gender: [''],
                age: [null],
                nationality: ['']
            }),
            physique: this.fb.group({
                height: [''],
                bodyType: [''],
                waist: [''],
                posture: ['']
            }),
            face: this.fb.group({
                faceShape: [''],
                forehead: [''],
                cheeks: [''],
                chin: [''],
                nose: [''],
                lips: [''],
                expression: [''],
                skinTone: ['']
            }),
            eyes: this.fb.group({
                size: [''],
                shape: [''],
                color: [''],
                eyelashes: [''],
                makeup: [''],
                eyebrows: ['']
            }),
            hair: this.fb.group({
                cut: [''],
                length: [''],
                parting: [''],
                texture: [''],
                color: [''],
                finishing: ['']
            }),
            wardrobe: this.fb.group({
                dressBrand: [''],
                dressModel: [''],
                dressColor: [''],
                dressFabric: [''],
                dressFit: [''],
                dressLength: [''],
                dressNeckline: [''],
                dressDetails: [''],
                shoeBrand: [''],
                shoeModel: [''],
                shoeColor: [''],
                shoeHeel: [''],
                shoeToe: [''],
                shoeStyle: [''],
                earrings: [''],
                ring: [''],
                necklace: [''],
                bracelet: [''],
                nails: ['']
            })
        });

        // Observar mudanças no formulário para atualizar o percentual
        this.form.valueChanges.subscribe(() => {
            this.calculateCompletionPercentage();
        });
    }

    ngOnInit(): void {
        this.bookId = this.config.data?.bookId;
        const character = this.config.data?.character as Character;

        this.loadVoices();
        this.loadBooks();

        if (character) {
            this.isEditMode = true;
            this.characterId = character.id;
            this.form.patchValue({
                name: character.name,
                bookId: character.bookId,
                voiceId: character.voiceId,
                voiceDescription: character.voiceDescription,
                identity: character.identity || {},
                physique: character.physique || {},
                face: character.face || {},
                eyes: character.eyes || {},
                hair: character.hair || {},
                wardrobe: character.wardrobe || {}
            });
            this.completionPercentage = character.completionPercentage || 0;
        } else if (this.bookId) {
            // Se foi passado um bookId via config, pré-seleciona
            this.form.patchValue({ bookId: this.bookId });
        }

        this.calculateCompletionPercentage();
    }

    calculateCompletionPercentage(): void {
        let totalFields = 0;
        let filledFields = 0;

        // Campos básicos (5 campos, sendo 3 obrigatórios)
        totalFields += 5;
        const formValue = this.form.value;
        if (formValue.name) filledFields++;
        if (formValue.voiceId) filledFields++;
        if (formValue.bookId) filledFields++;
        if (formValue.voiceDescription) filledFields++;

        // Identidade (3 campos)
        if (formValue.identity) {
            totalFields += 3;
            if (formValue.identity.gender) filledFields++;
            if (formValue.identity.age) filledFields++;
            if (formValue.identity.nationality) filledFields++;
        }

        // Físico (4 campos)
        if (formValue.physique) {
            totalFields += 4;
            if (formValue.physique.height) filledFields++;
            if (formValue.physique.bodyType) filledFields++;
            if (formValue.physique.waist) filledFields++;
            if (formValue.physique.posture) filledFields++;
        }

        // Rosto (8 campos)
        if (formValue.face) {
            totalFields += 8;
            if (formValue.face.faceShape) filledFields++;
            if (formValue.face.forehead) filledFields++;
            if (formValue.face.cheeks) filledFields++;
            if (formValue.face.chin) filledFields++;
            if (formValue.face.nose) filledFields++;
            if (formValue.face.lips) filledFields++;
            if (formValue.face.expression) filledFields++;
            if (formValue.face.skinTone) filledFields++;
        }

        // Olhos (6 campos)
        if (formValue.eyes) {
            totalFields += 6;
            if (formValue.eyes.size) filledFields++;
            if (formValue.eyes.shape) filledFields++;
            if (formValue.eyes.color) filledFields++;
            if (formValue.eyes.eyelashes) filledFields++;
            if (formValue.eyes.makeup) filledFields++;
            if (formValue.eyes.eyebrows) filledFields++;
        }

        // Cabelo (6 campos)
        if (formValue.hair) {
            totalFields += 6;
            if (formValue.hair.cut) filledFields++;
            if (formValue.hair.length) filledFields++;
            if (formValue.hair.parting) filledFields++;
            if (formValue.hair.texture) filledFields++;
            if (formValue.hair.color) filledFields++;
            if (formValue.hair.finishing) filledFields++;
        }

        // Vestuário (19 campos)
        if (formValue.wardrobe) {
            totalFields += 19;
            if (formValue.wardrobe.dressBrand) filledFields++;
            if (formValue.wardrobe.dressModel) filledFields++;
            if (formValue.wardrobe.dressColor) filledFields++;
            if (formValue.wardrobe.dressFabric) filledFields++;
            if (formValue.wardrobe.dressFit) filledFields++;
            if (formValue.wardrobe.dressLength) filledFields++;
            if (formValue.wardrobe.dressNeckline) filledFields++;
            if (formValue.wardrobe.dressDetails) filledFields++;
            if (formValue.wardrobe.shoeBrand) filledFields++;
            if (formValue.wardrobe.shoeModel) filledFields++;
            if (formValue.wardrobe.shoeColor) filledFields++;
            if (formValue.wardrobe.shoeHeel) filledFields++;
            if (formValue.wardrobe.shoeToe) filledFields++;
            if (formValue.wardrobe.shoeStyle) filledFields++;
            if (formValue.wardrobe.earrings) filledFields++;
            if (formValue.wardrobe.ring) filledFields++;
            if (formValue.wardrobe.necklace) filledFields++;
            if (formValue.wardrobe.bracelet) filledFields++;
            if (formValue.wardrobe.nails) filledFields++;
        }

        this.completionPercentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    }

    getPercentageColor(): string {
        if (this.completionPercentage < 30) return 'danger';
        if (this.completionPercentage < 70) return 'warn';
        return 'success';
    }

    loadVoices() {
        this.voiceService.listVoices().subscribe({
            next: (data) => {
                this.voices = data;
            },
            error: (error) => {
                console.error('Error loading voices:', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar vozes.' });
            }
        });
    }

    loadBooks() {
        this.bookService.getAll(1, 1000).subscribe({
            next: (response) => {
                this.books = response.data;
            },
            error: (error) => {
                console.error('Error loading books:', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar livros.' });
            }
        });
    }

    save() {
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const formValue = this.form.value;

        if (this.isEditMode) {
            this.characterService.update(this.characterId, formValue).subscribe({
                next: (updatedCharacter) => {
                    this.loading = false;
                    this.ref.close(updatedCharacter);
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Error updating character:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar personagem.' });
                }
            });
        } else {
            const selectedBookId = formValue.bookId || this.bookId;
            this.characterService.create(selectedBookId, formValue).subscribe({
                next: (newCharacter) => {
                    this.loading = false;
                    this.ref.close(newCharacter);
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Error creating character:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar personagem.' });
                }
            });
        }
    }

    cancel() {
        this.ref.close();
    }
}
