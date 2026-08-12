const banners = [
    "assets/images/banner1.PNG",
    "assets/images/banner2.PNG",
    "assets/images/banner3.PNG",
    "assets/images/banner4.PNG"    
];

let index = 0;
let activeLayer = 1;

const layer1 = document.getElementById("layer1");
const layer2 = document.getElementById("layer2");

banners.forEach(src => {
    const img = new Image();
    img.src = src;
});

layer1.style.backgroundImage = `url(${banners[0]})`;

function changeBackground() {
    index = (index + 1) % banners.length;
    const nextBanner = banners[index];
    
    if(activeLayer === 1) {
        layer2.style.backgroundImage = `url(${nextBanner})`;
    layer2.classList.add("active");
    layer1.classList.remove("active");
    activeLayer = 2;
    } else{
        layer1.style.backgroundImage = `url(${nextBanner})`;
        layer1.classList.add("active");
    layer2.classList.remove("active");
    activeLayer = 1;
    }
}

setInterval(changeBackground, 7000);
