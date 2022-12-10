const sharp = require('sharp');
const fs = require("fs");

const source = './images/source/';
const dist = './images/dist/';

const readFiles = (dir, onFileContent, onError) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.readdir(dir, (err, filenames) => {
        if (err) {
            onError(err);
            return;
        }

        filenames.forEach((filename) => {
            fs.readFile(dir + filename, 'utf-8', (err, content) => {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
            });
        });
    });
}

readFiles(source, async (filename) => {
    const ext = filename.split('.').pop();
    if (!fs.existsSync(dist)) fs.mkdirSync(dist);

    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') {
        const sharpImage = sharp(source + filename);
        const metadata = await sharpImage.metadata();
        const {width, height} = metadata;
        const fileNameWithoutExtension = filename.split('.').slice(0, -1).join('.');

        if (width > 64) {
            try {
                console.log(`Resizing ${filename} to ${64} width x ${64} height`);

                // use sharp to resize the image and set the extension to webp and save it to the dist folder : dist + fileNameWithoutExtension + '.webp'
                // The image must be pixelated like minecraft
                await sharp(source + filename)
                    .resize({
                        width: 64,
                        kernel: sharp.kernel.nearest
                    })
                    .webp({quality: 100})
                    .toFile(dist + fileNameWithoutExtension + '.webp');
            } catch (e) {
                console.log(filename + ' failed to resize' + e);
            }
        } else {
            try {
                console.log(`Moving ${filename} to dist`);
                await sharp(source + filename)
                    .webp({quality: 100})
                    .toFile(dist + fileNameWithoutExtension + '.webp');
            } catch (error) {
                console.log(filename, error);
            }
        }
    }
});