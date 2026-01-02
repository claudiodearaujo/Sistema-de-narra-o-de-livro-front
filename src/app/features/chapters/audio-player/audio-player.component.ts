import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-audio-player',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './audio-player.component.html',
    styleUrl: './audio-player.component.css'
})
export class AudioPlayerComponent {
    @Input() audioUrl?: string | null;
}
