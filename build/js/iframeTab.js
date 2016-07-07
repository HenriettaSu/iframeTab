/*
 * iframeTab
 * Version: 1.0.0
 *
 * Plugin that can simulate browser to open links as tab and iframe in a page
 *
 * https://github.com/HenriettaSu/iframeTab
 *
 * License: MIT
 *
 * Released on: July 7, 2016
*/

(function () {
    iframeTab = jQuery.prototype = {
        iFrameHeight: function() {
            var ifm = $(".tab-panel.active iframe")[0];
            var subWeb = $(document).frames ? $(document).frames["iframepage"].document : ifm.contentDocument;
            if(ifm != null && subWeb != null) {
                ifm.height = subWeb.body.scrollHeight;
            }
        },
        init: function (option) {
            var tnum = 0,
                p = window.parent.document,
                options = $.extend({
                    tabUl: '.tabs-header ul',
                    tabLi: '.tabs-header li',
                    tabBody: '.tabs-body',
                    tabPan: '.tab-panel',
                    closesBtnClass: 'fa fa-close',
                    newTabPan: '<div class="tab-panel active"><div class="right_col" role="main"></div></div>'
                }, option),
                tabUl = options.tabUl,
                tabLi = options.tabLi,
                tabBody = options.tabBody,
                tabPan = options.tabPan,
                closesBtnClass = options.closesBtnClass,
                newTabPan = options.newTabPan,
                tabCloseBtn = '[data-btn="close"]',
                closeBtn = tabLi + tabCloseBtn;

            $(document).on('mouseup touchend', 'a[data-num]', function () { // 任意位置的超鏈接
                
                var $this = $(this),
                    link = $this.attr('href'),
                    name = $this.attr('data-name') ? $this.data('name') : $this.text(),
                    mul = $this.data('mul'),
                    reload = $this.data('reload'),
                    $tabUl = $(tabUl, p),
                    $tabLi = $(tabLi, p),
                    $tabBody = $(tabBody, p),
                    $tabPan = $(tabPan, p),
                    tab = $tabUl.find('[data-name="' + name + '"]').data('tab'),
                    iframe = $('<iframe src="' + link + '" data-iframe="' + link + '" data-num="' + tnum + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" onload="iframeTab.iFrameHeight()"></iframe>');
                $this.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });

                // 插入新標籤
                function stellen() {
                    $tabLi.removeClass('active');
                    $tabUl.append('<li class="active" data-tab="' + link + '" data-name="' + name + '" data-num="' + tnum + '">' + name + '<i class="' + closesBtnClass + '" data-btn="close"></i></li>');
                    $tabPan.removeClass('active');
                    $tabBody.append(iframe);
                    iframe.wrap(newTabPan);
                    tnum = tnum + 1;
                }
                if ($(tabUl + ' [data-name="' + name + '"]', p).length > 0 && typeof mul === 'undefined') {
                    if (!$(tabUl + ' [data-tab="' + link + '"]', p).length > 0) {
                        $tabUl.find('[data-name="' + name + '"]').remove();
                        $tabBody.find('iframe[data-iframe="' + tab + '"]').remove();
                        stellen();
                    } else {
                        $tabLi.removeClass('active');
                        $tabUl.find('[data-tab="' + link + '"]').addClass('active');
                        $tabPan.removeClass('active');
                        $tabBody.find('iframe[data-iframe="' + link + '"]').parents(tabPan).addClass('active');
                        if (reload) {
                            $tabBody.find('iframe[data-iframe="' + link + '"]').attr('src', link);
                        }
                    }
                } else {
                    stellen();
                }
            });
            $(document).on('click', tabLi, function () { // 標籤欄切換
                var $this = $(this),
                    link = $this.data('tab'),
                    cnum = $this.data('num'),
                    $tabUl = $(tabUl),
                    $tabLi = $(tabLi),
                    $tabBody = $(tabBody),
                    $tabPan = $(tabPan);
                $tabLi.removeClass('active');
                $tabUl.find('[data-tab="' + link + '"][data-num="' + cnum + '"]').addClass('active');
                $tabPan.removeClass('active');
                $tabBody.find('iframe[data-iframe="' + link + '"][data-num="' + cnum + '"]').parents(tabPan).addClass('active');
            });
            $(document).on('click', tabCloseBtn, function (e) { // 刪除標籤
                var $this = $(this),
                    $li = $this.parents(tabLi),
                    tab = $li.data('tab'),
                    dnum = $li.data('num'),
                    $tabBody = $(tabBody),
                    $prev = $li.prev();
                $li.remove();
                $tabBody.find('iframe[data-iframe="' + tab + '"][data-num="' + dnum + '"]').parents(tabPan).remove();
                $prev.click();
                e.stopPropagation();
            });
            $(document).on('mouseup touchend', '[data-source]', function () { // 點擊刷新tab
                var $this = $(this),
                    source = $this.data('source'),
                    $tabBody = $(tabBody, p);
                $tabBody.find('iframe[data-iframe="' + source + '"]').attr('src', source);
                iframeTab.iFrameHeight();
            });
        }
    }
    
}());