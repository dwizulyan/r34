import { DownloadImage } from "./services/downloadImageService";
import path from 'path';
import { transfromTag, Wait } from "./utils/common";
import UpdateService from "./services/updateImageService";
import readLine from "node:readline/promises"
import { stdin, stdout } from "node:process"
import { Logger, Setting } from "./utils/common";
import { settings } from "./utils/setting";
import defaultSetting from "./setting.json"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { argv } from "process";


const image = new DownloadImage()
const wait = new Wait();
const update = new UpdateService();
const logger = new Logger();
const settingMethod = new Setting();

const parser = yargs(hideBin(argv))


async function downloadImage(tags: string) {
    try {
        const processedTag = transfromTag(tags);
        const directory = path.join(settings.location, processedTag, settings.folderImagesName)

        const images: { length: number, images: { url: string, id: number }[] } = await image.getImages(tags)

        await image.checkDirectory(directory)
        await image.batchDownlood(settings.downloadPerBatch, images.images, 0, Math.ceil(images.images.length / settings.downloadPerBatch), directory, tags)
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
        if (err instanceof Error)
            logger.log(err.toString())
    }
}

async function run() {
    const argv = await parser.argv
    const rl = readLine.createInterface({
        input: stdin,
        output: stdout,
    })

    if (argv._.length > 0) {
        if (argv._[0] === "download") {
            let tags = argv._[1]
            if (!argv._[1]) {
                tags = await rl.question("➡️  What tags you wanna download ? : ")
            }
            logger.log(`start to download ${tags}`)
            await downloadImage(tags as string)
        }
        else if (argv._[0] === "update") {
            logger.log("Update function is still in progress...")

        }
        else if (argv._[0] === "setting") {
            const newSetting = defaultSetting
            await settingMethod.update(newSetting, rl)
        }
        else {
            logger.log(`No option like ${argv._[0]}`)
        }

    }
    else {
        let loop = true
        while (loop) {
            const choice = await rl.question("❔  What you wanna do today ? (download / update / setting) : ")
            if (choice === "download") {
                const tags = await rl.question("➡️  What tags you wanna download ? : ")
                logger.log(`start to download ${tags}`)
                await downloadImage(tags)
                loop = false;
            }
            else if (choice === "update") {
                logger.log("Update function is still in progress...")
                await wait.start(3)
                loop = false;
            }
            else if (choice === "setting") {
                const newSetting = defaultSetting
                await settingMethod.update(newSetting, rl)

            }
            else {
                logger.log("Idk whatchu talkin' bout...")
            }
        }
    }
    rl.close()

}

run()