import axios from "axios";
import path from 'path'
import { access, readFile } from "fs/promises";
import { Logger } from "../utils/common";
import { Wait } from "../utils/common";
import { DownloadImage } from "./downloadImageService";
import { Sort } from "../utils/common";

import { settings } from "../utils/setting";

import { Image, ProcessedImage } from "../utils/types/types";
import { todo } from "node:test";
import { writeFile } from "fs/promises";
import { json } from "stream/consumers";

const logger = new Logger();
const wait = new Wait();
const downloadImg = new DownloadImage();
const sorter = new Sort();

const defaultLocation = settings.location
const defaultFolderImagesName = settings.folderImagesName
const defaultEncoding: BufferEncoding = settings.encoding as BufferEncoding;

const API = settings.apiUrl

class UpdateService {

    constructor() { }
    /**
     * Check update for a single folder
     * 
     * @param tags - this tag is the folder name
     */
    async checkUpdate(tags: string) {
        try {
            const tagsLocation: string = path.join(defaultLocation, tags, "downloaded.json")
            logger.log(`Checking : ${tagsLocation}`)
            await access(tagsLocation)
            logger.log("File exists!!")

            const downloaded = await readFile(path.join(tagsLocation), { encoding: defaultEncoding })
            const parsedHistory = JSON.parse(downloaded)
            const images = await axios.get(`${API}&tags=${tags}`)

            const sortedHistory: ProcessedImage[] = sorter.sort(parsedHistory);
            const sortedData: Image[] = sorter.sort(images.data)

            let newImage = 0;
            const toDownload: Image[] = [];

            for (let x = 0; x < sortedData.length; x++) {
                if (!sortedHistory[x]) {
                    toDownload.push(sortedData[x])
                    newImage++;
                }
            }
            console.log(toDownload)


            if (newImage > 0) {
                logger.log(`New image found!!`)
                logger.log(`${newImage} image to download`)

                for (let x = 0; x < newImage; x++) {
                    logger.log(`Downloading ${toDownload[x].file_url}`)
                    await downloadImg.download(toDownload[x].file_url, path.join(defaultLocation, tags, defaultFolderImagesName), tags)
                    logger.log(`Updating history...`)
                    sortedHistory.push({ url: toDownload[x].file_url, id: toDownload[x].id })
                    logger.log("Writing new download.json")
                    await writeFile(path.join(defaultLocation, tags, "downloaded.json"), JSON.stringify(sortedHistory))
                }
            }
        } catch (err) {
            if (err instanceof Error)
                logger.log(err.toString())
        }
    }
}
export default UpdateService