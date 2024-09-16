import { writeFile, stat, unlink } from "fs/promises"
import defaultSetting from "../../setting.json"
import path from "path"
import readLine from "readline/promises"

export class Wait {
    constructor() { }
    async start(timer: number) {
        await new Promise(resolve => setTimeout(resolve, timer))
    }
}

/**
 * Logging your message to console
 */
export class Logger {
    constructor() { }
    /**
     * Display a message,
     * If you want to make a space below or above, just put an empty string on messages
     * 
     * @param messages - message to be logged to console
     */
    log(...messages: string[]): void {
        if (messages[0] === "") { console.log("") }

        else {
            for (const message of messages) {
                console.log(`➡️  ${message}`)
            }
        }

    }
}
/**
 * Sorting purpose,
 */
export class Sort {
    constructor() { }
    /**
     * 
     * Sorting
     * @param data - Data to be sorted
     * @returns
     */
    sort(data: any) {
        return data.sort((a: any, b: any) => a.id - b.id)
    }
}

/**
 * Settings Purpose
 */
export class Setting {
    private logger = new Logger()
    private wait = new Wait()
    constructor() { }

    /**
     * 
     * @param newSetting - settings value
     */
    async update(newSetting: typeof defaultSetting, rl: readLine.Interface) {
        let onSetting = true
        while (onSetting) {
            this.logger.log(`1. Api url :  ${newSetting.apiUrl}`)
            this.logger.log(`2. Delay after download :  ${newSetting.delayAfterDownload}`)
            this.logger.log(`3. Location :  ${newSetting.location}`)
            this.logger.log(`4. Folder images Name :  ${newSetting.folderImagesName}`)
            this.logger.log(`5. Encoding :  ${newSetting.encoding}`)
            this.logger.log(`6. Download per batch :  ${newSetting.downloadPerBatch}`)
            this.logger.log("7. Exit")
            this.logger.log("")
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
                    this.logger.log("Exiting...")
                    await this.wait.start(2)
                    onSetting = false;
                    break;
            }

        }
        try {
            await stat(path.join(__dirname, "../../setting.json"))
            await unlink(path.join(__dirname, "../../setting.json"))
            await writeFile(path.join(__dirname, "../../setting.json"), JSON.stringify(newSetting))
            this.logger.log("")
            this.logger.log("Success writing new setting...")
        }
        catch (err) {
            console.log(err)
        }
    }
}

export function transfromTag(tag: string): string {
    const trim = tag.replaceAll("user:", "").replaceAll(" ", "-").replaceAll("+ai_generated", "").replaceAll("_", " ").split(" ")
    let final: string = "";
    for (let x = 0; x < trim.length; x++) {
        final += (trim[x][0].toUpperCase() + trim[x].slice(1))
        final += " "
    }
    return final.slice(0, final.length - 1)
}