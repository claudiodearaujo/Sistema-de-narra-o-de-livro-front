import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VoiceService } from '../../../core/services/voice.service';
import { Voice, GEMINI_VOICES } from '../../../core/models/voice.model';

@Component({
    selector: 'app-voice-list',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, TableModule, TagModule, TooltipModule, Toast],
    providers: [MessageService],
    templateUrl: './voice-list.component.html',
    styleUrl: './voice-list.component.css'
})
export class VoiceListComponent implements OnInit {
    voices: Voice[] = [];
    loading = false;
    previewingVoice: string | null = null;
    previewAudio: HTMLAudioElement | null = null;

    constructor(
        private voiceService: VoiceService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadVoices();
    }

    loadVoices() {
        // Usa as vozes fixas do Gemini
        this.voices = GEMINI_VOICES;
    }

    previewVoice(voice: Voice) {
        if (this.previewingVoice === voice.id) {
            // Parar preview atual
            this.stopPreview();
            return;
        }

        this.previewingVoice = voice.id;
        const sampleText = `Olá! Meu nome é ${voice.name}. Esta é uma demonstração da minha voz.`;

        this.voiceService.previewVoice(voice.id, sampleText).subscribe({
            next: (response) => {
                this.stopPreview();
                const audioData = `data:audio/wav;base64,${response.audioBase64}`;
                this.previewAudio = new Audio(audioData);
                this.previewAudio.onended = () => {
                    this.previewingVoice = null;
                };
                this.previewAudio.play();
            },
            error: (error) => {
                this.previewingVoice = null;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao reproduzir preview da voz'
                });
            }
        });
    }

    stopPreview() {
        if (this.previewAudio) {
            this.previewAudio.pause();
            this.previewAudio = null;
        }
        this.previewingVoice = null;
    }

    getGenderSeverity(gender: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (gender?.toUpperCase()) {
            case 'MALE':
                return 'info';
            case 'FEMALE':
                return 'success';
            default:
                return 'warn';
        }
    }

    getGenderLabel(gender: string): string {
        switch (gender?.toUpperCase()) {
            case 'MALE':
                return 'Masculino';
            case 'FEMALE':
                return 'Feminino';
            default:
                return 'Neutro';
        }
    }
}
