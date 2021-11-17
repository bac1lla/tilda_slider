// let sliderIndex = 0;

showSlide()

function showSlide() {
    let slider = document.querySelector('.slider'),
        slides = document.querySelectorAll(".item"),
        sliderFrame = document.querySelector(".slider__frame"),
        sliderTrack = document.querySelector(".slider__track"),
        dotsFrame = document.querySelector(".dots--frame"),
        frameWidth = sliderFrame.offsetWidth + 100,
        slideIndex = 0,
        posInit = 0,
        posX1 = 0,
        posX2 = 0,
        posY1 = 0,
        posY2 = 0,
        posFinal = 0,
        isSwipe = false,
        isScroll = false,
        allowSwipe = true,
        transition = true,
        nextTrf = 0,
        prevTrf = 0,
        lastTrf = --slides.length * frameWidth,
        posThreshold = slides[0].offsetWidth * 0.35,
        trfRegExp = /([-0-9.]+(?=px))/,
        dots = createDot(dotsFrame, slides.length)

    function getEvent() {
        return (event.type.search('touch') !== -1) ? event.touches[0] : event;
    }

    function slide() {
        if (transition) {
            sliderTrack.style.transition = 'transform .5s';
        }
        sliderTrack.style.transform = `translate3d(-${slideIndex * frameWidth}px, 0px, 0px)`;
    }

    function swipeStart() {
        let evt = getEvent();

        if (allowSwipe) {

            transition = true;

            nextTrf = (slideIndex + 1) * -frameWidth;
            prevTrf = (slideIndex - 1) * -frameWidth;

            posInit = posX1 = evt.clientX;
            posY1 = evt.clientY;

            sliderTrack.style.transition = '';

            document.addEventListener('touchmove', swipeAction);
            document.addEventListener('mousemove', swipeAction);
            document.addEventListener('touchend', swipeEnd);
            document.addEventListener('mouseup', swipeEnd);

            sliderFrame.classList.remove('grab');
            sliderFrame.classList.add('grabbing');
        }
    }

    function swipeAction() {

        let evt = getEvent(),
            style = sliderTrack.style.transform,
            transform = +style.match(trfRegExp)[0];

        posX2 = posX1 - evt.clientX;
        posX1 = evt.clientX;

        posY2 = posY1 - evt.clientY;
        posY1 = evt.clientY;

        // определение действия свайп или скролл
        if (!isSwipe && !isScroll) {
            let posY = Math.abs(posY2);
            if (posY > 7 || posX2 === 0) {
                isScroll = true;
                allowSwipe = false;
            } else if (posY < 7) {
                isSwipe = true;
            }
        }

        if (isSwipe) {
            // запрет ухода влево на первом слайде
            if (slideIndex === 0) {
                if (posInit < posX1) {
                    setTransform(transform, 0);
                    return;
                } else {
                    allowSwipe = true;
                }
            }

            // запрет ухода вправо на последнем слайде
            if (slideIndex === --slides.length) {
                if (posInit > posX1) {
                    setTransform(transform, lastTrf);
                    return;
                } else {
                    allowSwipe = true;
                }
            }

            // запрет протаскивания дальше одного слайда
            if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
                reachEdge();
                return;
            }

            // двигаем слайд
            sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
        }

    }

    function swipeEnd() {
        posFinal = posInit - posX1;

        isScroll = false;
        isSwipe = false;

        document.removeEventListener('touchmove', swipeAction);
        document.removeEventListener('mousemove', swipeAction);
        document.removeEventListener('touchend', swipeEnd);
        document.removeEventListener('mouseup', swipeEnd);

        sliderFrame.classList.add('grab');
        sliderFrame.classList.remove('grabbing');

        if (allowSwipe) {
            if (Math.abs(posFinal) > posThreshold) {
                if (posInit < posX1) {
                    slideIndex--;
                } else if (posInit > posX1) {
                    slideIndex++;
                }
            }

            if (posInit !== posX1) {
                allowSwipe = false;
                slide();
            } else {
                allowSwipe = true;
            }

        } else {
            allowSwipe = true;
        }

    }

    function setTransform(transform, compareTransform) {
        if (transform >= compareTransform) {
            if (transform > compareTransform) {
                sliderTrack.style.transform = `translate3d(${compareTransform}px, 0px, 0px)`;
            }
        }
        allowSwipe = false;
    }

    function reachEdge() {
        transition = false;
        swipeEnd();
        allowSwipe = true;
    }

    function createDot(dotsFrame, num) {
        for (let i = 0; i < num; ++i) {
            dotsFrame.innerHTML += `\n <span class="slider-dots_item" id="slide__${i}"></span>`
        }
        return document.querySelectorAll(".slider-dots_item")
    }




    sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
    sliderFrame.classList.add('grab');

    sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
    slider.addEventListener('touchstart', swipeStart);
    slider.addEventListener('mousedown', swipeStart);


    dotsFrame.addEventListener('click', event => {
        let target = event.target

        if (target.tagName.toLowerCase() === "span"){
            target.classList.add("dots__current")
            dots[slideIndex].classList.remove("dots__current")
            slideIndex = target.id.match(/\d/)
        }
        slide();
    });




}