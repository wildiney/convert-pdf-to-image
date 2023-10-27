import fs from 'fs'
import { join } from 'path'
import pdf2img from 'pdf-img-convert'
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Digite o caminho do arquivo pdf: ", async (answer: string) => {
    console.time('Time processing')

    const pdfFile = answer.replaceAll('"', '')
    if (!pdfFile.includes(".pdf")) return;

    console.log(new Date().toLocaleString(), "File path", pdfFile);

    const date = new Date();
    const folderName = `output/${date.getTime()}`;
    const path = join(__dirname, folderName)

    if (!fs.existsSync(path)) {
        console.log(new Date().toLocaleString(), "Output directory not exists")
        console.log(new Date().toLocaleString(), "Creating new output directory")
        fs.mkdirSync(path, { recursive: true })
        console.log(new Date().toLocaleString(), "Directory created at", path)
    }

    console.log(new Date().toLocaleString(), "Start conversion");
    const pdfArray = await pdf2img.convert(pdfFile);
    console.log(new Date().toLocaleString(), "Finished conversion");

    for (let i = 0; i < pdfArray.length; i++) {
        fs.writeFile(`${path}/page-${i + 1}.png`, pdfArray[i], (error) => {
            if (error) {
                console.error(new Date().toLocaleString(), `Error: ${error}`);
            }
        });
    }

    console.log(new Date().toLocaleString(), "Conversion completed!");
    console.timeEnd('Time processing')
    process.exit()
});
