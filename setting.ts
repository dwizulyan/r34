export const setting = {
    // Api url to download the image
    // you can also modify the limit per fetch
    // or anything pertty much
    apiUrl: "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1000",

    // delay given after successfully download a single batch
    delayAfterDownload: 2,

    // defualt location to save downloaded file
    defaultLocation: "C:/collection",

    // the default name for folder used to contain images  
    // example : C:/<tag>/<defaultFolderImagesName>
    defaultFolderImagesName: "images",

    // default encoding to write the history.json or read history.json
    // usually use utf-8 but if you have something to do, just change it
    defaultEncoding: "utf-8",
}