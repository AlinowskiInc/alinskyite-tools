import * from "@types/node"

interface SourceUploadIDFile {
    id_file: string
} 
interface Dict<T> {
    [key: string]: T | undefined;
}

interface ResultUploadIDFile {
    id_file:string
}
interface EffectProcessingResult extends Buffer {};

interface ResultUploadIDFiles extends Array<ResultUploadIDFile> { };
interface ArgumentsEffect<T> extends Dict<T> { };   
interface ParsedEffectOptionsAPI<P> extends SourceUploadIDFile {
    arguments_effect: Partial<ArgumentsEffect<string&{}>> & string & P;
}

interface OptionsEffectRequest {
    id_file: string,
    direct: boolean
}

interface PositionAbbreviation {
    x: number,
    y: number,
    w: number,
    h: number,
}

interface AddroiEffect {   
    name: "addroi";
    (params: Partial<{ 
        qoffset: number;
        clear: boolean;
        iw: number;
        ih: number;
    } & PositionAbbreviation>&string): EffectsPhoto;
}
interface AmplifyEffect {
    name: "amplify", 
    (params: Partial<{
        radius: number;
        factor: number;
        threshold: number;
        tolerance: number;
        low: number;
        high: number;
        planes: number;
    }>&string): EffectsPhoto;
}
interface AvgblurEffect { 
    name: "avgblur", 
    (params: Partial<{
        sizeX: number; 
        sizeY: number; 
        planes: number; 
    }>&string): EffectsPhoto;
}
interface BBoxEffect { 
    name: "bbox", 
    (params: Partial<{
        min_val: number;  
    }>&string): EffectsPhoto; 
}
interface BilateralEffect {  
    name: "bilateral", 
    (params: Partial<{
        sigmaS: number;  
        sigmaR: number; 
        planes: number; 
    }>&string): BilateralEffect; 
}
interface BlendEffect { 
    name: "blend", 
    (params: string): EffectsPhoto;
}
interface ParseEffect { 
    name: "parse", 
    (params: Partial<{}>&string): EffectsPhoto;
}

class Effect { 
    readonly prototype: Effect;

    raws: Map<string, any>; 
    length: number;

    readonly toFromArray(): [string, any][];
    readonly toStringJSON(): string;
    readonly toString(): string;
    readonly toJSONLocale(): any;

}
class EffectsPhoto extends Effect { 
    readonly prototype: EffectsPhoto;
    
    constructor (options: Partial<OptionsEffectRequest>): this;

    addroi: AddroiEffect;
    amplify: AmplifyEffect;
    avgblur: AvgblurEffect;
    bbox: BBoxEffect;
    bilateral: BilateralEffect;
    blend: BlendEffect; 

    readonly parse: ParseEffect; 
    
    setDirect(bool: boolean): this; 
    setIDFile(id: string): this;

    readonly toJSON(): any & { arguments_effect:any, id_file:string };
    readonly toJSONParse(): {id_file:string};
}
class EffectsAudio extends Effect { 
    readonly prototype: EffectsAudio;
    
    constructor (options: Partial<OptionsEffectRequest>): this; 

    readonly parse: ParseEffect; 
    
    setDirect(bool: boolean): this; 
    setIDFile(id: string): this;

    readonly toJSON(): any & { arguments_effect:any, id_file:string };
    readonly toJSONParse(): {id_file:string};
}

interface NSFWParamsRequest extends SourceUploadIDFile { }

interface NSFWAnalysisAPIResponse {
    sexy: number,
    drawing: number,
    neutral: number,
    porn: number,
    hentai: number
}
 
class API { 
    call(method:string, params:any): Promise<{}>

    get [Symbol.toStringTag](): string; 
}

class Upload {
    api: API;

    uploadPhoto(files: [string] & string): Promise<ResultUploadIDFiles>;
    uploadAudio(files: [string] & string): Promise<ResultUploadIDFiles>;
    buildUploadMake(files: [string] & string, type: string): Promise<ResultUploadIDFiles>;

    invertLinkID(id: string): string;

    get [Symbol.toStringTag](): string;
} 

class Alinskyite { 
    api: API;
    upload: Upload;

    parseEffect(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto & EffectsAudio ): Promise<EffectProcessingResult>; 
    lutParse(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    liquidFilter(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>;  
    filterRGBShift(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    filterVideoGlitch(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    filterSurroundBlur(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    filterPixelize(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>;  
    filterCrystallize(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    filterPolarBlur(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    filterShadowHighLight(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    filterEdge(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    filterStylizator(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>; 
    filterColorizer(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsPhoto ): Promise<EffectProcessingResult>;

    filterBass(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsAudio ): Promise<EffectProcessingResult>;
    filterPitch(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsAudio ): Promise<EffectProcessingResult>;
    filterVibrato(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsAudio ): Promise<EffectProcessingResult>;
    filterTremolo(params: Partial<ParsedEffectOptionsAPI<{}>> & EffectsAudio ): Promise<EffectProcessingResult>;

    nsfw(params: Partial<NSFWParamsRequest>): Promise<NSFWAnalysisAPIResponse>; 

    get [Symbol.toStringTag](): string;
}

export { Alinskyite, API, Upload, EffectsPhoto, EffectsAudio, Effect }