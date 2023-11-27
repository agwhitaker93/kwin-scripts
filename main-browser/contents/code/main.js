const caseInsensitiveWindowTitleMatch = readConfig('caseInsensitiveWindowTitleMatch', true)
const windowTitleSubstring = readConfig('windowTitleSubstring', 'Firefox')
const displayToUse = readConfig('displayToUse', 1)
const x = readConfig('posX', 0)
const y = readConfig('posY', 0)
const width = readConfig('width', 1280)
const height = readConfig('height', 720)
const delay = readConfig('delay', 1000)

let mainClient

function lowerCaseIfRequested(str) {
    if (caseInsensitiveWindowTitleMatch) {
        return str.toLowerCase()
    }
    return str
}

function clientMatch(client) {
    return lowerCaseIfRequested(client.caption).indexOf(lowerCaseIfRequested(windowTitleSubstring)) >= 0
}

function handleClient(client) {
    if (mainClient) return
    mainClient = client
    mainClient.desktop = displayToUse
    mainClient.noBorder = true
    mainClient.frameGeometry = {
        x, y,
        width, height
    }
}

workspace.clientList()
    .filter(clientMatch)
    .map(handleClient)

workspace.clientAdded.connect((client) => {
    const timer = new QTimer()
    timer.interval = delay
    timer.timeout.connect(() => {
        timer.stop()
        if (clientMatch(client)) handleClient(client)
    })
    timer.start()
})

workspace.clientRemoved.connect((client) => {
    if (client === mainClient) {
        mainClient = null
    }
})
