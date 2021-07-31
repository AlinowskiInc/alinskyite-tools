const {Alinskyite, Upload, EffectsAudio} = require("."); 

const filters = require("./filters-audio");

const out_dir = "./output-filters-end";

(async () => { 

    const alinskyite = new Alinskyite(); 
    const effects_audio = new EffectsAudio(); 
    
    const upload = await alinskyite.upload.uploadAudio([ "example.mp3" ]); 

    effects_audio.setIDFile(upload[0].id_file);

    for (let i = 0; i < filters.length; i++) { 
        const filter = filters[i];

        if (filter[1]) {
            effects_photo.parse(filter[1]);
        }

        const buffer = await alinskyite[filter[0]](effects_audio);
        const save = out_dir + "/" + (i + 1) + ".mp3";

        console.log(`Save audio -> ${save}`);

        fs.writeFileSync(save, buffer);
    }

    console.log("Done."); 
})();
