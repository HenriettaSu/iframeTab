/*
 * iframeTab
 * Version: 2.3.7
 *
 * Plugin that can simulate browser to open links as tab and iframe in a page.
 *
 * https://github.com/HenriettaSu/iframeTab
 *
 * License: MIT
 *
 * Released on: April 05, 2017
 */
(function () {
    iframeTab = jQuery.prototype = {
        iframeHeight: function(updateHeight) {
            var iframes = document.getElementById('tabBody').children,
                len = document.frames ? document.frames.length - 1 : 0,
                ifm,
                subWeb,
                i,
                g;
            for (i = 0; i < iframes.length; i++) {
                var ifmClass;
                g = iframes[i];
                ifmClass = g.getAttribute('class');
                ifm = ifmClass.match('active') ? g.getElementsByTagName('iframe')[0] : null;
            }
            subWeb = document.frames ? document.frames[len].document : ifm.contentDocument;
            if (updateHeight) {
                ifm.height = updateHeight;
            } else if (ifm !== null && subWeb !== null) {
                ifm.height = subWeb.body.scrollHeight;
            }
            $(document).trigger('iframetab.reloaded');
        },
        init: function (option) {
            var _tab = this,
                tab = _tab.prototype,
                act = 'active',
                isTop = (top === self),
                isOpen = false,
                isSwitch = false,
                p = isTop ? null : window.parent.document,
                $tabUl = $('#tabHeader ul', p),
                $tabBody = $('#tabBody', p),
                currHei,
                currWid,
                options = $.extend({
                    tabLiClass: '',
                    tabPanClass: '',
                    closesBtnClass: 'fa fa-close',
                    switchBtnDown: 'fa fa-chevron-down',
                    switchBtnUp: 'fa fa-chevron-up',
                    contextmenuClass: 'dropdown',
                    iframeBox: '<div class="right_col" role="main"></div>',
                    singleLineheight: document.getElementById('tabHeader') ? document.getElementById('tabHeader').scrollHeight : 0,
                    menuWidth: document.getElementById('leftMenu') ? document.getElementById('leftMenu').scrollWidth : 0,
                    callback: []
                }, option),
                tabLiClass = options.tabLiClass,
                tabPanClass = options.tabPanClass,
                closesBtnClass = options.closesBtnClass,
                switchBtnDown = options.switchBtnDown,
                switchBtnUp = options.switchBtnUp,
                iframeBox = options.iframeBox,
                singleLineheight = options.singleLineheight,
                menuWidth = options.menuWidth,
                contextmenuClass = options.contextmenuClass,
                callback = options.callback;
            tabList = parent.tabList || {};

            function stellung (event) { // 創建窗口
                var $this = $(this),
                    that = this,
                    link = that.href,
                    name = getData(that, 'name') ? getData(that, 'name') : that.innerHTML,
                    date = new Date().getTime(),
                    mul = getData(that, 'mul'),
                    reload = getData(that, 'reload'),
                    $tabLi = $('#tabHeader li', p),
                    $tabPan = $('.tab-panel', p),
                    tab = $tabUl.find('li[data-name="' + name + '"]').data('tab'),
                    tempLiArry = [],
                    tempLi,
                    tempIframeArry = [],
                    $iframe;
                tempLiArry.push('<li class="active ', tabLiClass, '" data-tab="' , link , '" data-name="' , name , '" data-num="' , date , '">' , name , '<i class="' , closesBtnClass , '" data-btn="close"></i></li>');
                tempLi = tempLiArry.join('');
                tempIframeArry.push('<iframe src="', link, '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" onLoad="iframeTab.iframeHeight()"></iframe>');
                $iframe = $(tempIframeArry.join(''));
                $this.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                // 插入新標籤
                function stellen(cb) {
                    var tabUlWidth = $tabUl.width(),
                        $newTabLiLast,
                        $newTabLiFirst,
                        beforeCreatBoolean;
                    beforeCreatBoolean = cb.beforeCreat();
                    if (beforeCreatBoolean === false) {
                        return false;
                    }
                    tabList[link] = true;
                    $tabLi.removeClass(act);
                    $tabUl.append(tempLi);
                    if (!isSwitch && $tabUl.height() > singleLineheight) {
                        $newTabLiLast = $tabUl.find('li').last();
                        $tabUl.width(tabUlWidth - 30);
                        $tabUl.addClass('hide-tab');
                        $tabUl.after('<i class="' + switchBtnDown + ' fold-switch" data-btn="switch"></i>');
                        isSwitch = true;
                        $('#tabHeader').on('click.iframetab.switch', '[data-btn="switch"]', function () {
                            var _this = $(this);
                            _this.toggleClass(switchBtnDown);
                            _this.toggleClass(switchBtnUp);
                            $tabUl.toggleClass('hide-tab');
                        });
                        $newTabLiLast.remove();
                        $tabUl.find('li').first().before($newTabLiLast);
                    } else if (isSwitch) {
                        $newTabLiFirst = $tabUl.find('li').last();
                        $newTabLiFirst.remove();
                        $tabUl.find('li').first().before($newTabLiFirst);
                    }
                    $tabPan.removeClass(act);
                    $tabBody.append($iframe);
                    $iframe.wrap('<div class="tab-panel active ' + tabPanClass + '" data-num="' + date + '"  data-iframe="' + link + '"></div>');
                    $iframe.wrap(iframeBox);
                    cb.onCreat();
                    $iframe.load(function () {
                        cb.afterCreat();
                    });
                }
                if (event.which === 1) {
                    var cb = {
                        beforeCreat: function () {
                            if (callback.beforeCreat) {
                                return callback.beforeCreat();
                            }
                        },
                        onCreat: function () {
                            if (callback.onCreat) {
                                callback.onCreat();
                            }
                        },
                        afterCreat: function () {
                            if (callback.afterCreat) {
                                callback.afterCreat();
                            }
                        }
                    }
                    if (tabList[link] && typeof mul === 'undefined') {
                        $tabLi.removeClass(act);
                        $tabUl.find('li[data-tab="' + link + '"]').addClass(act);
                        $tabPan.removeClass(act);
                        $tabBody.find('[data-iframe="' + link + '"]').addClass(act);
                        if (reload) {
                            $tabBody.find('[data-iframe="' + link + '"]').find('iframe').attr('src', link);
                        }
                    } else {
                        stellen(cb);
                    }
                }
            }
            function changeTab (cb) { // 切換標籤
                $('#tabHeader').on('click.iframetab', 'li:not(.active)', function () {
                    var $thisLi = $(this),
                        that = this,
                        liLink = getData(that, 'tab'),
                        date = getData(that, 'num'),
                        $liTabPan = $('.tab-panel'),
                        $liTabLi = $tabUl.find('li'),
                        beforeChangeBoolean;
                    beforeChangeBoolean = cb.beforeChange();
                    if (beforeChangeBoolean === false) {
                        return false
                    }
                    $liTabLi.removeClass(act);
                    $liTabPan.removeClass(act);
                    cb.onChange();
                    $('[data-num="' + date + '"]').addClass(act);
                    cb.afterChange();
                });
            }
            function btnDel (cb) { // 關閉標籤
                $('#tabHeader').on('click.iframetab', 'li [data-btn="close"]', function (e) {
                    var $this = $(this),
                        that = this,
                        thatLi = this.parentNode,
                        prev = thatLi.previousElementSibling,
                        next = thatLi.nextElementSibling,
                        tab = getData(thatLi, 'tab'),
                        date = getData(thatLi, 'num'),
                        tabLi = document.getElementById('tabHeader').getElementsByTagName('li'),
                        windowWidth = document.body.clientWidth,
                        countWidth = 0,
                        liWidth,
                        beforeCloseBoolean,
                        i,
                        g;
                    beforeCloseBoolean = cb.beforeClose();
                    if (beforeCloseBoolean === false) {
                        return false
                    }
                    delete tabList[tab];
                    $('[data-num="' + date + '"]').remove();
                    for (i = 0; i < tabLi.length; i++) {
                        g = tabLi[i];
                        liWidth = g.offsetWidth > 0 ? g.offsetWidth : g.offsetWidth;
                        countWidth += liWidth;
                    }
                    if (isSwitch && countWidth < windowWidth - menuWidth) {
                        $('#tabHeader').off('click.iframetab.switch').find('[data-btn="switch"]').remove();
                        isSwitch = false;
                        $tabUl.removeClass('hide-tab');
                        $tabUl.width('auto');
                    }
                    cb.onClose();
                    if (!prev) {
                        next.click();
                    } else {
                        prev.click();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    cb.afterClose();
                });
            }
            function creatContextmenu (e) { // 右鍵菜單
                var $this = $(this),
                    x = e.clientX,
                    y = e.clientY,
                    windowWidth = window.innerWidth,
                    tempContextmenuArry = [],
                    tabContextmenu,
                    contextmenu,
                    contextmenuWidth = 0;
                tempContextmenuArry.push('<div id="tabContextmenu" class="tab-contextmenu ', contextmenuClass, '"><ul class="dropdown-menu"><li><a href="javascript: void(0)" data-btn="removeAll">关闭所有标签</a></li><li><a href="javascript: void(0)" data-btn="removeExceptAct">关闭激活标签外所有标签</a></li></ul></div>');
                contextmenu = tempContextmenuArry.join('');
                if (e.which === 3) {
                    $this.on('contextmenu', function (event) {
                        event.preventDefault();
                    });
                    if (isOpen) {
                        $('#tabContextmenu').addClass('open');
                    } else {
                        $('body').after(contextmenu);
                        isOpen = true;
                    }
                    tabContextmenu = document.getElementById('tabContextmenu');
                    contextmenuWidth = tabContextmenu.scrollWidth + 6;
                    if (windowWidth - x > contextmenuWidth) {
                        tabContextmenu.style.left = x + 'px';
                    } else {
                        tabContextmenu.style.right = contextmenuWidth + 'px';
                        tabContextmenu.style.left = 'auto';
                    }
                    tabContextmenu.style.top = y + 'px';
                    $(document).on('click.context.remove.pl', '[data-btn="removeAll"]', function removeAll() { // 關閉所有標籤
                        $('#tabHeader').find('li:not(.tab-keep)').remove();
                        $('.tab-panel:not(.tab-keep)').remove();
                        $('#tabHeader').find('li.tab-keep').click();
                        if (isSwitch) {
                            $('#tabHeader').off('click.iframetab.switch').find('[data-btn="switch"]').remove();
                            $tabUl.removeClass('hide-tab');
                            $tabUl.width('auto');
                            isSwitch = false;
                        }
                        tabList = {};
                    });
                    $(document).on('click.context.remove.sing', '[data-btn="removeExceptAct"]', function () { // 關閉激活標籤外所有標籤
                        $('#tabHeader li, .tab-panel').each(function () {
                            var _this = $(this),
                                tab = getData(this, 'tab');
                            if (_this.is(':not(.tab-keep)') && _this.is(':not(.active)')) {
                                _this.remove();
                                delete tabList[tab];
                            }
                        });
                        $('#tabHeader').find('li.active').click();
                        if (isSwitch) {
                            $('#tabHeader').off('click.iframetab.switch').find('[data-btn="switch"]').remove();
                            $tabUl.removeClass('hide-tab');
                            $tabUl.width('auto');
                            isSwitch = false;
                        }
                    });
                    $('body').on('click.hide.context', function () { // 關閉右鍵菜單
                        $('body').off('click.hide.context');
                        $('#tabContextmenu').removeClass('open');
                        $(document).off('click.context.remove.pl', '[data-btn="removeAll"]').off('click.context.remove.sing', '[data-btn="removeExceptAct"]');
                    });
                    $('.tab-panel.active iframe')[0].contentWindow.$('body').on('click.hide.context', function () {
                        $('.tab-panel.active iframe')[0].contentWindow.$('body').off('click.hide.context');
                        parent.$('#tabContextmenu').removeClass('open');
                        parent.$(document).off('click.context.remove.pl', '[data-btn="removeAll"]').off('click.context.remove.sing', '[data-btn="removeExceptAct"]');
                    });
                }
            }
            function checkResize () { // 自適應高度
                $(window).resize(function () {
                    var windowHei = window.innerHeight,
                        windowWid = window.innerWidth;
                    if (!currHei || currHei !== windowHei || !currWid || currWid !== windowWid) {
                        parent.iframeTab.iframeHeight();
                        currHei = windowHei;
                        currWid = windowWid;
                    }
                });
            }
            function offEvents () { // 解除命名空間為iframetab的事件綁定
                $(document).off('mouseup.iframetab').off('click.iframetab').off('iframetab.reloaded');
                $('#tabHeader').off('mousedown.iframetab').off('click.iframetab');
            }
            function testArry (evt) {
                if (!Array.isArray) {
                    Array.isArray = function (arg) {
                        return Object.prototype.toString.call(arg) === '[object Array]';
                    }
                }
                return Array.isArray(evt) ? 'array' : typeof evt;
            }
            function getData (ele, key) {
                var data = ele.dataset ? ele.dataset[key] : ele.getAttribute('data-' + key);
                return data;
            }

            $(document).on('iframetab.reloaded', checkResize);
            $(document).on('mouseup.iframetab', 'a[data-num]', stellung);
            if (isTop) {
                var changeCb = {
                    beforeChange: function () {
                        if (callback.beforeChange) {
                            return callback.beforeChange();
                        }
                    },
                    onChange: function () {
                        if (callback.onChange) {
                            callback.onChange();
                        }
                    },
                    afterChange: function () {
                        if (callback.afterChange) {
                            callback.afterChange();
                        }
                    }
                }, closeCb = {
                    beforeClose: function () {
                        if (callback.beforeClose) {
                            return callback.beforeClose();
                        }
                    },
                    onClose: function () {
                        if (callback.onClose) {
                            callback.onClose();
                        }
                    },
                    afterClose: function () {
                        if (callback.afterClose) {
                            callback.afterClose();
                        }
                    }
                }
                changeTab(changeCb);
                btnDel(closeCb);
                $('#tabHeader').on('mousedown.iframetab', creatContextmenu);
            }
            if ($('[data-source]').length) {
                $(document).on('mouseup.iframetab', '[data-source]', function () { // 點擊刷新tab
                    var source = getData(this, 'source');
                    $tabBody.find('iframe[src="' + source + '"]').attr('src', source);
                    iframeTab.iframeHeight();
                });
            }
            if ($('[data-btn="refresh"]').length) {
                $(document).on('click.iframetab', '[data-btn="refresh"]', function (e) { // 刷新當前iframe
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.reload(true);
                });
            }
            tab = {
                on: function () {
                    var len = arguments.length,
                        evt = arguments[0],
                        cbFunc = arguments[1],
                        evts,
                        evtType = testArry(evt),
                        i,
                        g;
                    switch (evtType) {
                        case 'string':
                            evts = evt.split(' ');
                            for (i = 0; i < len; i++) {
                                g = evts[i];
                                callback[g] = cbFunc;
                            }
                            break;
                        case 'object':
                            for (i in evt) {
                                callback[i] = evt[i];
                            }
                            break;
                        default:
                            console.error('Event type is unexceptable.');
                    }
                },
                off: function (evtName) {
                    var evt = evtName,
                        evts,
                        evtType = typeof evt,
                        hasVal = false,
                        isEmpty,
                        len,
                        i,
                        g;
                    switch (evtType) {
                        case 'string':
                            hasVal = (evt !== ' ');
                            if (hasVal) {
                                evts = evt.split(' ');
                                len = evts.length;
                                if (len === 1) {
                                    delete callback[evt];
                                } else {
                                    for (i = 0; i < len; i++) {
                                        g = evts[i];
                                        delete callback[g];
                                    }
                                }
                            }
                            break;
                        case 'undefined':
                            for (i in callback) {
                                delete callback[i];
                            }
                            break;
                    }
                },
                closeActIframe: function () {
                    parent.$('#tabHeader').find('li.active').find('[data-btn="close"]').click();
                },
                destroy: function () {
                    var i;
                    offEvents();
                    for (i in tab) {
                        if (i !== 'dispose') {
                            delete tab[i];
                        }
                    }
                },
                dispose: function (refName) {
                    offEvents();
                    eval(refName + ' = null;');
                    eval('delete ' + refName + ';');
                }
            }
            return tab;
        }
    }
}());
