import UpdateService from "../services/updateImageService";

const update = new UpdateService();

async function test() {
    try {
        await update.checkUpdate("kiwora")
    }
    catch (err) {
        console.log(err)
    }
}
async function run() {
    await test()
}
run()