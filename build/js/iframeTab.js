/*
 * iframeTab
 * Version: 2.3.4
 *
 * Plugin that can simulate browser to open links as tab and iframe in a page
 *
 * https://github.com/HenriettaSu/iframeTab
 *
 * License: MIT
 *
 * Released on: February 03, 2017
 */
(function () {
    iframeTab = jQuery.prototype = {
        iframeHeight: function(updateHeight) {
            var ifm = $('.active iframe')[0],
                subWeb = $(document).frames ? $(document).frames['iframepage'].document : ifm.contentDocument;
            if (updateHeight) {
                ifm.height = updateHeight;
            } else if (ifm !== null && subWeb !== null) {
                ifm.height = subWeb.body.scrollHeight;
            }
        },
        init: function (option) {
            var _tab = this,
                tab = _tab.prototype,
                act = 'active',
                isTop = (top === self),
                isOpen = false,
                isSwitch = false,
                p = isTop ? null : window.parent.document,
                $tabUl = $('.tabs-header ul', p),
                $tabBody = $('.tabs-body', p),
                options = $.extend({
                    tabLiClass: '',
                    tabPanClass: '',
                    closesBtnClass: 'fa fa-close',
                    switchBtnDown: 'fa fa-chevron-down',
                    switchBtnUp: 'fa fa-chevron-up',
                    contextmenuClass: 'dropdown open',
                    iframeBox: '<div class="right_col" role="main"></div>',
                    singleLineheight: 92,
                    menuWidth: 230,
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
                    link = $this.attr('href'),
                    name = $this.attr('data-name') ? $this.data('name') : $this.text(),
                    date = new Date().getTime(),
                    mul = $this.data('mul'),
                    reload = $this.data('reload'),
                    $tabLi = $('.tabs-header li', p),
                    $tabPan = $('.tab-panel', p),
                    tab = $tabUl.find('li[data-name="' + name + '"]').data('tab'),
                    tempLi = '<li class="active ' + tabLiClass + '" data-tab="' + link + '" data-name="' + name + '" data-num="' + date + '">' + name + '<i class="' + closesBtnClass + '" data-btn="close"></i></li>',
                    $iframe = $('<iframe src="' + link + '" data-iframe="' + link + '" data-num="' + date + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" onLoad="iframeTab.iframeHeight()" name="' + date + '"></iframe>');
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
                        return false
                    }
                    tabList[link] = true;
                    $tabLi.removeClass(act);
                    $tabUl.append(tempLi);
                    if (!isSwitch && $tabUl.height() > singleLineheight) {
                        $newTabLiLast = $tabUl.find('li:last-child');
                        $tabUl.width(tabUlWidth - 30);
                        $tabUl.addClass('hide-tab');
                        $tabUl.after('<i class="' + switchBtnDown + ' fold-switch" data-btn="switch"></i>');
                        isSwitch = true;
                        $('.tabs-header').on('click.iframetab.switch', '[data-btn="switch"]', function () {
                            var _this = $(this);
                            _this.toggleClass(switchBtnDown);
                            _this.toggleClass(switchBtnUp);
                            $tabUl.toggleClass('hide-tab');
                        });
                        $newTabLiLast.remove();
                        $tabUl.find('li:first-child').before($newTabLiLast);
                    } else if (isSwitch) {
                        $newTabLiFirst = $tabUl.find('li:last-child');
                        $newTabLiFirst.remove();
                        $tabUl.find('li:first-child').before($newTabLiFirst);
                    }
                    $tabPan.removeClass(act);
                    $tabBody.append($iframe);
                    $iframe.wrap('<div class="tab-panel active ' + tabPanClass + '"></div>');
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
                        $tabUl.find('li[data-tab="' + link + '"]').addClass('active');
                        $tabPan.removeClass(act);
                        $tabBody.find('iframe[data-iframe="' + link + '"]').parents('.tab-panel').addClass(act);
                        if (reload) {
                            $tabBody.find('iframe[data-iframe="' + link + '"]').attr('src', link);
                        }
                    } else {
                        stellen(cb);
                    }
                }
            }
            function changeTab (cb) { // 切換標籤
                $('.tabs-header').on('click.iframetab', 'li:not(.active)', function () {
                    var $thisLi = $(this),
                        liLink = $thisLi.data('tab'),
                        date = $thisLi.data('num'),
                        $liTabUl = $('.tabs-header ul'),
                        $liTabLi = $('.tabs-header li'),
                        $liTabBody = $('.tabs-body'),
                        $liTabPan = $('.tab-panel'),
                        $activeIframe = $liTabBody.find('iframe[data-iframe="' + liLink + '"][data-num="' + date + '"]'),
                        beforeChangeBoolean;
                    beforeChangeBoolean = cb.beforeChange();
                    if (beforeChangeBoolean === false) {
                        return false
                    }
                    $liTabLi.removeClass(act);
                    $liTabPan.removeClass(act);
                    cb.onChange();
                    $liTabUl.find('li[data-tab="' + liLink + '"][data-num="' + date + '"]').addClass(act);
                    $activeIframe.parents('.tab-panel').addClass(act);
                    cb.afterChange();
                });
            }
            function btnDel (cb) { // 關閉標籤
                $('.tabs-header').on('click.iframetab', 'li [data-btn="close"]', function (e) {
                    var $this = $(this),
                        $li = $this.parent(),
                        tab = $li.data('tab'),
                        date = $li.data('num'),
                        $tabLi = $('.tabs-header li'),
                        $prev = $li.prev(),
                        $next = $li.next(),
                        windowWidth = $(window).width(),
                        countWidth = 0,
                        beforeCloseBoolean;
                    beforeCloseBoolean = cb.beforeClose();
                    if (beforeCloseBoolean === false) {
                        return false
                    }
                    delete tabList[tab];
                    $li.remove();
                    $tabBody.find('iframe[data-iframe="' + tab + '"][data-num="' + date + '"]').parents('.tab-panel').remove();
                    $tabLi.each(function () {
                        var _this = $(this),
                            liWidth = _this.width() > 0 ? _this.width() + 25 : _this.width();
                        countWidth += liWidth;
                    });
                    if (isSwitch && countWidth < windowWidth - menuWidth) {
                        $('.tabs-header').off('click.iframetab.switch').find('[data-btn="switch"]').remove();
                        isSwitch = false;
                        $tabUl.toggleClass('hide-tab');
                        $tabUl.width('auto');
                    }
                    cb.onClose();
                    if (typeof $prev.html() === 'undefined') {
                        $next.click();
                    } else {
                        $prev.click();
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
                    contextmenu = '<div class="tab-contextmenu ' + contextmenuClass + '">' +
                        '<ul class="dropdown-menu">' +
                        '<li><a href="javascript: void(0)" data-btn="removeAll">关闭所有标签</a></li>' +
                        '<li><a href="javascript: void(0)" data-btn="removeExceptAct">关闭激活标签外所有标签</a></li>' +
                        '</ul>' +
                        '</div>',
                    contextmenuWidth = 180;
                if (e.which === 3) {
                    $this.on('contextmenu', function (event) {
                        event.preventDefault();
                    });
                    if (isOpen) {
                        $('.tab-contextmenu').addClass('open');
                    } else {
                        $('body').after(contextmenu);
                        isOpen = true;
                    }
                    if (windowWidth - x > contextmenuWidth) {
                        $('.tab-contextmenu').css('left', x);
                    } else {
                        $('.tab-contextmenu').css('right', contextmenuWidth);
                    }
                    $('.tab-contextmenu').css('top', y);
                    $(document).on('click.context.remove.pl', '[data-btn="removeAll"]', function removeAll() { // 關閉所有標籤
                        $('.tabs-header li:not(.tab-keep)').remove();
                        $('.tab-panel:not(.tab-keep)').remove();
                        $('.tabs-header li.tab-keep').click();
                        if (isSwitch) {
                            $('.tabs-header').off('click.iframetab.switch').find('[data-btn="switch"]').remove();
                            $tabUl.removeClass('hide-tab');
                            $tabUl.width('auto');
                            isSwitch = false;
                        }
                        tabList = {};
                    });
                    $(document).on('click.context.remove.sing', '[data-btn="removeExceptAct"]', function () { // 关闭激活标签外所有标签
                        $('.tabs-header li, .tab-panel').each(function () {
                            var _this = $(this),
                                tab = _this.data('tab');
                            if (_this.is(':not(.tab-keep)') && _this.is(':not(.active)')) {
                                _this.remove();
                                delete tabList[tab]
                            }
                        });
                        $('.tabs-header li.active').click();
                        if (isSwitch) {
                            $('.tabs-header').off('click.iframetab.switch').find('[data-btn="switch"]').remove();
                            $tabUl.removeClass('hide-tab');
                            $tabUl.width('auto');
                            isSwitch = false;
                        }
                    });
                    $('body').on('click.hide.context', function () { // 關閉右鍵菜單
                        $('body').off('click.hide.context');
                        $('.tab-contextmenu').removeClass('open');
                        $(document).off('click.context.remove.pl', '[data-btn="removeAll"]').off('click.context.remove.sing', '[data-btn="removeExceptAct"]');
                    });
                    $('.tab-panel.active iframe')[0].contentWindow.$('body').on('click.hide.context', function () {
                        $('.tab-panel.active iframe')[0].contentWindow.$('body').off('click.hide.context');
                        parent.$('.tab-contextmenu').removeClass('open');
                        parent.$(document).off('click.context.remove.pl', '[data-btn="removeAll"]').off('click.context.remove.sing', '[data-btn="removeExceptAct"]');
                    });
                }
            }
            function offEvents () { // 解除命名空間為iframetab的事件綁定
                $(document).off('mouseup.iframetab').off('click.iframetab');
                $('.tabs-header').off('mousedown.iframetab').off('click.iframetab');
            }
            function testArry (evt) {
                return Array.isArray(evt) ? 'array' : typeof evt;
            }

            $(window).resize(function () {
                parent.iframeTab.iframeHeight();
            });
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
                $('.tabs-header').on('mousedown.iframetab', creatContextmenu);
            }
            if ($('[data-source]').length) {
                $(document).on('mouseup.iframetab', '[data-source]', function () { // 點擊刷新tab
                    var $this = $(this),
                        source = $this.data('source');
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
                    parent.$('.tabs-header li.active [data-btn="close"]').click();
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
