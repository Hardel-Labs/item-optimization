import fs from "fs";

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

export default readFiles;