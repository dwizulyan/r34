import { readFile } from "fs"
import path from "path"

import defaultSetting from "../setting.json"



export const settings = {
    // Api url to download the image
    // you can also modify the limit per fetch
    // or anything pertty much
    apiUrl: defaultSetting.apiUrl,

    // delay given after successfully download a single batch
    delayAfterDownload: defaultSetting.delayAfterDownload,

    // defualt location to save downloaded file
    location: defaultSetting.location,

    // the default name for folder used to contain images  
    // example : C:/<tag>/<defaultFolderImagesName>
    folderImagesName: defaultSetting.folderImagesName,

    // default encoding to write the history.json or read history.json
    // usually use utf-8 but if you have something to do, just change it
    encoding: defaultSetting.encoding,

    // images to download per batch
    downloadPerBatch: defaultSetting.downloadPerBatch,

    imagesLimit: defaultSetting.imagesLimit,
}