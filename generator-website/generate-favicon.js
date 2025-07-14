const fs = require('fs');
const { createCanvas } = require('canvas');

// Create 16x16 canvas
const canvas = createCanvas(16, 16);
const ctx = canvas.getContext('2d');

// Clear canvas
ctx.clearRect(0, 0, 16, 16);

// Draw background circle with green gradient
const gradient = ctx.createLinearGradient(0, 0, 16, 16);
gradient.addColorStop(0, '#16a34a');
gradient.addColorStop(1, '#22c55e');

ctx.beginPath();
ctx.arc(8, 8, 7, 0, 2 * Math.PI);
ctx.fillStyle = gradient;
ctx.fill();

// Draw border
ctx.strokeStyle = '#059669';
ctx.lineWidth = 1;
ctx.stroke();

// Draw white heart shape (simplified for 16x16)
ctx.fillStyle = '#ffffff';
ctx.beginPath();
ctx.moveTo(8, 12);
ctx.bezierCurveTo(6, 10, 4, 8, 4, 6);
ctx.bezierCurveTo(4, 4, 6, 4, 8, 6);
ctx.bezierCurveTo(10, 4, 12, 4, 12, 6);
ctx.bezierCurveTo(12, 8, 10, 10, 8, 12);
ctx.fill();

// Draw small plus sign
ctx.fillStyle = '#ffffff';
ctx.fillRect(3, 2, 1, 3);
ctx.fillRect(2, 3, 3, 1);

// Convert to buffer and save
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./app/favicon.ico', buffer);

console.log('Favicon created successfully!');