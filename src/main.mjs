import sharp from 'sharp';
import fs from "fs";
import readFiles from "./readFile.mjs";
import {dist, source} from "./constant.mjs";

readFiles(source, async (filename) => {
    const ext = filename.split('.').pop();
    if (!fs.existsSync(dist)) fs.mkdirSync(dist);

    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') {
        const sharpImage = sharp(source + filename);
        const metadata = await sharpImage.metadata();
        const {width, height} = metadata;
        const fileNameWithoutExtension = filename.split('.').slice(0, -1).join('.');

        if (width > 64) {
            const proportionW = Math.floor(width / 64);
            const proportionH = Math.floor(height / 64);
            const newWidth = Math.floor(width / proportionW);
            const newHeight = Math.floor(height / proportionH);

            try {
                console.log(`Resizing ${filename} to ${newWidth} width x ${newHeight} height`);
                await sharp(source + filename)
                    .resize({
                        width: newWidth,
                        height: newHeight,
                        kernel: sharp.kernel.nearest,
                        fit: sharp.fit.inside,
                        withoutEnlargement: true
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