import sharp from 'sharp';
import fs from "fs";
import readFiles from "./readFile.mjs";
import {dist, source} from "./constant.mjs";

readFiles(source, async (filename) => {
    const ext = filename.split('.').pop();
    if (!fs.existsSync(dist)) fs.mkdirSync(dist);

    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') {
        const fileNameWithoutExtension = filename.split('.').slice(0, -1).join('.');

        try {
            await sharp(source + filename)
                .webp({quality: 100})
                .toFile(dist + fileNameWithoutExtension + '.webp');
        } catch (e) {
            console.log(filename + ' failed to resize' + e);
        }
    }
});