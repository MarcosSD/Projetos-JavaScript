let totalSlides = document.querySelectorAll('.slider--item').length;
let currentSlide = 0;

document.querySelector('.slider--width').style.width = `calc(100vw * ${totalSlides})`;
document.querySelector('.slider--controls').style.height = `${document.querySelector('.slider').clientHeight}px`;

function voltar(){
    currentSlide--;
    if(currentSlide < 0){
        currentSlide = totalSlides - 1;
    }
    updateMargin();
}

function proxima(){
    currentSlide++;
    if(currentSlide > (totalSlides - 1)){
        currentSlide = 0
    }
    updateMargin();
}

function updateMargin(){
    let sliderWidthItem = document.querySelector('.slider--item').clientWidth;
    let newMargin = (currentSlide * sliderWidthItem);
    document.querySelector('.slider--width').style.marginLeft = `-${newMargin}px`;
}

setInterval(proxima, 5000);