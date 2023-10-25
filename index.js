const express = require('express');
const axios = require('axios');
const fs = require('fs');
const { time } = require('console');
const app = express();
const FormData = require('form-data');

// Fungsi untuk menghasilkan data random
function generateRandomData() {
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(3, '0')}`;

    const randomDirection = () => Math.random() <= 0.32 ? 1 : 0; // hanya menghasilkan 1 dengan probabilitas 0.32, lainnya 0
    const randomCO2 = () => (650 + Math.random() * 2).toFixed(2);
    const randomCH4 = () => (780 + Math.random() * 2).toFixed(2);
    const randomTemp = () => (25 + Math.random() * 2).toFixed(2);
    const randomDHTHumidity = () => (50 + Math.random() * 2).toFixed(2);
    const randomSHThumidity = () => (60 + Math.random() * 2).toFixed(2);
    const randomBMPtemp = () => (25 + Math.random() * 2).toFixed(2); // 0 hingga 20.59
    const randomPressure = () => (1000 + Math.random() * 6.03).toFixed(2); // 1000 hingga 1006.02
    const randomSHTTemp = () => (25 + Math.random() * 2).toFixed(2); // 0 hingga 20.73
    const randomHeatIndex = () => (25 + Math.random() * 2).toFixed(2);
    const randomAltitude = () => (58 + Math.random() * 2).toFixed(2); // 0 hingga 60.36
    const randomAbsHumidity = () => (Math.random() * 0.12).toFixed(2); // 0 hingga 0.11

    return `${timestamp},${randomDirection()},${randomDirection()},${randomDirection()},${randomDirection()},${randomDirection()},${randomDirection()},${randomCO2()},${randomCH4()},${randomTemp()},${randomDHTHumidity()},${randomBMPtemp()},${randomPressure()},${randomSHTTemp()},${randomSHThumidity()},${randomHeatIndex()},${randomAltitude()},${randomAbsHumidity()}`;
}


// Fungsi untuk menulis ke CSV dan mengirim ke API
function writeAndSendData() {
    // Cek apakah file 'data.csv' sudah ada
    fs.exists('data.csv', (exists) => {
        if (!exists) {
            // Jika file belum ada, tulis header terlebih dahulu
            fs.writeFileSync('data.csv', 'timestamp,selatan,timur,utara,barat,bawah,atas,co2_concentration,ch4_concentration,dht_temperature,dht_humidity,bmp_temperature,bmp_pressure,sht31_temperature,sht31_humidity,heat_index,approx_altitude,absolute_humidity\n');
        }

        // Tambahkan 100 data ke file CSV setiap menit
        for(let i = 0; i < 300; i++) {
            const data = generateRandomData();
            fs.appendFileSync('data.csv', data + '\n');
        }

        // Mengirim data ke API
        const formData = new FormData();
        formData.append('csv', fs.createReadStream('data.csv'));

        axios.post('https://vps.isi-net.org:7800/sendcsv', formData, {
            headers: formData.getHeaders()
        })
            .then(response => {
                console.log('Data sent successfully:', response.data);
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    });
}



// Jadwalkan pengiriman setiap menit
setInterval(writeAndSendData, 60 * 1000);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Mulai pengiriman pertama saat server dimulai
    writeAndSendData();
});
