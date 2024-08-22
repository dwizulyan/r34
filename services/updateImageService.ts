import axios from "axios";
import path from 'path'
import { access, readFile } from "fs/promises";
import { Logger } from "../utils/common";
import { Wait } from "../utils/common";
import { DownloadImage } from "./downloadImageService";
import { Sort } from "../utils/common";

import { settings } from "../utils/setting";

import { Image, ProcessedImage } from "../utils/types/types";

const logger = new Logger();
const wait = new Wait();
const downlaodImg = new DownloadImage();
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
            const tagsLocation: string = path.join(defaultLocation, tags, "history.json")
            logger.log(`Checking : ${tagsLocation}`)
            await wait.start(1)
            await access(tagsLocation)
            logger.log("File exists!!")
            await wait.start(1)

            const history = await readFile(path.join(tagsLocation), { encoding: defaultEncoding })
            const parsedHistory = JSON.parse(history)
            const images = await axios.get(`${API}&tags=${tags}`)

            const sortedHistory: ProcessedImage[] = sorter.sort(parsedHistory);
            const sortedData: Image[] = sorter.sort(images.data)

            let newImage = 0;
            const toDownload = [];

            for (let x = 0; x < sortedData.length; x++) {
                if (!sortedHistory[x]) {
                    newImage++
                    toDownload.push({
                        url: sortedData[x].file_url,
                        id: sortedData[x].id
                    })
                }
            }

            if (newImage > 0) {
                logger.log(`New image found!!`)
                logger.log(`${newImage} image to download`)

                await downlaodImg.batchDownlood(5, toDownload, 0, Math.ceil(toDownload.length / 5), path.join(defaultLocation, tags, defaultFolderImagesName), tags, toDownload)
            }
        } catch (err) {
            if (err instanceof Error)
                logger.log(err.toString())
        }
    }
}
export default UpdateService