const fetch = require("node-fetch");
const path = require("path"); 
const stream = require("stream");
const util = require("util");
const fs = require("fs");
const URL = require("url");

const effectListPhoto = [
    "addroi", "amplify", "blend", "bilateral", 
    "bbox", "avgblur", "parse"
]; 
const allMethods = [ 
    {
        clazz:"tools",
        methods:[
            "nsfw", 
            "nsfw2"
        ]
    },
    {
        clazz:"photo",
        methods:[
            "lutParse", 
            "liquidFilter", 
            "filterRGBShift", 
            "filterVideoGlitch", 
            "filterSurroundBlur", 
            "filterPixelize", 
            "filterMozayka", 
            "filterCrystallize", 
            "filterPolarBlur", 
            "filterShadowHighLight", 
            "filterEdge", 
            "filterStylizator", 
            "filterColorizer"
        ]
    },
    {
        clazz:"audio",
        methods:[
            "filterBass", 
            "filterPitch", 
            "filterVibrato", 
            "filterTremolo"
        ]
    }
];

const urlSystem = "https://alinskyite.ru"; 

function bufferToStream(buffer) {
    return new stream.Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    })
}
const streamToBuffer = async (rawStream) => {
    const stream$1 = new stream.PassThrough();
    rawStream.pipe(stream$1);
    const chunks = [];
    let totalSize = 0;
    for await (const chunk of stream$1) {
        totalSize += chunk.length;
        chunks.push(chunk);
    }
    return Buffer.concat(chunks, totalSize);
};
async function requestData(url) {
    const parsed = URL.parse(url);
    
    if (/^(http|https)/i.test(parsed.protocol)) {
        const rsp = await fetch.default(url);
        const buffer = await rsp.buffer();
        return bufferToStream(buffer);
    }
} 

class Effect { 
    constructor() { 
        this.raws = new Map([]); 
        this.length = 0; 
    }
    toFromArray() {
        return Array.from(this.raws);
    }
    toStringJSON() {
        return JSON.stringify(this.toFromArray());
    }
    toString() {
        return this.toFromArray().map(item => "Name: " + item[0] + "\nParams: " + JSON.stringify(item[1])).join("\n\n");
    } 
    toJSONLocale() {
        let json = {};
        this.raws.forEach((k,n,m) => { json[n] = k; }); 
        return json;
    }
    [util.inspect.custom || "inspect"](options, context) { 
        return `${context.stylize(this.constructor.name, 'special')} ${context.stylize("<" + String(this.length) + ">", "string")}`
    }
}

class EffectsPhoto extends Effect {
    constructor({ id_file, direct } = {}) { 
        super();
        this.id = id_file || null;
        this.direct = direct || false;

        for (const name of effectListPhoto) {
            this[name] = ( params = {} ) => { 
                this.raws.set(name, params);
                this.length = this.raws.size;
                return this;
            }
        } 
    }
    
    
    setDirect(bool) {
        this.direct = bool || false;
        return this;
    }
    setIDFile(id) {
        if (id.id_file) {
            this.id = id.id_file || null;
        } else { 
            this.id = id || null;
        }
        
        return this;
    }

    toJSON() {
        let json = {};
        this.raws.forEach((k,n,m) => { json[n] = k; }); 
        return this.direct ? { arguments_effect:json, id_file:this.id } : json;
    }
    toJSONParse() {  
        return { ...(this.raws.get("parse")), id_file:this.id };
    }
}
 
class EffectsAudio extends Effect {
    constructor({ id_file, direct } = {}) { 
        super();
        this.id = id_file || null;
        this.direct = direct || false;

        for (const name of effectListPhoto) {
            this[name] = ( params = {} ) => { 
                this.raws.set(name, params);
                this.length = this.raws.size;
                return this;
            }
        } 
    }
    
    
    setDirect(bool) {
        this.direct = bool || false;
        return this;
    }
    setIDFile(id) {
        if (id.id_file) {
            this.id = id.id_file || null;
        } else { 
            this.id = id || null;
        }
        
        return this;
    }

    toJSON() {
        let json = {};
        this.raws.forEach((k,n,m) => { json[n] = k; }); 
        return this.direct ? { arguments_effect:json, id_file:this.id } : json;
    }
    toJSONParse() {  
        return { ...(this.raws.get("parse")), id_file:this.id };
    }
}

class API {

    constructor(options = {}) { 
        this.options = options; 
    } 

    async call(method, params = {}) {
        const body = params instanceof stream.Readable ? params : util.isBuffer(params) ? bufferToStream(params) : JSON.stringify(params);
        const get = await fetch.default(urlSystem + "/api/" + method, {
            method: "POST", body
        });
        const data = await get.buffer();
        const content_type = get.headers.get("content-type");
        if (content_type&&content_type.includes("application/json")) {
            const json = JSON.parse(data.toString());
            if (json.error) throw new Error(json.error.message);
            return json;
        } 
        return data;
    }
}

class Upload {
    constructor(options = {}) {
 
        this.options = options; 
        this.api = options.api;

    }
    uploadPhoto(files) {
        return this.buildUploadMake(files, {
            method:"tools.uploadFilePhoto"
        });
    } 
    uploadAudio(files) {
        return this.buildUploadMake(files, {
            method:"tools.uploadFileAudio"
        });
    } 
    async buildUploadMake(files, options={}) {
        files = Array.isArray(files) ? files : [files];
        files = await Promise.all(files.map(file => {
            if (file instanceof stream.Readable) return file;
            if (util.isBuffer(file)) return bufferToStream(file);
            if (util.isString(file) && fs.existsSync(file) && !fs.statSync(file).isDirectory()) return fs.createReadStream(file);
            if (util.isString(file)) return requestData(file);
        }));
        files = files.filter(Boolean);
        files = await Promise.all(files.map(readstr => this.api.call(options.method, readstr))); 
        return files;
    }
    invertLinkID(id) {
        return urlSystem + "/away.media/" + id;
    }
}

class Alinskyite {
    constructor(options = {}) {
        this.api = new API({...options});
        this.upload = new Upload({api:this.api, ...options});
        
        for (const pay of allMethods) { 
            for (const method of pay.methods) {
                this[method] = params => this.api.call(pay.clazz + "." + method, params instanceof Effect ? params.toJSONParse() : params || {});
            }
        }
    }
    parseEffect(params = {}) { 
        let body = {};
        if (params instanceof EffectsPhoto) {
            body = params.toJSON(); 
            if (!body.arguments_effect) {
                body = {arguments_effect:body,id_file:params.id};
            }
        } else {
            body = params;
        } 
        return this.api.call("photo.parseEffect", body);
    } 
} 

module.exports.default = Alinskyite;
module.exports.Alinskyite = Alinskyite;
module.exports.API = API;
module.exports.Upload = Upload;
module.exports.Effect = Effect;
module.exports.EffectsPhoto = EffectsPhoto;
module.exports.EffectsAudio = EffectsAudio;