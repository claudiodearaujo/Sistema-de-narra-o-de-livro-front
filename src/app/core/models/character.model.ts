import { Voice } from './voice.model';

export interface CharacterIdentity {
    id?: string;
    characterId?: string;
    gender?: string;
    age?: number;
    nationality?: string;
}

export interface CharacterPhysique {
    id?: string;
    characterId?: string;
    height?: string;
    bodyType?: string;
    waist?: string;
    posture?: string;
}

export interface CharacterFace {
    id?: string;
    characterId?: string;
    faceShape?: string;
    forehead?: string;
    cheeks?: string;
    chin?: string;
    nose?: string;
    lips?: string;
    expression?: string;
    skinTone?: string;
}

export interface CharacterEyes {
    id?: string;
    characterId?: string;
    size?: string;
    shape?: string;
    color?: string;
    eyelashes?: string;
    makeup?: string;
    eyebrows?: string;
}

export interface CharacterHair {
    id?: string;
    characterId?: string;
    cut?: string;
    length?: string;
    parting?: string;
    texture?: string;
    color?: string;
    finishing?: string;
}

export interface CharacterWardrobe {
    id?: string;
    characterId?: string;
    dressBrand?: string;
    dressModel?: string;
    dressColor?: string;
    dressFabric?: string;
    dressFit?: string;
    dressLength?: string;
    dressNeckline?: string;
    dressDetails?: string;
    shoeBrand?: string;
    shoeModel?: string;
    shoeColor?: string;
    shoeHeel?: string;
    shoeToe?: string;
    shoeStyle?: string;
    earrings?: string;
    ring?: string;
    necklace?: string;
    bracelet?: string;
    nails?: string;
}

export interface Character {
    id: string;
    bookId: string;
    name: string;
    voiceId: string;
    voiceDescription?: string;
    previewAudioUrl?: string;
    voice?: Voice;
    identity?: CharacterIdentity;
    physique?: CharacterPhysique;
    face?: CharacterFace;
    eyes?: CharacterEyes;
    hair?: CharacterHair;
    wardrobe?: CharacterWardrobe;
    completionPercentage?: number;
}
