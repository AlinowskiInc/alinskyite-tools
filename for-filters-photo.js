const {Alinskyite, EffectsPhoto} = require("./..");
const fs = require("fs");

const filters = require("./filters");

const out_dir = "./output-filters-end";

(async () => {
    const alinskyite = new Alinskyite();
    const effects_photo = new EffectsPhoto();

    const upload = await alinskyite.upload.uploadPhoto(fs.createReadStream());
    
    effects_photo.setIDFile(upload[0].id_file);  

    for (let i = 0; i < filters.length; i++) { 
        const filter = filters[i];

        if (filter[1]) {
            effects_photo.parse(filter[1]);
        }

        const buffer = await alinskyite[filter[0]](effects_photo);
        const save = out_dir + "/" + (i + 1) + ".jpg";

        console.log(`Save image -> ${save}`);

        fs.writeFileSync(save, buffer);
    }

    console.log("Done.");
})();