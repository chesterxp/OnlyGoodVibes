console.log('Only Good Vibes234444333');
var onlyGoodVibes = {
    mainNav: '',
    articleNav: '',
    nav: '',
    isMobile: '',
    init: function(){
        const o = onlyGoodVibes;
        const nav = document.querySelector('.navigation');
        o.isMobile = o.checkDevice();

        //podmiana tła w artykułach
        o.lazyLoadBackground(o);

        //dodawania background do nawigacji
        o.navigation(o, nav);

        //pokaz nawigacje i schowaj
        if(o.isMobile){
            o.hamburger(o, nav)
        }

        //pokazywanie sekcji
        o.showHideElement();

        //inne
        o.animateAllLinks();
        o.changeCurrentYear();
        // o.shareArticle(o);
        o.shareArticle2(o);
    },
    //isMobileDevice
    checkDevice: function(){
        let windowWidth = window.innerWidth;
        return windowWidth < 800;
    },
    //lazyload for backgrounds
    lazyLoadBackground: (o) =>{
        const allBackgrounds = document.querySelectorAll("[data-background-src]");

        if(allBackgrounds.length > 0){
            o.lazyLoadPictures(allBackgrounds);
        }
    },
    lazyLoadPictures: function(backgrounds){
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    onlyGoodVibes.addBackground(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '20px',
            threshold: 0.01
        });
        backgrounds.forEach( ele => {
            observer.observe(ele);
        })
    },
    addBackground: function(el){
        if(!el) return false;
        const backgroundConfig = JSON.parse(el.dataset.backgroundSrc);

        let size = '';
        let picture = '';

        if(onlyGoodVibes.isMobile){
            size = backgroundConfig.mobile;
            picture = backgroundConfig.mobileSrc;
            if(!picture){
                picture = backgroundConfig.desktopSrc;
            }
        }
        else{
            size = backgroundConfig.desktop;
            picture = backgroundConfig.desktopSrc;
        }

        el.style = `background-image: url(./image/${size}/${picture})`;
    },

    //navigation
    navigation: function(o, nav){
        const titleBox = document.querySelector('.titleBox');
        if(titleBox){
            const heightOFHero = o.getHeightOfHero(titleBox);
            o.createNavPX(heightOFHero);
            o.showHideNavigation(nav);
        }
    },
    getHeightOfHero:function(element){
        return element.offsetHeight;
    },
    createNavPX: function(height){
        const navPX = document.createElement('div');
        navPX.classList.add('navPX');
        navPX.setAttribute('style',`position:absolute; top:${height-130}px; opacity:0; width:1px; height:1px;`);
        document.body.append(navPX);
    },
    showHideNavigation: function(nav){
        const navPX = document.querySelector('.navPX');
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    nav.classList.remove('navigation--addBackground');
                    console.log('jestem w ')
                } else{
                    console.log('jestem poza')
                    nav.classList.add('navigation--addBackground');
                }
            });
        }, {
            rootMargin: '20px',
            threshold: 0.01
        });

        observer.observe(navPX);
    },

    //hamburger - pokaz nav po kliknieciu w hamburgera
    hamburger: (o, nav) =>{
        const navElements = nav.querySelectorAll('.navigation__link, .navigation__hamburger');
        const hamburger = document.querySelector('.navigation__hamburger');

        navElements.forEach(link =>{
            link.addEventListener('click', o.changeClass.bind(this, nav, hamburger));
        })
    },
    changeClass: function(nav, hamburger){
        nav.classList.toggle('navigation--showList')
        hamburger.classList.toggle('close')
    },

    //pokazywanie sekcji
    showHideElement: function(){
        const showHideElements = document.querySelectorAll('.showHideElement');

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    entry.target.classList.add('showHideElement--show')
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.01
        });

        if(showHideElements){
            if (showHideElements.length > 1) {
                showHideElements.forEach(function(el) {
                    observer.observe(el);
                });
            } else {
                observer.observe(showHideElements)
            }
        }
    },

    //animowane pływanie do linków
    animateAllLinks: function() {
        var all = document.querySelectorAll('a[href^="#"]');
        all.forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                var href = this.getAttribute('href');
                var destination = document.querySelector(href).offsetTop - 50;
                var currentPosition = window.pageYOffset;
                var body = document.querySelector('body,html');
                onlyGoodVibes.animate(body, "scrollTop", "", currentPosition, destination, 600, true);
            });
        })
    },
    animate: function(elem, style, unit, from, to, time, prop) {
        if (!elem) return;
        var start = new Date().getTime(),
            timer = setInterval(function() {
                var step = Math.min(1, (new Date().getTime() - start) / time);
                if (prop) {
                    elem[style] = (from + step * (to - from)) + unit;
                } else {
                    elem.style[style] = (from + step * (to - from)) + unit;
                }
                if (step == 1) clearInterval(timer);
            }, 25);
        elem.style[style] = from + unit;
    },

    //mechanizm obserwera
    // myObserver: function(targets, viewPortIn, viewPortOut, rootMargin = '1px') {
    //     var target = Array.from(targets);
    //     var observer = new IntersectionObserver(function(entries) {
    //         entries.forEach(function(entry) {
    //             if (entry.intersectionRatio > 0) {
    //                 viewPortIn(entry.target);
    //                 if (viewPortOut == false) {
    //                     observer.unobserve(entry.target);
    //                 }
    //             } else {
    //                 if (viewPortOut != false) {
    //                     viewPortOut(entry.target);
    //                 }
    //                 return true;
    //             }
    //         });
    //     }, {
    //         rootMargin: rootMargin,
    //         threshold: 0.01
    //     });
    //     if (target.length > 1) {
    //         target.forEach(function(el) {
    //             observer.observe(el);
    //         });
    //     } else {
    //         observer.observe(targets)
    //     }
    // },
    // lazyLoadElement: function(el) {
    //     if (el.getAttribute('data-src')) {
    //         el.src = el.getAttribute('data-src');
    //     }
    // },

    //zmiana roku w stopce
    changeCurrentYear: function(){
        const currentYearBox = document.querySelector('.currentYear');
        currentYearBox.innerHTML = onlyGoodVibes.gerCurrentYear();
    },
    gerCurrentYear: function(){
        return new Date().getFullYear();
    },


    //udostepnij artykuł
    shareArticle: (o) =>{
        const likeButton = document.querySelector('.article__likeIt');
        // likeButton.addEventListener('click', o.showShare.bind(null , o.getShareFunction(o)));
        likeButton.addEventListener('click', o.fb);
    },
    getShareFunction: (o)=> {
        return o.isMobile ? o.showShareForMobile : o.showShareForDesktop;
    },

    showShareForMobile: (shareURL , shareTitle) => {
        navigator.share({
            title: shareTitle,
            text: shareTitle,
            url: shareURL
        });
    },
    showShareForDesktop: (shareURL) => {
        window.open( "https://www.facebook.com/sharer/sharer.php?u=" + shareURL, "myWindow", "status = 1, height = 500, width = 360, resizable = 0" );
    },
    showShare(shareFunction, clickElement) {
        let newTarget = clickElement.target;

        if(newTarget.nodeName === 'svg'){
            newTarget = newTarget.parentElement;
        }

        const shareTitle = newTarget.dataset.sharetitle;
        // const shareURL = newTarget.dataset.articleurl;
        const shareURL = 'https://wiadomosci.gazeta.pl/wiadomosci/7,173952,26834423,ministerstwo-zdrowia-10-099-przypadkow-zakazenia-koronawirusem.html';

        if(!shareURL){
            return;
        }

        shareFunction(shareURL, shareTitle);
    },
    fb: () =>{
            FB.ui({
              display: 'popup',
              method: 'share',
              href: 'https://wiadomosci.gazeta.pl/wiadomosci/7,173952,26834423,ministerstwo-zdrowia-10-099-przypadkow-zakazenia-koronawirusem.html',
            }, function(response){});
    },

    shareArticle2: () =>{
        //https://www.facebook.com/sharer.php?u=[post-url]
        //https://api.whatsapp.com/send?text=[post-title] [post-url]

        const btn = document.querySelector('.article__share');
        const shareURL = 'http://zespolforum.info/';
        btn.addEventListener('click', () => {
            btn.setAttribute('href', `https://www.facebook.com/sharer.php?u=${shareURL}`)
            // window.open( "https://www.facebook.com/sharer.php?u=" + shareURL, "myWindow", "status = 1, height = 500, width = 360, resizable = 0" );
            // window.open( "https://api.whatsapp.com/send?text=jAKISytul&" + shareURL, "myWindow", "status = 1, height = 500, width = 360, resizable = 0" );
        })
    }

}

onlyGoodVibes.init();

//colory
//zdjecia
//logo