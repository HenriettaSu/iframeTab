/*
 * iframeTab
 * Version: 2.1.0
 *
 * Plugin that can simulate browser to open links as tab and iframe in a page
 *
 * https://github.com/HenriettaSu/iframeTab
 *
 * License: MIT
 *
 * Released on: November 7, 2016
 */

(function () {
    iframeTab = jQuery.prototype = {
        iframeHeight: function(updateHeight) {
            var ifm = $('.active iframe')[0],
                subWeb = $(document).frames ? $(document).frames['iframepage'].document : ifm.contentDocument;
            if (updateHeight) {
                ifm.height = updateHeight;
            } else if (ifm != null && subWeb != null) {
                ifm.height = subWeb.body.scrollHeight;
            }
        },
        init: function (option) {
            var tnum = 0,
                p = window.parent.document,
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
                    callback: ''
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

            $.extend({
                btnDel: function (cb) {
                    $(document).on('click.tab.close', '.tabs-header li [data-btn="close"]', function (e) { // 刪除單個標籤
                        var $this = $(this),
                            $li = $this.parent(),
                            tab = $li.data('tab'),
                            dnum = $li.data('num'),
                            $tabUl = $('.tabs-header ul'),
                            $tabLi = $('.tabs-header li'),
                            $tabBody = $('.tabs-body'),
                            $prev = $li.prev(),
                            $next = $li.next(),
                            windowWidth = $(window).width(),
                            countWidth = 0;
                        cb.beforeClose();
                        $li.remove();
                        $tabBody.find('iframe[data-iframe="' + tab + '"][data-num="' + dnum + '"]').parents('.tab-panel').remove();
                        $tabLi.each(function () {
                            var _this = $(this),
                                liWidth = _this.width() > 0 ? _this.width() + 25 : _this.width();
                            countWidth += liWidth;
                        });
                        if ($('.tabs-header [data-btn="switch"]').length && countWidth < windowWidth - menuWidth) {
                            $('.tabs-header').find('[data-btn="switch"]').remove();
                            $(document).off('click.tab.switch');
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
                },
                changeTab: function (cb) {
                    $(document).on('click.tab.change', '.tabs-header li:not(.active)', function () { // 標籤欄切換
                        var $thisLi = $(this),
                            liLink = $thisLi.data('tab'),
                            cnum = $thisLi.data('num'),
                            $liTabUl = $('.tabs-header ul'),
                            $liTabLi = $('.tabs-header li'),
                            $liTabBody = $('.tabs-body'),
                            $liTabPan = $('.tab-panel'),
                            $activeIframe = $liTabBody.find('iframe[data-iframe="' + liLink + '"][data-num="' + cnum + '"]');
                        cb.beforeChange();
                        $liTabLi.removeClass('active');
                        $liTabPan.removeClass('active');
                        cb.onChange();
                        $liTabUl.find('li[data-tab="' + liLink + '"][data-num="' + cnum + '"]').addClass('active');
                        $activeIframe.parents('.tab-panel').addClass('active');
                        cb.afterChange();
                    });
                }
            });
            if ($('[data-source]').length) {
                $(document).on('mouseup', '[data-source]', function () { // 點擊刷新tab
                    var $this = $(this),
                        source = $this.data('source'),
                        $tabBody = $('.tabs-body', p);
                    $tabBody.find('iframe[src="' + source + '"]').attr('src', source);
                    iframeTab.iframeHeight();
                });
            }
            $(document).on('mouseup', 'a[data-num]', function (event) { // 任意位置的超鏈接
                var $this = $(this),
                    link = $this.attr('href'),
                    name = $this.attr('data-name') ? $this.data('name') : $this.text(),
                    mul = $this.data('mul'),
                    reload = $this.data('reload'),
                    $tabUl = $('.tabs-header ul', p),
                    $tabLi = $('.tabs-header li', p),
                    $tabBody = $('.tabs-body', p),
                    $tabPan = $('.tab-panel', p),
                    tab = $tabUl.find('li[data-name="' + name + '"]').data('tab'),
                    iframe = $('<iframe src="' + link + '" data-iframe="' + link + '" data-num="' + tnum + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" onLoad="iframeTab.iframeHeight()" name="' + tnum + '"></iframe>');
                $this.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                // 插入新標籤
                function stellen(cb) {
                    var tabUlWidth = $tabUl.width(),
                        $newTabLiLast,
                        $newTabLiFirst;
                    cb.beforeCreat();
                    $tabLi.removeClass('active');
                    $tabUl.append('<li class="active ' + tabLiClass + '" data-tab="' + link + '" data-name="' + name + '" data-num="' + tnum + '">' + name + '<i class="' + closesBtnClass + '" data-btn="close"></i></li>');
                    if (!$('.tabs-header [data-btn="switch"]').length && $tabUl.height() > singleLineheight) {
                        $newTabLiLast = $tabUl.find('li:last-child');
                        $tabUl.width(tabUlWidth - 30);
                        $tabUl.addClass('hide-tab');
                        $tabUl.after('<i class="' + switchBtnDown + ' fold-switch" data-btn="switch"></i>');
                        $(document).on('click.tab.switch', '.tabs-header [data-btn="switch"]', function () {
                            var _this = $(this);
                            _this.toggleClass(switchBtnDown);
                            _this.toggleClass(switchBtnUp);
                            $tabUl.toggleClass('hide-tab');
                        });
                        $newTabLiLast.remove();
                        $tabUl.find('li:first-child').before($newTabLiLast);
                    } else if ($('.tabs-header [data-btn="switch"]').length) {
                        $newTabLiFirst = $tabUl.find('li:last-child');
                        $newTabLiFirst.remove();
                        $tabUl.find('li:first-child').before($newTabLiFirst);
                    }
                    $tabPan.removeClass('active');
                    $tabBody.append(iframe);
                    iframe.wrap('<div class="tab-panel active ' + tabPanClass + '"></div>');
                    iframe.wrap(iframeBox);
                    cb.onCreat();
                    $(iframe).load(function () {
                        cb.afterCreat();
                    });
                    tnum = tnum + 1;
                }
                if (event.which === 1) {
                    var cb = {
                        beforeCreat: function () {
                            if (callback.beforeCreat) {
                                callback.beforeCreat();
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
                    if ($('.tabs-header li[data-name="' + name + '"]', p).length > 0 && typeof mul === 'undefined') {
                        if (!$('.tabs-header li[data-tab="' + link + '"]', p).length > 0) {
                            $tabUl.find('li[data-name="' + name + '"]').remove();
                            $tabBody.find('iframe[data-iframe="' + tab + '"]').remove();
                            stellen(cb);
                        } else {
                            $tabLi.removeClass('active');
                            $tabUl.find('li[data-tab="' + link + '"]').addClass('active');
                            $tabPan.removeClass('active');
                            $tabBody.find('iframe[data-iframe="' + link + '"]').parents('.tab-panel').addClass('active');
                            if (reload === 'ja') {
                                $tabBody.find('iframe[data-iframe="' + link + '"]').attr('src', link);
                            }
                        }
                    } else {
                        stellen(cb);
                    }
                }
            });
            if ($('.tabs-header li', p).length === 1) {
                var changeCb = {
                    beforeChange: function () {
                        if (callback.beforeChange) {
                            callback.beforeChange();
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
                            callback.beforeClose();
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
                $.changeTab(changeCb);
                $.btnDel(closeCb);
            }
            $('.tabs-header').on('mousedown', function (e) { // 右鍵菜單
                var $this = $(this),
                    x = e.clientX,
                    y = e.clientY,
                    windowWidth = window.innerWidth,
                    contextmenu = '<div class="tab-contextmenu ' + contextmenuClass + '" style="top: ' + y + 'px">' +
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
                    if ($('.tab-contextmenu').length) {
                        $('.tab-contextmenu').remove();
                    }
                    $('body').before(contextmenu);
                    if (windowWidth - x > contextmenuWidth) {
                        $('.tab-contextmenu').css('left', x);
                    } else {
                        $('.tab-contextmenu').css('right', contextmenuWidth);
                    }
                    $(document).on('click.context.remove.pl', '[data-btn="removeAll"]', function removeAll() { // 关闭所有标签
                        $('.tabs-header li:not(.tab-keep)').remove();
                        $('.tab-panel:not(.tab-keep)').remove();
                        $('.tabs-header li.tab-keep').click();
                    });
                    $(document).on('click.context.remove.sing', '[data-btn="removeExceptAct"]', function () { // 关闭激活标签外所有标签
                        $('.tabs-header li, .tab-panel').each(function () {
                            var _this = $(this);
                            if (_this.is(':not(.tab-keep)') && _this.is(':not(.active)')) {
                                _this.remove();
                            }
                        });
                        $('.tabs-header li.active').click();
                    });
                    $('body').on('click.hide.context', function () { // 關閉右鍵菜單
                        $('body').off('click.hide.context');
                        $('.tab-contextmenu').remove();
                        $(document).off('click.context.remove.pl', '[data-btn="removeAll"]').off('click.context.remove.sing', '[data-btn="removeExceptAct"]');
                    });
                    $('.tab-panel.active iframe')[0].contentWindow.$('body').on('click.hide.context', function () {
                        $('.tab-panel.active iframe')[0].contentWindow.$('body').off('click.hide.context');
                        parent.$('.tab-contextmenu').remove();
                        parent.$(document).off('click.context.remove.pl', '[data-btn="removeAll"]').off('click.context.remove.sing', '[data-btn="removeExceptAct"]');
                    });
                }
            });
            $(document).on('click', '[data-btn="refresh"]', function () { // 刷新當前iframe
                window.location.reload(true);
            });
        },
        closeActIframe: function () {
            parent.$('.tabs-header li.active [data-btn="close"]').click();
        }
    }

}());
