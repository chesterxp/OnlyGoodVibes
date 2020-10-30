console.log('Only Good Vibes234444333');
var onlyGoodVibes = {
    mainNav: '',
    articleNav: '',
    nav: '',
    init: function(){
        //podmiana tła w artykułach
        const allArticles = document.querySelectorAll("[data-background-src]");
        if(allArticles.length > 1){
            onlyGoodVibes.myObserver(allArticles,onlyGoodVibes.lazyLoadBackground, false );
        }

        //dodawania background do nawigacji
        const nav = document.querySelector('.navigation');
        const titleBox = document.querySelector('.titleBox');
        if(titleBox){
            onlyGoodVibes.toggleClassForNavigation(nav,titleBox);
        }

        //pokaz nawigacje i schowaj
        onlyGoodVibes.hamburgerButton();
        onlyGoodVibes.hideNavAfterClickAtLink();

        //pokazywanie sekcji
        const showHideElements = document.querySelectorAll('.showHideElement');
        onlyGoodVibes.showHideElement(showHideElements);
        //inne
        onlyGoodVibes.animateAllLinks();
        onlyGoodVibes.changeCurrentYear();
    },

    // showNavAtArticlesSite: function(titleSection, nav){
    //     var observer = new IntersectionObserver(function(entries) {
    //         entries.forEach(function(entry) {
    //             if (entry.intersectionRatio > 0) {
    //                 onlyGoodVibes.hideBackground(nav);
    //             } else {
    //                 onlyGoodVibes.showBackground(nav);
    //             }
    //         });
    //     }, {
    //         rootMargin: '20px',
    //         threshold: 0.01
    //     });
    //     observer.observe(titleSection);
    // },



    hamburgerButton: function(){
        const hamburger = document.querySelector('.navigation__hamburger svg');
        const nav = document.querySelector('.navigation')
        hamburger.addEventListener('click', toggleHamburgerClass.bind(this, nav));

        function toggleHamburgerClass(nav){
            nav.classList.toggle('navigation--showList')
        }
    },
    hideNavAfterClickAtLink: function(){
        const nav = document.querySelector('.navigation')
        const navLinks = nav.querySelectorAll('.navigation__link');

        navLinks.forEach(link =>{
            link.addEventListener('click', onlyGoodVibes.removeNavClass.bind(this, nav));
        })
    },
    removeNavClass: function(nav){
        nav.classList.remove('navigation--showList')
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
    myObserver: function(targets, viewPortIn, viewPortOut, rootMargin = '1px') {
        var target = Array.from(targets);
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    viewPortIn(entry.target);
                    if (viewPortOut == false) {
                        observer.unobserve(entry.target);
                    }
                } else {
                    if (viewPortOut != false) {
                        viewPortOut(entry.target);
                    }
                    return true;
                }
            });
        }, {
            rootMargin: rootMargin,
            threshold: 0.01
        });
        if (target.length > 1) {
            target.forEach(function(el) {
                observer.observe(el);
            });
        } else {
            observer.observe(targets)
        }
    },
    lazyLoadElement: function(el) {
        if (el.getAttribute('data-src')) {
            el.src = el.getAttribute('data-src');
        }
    },
    lazyLoadBackground: function(el){
        const backgroundSrc = el.dataset.backgroundSrc;
        el.style = 'background-image: url('+backgroundSrc +')';
    },
    gerCurrentYear: function(){
        return new Date().getFullYear();
    },
    changeCurrentYear: function(){
        const currentYearBox = document.querySelector('.currentYear');
        currentYearBox.innerHTML = onlyGoodVibes.gerCurrentYear();
    },

    //pokazywanie nav po przeskrolowaniu
    toggleClassForNavigation: function(nav, titleBox){
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    onlyGoodVibes.hideBackground(nav);
                } else {
                    onlyGoodVibes.showBackground(nav);
                }
            });
        }, {
            rootMargin: '20px',
            threshold: 0.01
        });
        observer.observe(titleBox);
    },
    showBackground: function(nav){
        nav.classList.add('navigation--addBackground')
    },
    hideBackground: function(nav){
        nav.classList.remove('navigation--addBackground')
    },
    //pokazywanie sekcji
    showHideElement: function(elements){
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    onlyGoodVibes.addClass(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.01
        });
        if (elements.length > 1) {
            elements.forEach(function(el) {
                observer.observe(el);
            });
        } else {
            observer.observe(elements)
        }
    },
    addClass: function(element){
        element.classList.add('showHideElement--show');
    }
}

onlyGoodVibes.init();