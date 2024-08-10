import axios from "axios";
import path from 'path'
import { access, readFile } from "fs/promises";
import { Logger } from "../utils/common";
import { Wait } from "../utils/common";
import { DownloadImage } from "./downloadImageService";
import { todo } from "node:test";

import { setting } from "../setting";

const logger = new Logger();
const wait = new Wait();
const downlaodImg = new DownloadImage();

const defaultLocation = setting.defaultLocation

const API =
    "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1000"

class UpdateService {

    constructor() { }
    async checkUpdate(tags: string) {
        try {
            const tagsLocation: string = path.join(defaultLocation, tags, "history.json")
            logger.log(`Checking : ${tagsLocation}`)
            await wait.start(1)
            await access(tagsLocation)
            logger.log("File exists!!")
            await wait.start(1)

            const history = await readFile(path.join(tagsLocation), { encoding: 'utf-8' })
            const parsedHistory = JSON.parse(history)
            const images = await axios.get(`${API}&tags=${tags}`)

            const sortedHistory: { url: string, id: number }[] = parsedHistory.sort((a: typeof parsedHistory, b: typeof parsedHistory) => a.id - b.id);
            const sortedData: { file_url: string, id: number }[] = images.data.sort((a: typeof parsedHistory, b: typeof parsedHistory) => a.id - b.id)

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

                await downlaodImg.batchDownlood(5, toDownload, 0, Math.ceil(toDownload.length / 5), path.join(defaultLocation, tags, "images"), tags, toDownload)
            }
        } catch (err) {
            if (err instanceof Error)
                logger.log(err.toString())
        }
    }
}
export default UpdateService