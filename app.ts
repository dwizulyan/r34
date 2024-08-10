import { DownloadImage } from "./services/downloadImageService";
import path from 'path';
import { Wait } from "./utils/common";
import yargs from "yargs"
import UpdateService from "./services/updateImageService";

const parser = yargs(process.argv.slice(2)).options({
    tags: { type: "string", default: "" },
    method: { type: "string", default: "" }
})

const image = new DownloadImage()
const delayer = new Wait();
const update = new UpdateService();
async function downlaodImage(tags: string) {
    try {
        const directory = path.join(__dirname, `../../../collection/`, tags.replaceAll(" ", "-"), "/images")
        const images: { length: number, images: { url: string, id: number }[] } = await image.getImages(tags)
        await image.checkDirectory(directory)
        await image.batchDownlood(5, images.images, 0, Math.ceil(images.images.length / 5), directory, tags)
    }
    catch (err) {
        throw err
    }
}
async function updateImage(tags: string) {
    try {
        await update.checkUpdate(tags)
    }
    catch (err) {
        console.log(err)
    }
}

async function run() {
    const argv = await parser.parse()
    console.log(argv.method)
    if (argv.method == "download") {

        await downlaodImage(argv.tags);
    }
    else if (argv.method == "update") {
        await updateImage(argv.tags)
    }
}

run()