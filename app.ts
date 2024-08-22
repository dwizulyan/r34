import { DownloadImage } from "./services/downloadImageService";
import path from 'path';
import { Wait } from "./utils/common";
import UpdateService from "./services/updateImageService";
import readLine from "node:readline/promises"
import { stdin, stdout } from "node:process"
import { Logger } from "./utils/common";
import { settings } from "./utils/setting";
import { writeFile, stat, unlink } from "fs/promises";
import defaultSetting from "./setting.json"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { argv } from "process";


const image = new DownloadImage()
const wait = new Wait();
const update = new UpdateService();
const logger = new Logger();

const parser = yargs(hideBin(argv))


async function downloadImage(tags: string) {
    try {
        const directory = path.join(settings.location, tags.replaceAll(" ", "-").replaceAll("+ai_generated", ""), settings.folderImagesName)
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
            let onSetting = true
            const newSetting = defaultSetting
            while (onSetting) {
                logger.log(`1. Api url :  ${newSetting.apiUrl}`)
                logger.log(`2. Delay after download :  ${newSetting.delayAfterDownload}`)
                logger.log(`3. Location :  ${newSetting.location}`)
                logger.log(`4. Folder images Name :  ${newSetting.folderImagesName}`)
                logger.log(`5. Encoding :  ${newSetting.encoding}`)
                logger.log(`6. Download per batch :  ${newSetting.downloadPerBatch}`)
                logger.log("7. Exit")
                logger.log("")
                const select = await rl.question("Select number to change setting value or exit : ")

                switch (Number(select)) {
                    case 1:
                        const apiUrl = await rl.question("New apiUrl value : ")
                        newSetting.apiUrl = apiUrl;
                        break;
                    case 2:
                        const delayAfterDownload = await rl.question("New delayAfterDownload value : ")
                        newSetting.delayAfterDownload = Number(delayAfterDownload);
                        break;
                    case 3:
                        const location = await rl.question("New Location value : ")
                        newSetting.location = location;
                        break;
                    case 4:
                        const folderImagesName = await rl.question("New folderImagesName value : ")
                        newSetting.folderImagesName = folderImagesName;
                        break;
                    case 5:
                        const encoding = await rl.question("New encoding value : ")
                        newSetting.encoding = encoding;
                        break;
                    case 6:
                        const downloadPerBatch = await rl.question("new downloadPerBatch value : ")
                        newSetting.downloadPerBatch = Number(downloadPerBatch)
                        break;
                    case 7:
                        logger.log("Exiting...")
                        await wait.start(2)
                        onSetting = false;
                        break;
                }

            }
            try {

                console.log(newSetting)
                await unlink(path.join(__dirname, "/setting.json"))
                await writeFile(path.join(__dirname, "/setting.json"), JSON.stringify(newSetting))
                logger.log("")
                logger.log("Success writing new setting...")
            }
            catch (err) {
                console.log(err)
            }

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
                let onSetting = true
                const newSetting = defaultSetting
                while (onSetting) {
                    logger.log(`1. Api url :  ${newSetting.apiUrl}`)
                    logger.log(`2. Delay after download :  ${newSetting.delayAfterDownload}`)
                    logger.log(`3. Location :  ${newSetting.location}`)
                    logger.log(`4. Folder images Name :  ${newSetting.folderImagesName}`)
                    logger.log(`5. Encoding :  ${newSetting.encoding}`)
                    logger.log(`6. Download per batch :  ${newSetting.downloadPerBatch}`)
                    logger.log("7. Exit")
                    logger.log("")
                    const select = await rl.question("Select number to change setting value or exit : ")

                    switch (Number(select)) {
                        case 1:
                            const apiUrl = await rl.question("New apiUrl value : ")
                            newSetting.apiUrl = apiUrl;
                            break;
                        case 2:
                            const delayAfterDownload = await rl.question("New delayAfterDownload value : ")
                            newSetting.delayAfterDownload = Number(delayAfterDownload);
                            break;
                        case 3:
                            const location = await rl.question("New Location value : ")
                            newSetting.location = location;
                            break;
                        case 4:
                            const folderImagesName = await rl.question("New folderImagesName value : ")
                            newSetting.folderImagesName = folderImagesName;
                            break;
                        case 5:
                            const encoding = await rl.question("New encoding value : ")
                            newSetting.encoding = encoding;
                            break;
                        case 6:
                            const downloadPerBatch = await rl.question("new downloadPerBatch value : ")
                            newSetting.downloadPerBatch = Number(downloadPerBatch)
                            break;
                        case 7:
                            logger.log("Exiting...")
                            await wait.start(2)
                            onSetting = false;
                            break;
                    }

                }
                try {

                    console.log(newSetting)
                    await unlink(path.join(__dirname, "/setting.json"))
                    await writeFile(path.join(__dirname, "/setting.json"), JSON.stringify(newSetting))
                    logger.log("")
                    logger.log("Success writing new setting...")
                    loop = false;
                }
                catch (err) {
                    console.log(err)
                }
            }
            else {
                logger.log("Idk whatchu talkin' bout...")
            }
        }
    }
    rl.close()

}

run()