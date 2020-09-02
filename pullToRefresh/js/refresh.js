;
(function(undefined) {
    "use strict"
    var _global;

    function pullToRefresh(container) {
        this.body = document.querySelector(container);
        this.docWidth = document.body.offsetWidth;
        this.dropMaxHeight = (this.docWidth * 0.01 * 2.666667 * 6).toFixed(2); //最大下拉距离，drop的最大高度6rem
        this.start = 0; //记录开始触摸位置        
        this.scrollTop = 0;
    }
    pullToRefresh.prototype = {
            init: function() {
                this.drop = document.createElement("div");
                this.drop.className = "dropload";
                this.drop.id = "dropload"
                var  first = this.body.firstChild;
                this.body.insertBefore(this.drop, first); //在得到的第一个元素之前插入。
                this.touchEvt()
            },
            touchEvt: function() {
                var self = this;
                this.body.addEventListener('touchstart', function(event) {
                    self.start = event.targetTouches[0].clientY;
                }, false);
                this.body.addEventListener('touchmove', function(event) {
                    self.scrollTop = self.body.scrollTop;
                    if (self.scrollTop == 0 && event.targetTouches[0].clientY - self.start > 0) { //在顶部时才触发下拉判断
                        event.preventDefault()
                        self.drop.style.height = (event.targetTouches[0].clientY - self.start) + 'px';
                        if (event.targetTouches[0].clientY - self.start >= self.dropMaxHeight) {
                            self.drop.innerHTML = '<span>释放刷新</span>';
                        } else {
                            self.drop.innerHTML = '<span>下拉刷新</span>';
                        }
                    }
                }, false);
                this.body.addEventListener('touchend', function(event) {
                    self.scrollTop = self.body.scrollTop;
                    //当下拉距离大于等于drop的最大高度时触发刷新
                    if (event.changedTouches[0].clientY - self.start >= self.dropMaxHeight && self.scrollTop == 0) {
                        event.preventDefault()
                        self.drop.innerHTML = '<i class="load--icon"></i><span>加载中</span>';
                        //异步操作
                        setTimeout(function() {
                            console.log('刷新完成')
                            self.hide(0) //异步完成之后要关闭drop
                        }, 3000)

                    } else {
                        self.hide(0)
                    }
                }, false);
            },
            hide: function(t) {
                var self = this;
                var offsetHeight = this.drop.offsetHeight
                var h = parseFloat((offsetHeight - Math.pow(t, 2) * 0.01));
                if (h <= 0) {
                    h = 0;
                }
                this.drop.style.height = h + 'px';
                t++;
                if (offsetHeight > 0) {
                    setTimeout(function() {
                        self.hide(t)
                    }, 10)
                } else {

                }
            }
        }
        // 最后将插件对象暴露给全局对象
    _global = (function() { return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = pullToRefresh;
    } else if (typeof define === "function" && define.amd) {
        define(function() { return pullToRefresh; });
    } else {
        !('pullToRefresh' in _global) && (_global.pullToRefresh = pullToRefresh);
    }
}());