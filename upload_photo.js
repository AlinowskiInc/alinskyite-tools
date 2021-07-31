(async () => {
    const alinskyite = new Alinskyite(); 

    const upload = await alinskyite.upload.uploadPhoto("./example.jpg");
    
    console.log(upload);

})();