;
(function(undefined) {
    "use strict"
    var _global;

    function rotate(container, activeIndex) {
        this.touchXStart = 0; //触摸起始x坐标
        this.touchYStart = 0; //触摸起始y坐标
        this.container = document.querySelector(container); //绑定容器
        this.offsetTop = this.container.offsetTop; //容器顶部距离
        this.offsetLeft = this.container.offsetLeft; //容器左边距离
        this.containerHeight = this.container.offsetHeight; //容器高
        this.containerWidth = this.container.offsetWidth; //容器宽
        this.activeIndex = activeIndex || 0; //激活的索引
        this.containerChildren = document.querySelectorAll(container + '>div');
        this.timer = null;
        this.childrenNum = this.containerChildren.length - 1;
    }
    rotate.prototype = {
            init: function() {
                if (this.container && this.containerChildren.length > 0) {
                    this.touchEvt()
                    this.move();
                    this.autoPlay();
                } else {
                    console.error('未找到绑定元素');
                    return false;
                }

            },
            touchEvt: function() {
                var self = this;
                this.container.addEventListener('touchstart', function(event) {
                    self.touchXStart = event.targetTouches[0].clientX;
                    self.touchYStart = event.targetTouches[0].clientY
                })
                this.container.addEventListener('touchend', function(event) {
                    var touchXEnd = event.changedTouches[0].clientX;
                    var distance = touchXEnd - self.touchXStart; //滑动距离
                    //在container范围内触摸且横向滑动大于50触发
                    if (Math.abs(distance) > 50) {
                        event.preventDefault()
                        clearInterval(self.timer) //有效滑动，取消自动滚动
                        if (distance > 0) { //右滑
                            self.activeIndex--;
                            self.move()

                        } else { //左滑
                            self.activeIndex++;
                            self.move()
                        }

                    }

                })
            },
            move: function() {
                var self = this;
                if (self.activeIndex == self.containerChildren.length) {
                    self.activeIndex = 0;
                }
                if (self.activeIndex < 0) {
                    self.activeIndex = self.childrenNum;
                }

                for (var i = 0; i < self.containerChildren.length; i++) {
                    if (i == self.activeIndex + 1) {
                        self.containerChildren[i].className = 'slide next';

                    } else if (i == self.activeIndex) {
                        self.containerChildren[i].className = 'slide activeSlide';

                    } else if (i == self.activeIndex - 1) {
                        self.containerChildren[i].className = 'slide prev';

                    } else {
                        self.containerChildren[i].className = 'slide other'
                    }


                }
                if (self.activeIndex == self.childrenNum && self.childrenNum > 1) {
                    self.containerChildren[0].className = 'slide next';
                }
                if (self.activeIndex == 0 && self.containerChildren[self.childrenNum] && self.childrenNum > 1) {

                    self.containerChildren[self.childrenNum].className = 'slide prev';
                }
            },
            autoPlay: function() {
                var self = this;
                this.timer = setInterval(function() {
                    self.activeIndex++;
                    self.move()
                }, 3000);
            }

        }
        // 最后将插件对象暴露给全局对象
    _global = (function() { return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = rotate;
    } else if (typeof define === "function" && define.amd) {
        define(function() { return rotate; });
    } else {
        !('rotate' in _global) && (_global.rotate = rotate);
    }
}());