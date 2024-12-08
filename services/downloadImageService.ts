import axios, { AxiosResponse } from "axios";
import { readFile, access, mkdir, writeFile } from "fs/promises";
import fs from "fs";

import { settings } from "../utils/setting";

import { Logger } from "../utils/common";
import { Image, GetImageReturn } from "../utils/types/types";
import { Wait } from "../utils/common";
import path from "path";

const logger = new Logger();
const delayer = new Wait();




const API = settings.apiUrl
const delayAfterDownload = settings.delayAfterDownload

export class DownloadImage {
    constructor() { }
    /**
     * Fetching sets of images from rule34 api and extract the file_url and id key.
     * 
     * @param tags - tags used to search images
     * @return { string[] } array of string containing images links
     */
    async getImages(tags: string): Promise<GetImageReturn | any> {
        let hasMore: boolean = true;
        const images: { url: string, id: number }[] = []
        let page = 0;
        try {
            logger.log("")
            logger.log(`Searching 🔍 : ${tags.replaceAll(" ", "+")}`)
            while (hasMore) {
                const response: AxiosResponse = await axios.get(`${API}&limit=${settings.imagesLimit}&tags=${tags}&pid=${page}`)
                if (response.data.length > 0) {

                    response.data.map((image: Image) => {
                        images.push({ url: image.file_url, id: image.id })
                    })
                    page++
                }
                else {
                    hasMore = false;
                }
            }
            logger.log(`Found ${images.length} images`)
            return { length: images.length, images: images }
        } catch (err) {
            if (err instanceof Error) {
                return err
            }
        }
    }


    /**
     * Check a directory if it exists or not
     * 
     * @param directory - directory to store the images
     */
    async checkDirectory(directory: string) {
        logger.log(`Checking Directory : ${directory} ...`)
        try {
            await access(directory)
            logger.log(`Directory exists ! ✅`)
            await delayer.start(1000)
            logger.log("")
        } catch {
            logger.log(`Directory doesn't exists !! ❌`)
            delayer.start(1000)
            logger.log(`Creating directory ✍️: ${directory} ...`)
            await mkdir(directory, { recursive: true })
            logger.log("")
        }
    }
    /**
     * Download the image
     * 
     * @param url - Link to download
     * @param saveTo - Directory to save the images
     * @param tags - images tag
     */
    async download(url: string, saveTo: string, tags: string) {
        const file = path.join(saveTo, url.split("/").pop() || "unknown")
        logger.log(`Downloading 🟢: ${url}`)
        try {
            const response = await axios.get(url, { responseType: "stream" })
            const writer = fs.createWriteStream(file);
            const totalLength = response.headers['content-length'];
            let downloadedLength = 0;

            response.data.pipe(writer)
            response.data.on('data', (chunk: Buffer) => {
                downloadedLength += chunk.length;
                const progress = (downloadedLength / totalLength) * 100;
                process.stdout.write(`\r\x1b[K🟢  Progress : ${progress.toFixed(2)}% (${downloadedLength} / ${totalLength})`);
            });
            await new Promise((resolve, reject) => {
                writer.on("finish", () => {
                    resolve("")
                })
                writer.on("error", (err) => {
                    logger.log(err.toString())
                    reject(err)
                    return
                })
            })


        } catch (err) {
            if (err instanceof Error)
                logger.log(err.toString())
        }
    }
    /**
    * 
    * @param batchSize - Size of batch
    * @param images - Array of images to be downloaded
    * @param from - Start at what batch
    * @param to - How many batch
    * @param directory - Directory to store the images
    * @param tags - The images tags
    */
    async batchDownlood(batchSize: number, images: { url: string, id: number }[], from: number, to: number, directory: string, tags: string, history: { url: string, id: number }[] = []) {
        let batch = 1 * from
        const downloaded: { url: string, id: number }[] = []

        logger.log(`Downloading batch....`)
        while ((batch * batchSize < images.length) && (to && batch < to)) {
            logger.log(`Downloading [batch ${batch + 1} / batch ${to}]`)
            logger.log("")
            const start = batch * batchSize;
            const end = start + batchSize

            const batchImages = images.slice(start, end);
            await Promise.all(batchImages.map(async (image) => {
                try {
                    const file = path.join(directory)
                    await this.download(image.url, file, tags).then(() => downloaded.push({ url: image.url, id: image.id }))
                } catch {
                    ;
                }

            }))

            try {

                logger.log("Writing history.json...")
                await writeFile(path.join(directory, "../downloaded.json"), JSON.stringify(downloaded))

                logger.log("Upating queue.json....")
                const currQueue: typeof images = images.map(data => { return data })
                for (let x = 0; x < downloaded.length; x++) {
                    for (let y = 0; y < currQueue.length; y++) {
                        if (downloaded[x].id === currQueue[y].id) {
                            currQueue.splice(y, 1)
                        }
                        else {
                            ;
                        }

                    }
                }
                await writeFile(path.join(directory, "../queue.json"), JSON.stringify(currQueue))

            } catch (err) {
                if (err instanceof Error) {
                    logger.log(`error encountered : ${err.toString()}`)
                    logger.log("Exiting process")
                    process.exit()
                }
            }

            logger.log("")
            logger.log(`Success downloading batch ${batch + 1} ✅`);
            logger.log("")


            batch++

            await new Promise(resolve => setTimeout(resolve, 1000 * 2))
        }
        logger.log("Success downloading all batch ✅")
        logger.log("Bye... 🖐️")

    }
}