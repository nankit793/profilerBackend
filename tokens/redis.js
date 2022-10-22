const express = require("express");
const redis = require("redis");
const client = redis.createClient({
  port: 6379,
  host: "127.0.0.1",
});

client.on("connect", () => {
  console.log("connection to client has been eshtablished");
});

client.on("error", (err) => {
  console.log(err);
});

client.on("ready", () => {
  console.log("connection to client has been eshtablished and ready to use");
});

client.on("end", () => {
  console.log("disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
