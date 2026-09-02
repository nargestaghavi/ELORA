//تغییر عکس بنر

const banners = [
    "assets/images/banners/banner1.jpg",
    "assets/images/banners/banner2.jpg",
    "assets/images/banners/banner3.jpg",
    "assets/images/banners/banner4.jpg"
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

    if (activeLayer === 1) {
        layer2.style.backgroundImage = `url(${nextBanner})`;
        layer2.classList.add("active");
        layer1.classList.remove("active");
        activeLayer = 2;
    } else {
        layer1.style.backgroundImage = `url(${nextBanner})`;
        layer1.classList.add("active");
        layer2.classList.remove("active");
        activeLayer = 1;
    }
}

setInterval(changeBackground, 7000);

//نوار اسکرول برند ها

const images = document.querySelector('.brands .images');
const scrollbar = document.querySelector('.brands .scrollbar');
const thumb = document.querySelector('.brands .scrollbar-thumb');

function updateScrollbar() {
    const contentWidth = images.scrollWidth;
    const visibleWidth = images.clientWidth;

    const scrollableWidth = contentWidth - visibleWidth;

    if (scrollableWidth <= 0) {
        scrollbar.style.display = 'none';
        return;
    }

    scrollbar.style.display = 'block';

    // عرض thumb
    const thumbWidth =
        (visibleWidth / contentWidth) * scrollbar.clientWidth;

    thumb.style.width = `${thumbWidth}px`;

    // فضای قابل حرکت thumb
    const maxMove =
        scrollbar.clientWidth - thumbWidth;

    // مقدار اسکرول
    const scrollLeft = Math.abs(images.scrollLeft);

    // درصد اسکرول
    const progress =
        Math.min(scrollLeft / scrollableWidth, 1);

    // چون نوار RTL است، از راست حرکت می‌کند
    thumb.style.right = `${progress * maxMove}px`;
}

images.addEventListener('scroll', updateScrollbar);
window.addEventListener('resize', updateScrollbar);

updateScrollbar();

//اسلایدر محصولات

const collections = document.querySelectorAll(".collection");
const scrollHandlers = [];

collections.forEach(collection => {
    const container = collection.querySelector('.images');
    const track = collection.querySelector('.images-track');
    const dotsWrapper = collection.querySelector('.dots-wrapper');
    const originalProducts = Array.from(collection.querySelectorAll(".box-img"));
    const totalOriginal = originalProducts.length;
    const dots = [];

    // کلون کردن کل ست تصاویر و چسباندن پشت سر آخرین آیتم
    const clones = originalProducts.map(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone-slide');
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
        return clone;
    });

    const allSlides = [...originalProducts, ...clones];

    // دات‌ها فقط به تعداد آیتم‌های اصلی
    originalProducts.forEach(() => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dotsWrapper.appendChild(dot);
        dots.push(dot);
    });

    const goToItem = (targetItem) => {
        const containerRect = container.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();
        const scrollPosition = container.scrollLeft + (itemRect.right - containerRect.right);
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    };

    // کلیک روی همه‌ی اسلایدها (اصلی + کلون) کار کنه
    allSlides.forEach((item) => {
        item.addEventListener("click", () => goToItem(item));
    });

    // کلیک روی دات‌ها فقط به آیتم اصلی معادل بره
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToItem(originalProducts[index]));
    });

    let scrollEndTimer = null;

    function scrollProducts() {
        const containerRect = container.getBoundingClientRect();
        const rightEdge = containerRect.right;

        // به‌جای علامت‌گذاری همه‌ی آیتم‌های نزدیک، فقط نزدیک‌ترین آیتم به لبه‌ی راست
        // به عنوان فعال انتخاب می‌شه تا هیچ‌وقت دو اسلاید هم‌زمان فعال نشن
        let minDistance = Infinity;
        let activeSlideIndex = 0;

        allSlides.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const distance = Math.abs(rightEdge - rect.right);
            if (distance < minDistance) {
                minDistance = distance;
                activeSlideIndex = index;
            }
        });

        const activeIndex = activeSlideIndex % totalOriginal; // ایندکس دات معادل، چه اصلی چه کلون

        allSlides.forEach((item, index) => {
            const img = item.querySelector('img');
            if (index === activeSlideIndex) {
                img.style.opacity = "1";
                img.style.transform = "scale(1)";
                img.style.boxShadow = "6px 6px 16px rgba(0, 0, 0, 0.12),-6px -6px 16px rgba(186, 186, 186, 0.743),inset -6px -6px 16px rgba(0, 0, 0, 0.12),inset 6px 6px 16px rgba(231, 231, 231, 0.743)";
            } else {
                img.style.opacity = "0.65";
                img.style.transform = "scale(0.8)";
                img.style.boxShadow = "none";
            }
        });

        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.style.backgroundColor = "rgb(50, 50, 50)";
                dot.style.transform = "scale(1.2)";
            } else {
                dot.style.backgroundColor = "rgb(137, 137, 137)";
                dot.style.transform = "scale(1)";
            }
        });

        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(checkLoop, 150);
    }

    // وقتی اسکرول متوقف شد، اگه رو یکی از کلون‌ها بودیم، بی‌صدا برگرد به معادل اصلیش
    function checkLoop() {
        const containerRect = container.getBoundingClientRect();
        const rightEdge = containerRect.right;

        for (let i = 0; i < clones.length; i++) {
            const rect = clones[i].getBoundingClientRect();
            const distance = Math.abs(rightEdge - rect.right);if (distance < 20) {
                const cycleWidth = clones[i].offsetLeft - originalProducts[i].offsetLeft;

                allSlides.forEach(item => {
                    item.querySelector('img').style.transition = 'none';
                });

                container.style.scrollBehavior = 'auto';
                container.scrollLeft -= cycleWidth;
                container.style.scrollBehavior = '';

                scrollProducts();
                requestAnimationFrame(() => {
                    allSlides.forEach(item => {
                        item.querySelector('img').style.transition = '';
                    });
                });

                break;
            }
        }
    }

    container.addEventListener("scroll", scrollProducts);
    scrollProducts();

    // نگه داشتن رفرنس تابع برای صدا زدن مجدد بعد از لود کامل تصاویر
    scrollHandlers.push(scrollProducts);
});

// بعد از لود کامل همه‌ی تصاویر صفحه، موقعیت‌ها رو دوباره محاسبه می‌کنیم
// چون موقع لود اولیه ممکنه عرض واقعی عکس‌ها هنوز اعمال نشده باشه
// و همین باعث می‌شد گاهی دو اسلاید هم‌زمان فعال (بزرگ) به نظر برسن
window.addEventListener('load', () => {
    scrollHandlers.forEach(fn => fn());
});