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
                console.log(`➡️\t${message}`)
            }
        }

    }
}