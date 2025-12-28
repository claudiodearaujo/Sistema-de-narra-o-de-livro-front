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
import { VoicePreviewComponent } from '../voice-preview/voice-preview.component';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

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
        VoicePreviewComponent,
        TabsModule,
        ProgressBarModule,
        InputNumberModule,
        TooltipModule
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

    // Opções para selects
    genderOptions = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' },
        { label: 'Outro', value: 'Outro' }
    ];

    bodyTypeOptions = [
        { label: 'Magra', value: 'Magra' },
        { label: 'Atlética', value: 'Atlética' },
        { label: 'Média', value: 'Média' },
        { label: 'Robusta', value: 'Robusta' },
        { label: 'Musculosa', value: 'Musculosa' }
    ];

    postureOptions = [
        { label: 'Erguida/Elegante', value: 'Erguida, elegante' },
        { label: 'Relaxada', value: 'Relaxada' },
        { label: 'Curvada', value: 'Curvada' },
        { label: 'Rígida', value: 'Rígida' }
    ];

    faceShapeOptions = [
        { label: 'Oval', value: 'Oval' },
        { label: 'Redondo', value: 'Redondo' },
        { label: 'Quadrado', value: 'Quadrado' },
        { label: 'Retangular', value: 'Retangular' },
        { label: 'Coração', value: 'Coração' },
        { label: 'Diamante', value: 'Diamante' }
    ];

    eyeColorOptions = [
        { label: 'Castanho', value: 'Castanho' },
        { label: 'Verde', value: 'Verde' },
        { label: 'Azul', value: 'Azul' },
        { label: 'Mel', value: 'Mel' },
        { label: 'Cinza', value: 'Cinza' },
        { label: 'Preto', value: 'Preto' }
    ];

    eyeShapeOptions = [
        { label: 'Amendoado', value: 'Amendoado' },
        { label: 'Redondo', value: 'Redondo' },
        { label: 'Caído', value: 'Caído' },
        { label: 'Rasgado', value: 'Rasgado' },
        { label: 'Saltado', value: 'Saltado' }
    ];

    hairColorOptions = [
        { label: 'Preto', value: 'Preto' },
        { label: 'Castanho Escuro', value: 'Castanho Escuro' },
        { label: 'Castanho Claro', value: 'Castanho Claro' },
        { label: 'Loiro', value: 'Loiro' },
        { label: 'Ruivo', value: 'Ruivo' },
        { label: 'Grisalho', value: 'Grisalho' },
        { label: 'Branco', value: 'Branco' }
    ];

    hairTextureOptions = [
        { label: 'Liso', value: 'Liso' },
        { label: 'Ondulado', value: 'Ondulado' },
        { label: 'Cacheado', value: 'Cacheado' },
        { label: 'Crespo', value: 'Crespo' }
    ];

    hairLengthOptions = [
        { label: 'Careca', value: 'Careca' },
        { label: 'Muito Curto', value: 'Muito Curto' },
        { label: 'Curto', value: 'Curto' },
        { label: 'Médio', value: 'Médio' },
        { label: 'Longo', value: 'Longo' },
        { label: 'Muito Longo', value: 'Muito Longo' }
    ];

    clothingStyleOptions = [
        { label: 'Casual', value: 'Casual' },
        { label: 'Formal', value: 'Formal' },
        { label: 'Esportivo', value: 'Esportivo' },
        { label: 'Elegante', value: 'Elegante' },
        { label: 'Boho', value: 'Boho' },
        { label: 'Streetwear', value: 'Streetwear' },
        { label: 'Clássico', value: 'Clássico' }
    ];

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
            // Campos básicos obrigatórios
            name: ['', [Validators.required, Validators.minLength(2)]],
            bookId: ['', Validators.required],
            voiceId: ['', Validators.required],
            voiceDescription: [''],
            
            // Identidade
            identity: this.fb.group({
                gender: [''],
                age: [null],
                nationality: [''],
                occupation: [''],
                birthDate: [''],
                birthPlace: [''],
                personality: [''],
                background: ['']
            }),
            
            // Físico
            physique: this.fb.group({
                height: [''],
                weight: [''],
                bodyType: [''],
                waist: [''],
                posture: [''],
                skinTone: [''],
                skinTexture: [''],
                scars: [''],
                tattoos: [''],
                birthmarks: ['']
            }),
            
            // Rosto
            face: this.fb.group({
                faceShape: [''],
                forehead: [''],
                cheekbones: [''],
                chin: [''],
                jaw: [''],
                nose: [''],
                lips: [''],
                expression: [''],
                beard: [''],
                mustache: [''],
                wrinkles: [''],
                dimples: [''],
                freckles: ['']
            }),
            
            // Olhos
            eyes: this.fb.group({
                eyeSize: [''],
                eyeShape: [''],
                eyeColor: [''],
                eyeSpacing: [''],
                eyelashes: [''],
                eyebrowShape: [''],
                eyebrowColor: [''],
                eyebrowThickness: [''],
                glasses: [''],
                makeup: ['']
            }),
            
            // Cabelo
            hair: this.fb.group({
                haircut: [''],
                hairLength: [''],
                hairColor: [''],
                hairTexture: [''],
                hairVolume: [''],
                hairStyle: [''],
                hairPart: [''],
                hairShine: [''],
                dyedColor: [''],
                highlights: ['']
            }),
            
            // Vestuário
            wardrobe: this.fb.group({
                clothingStyle: [''],
                topwear: [''],
                topwearColor: [''],
                topwearBrand: [''],
                bottomwear: [''],
                bottomwearColor: [''],
                bottomwearBrand: [''],
                dress: [''],
                dressColor: [''],
                dressBrand: [''],
                footwear: [''],
                footwearColor: [''],
                footwearBrand: [''],
                heelHeight: [''],
                earrings: [''],
                necklace: [''],
                rings: [''],
                bracelets: [''],
                watch: [''],
                bag: [''],
                hat: [''],
                scarf: [''],
                nails: [''],
                perfume: ['']
            })
        });

        // Calcular percentual quando o form mudar
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
            this.patchCharacterForm(character);
        } else if (this.bookId) {
            this.form.patchValue({ bookId: this.bookId });
        }
    }

    patchCharacterForm(character: Character) {
        this.form.patchValue({
            name: character.name,
            bookId: character.bookId,
            voiceId: character.voiceId,
            voiceDescription: character.voiceDescription
        });

        if (character.identity) {
            this.form.get('identity')?.patchValue(character.identity);
        }
        if (character.physique) {
            this.form.get('physique')?.patchValue(character.physique);
        }
        if (character.face) {
            this.form.get('face')?.patchValue(character.face);
        }
        if (character.eyes) {
            this.form.get('eyes')?.patchValue(character.eyes);
        }
        if (character.hair) {
            this.form.get('hair')?.patchValue(character.hair);
        }
        if (character.wardrobe) {
            this.form.get('wardrobe')?.patchValue(character.wardrobe);
        }

        this.completionPercentage = character.completionPercentage || 0;
    }

    calculateCompletionPercentage() {
        const fieldCounts = {
            identity: 8,
            physique: 10,
            face: 13,
            eyes: 10,
            hair: 10,
            wardrobe: 24
        };

        let filledCount = 0;
        const totalFields = Object.values(fieldCounts).reduce((a, b) => a + b, 0);

        ['identity', 'physique', 'face', 'eyes', 'hair', 'wardrobe'].forEach(section => {
            const group = this.form.get(section) as FormGroup;
            if (group) {
                Object.keys(group.controls).forEach(key => {
                    const value = group.get(key)?.value;
                    if (value !== null && value !== undefined && value !== '') {
                        filledCount++;
                    }
                });
            }
        });

        this.completionPercentage = Math.round((filledCount / totalFields) * 100);
    }

    getProgressBarColor(): string {
        if (this.completionPercentage < 30) return 'bg-red-500';
        if (this.completionPercentage < 70) return 'bg-yellow-500';
        return 'bg-green-500';
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

    prepareFormData() {
        const formValue = this.form.value;
        
        // Remover campos vazios dos grupos aninhados
        const cleanGroup = (group: any) => {
            if (!group) return undefined;
            const cleaned: any = {};
            let hasValue = false;
            Object.keys(group).forEach(key => {
                if (group[key] !== null && group[key] !== undefined && group[key] !== '') {
                    cleaned[key] = group[key];
                    hasValue = true;
                }
            });
            return hasValue ? cleaned : undefined;
        };

        return {
            name: formValue.name,
            bookId: formValue.bookId,
            voiceId: formValue.voiceId,
            voiceDescription: formValue.voiceDescription,
            identity: cleanGroup(formValue.identity),
            physique: cleanGroup(formValue.physique),
            face: cleanGroup(formValue.face),
            eyes: cleanGroup(formValue.eyes),
            hair: cleanGroup(formValue.hair),
            wardrobe: cleanGroup(formValue.wardrobe)
        };
    }

    save() {
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const formData = this.prepareFormData();

        if (this.isEditMode) {
            this.characterService.update(this.characterId, formData).subscribe({
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
            const selectedBookId = formData.bookId || this.bookId;
            this.characterService.create(selectedBookId, formData).subscribe({
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
