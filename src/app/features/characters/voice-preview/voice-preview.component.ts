import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VoiceService } from '../../../core/services/voice.service';
import { CharacterService } from '../../../core/services/character.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-voice-preview',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, ProgressSpinnerModule],
    templateUrl: './voice-preview.component.html',
    styleUrl: './voice-preview.component.css'
})
export class VoicePreviewComponent implements OnDestroy {
    @Input() voiceId: string = '';
    @Input() text: string = '';
    @Input() characterId: string = ''; // ID do personagem para persistir o áudio

    isLoading = false;
    isPlaying = false;
    hasCachedAudio = false;
    audio: HTMLAudioElement | null = null;

    constructor(
        private voiceService: VoiceService,
        private characterService: CharacterService,
        private messageService: MessageService
    ) { }

    async play() {
        if (!this.voiceId) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione uma voz para testar.' });
            return;
        }

        if (this.isPlaying && this.audio) {
            this.stop();
            return;
        }

        this.isLoading = true;

        // Se tem characterId, usar o endpoint de personagem (com cache)
        if (this.characterId) {
            console.log('🎵 Requesting preview for character:', this.characterId, 'voice:', this.voiceId);
            this.characterService.generatePreviewAudio(this.characterId).subscribe({
                next: (response) => {
                    console.log('✅ Character preview response:', {
                        audioSize: response.audioBase64?.length || 0,
                        format: response.format,
                        cached: response.cached,
                        audioUrl: response.audioUrl
                    });

                    if (!response.audioBase64) {
                        throw new Error('Audio base64 está vazio');
                    }

                    this.hasCachedAudio = response.cached || false;
                    if (response.cached) {
                        this.messageService.add({ 
                            severity: 'info', 
                            summary: 'Cache', 
                            detail: 'Usando áudio salvo anteriormente.' 
                        });
                    }

                    this.playAudio(response.audioBase64, response.format || 'wav');
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('❌ Error generating character preview:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao gerar preview da voz.' });
                    this.isLoading = false;
                }
            });
        } else {
            // Sem characterId, usar o endpoint de voz direto (sem persistir)
            const previewText = `Olá! Esta é uma prévia da voz ${this.text || this.voiceId}. Como você está hoje?`;
            console.log('🎵 Requesting preview for voice:', this.voiceId, 'with text:', previewText);
            
            this.voiceService.previewVoice(this.voiceId, previewText).subscribe({
                next: (response) => {
                    console.log('✅ Voice preview response:', {
                        audioSize: response.audioBase64?.length || 0,
                        format: response.format,
                        voiceId: response.voiceId
                    });

                    if (!response.audioBase64) {
                        throw new Error('Audio base64 está vazio');
                    }

                    this.playAudio(response.audioBase64, response.format || 'wav');
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('❌ Error generating preview:', error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao gerar preview da voz.' });
                    this.isLoading = false;
                }
            });
        }
    }

    playAudio(base64: string, format: string = 'wav') {
        try {
            if (this.audio) {
                this.audio.pause();
                this.audio = null;
            }

            // Mapear formato para MIME type correto
            const mimeTypes: { [key: string]: string } = {
                'wav': 'audio/wav',
                'mp3': 'audio/mpeg',
                'ogg': 'audio/ogg',
                'webm': 'audio/webm'
            };
            const mimeType = mimeTypes[format.toLowerCase()] || 'audio/wav';

            console.log('🔊 Creating audio element with format:', format, 'mimeType:', mimeType);
            this.audio = new Audio(`data:${mimeType};base64,${base64}`);
            
            this.audio.onended = () => {
                console.log('🎵 Audio playback ended');
                this.isPlaying = false;
            };
            
            this.audio.onerror = (error) => {
                console.error('❌ Audio playback error:', error);
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Erro ao reproduzir áudio.' 
                });
                this.isPlaying = false;
            };
            
            this.audio.onloadeddata = () => {
                console.log('✅ Audio data loaded successfully');
            };
            
            console.log('▶️ Starting audio playback...');
            this.audio.play()
                .then(() => {
                    console.log('✅ Audio playing successfully');
                    this.isPlaying = true;
                })
                .catch((error) => {
                    console.error('❌ Error playing audio:', error);
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Erro', 
                        detail: 'Falha ao iniciar reprodução do áudio.' 
                    });
                    this.isPlaying = false;
                });
        } catch (error) {
            console.error('❌ Exception in playAudio:', error);
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao criar elemento de áudio.' 
            });
            this.isPlaying = false;
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
        }
    }

    ngOnDestroy() {
        this.stop();
    }
}
