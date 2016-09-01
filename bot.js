var Discord = require("discord.js");
var bot = new Discord.Client();

//required modules
const mysql = require("mysql");
const http = require("http");
const request = require("request");
const getJSON = require("get-json");

//debug
const util = require("util");
console.log(util.inspect(Discord, false, null));

//db
var connection = require("./connection.js");

//console log
bot.on("ready", function () {
  console.log("Connected!");
  console.log("Logged in as: ");
  console.log(bot.user.username);
  bot.setPlayingGame("Battlefield Stats");
});

//uptime
bot.on("message", function (message) {
  if (!message.channel.isPrivate) {
    if (message.content === "!bfbotuptime") {
      bot.sendMessage(message, "Hello, Your on server **" + message.channel.server.name + "**");
    }
  } else {
    if (message.content === "!server") {
      bot.sendMessage(message, "Hello, Your on **PM**");
    }
  }
});

//dbservercreate
bot.on("serverCreated", function (server) {
  console.log("Trying to insert server " + server.name + " into database");
  var info = {
    "servername": "'" + server.name + "'",
    "serverid": server.id,
    "ownerid": server.owner.id,
    "prefix": "&"
  };

  connection.query("INSERT INTO servers SET ?", info, function (error) {
    if (error) {
      console.log(error);
      return;
    }
    console.log("Server added successfully");
  });
});

//dbserverdelete
bot.on("serverDeleted", function (server) {
  console.log("Trying to remove server " + server.name + " from database");
  connection.query("DELETE FROM servers WHERE serverid = '" + server.id + "'", function (error) {
    if (error) {
      console.log(error);
      return;
    }
    console.log("Server removed successfully");
  });
});

//help
bot.on("message", function (message) {
  if (!message.channel.isPrivate) {
    if (message.content === "!bfbothelp") {
      bot.sendMessage(message, "Hello, Your on server **" + message.channel.server.name + "**");
    }
  }
});

//bfbc2stats
bot.on("message", function (message) {
  if (!message.channel.isPrivate) {
    //get content
    var content = message.content;
    var name = content.split(" ");
    var playername = name[1];

    //api
    var bfbc2statsapi = "http://api.bfbcs.com/api/pc?players=" + playername + "&fields=general";

    //url
    var bfbc2stats = "http://bfbcs.com/";
    var url = bfbc2stats + playername;

    if (message.content === ("!bfbc2rank " + playername)) { getJSON(bfbc2statsapi, function (err, res) { if (res.found === 0) { bot.sendMessage(message, "Player not identified"); } else { bot.sendMessage(message, "Your rank is **" + res["players"][0]["rank"] + "**");};});}
    if (message.content === ("!bfbc2skill " + playername)) { getJSON(bfbc2statsapi, function (err, res) { if (res.found === 0) { bot.sendMessage(message, "Player not identified"); } else { bot.sendMessage(message, "Your skill score is **" + res["players"][0]["elo"].toFixed(0) + "**");};});}
    if (message.content === ("!bfbc2kd " + playername)) { getJSON(bfbc2statsapi, function (err, res) { if (res.found === 0) { bot.sendMessage(message, "Player not identified"); } else { var kills = (res["players"][0]["kills"]); var deaths = (res["players"][0]["deaths"]); bot.sendMessage(message, "Your K/D is **" + (kills / deaths).toFixed(2) + "**");};});}
  }
});

//bf3stats
bot.on("message", function (message) {
  if (!message.channel.isPrivate) {
    //get content
    var content = message.content;
    var name = content.split(" ");
    var playername = name[1];

    //api
    var bf3statsapi = "http://api.bf3stats.com/pc/player/player=" + playername + "&opt=clear,rank,global";

    //url
    var bf3stats = "http://bf3stats.com/pc/";
    var url = bf3stats + playername;

    if (message.content === ("!bf3rank " + playername)) { getJSON(bf3statsapi, function (err, res) { if (res.status == "notfound") { bot.sendMessage(message, "Player not identified"); } else { bot.sendMessage(message, "Your rank is **" + res.stats.rank.nr + "**");};});}
    if (message.content === ("!bf3skill " + playername)) { getJSON(bf3statsapi, function (err, res) { if (res.status == "notfound") { bot.sendMessage(message, "Player not identified"); } else { bot.sendMessage(message, "Your skill score is **" + res.stats.global.elo.toFixed(0) + "**");};});}
    if (message.content === ("!bf3kd " + playername)) { getJSON(bf3statsapi, function (err, res) { if (res.status == "notfound") { bot.sendMessage(message, "Player not identified"); } else { bot.sendMessage(message, "Your K/D is **" + res.stats.global.elo_games.toFixed(0) + "**");};});}
  }
});

//bf4stats
bot.on("message", function (message) {
  if (!message.channel.isPrivate) {
    //get content
    var content = message.content;
    var name = content.split(" ");
    var playername = name[1];

    //api
    var bf4statsapi = "http://api.bf4stats.com/api/playerInfo?plat=pc&name=" + playername + "&opt=stats,extra";

    //url
    var bf4stats = "http://bf4stats.com/pc/";
    var url = bf4stats + playername;

    if (message.content === ("!bf4rank " + playername)) { getJSON(bf4statsapi, function (err, res) { if (res.error == "notFound") { bot.sendMessage(message, "Player not identified"); } else { bot.sendMessage(message, "Your rank is **" + res.stats.rank + "**");};});}
    if (message.content === ("!bf4skill " + playername)) { getJSON(bf4statsapi, function (err, res) { if (res.error == "notfound") { bot.sendMessage(message, "Player not identified"); } else { bot.sendMessage(message, "Your skill score is **" + res.stats.skill + "**");};});}
    if (message.content === ("!bf4kd " + playername)) { getJSON(bf4statsapi, function (err, res) { if (res.error == "notFound") { bot.sendMessage(message, "Player not identified"); } else { bot.sendMessage(message, "Your K/D is **" + res.stats.extra.kdr.toFixed(2) + "**");};});}
  }
});

//bf1stats
bot.on("message", function (message) {
  if (!message.channel.isPrivate) {
    //get content
    var content = message.content;
    var name = content.split(" ");
    var playername = name[1];

    //api
    var bf1statsapi = "http://api.bf1stats.com/api/playerInfo?plat=pc&name=" + playername + "&opt=stats,extra&callback=?";

    //url
    var bf1stats = "http://bf4stats.com/pc/";
    var url = bf1stats + playername;

    if (message.content === ("!bf1rank " + playername)) {getJSON(bf1statsapi, function (err, res) {bot.sendMessage(message, "Your rank is **" + res.stats.rank + "**");});}
    if (message.content === ("!bf1skill " + playername)) {getJSON(bf1statsapi, function (err, res) {bot.sendMessage(message, "Your skill score is **" + res.stats.skill + "**");});}
    if (message.content === ("!bf1kd " + playername)) {getJSON(bf1statsapi, function (err, res) {bot.sendMessage(message, "Your K/D is **" + res.stats.extra.kdr.toFixed(2) + "**");});}
  } else {
    if (message.content === "!stats") {
      bot.sendMessage(message, "Hello, Your on **PM**");
    }
  }
});

//user command. create by admin



//token
var token = require('./token.js');
bot.loginWithToken(token);
