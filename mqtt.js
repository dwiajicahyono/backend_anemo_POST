const mqtt = require('mqtt');
const express = require('express');
require('dotenv').config();

// Setup klien MQTT
const client = mqtt.connect(process.env.LINKMQTT, {
    username: process.env.USERNAMEMQTT,
    password: process.env.PASSWORDMQTT
});

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Mulai pengiriman pertama saat terhubung
    writeAndSendData();
});

function generateRandomData() {
    const date = new Date();
    const timestamp = date.toISOString();
    const randomCurrent = () => (0.7 + Math.random() * 2).toFixed(2);
    const randomVoltage = () => (5 + Math.random() * 2).toFixed(2);
    const randomTemp = () => (25 + Math.random() * 2).toFixed(2);
    const randomHumi = () => (50 + Math.random() * 2).toFixed(2);
    const soil = () => (40 + Math.random() * 6.03).toFixed(2);

    return {
        ts: timestamp,
        current: parseFloat(randomCurrent()),  // Konversi ke number
        voltage: parseFloat(randomVoltage()),  // Konversi ke number
        temperature: parseFloat(randomTemp()), // Konversi ke number
        humidity: parseFloat(randomHumi()),    // Konversi ke number
        soilmoisture: parseFloat(soil())       // Konversi ke number
    };
}

function generateRandomDataGateway() {
    const date = new Date();
    const timestamp = date.toISOString();
    const randomCurrent = () => (0.7 + Math.random() * 2).toFixed(2);
    const randomVoltage = () => (5 + Math.random() * 2).toFixed(2);
    const randomTemp = () => (25 + Math.random() * 2).toFixed(2);
    const randomHumi = () => (50 + Math.random() * 2).toFixed(2);


    return {
        ts: timestamp,
        current: parseFloat(randomCurrent()),  // Konversi ke number
        voltage: parseFloat(randomVoltage()),  // Konversi ke number
        temperature: parseFloat(randomTemp()), // Konversi ke number
        humidity: parseFloat(randomHumi())     // Konversi ke number
    };
}

function writeAndSendData() {
    for (let i = 0; i < 10; i++) {
        const data = generateRandomData();
        const jsonData = JSON.stringify(data);

        // Publish data ke topic MQTT
        client.publish(`siskom/node${i % 7 + 1}`, jsonData); // Mengasumsikan data dibagi rata ke 7 node
    }
}

function writeAndSendDataGateway() {
    for (let i = 0; i < 10; i++) {
        const data = generateRandomDataGateway();
        const jsonData = JSON.stringify(data);

        // Publish data ke topic MQTT
        client.publish('topic/gatewaysiskom', jsonData);
    }
}

// // Jadwalkan pengiriman setiap menit
// setInterval(writeAndSendData, 60 * 1000);
 setInterval(writeAndSendData, 5000);
 setInterval(writeAndSendDataGateway, 5000);

const PORT = 3000;
const app = express();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
