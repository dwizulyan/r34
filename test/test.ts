import UpdateService from "../services/updateImageService";
import { DownloadImage } from "../services/downloadImageService";

const update = new UpdateService();
const images = new DownloadImage();

async function test() {
    try {
        await images.getImages("lewdwaifulaifu")
    }
    catch (err) {
        console.log(err)
    }
}
async function run() {
    await test()
}
run()