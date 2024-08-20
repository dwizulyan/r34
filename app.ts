import { DownloadImage } from "./services/downloadImageService";
import path from 'path';
import { Wait } from "./utils/common";
import UpdateService from "./services/updateImageService";
import readLine from "node:readline/promises"
import { stdin, stdout } from "node:process"
import { Logger } from "./utils/common";

const image = new DownloadImage()
const delayer = new Wait();
const update = new UpdateService();
const logger = new Logger();
async function downlaodImage(tags: string) {
    try {
        const directory = path.join(__dirname, `../../../collection/`, tags.replaceAll(" ", "-").replaceAll("+ai_generated", ""), "/images")
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
    const rl = readLine.createInterface({
        input: stdin,
        output: stdout,
    })

    const choice = await rl.question("❔  What you wanna do today ? (download/update) : ")
    if (choice === "download") {
        const tags = await rl.question("➡️  What tags you wanna download ? : ")
        logger.log(`start to download ${tags}`)
        downlaodImage(tags)
    }
    rl.close()
}
run()