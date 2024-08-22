import { ProcessedImage, Image } from "../types/types"
import { writeFile, stat, unlink } from "fs/promises"
import defaultSetting from "../../setting.json"
import path from "path"

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

export class Setting {
    logger = new Logger()
    constructor() {

    }
    async update(newSetting: typeof defaultSetting) {
        try {
            await stat(path.join(__dirname, "../setting.json"))
            await unlink(path.join(__dirname, "../setting.json"))
            await writeFile(path.join(__dirname, "../setting.json"), JSON.stringify(newSetting))
            this.logger.log("")
            this.logger.log("Success writing new setting...")
        }
        catch (err) {
            console.log(err)
        }
    }
}