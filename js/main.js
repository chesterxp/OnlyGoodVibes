console.log('---Only Good Vibes v3---');
/*!
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//Intersection Polifill
(function(i, l) {
    if ("IntersectionObserver" in i && "IntersectionObserverEntry" in i && "intersectionRatio" in i.IntersectionObserverEntry.prototype) {
        return
    }
    var b = [];

    function e(p) {
        this.time = p.time;
        this.target = p.target;
        this.rootBounds = p.rootBounds;
        this.boundingClientRect = p.boundingClientRect;
        this.intersectionRect = p.intersectionRect || j();
        this.isIntersecting = !!p.intersectionRect;
        var r = this.boundingClientRect;
        var q = r.width * r.height;
        var o = this.intersectionRect;
        var n = o.width * o.height;
        if (q) {
            this.intersectionRatio = n / q
        } else {
            this.intersectionRatio = this.isIntersecting ? 1 : 0
        }
    }

    function a(p, o) {
        var n = o || {};
        if (typeof p != "function") {
            throw new Error("callback must be a function")
        }
        if (n.root && n.root.nodeType != 1) {
            throw new Error("root must be an Element")
        }
        this._checkForIntersections = m(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);
        this._callback = p;
        this._observationTargets = [];
        this._queuedEntries = [];
        this._rootMarginValues = this._parseRootMargin(n.rootMargin);
        this.thresholds = this._initThresholds(n.threshold);
        this.root = n.root || null;
        this.rootMargin = this._rootMarginValues.map(function(q) {
            return q.value + q.unit
        }).join(" ")
    }
    a.prototype.THROTTLE_TIMEOUT = 100;
    a.prototype.POLL_INTERVAL = null;
    a.prototype.observe = function(n) {
        if (this._observationTargets.some(function(o) {
                return o.element == n
            })) {
            return
        }
        if (!(n && n.nodeType == 1)) {
            throw new Error("target must be an Element")
        }
        this._registerInstance();
        this._observationTargets.push({
            element: n,
            entry: null
        });
        this._monitorIntersections()
    };
    a.prototype.unobserve = function(n) {
        this._observationTargets = this._observationTargets.filter(function(o) {
            return o.element != n
        });
        if (!this._observationTargets.length) {
            this._unmonitorIntersections();
            this._unregisterInstance()
        }
    };
    a.prototype.disconnect = function() {
        this._observationTargets = [];
        this._unmonitorIntersections();
        this._unregisterInstance()
    };
    a.prototype.takeRecords = function() {
        var n = this._queuedEntries.slice();
        this._queuedEntries = [];
        return n
    };
    a.prototype._initThresholds = function(o) {
        var n = o || [0];
        if (!Array.isArray(n)) {
            n = [n]
        }
        return n.sort().filter(function(r, q, p) {
            if (typeof r != "number" || isNaN(r) || r < 0 || r > 1) {
                throw new Error("threshold must be a number between 0 and 1 inclusively")
            }
            return r !== p[q - 1]
        })
    };
    a.prototype._parseRootMargin = function(n) {
        var o = n || "0px";
        var p = o.split(/\s+/).map(function(q) {
            var r = /^(-?\d*\.?\d+)(px|%)$/.exec(q);
            if (!r) {
                throw new Error("rootMargin must be specified in pixels or percent")
            }
            return {
                value: parseFloat(r[1]),
                unit: r[2]
            }
        });
        p[1] = p[1] || p[0];
        p[2] = p[2] || p[0];
        p[3] = p[3] || p[1];
        return p
    };
    a.prototype._monitorIntersections = function() {
        if (!this._monitoringIntersections) {
            this._monitoringIntersections = true;
            this._checkForIntersections();
            if (this.POLL_INTERVAL) {
                this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL)
            } else {
                f(i, "resize", this._checkForIntersections, true);
                f(l, "scroll", this._checkForIntersections, true);
                if ("MutationObserver" in i) {
                    this._domObserver = new MutationObserver(this._checkForIntersections);
                    this._domObserver.observe(l, {
                        attributes: true,
                        childList: true,
                        characterData: true,
                        subtree: true
                    })
                }
            }
        }
    };
    a.prototype._unmonitorIntersections = function() {
        if (this._monitoringIntersections) {
            this._monitoringIntersections = false;
            clearInterval(this._monitoringInterval);
            this._monitoringInterval = null;
            k(i, "resize", this._checkForIntersections, true);
            k(l, "scroll", this._checkForIntersections, true);
            if (this._domObserver) {
                this._domObserver.disconnect();
                this._domObserver = null
            }
        }
    };
    a.prototype._checkForIntersections = function() {
        var o = this._rootIsInDom();
        var n = o ? this._getRootRect() : j();
        this._observationTargets.forEach(function(s) {
            var v = s.element;
            var u = d(v);
            var q = this._rootContainsTarget(v);
            var r = s.entry;
            var p = o && q && this._computeTargetAndRootIntersection(v, n);
            var t = s.entry = new e({
                time: c(),
                target: v,
                boundingClientRect: u,
                rootBounds: n,
                intersectionRect: p
            });
            if (!r) {
                this._queuedEntries.push(t)
            } else {
                if (o && q) {
                    if (this._hasCrossedThreshold(r, t)) {
                        this._queuedEntries.push(t)
                    }
                } else {
                    if (r && r.isIntersecting) {
                        this._queuedEntries.push(t)
                    }
                }
            }
        }, this);
        if (this._queuedEntries.length) {
            this._callback(this.takeRecords(), this)
        }
    };
    a.prototype._computeTargetAndRootIntersection = function(t, p) {
        if (i.getComputedStyle(t).display == "none") {
            return
        }
        var s = d(t);
        var o = s;
        var r = t.parentNode;
        var q = false;
        while (!q) {
            var n = null;
            if (r == this.root || r.nodeType != 1) {
                q = true;
                n = p
            } else {
                if (i.getComputedStyle(r).overflow != "visible") {
                    n = d(r)
                }
            }
            if (n) {
                o = g(n, o);
                if (!o) {
                    break
                }
            }
            r = r.parentNode
        }
        return o
    };
    a.prototype._getRootRect = function() {
        var o;
        if (this.root) {
            o = d(this.root)
        } else {
            var p = l.documentElement;
            var n = l.body;
            o = {
                top: 0,
                left: 0,
                right: p.clientWidth || n.clientWidth,
                width: p.clientWidth || n.clientWidth,
                bottom: p.clientHeight || n.clientHeight,
                height: p.clientHeight || n.clientHeight
            }
        }
        return this._expandRectByRootMargin(o)
    };
    a.prototype._expandRectByRootMargin = function(o) {
        var p = this._rootMarginValues.map(function(r, q) {
            return r.unit == "px" ? r.value : r.value * (q % 2 ? o.width : o.height) / 100
        });
        var n = {
            top: o.top - p[0],
            right: o.right + p[1],
            bottom: o.bottom + p[2],
            left: o.left - p[3]
        };
        n.width = n.right - n.left;
        n.height = n.bottom - n.top;
        return n
    };
    a.prototype._hasCrossedThreshold = function(p, s) {
        var o = p && p.isIntersecting ? p.intersectionRatio || 0 : -1;
        var r = s.isIntersecting ? s.intersectionRatio || 0 : -1;
        if (o === r) {
            return
        }
        for (var q = 0; q < this.thresholds.length; q++) {
            var n = this.thresholds[q];
            if (n == o || n == r || n < o !== n < r) {
                return true
            }
        }
    };
    a.prototype._rootIsInDom = function() {
        return !this.root || h(l, this.root)
    };
    a.prototype._rootContainsTarget = function(n) {
        return h(this.root || l, n)
    };
    a.prototype._registerInstance = function() {
        if (b.indexOf(this) < 0) {
            b.push(this)
        }
    };
    a.prototype._unregisterInstance = function() {
        var n = b.indexOf(this);
        if (n != -1) {
            b.splice(n, 1)
        }
    };

    function c() {
        return i.performance && performance.now && performance.now()
    }

    function m(n, o) {
        var p = null;
        return function() {
            if (!p) {
                p = setTimeout(function() {
                    n();
                    p = null
                }, o)
            }
        }
    }

    function f(p, o, n, q) {
        if (typeof p.addEventListener == "function") {
            p.addEventListener(o, n, q || false)
        } else {
            if (typeof p.attachEvent == "function") {
                p.attachEvent("on" + o, n)
            }
        }
    }

    function k(p, o, n, q) {
        if (typeof p.removeEventListener == "function") {
            p.removeEventListener(o, n, q || false)
        } else {
            if (typeof p.detatchEvent == "function") {
                p.detatchEvent("on" + o, n)
            }
        }
    }

    function g(q, o) {
        var u = Math.max(q.top, o.top);
        var p = Math.min(q.bottom, o.bottom);
        var t = Math.max(q.left, o.left);
        var r = Math.min(q.right, o.right);
        var s = r - t;
        var n = p - u;
        return (s >= 0 && n >= 0) && {
            top: u,
            bottom: p,
            left: t,
            right: r,
            width: s,
            height: n
        }
    }

    function d(n) {
        var o = n.getBoundingClientRect();
        if (!o) {
            return
        }
        if (!o.width || !o.height) {
            o = {
                top: o.top,
                right: o.right,
                bottom: o.bottom,
                left: o.left,
                width: o.right - o.left,
                height: o.bottom - o.top
            }
        }
        return o
    }

    function j() {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        }
    }

    function h(n, p) {
        var o = p;
        while (o) {
            if (o.nodeType == 11 && o.host) {
                o = o.host
            }
            if (o == n) {
                return true
            }
            o = o.parentNode
        }
        return false
    }
    i.IntersectionObserver = a;
    i.IntersectionObserverEntry = e
}(window, document));


var onlyGoodVibes = {
    mainNav: '',
    articleNav: '',
    nav: '',
    isMobile: '',
    init: function(){
        const o = onlyGoodVibes;
        const nav = document.querySelector('.navigation');
        o.isMobile = o.checkDevice();

        o.lazyLoadBackground(o);

        if(o.isMobile){
            o.hamburger(o, nav)
        }

        o.showHideElement();

        //other functions
        o.animateAllLinks();
        o.changeCurrentYear();
        // o.shareBtn(o);
        o.checkReferrer();
    },
    //isMobileDevice
    checkDevice: function(){
        let windowWidth = window.innerWidth;
        return windowWidth < 800;
    },
    ////lazyload pictures
    lazyLoadBackground: (o) =>{
        const allBackgrounds = document.querySelectorAll("[data-image-src]");

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
        const imageConfig = JSON.parse(el.dataset.imageSrc);

        let folder = 'desktop';
        let photoSrc = imageConfig.desktopSrc;
        let newSrc;
        let type = imageConfig.type ? imageConfig.type : 'image';//default image
        let size = imageConfig.size ? imageConfig.size : 'big';//default big

        if(onlyGoodVibes.isMobile){
            folder = 'mobile';
            photoSrc = imageConfig.mobileSrc;
            if(!photoSrc){
                photoSrc = imageConfig.desktopSrc;
            }
        }

        if(size === 'small'){
            folder = 'mobile';
        }

        newSrc = `../image/${folder}/${photoSrc}`;

        if(type === 'background'){
            el.setAttribute('style',`background-position: center; background-size: cover; background-image: url(${newSrc});`)
        } else if(type === 'image'){
            el.src = newSrc;
        }
    },

    //navigation
    navigation: function(o, nav){
        // const titleBox = document.querySelector('.titleBox');
        // if(titleBox){
            // const heightOFHero = o.getHeightOfHero(titleBox);
            const targets = document.querySelectorAll('.heroBox, .article__hero');
            o.createNavPX(heightOFHero);
            o.showHideNavigation(nav, targets[0]);
        // }
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
    showHideNavigation: function(nav, target){
        // const navPX = document.querySelector('.navPX');
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    nav.classList.remove('navigation--addBackground');
                } else{
                    nav.classList.add('navigation--addBackground');
                }
            });
        }, {
            rootMargin: '10px',
            threshold: 0.01
        });

        observer.observe(target);
    },
    //showHide navigation after click at hamburger
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
    //showHideSections
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

    //links animation
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

    //change year at footer
    changeCurrentYear: function(){
        const currentYearBox = document.querySelector('.currentYear');
        currentYearBox.innerHTML = `&nbsp;${onlyGoodVibes.gerCurrentYear()}&nbsp;`;
    },
    gerCurrentYear: function(){
        return new Date().getFullYear();
    },

    //share article
    shareBtn: (o) =>{
        //https://www.facebook.com/sharer.php?u=[post-url]
        //https://api.whatsapp.com/send?text=[post-title] [post-url]
        //https://twitter.com/share?url=[post-url]&text=[post-title]&via=[via]&hashtags=[hashtags]
        //https://plus.google.com/share?url=[post-url]

        const btns = document.querySelectorAll('.article__shareBtn');
        const shareURL = decodeURI(window.location.href);

        btns.forEach((btn) =>{
            btn.setAttribute('href', `https://www.facebook.com/sharer.php?u=${shareURL}`)
        })
    },
    checkReferrer: () =>{
        const ref = document.referrer;
        console.log('------------------Referrer------------', ref);
    }
}


onlyGoodVibes.init();