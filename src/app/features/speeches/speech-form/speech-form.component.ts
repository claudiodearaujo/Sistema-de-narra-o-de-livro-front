import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SpeechService, SpellCheckResponse, SuggestionResponse, CharacterEnrichmentResponse, EmotionImageResponse } from '../../../core/services/speech.service';
import { CharacterService } from '../../../core/services/character.service';
import { SsmlService } from '../../../core/services/ssml.service';
import { Character } from '../../../core/models/character.model';
import { Speech } from '../../../core/models/speech.model';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { SsmEditorComponent } from '../ssml-editor/ssml-editor.component';

@Component({
    selector: 'app-speech-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        SelectModule,
        ToggleSwitchModule,
        SsmEditorComponent
    ],
    providers: [MessageService],
    templateUrl: './speech-form.component.html',
    styleUrl: './speech-form.component.css'
})
export class SpeechFormComponent implements OnInit {
    form: FormGroup;
    characters: Character[] = [];
    chapterId: string = '';
    isEditMode = false;
    speechId: string = '';
    loading = false;
    validating = false;
    includeContext = true;
    ssmlGuideVisible = false;

    spellCheckLoading = false;
    suggestionLoading = false;
    characterEnrichmentLoading = false;
    emotionImageLoading = false;

    spellCheckResult?: SpellCheckResponse;
    suggestionResult?: SuggestionResponse;
    characterEnrichmentResult?: CharacterEnrichmentResponse;
    emotionImageResult?: EmotionImageResponse;

    constructor(
        private fb: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private speechService: SpeechService,
        private characterService: CharacterService,
        private ssmlService: SsmlService,
        private messageService: MessageService
    ) {
        this.form = this.fb.group({
            characterId: ['', Validators.required],
            text: ['', Validators.required],
            ssmlText: ['']
        });
    }

    ngOnInit(): void {
        this.chapterId = this.config.data?.chapterId;
        const bookId = this.config.data?.bookId;
        const speech = this.config.data?.speech as Speech;

        if (bookId) {
            this.loadCharacters(bookId);
        }

        if (speech) {
            this.isEditMode = true;
            this.speechId = speech.id;
            this.form.patchValue({
                characterId: speech.characterId,
                text: speech.text,
                ssmlText: speech.ssmlText || speech.text // Default to text if no SSML
            });
        }
    }

    loadCharacters(bookId: string) {
        this.characterService.getByBookId(bookId).subscribe({
            next: (data) => {
                this.characters = data;
            },
            error: (error) => {
                console.error('Error loading characters:', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar personagens.' });
            }
        });
    }

    get emotionImageDataUrl(): string | null {
        if (!this.emotionImageResult) {
            return null;
        }
        return `data:${this.emotionImageResult.mimeType};base64,${this.emotionImageResult.imageBase64}`;
    }

    toggleSsmlGuide() {
        this.ssmlGuideVisible = !this.ssmlGuideVisible;
    }

    private applyTextToForm(newText: string) {
        this.form.patchValue({ text: newText });
        this.form.markAsDirty();
        this.form.get('text')?.markAsDirty();
        const ssmlControl = this.form.get('ssmlText');
        const currentSsml = (ssmlControl?.value || '').toString().trim();
        const strippedSsml = currentSsml.replace(/<[^>]*>/g, '').trim();
        const plainCurrent = strippedSsml || currentSsml;
        if (!plainCurrent || plainCurrent === this.form.get('text')?.value) {
            ssmlControl?.setValue(newText);
            ssmlControl?.markAsDirty();
        }
    }

    runSpellCheck() {
        const text = this.form.get('text')?.value;
        if (!text || !text.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Escreva um texto antes de usar o corretor.' });
            return;
        }

        this.spellCheckResult = undefined;
        this.spellCheckLoading = true;
        this.speechService.spellCheck({ text }).subscribe({
            next: (result) => {
                this.spellCheckResult = result;
                this.spellCheckLoading = false;
                this.messageService.add({ severity: 'success', summary: 'Correção pronta', detail: 'Revise e aplique se fizer sentido.' });
            },
            error: (error) => {
                this.spellCheckLoading = false;
                console.error('Spell check error', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error?.error || 'Falha ao corrigir texto.' });
            }
        });
    }

    applySpellCheck() {
        if (!this.spellCheckResult) {
            return;
        }
        this.applyTextToForm(this.spellCheckResult.correctedText);
        this.spellCheckResult = undefined;
        this.messageService.add({ severity: 'success', summary: 'Texto atualizado', detail: 'Correções aplicadas.' });
    }

    runSuggestions() {
        const text = this.form.get('text')?.value;
        if (!text || !text.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Escreva algo para receber sugestões.' });
            return;
        }

        this.suggestionResult = undefined;
        this.suggestionLoading = true;
        this.speechService.suggestImprovements({
            text,
            characterId: this.form.get('characterId')?.value,
            chapterId: this.chapterId,
            includeContext: this.includeContext
        }).subscribe({
            next: (result) => {
                this.suggestionResult = result;
                this.suggestionLoading = false;
            },
            error: (error) => {
                this.suggestionLoading = false;
                console.error('Suggestion error', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error?.error || 'Falha ao gerar sugestões.' });
            }
        });
    }

    applySuggestion() {
        if (!this.suggestionResult) {
            return;
        }
        this.applyTextToForm(this.suggestionResult.improvedText);
        this.suggestionResult = undefined;
        this.messageService.add({ severity: 'success', summary: 'Texto atualizado', detail: 'Sugestão aplicada.' });
    }

    runCharacterEnrichment() {
        const characterId = this.form.get('characterId')?.value;
        if (!characterId) {
            this.messageService.add({ severity: 'warn', summary: 'Selecione um personagem', detail: 'Escolha o personagem para gerar detalhes.' });
            return;
        }

        this.characterEnrichmentResult = undefined;
        this.characterEnrichmentLoading = true;
        this.speechService.enrichWithCharacter({
            characterId,
            text: this.form.get('text')?.value
        }).subscribe({
            next: (result) => {
                this.characterEnrichmentResult = result;
                this.characterEnrichmentLoading = false;
            },
            error: (error) => {
                this.characterEnrichmentLoading = false;
                console.error('Character enrichment error', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error?.error || 'Falha ao enriquecer a fala.' });
            }
        });
    }

    applyCharacterEnrichment() {
        if (!this.characterEnrichmentResult) {
            return;
        }
        this.applyTextToForm(this.characterEnrichmentResult.enrichedText);
        this.characterEnrichmentResult = undefined;
        this.messageService.add({ severity: 'success', summary: 'Texto atualizado', detail: 'Detalhes do personagem incluídos.' });
    }

    generateEmotionImage() {
        const text = this.form.get('text')?.value;
        if (!text || !text.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Texto obrigatório', detail: 'Escreva a fala para gerar a imagem.' });
            return;
        }

        this.emotionImageResult = undefined;
        this.emotionImageLoading = true;
        this.speechService.generateEmotionImage({
            text,
            characterId: this.form.get('characterId')?.value
        }).subscribe({
            next: (result) => {
                this.emotionImageResult = result;
                this.emotionImageLoading = false;
            },
            error: (error) => {
                this.emotionImageLoading = false;
                console.error('Emotion image error', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error?.error || 'Não foi possível gerar a imagem.' });
            }
        });
    }

    onSsmlChange(newSsml: string) {
        this.form.patchValue({ ssmlText: newSsml });
        // Auto-update plain text from SSML (stripping tags) - simplified
        const plainText = newSsml.replace(/<[^>]*>/g, '');
        this.form.patchValue({ text: plainText }, { emitEvent: false });
    }

    async save() {
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const formValue = this.form.value;

        // Wrap SSML content with <speak> tag if not already present
        if (formValue.ssmlText) {
            const trimmedSsml = formValue.ssmlText.trim();
            if (!trimmedSsml.startsWith('<speak>')) {
                formValue.ssmlText = `<speak>${trimmedSsml}</speak>`;
            }
        }

        // Validate SSML before saving
        if (formValue.ssmlText) {
            this.validating = true;
            try {
                const validation = await this.ssmlService.validate(formValue.ssmlText).toPromise();
                this.validating = false;
                if (validation && !validation.valid) {
                    this.messageService.add({ severity: 'error', summary: 'Erro SSML', detail: validation.errors.join(', ') });
                    this.loading = false;
                    return;
                }
            } catch (error) {
                this.validating = false;
                console.error('Error validating SSML:', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao validar SSML.' });
                this.loading = false;
                return;
            }
        }

        if (this.isEditMode) {
            this.speechService.update(this.speechId, formValue).subscribe({
                next: (updatedSpeech) => {
                    this.loading = false;
                    this.ref.close(updatedSpeech);
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Error updating speech:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar fala.' });
                }
            });
        } else {
            this.speechService.create(this.chapterId, formValue).subscribe({
                next: (newSpeech) => {
                    this.loading = false;
                    this.ref.close(newSpeech);
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Error creating speech:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar fala.' });
                }
            });
        }
    }

    cancel() {
        this.ref.close();
    }
}
