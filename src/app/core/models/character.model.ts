import { Voice } from './voice.model';

export interface Character {
    id: string;
    bookId: string;
    name: string;
    voiceId: string;
    voiceDescription?: string;
    previewAudioUrl?: string;
    voice?: Voice;
}
