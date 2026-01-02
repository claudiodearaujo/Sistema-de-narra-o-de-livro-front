import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-export-options',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './export-options.component.html'
})
export class ExportOptionsComponent {
    @Input() chapterId: string = '';
    @Input() canProcess: boolean = false;
    @Output() onProcessComplete = new EventEmitter<string>();

    processing = false;
    status = '';
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient, private messageService: MessageService) { }

    processAudio() {
        this.processing = true;
        this.status = 'Iniciando...';

        this.http.post(`${this.apiUrl}/chapters/${this.chapterId}/audio/process`, {}).subscribe({
            next: (res: any) => {
                this.messageService.add({ severity: 'info', summary: 'Processamento Iniciado', detail: 'O áudio está sendo gerado em segundo plano.' });
                this.pollStatus();
            },
            error: (err) => {
                this.processing = false;
                this.status = 'Erro ao iniciar';
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.error || 'Falha ao iniciar processamento.' });
            }
        });
    }

    checkStatus() {
        this.http.get(`${this.apiUrl}/chapters/${this.chapterId}/audio/status`).subscribe({
            next: (res: any) => {
                this.status = res.status;
                if (res.status === 'completed') {
                    this.processing = false;
                    // Assuming result contains the URL or we fetch chapter again
                    this.onProcessComplete.emit(res.result);
                    this.messageService.add({ severity: 'success', summary: 'Concluído', detail: 'Áudio final gerado com sucesso!' });
                } else if (res.status === 'failed') {
                    this.processing = false;
                    this.messageService.add({ severity: 'error', summary: 'Falha', detail: res.failedReason || 'Erro no processamento.' });
                }
            },
            error: (err) => console.error(err)
        });
    }

    pollStatus() {
        const interval = setInterval(() => {
            if (!this.processing) {
                clearInterval(interval);
                return;
            }
            this.checkStatus();
        }, 3000);
    }
}
