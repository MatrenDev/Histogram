function Draw(zdj) 
{
    const width = zdj.width;
    const height = zdj.height;
    const src = new Uint32Array(zdj.data.buffer);
  
    let histR = (new Array(256)).fill(0);
    let histG = (new Array(256)).fill(0);
    let histB = (new Array(256)).fill(0);
    for (let i = 0; i < src.length; i++) 
    {
        let r = src[i] & 0xFF;
        let g = (src[i] >> 8) & 0xFF;
        let b = (src[i] >> 16) & 0xFF;
  
        histR[r]++;
        histG[g]++;
        histB[b]++;
    }

    let maxBrght = 0;
  
    for (let i = 0; i < 256; i++) 
    {
        if(maxBrght < histR[i]) 
        {
            maxBrght = histR[i];
        } 
        else if(maxBrght < histG[i])
        {
            maxBrght = histG[i];
        } 
        else if (maxBrght < histB[i]) 
        {
            maxBrght = histB[i];
        }
    }

    const canvas = document.getElementById('canvasHistogram');
    const _get = canvas.getContext('2d');
  
    let guideHeight = 8;
    let startY = (canvas.height - guideHeight);
    let dx = canvas.width / 256;
    let dy = startY / maxBrght;
  
    _get.lineWidth = dx;
    _get.fillStyle = "#fff";
    _get.fillRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < 256; i++) 
    {
        let x = i * dx;
        // Red
        _get.strokeStyle = "rgba(255,0,0,1)";
        _get.beginPath();
        _get.moveTo(x, startY);
        _get.lineTo(x, startY - histR[i] * dy);
        _get.closePath();
        _get.stroke(); 
        // Green
        _get.strokeStyle = "rgba(0,255,0,1)";
        _get.beginPath();
        _get.moveTo(x, startY);
        _get.lineTo(x, startY - histG[i] * dy);
        _get.closePath();
        _get.stroke(); 
        // Blue
        _get.strokeStyle = "rgba(0,0,255,1)";
        _get.beginPath();
        _get.moveTo(x, startY);
        _get.lineTo(x, startY - histB[i] * dy);
        _get.closePath();
        _get.stroke(); 
    }
}

function getImageData(el) 
{
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = document.getElementById(el);
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, img.width, img.height);
}

document.getElementById('input').addEventListener('change', function() 
{
    if (this.files && this.files[0]) 
    {
        var img = document.getElementById('img');
        img.src = URL.createObjectURL(this.files[0]);
        img.onload = update;
    }
});

$('input[name="rType"]').on('click change', update);

function update(e) 
{
    Draw(getImageData('img'));
}

update();