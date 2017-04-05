# iframeTab plug-in for jQuery 2.3.7

jQuery iframeTab是一個模擬瀏覽器多窗口 + 標籤開啟頁面的插件，在標籤過多情況下將自動折疊成一行，還可右鍵關閉所有標籤。

除了樣式可以自由配置，還可配置事件回調函數。為了能更好更方便地操作本插件，iframeTab提供了API去對已初始化的對象進行操作。

#### 給我提供主機的離老闆最近忙於工作和公眾號，並沒有時間給我更新主頁。插件的更新日誌和使用說明請在 `example` 分支裡查看。


## DEMO演示 & API文檔

[示例](http://henrie.pursuitus.com/adminTemplate/)


## 最近更新

ver 2.3.7

1. **重要整改：**html結構修改，原本在 `<iframe>` 上的 `data-num` 和 `data-iframe` 屬性放到 `div.tab-panel` 上，參數不變；
2. 修復標籤爛展開狀態下，刪除標籤後，折疊按鈕無法再次出現bug；
3. 左側菜單寬度默認值從230改為0，如需設定，可將菜單欄 `id` 設為 `leftMenu` ，或自行在初始化時通過option設定數值；
4. 部分jQuery的代碼替換成JavaScript；

ver 2.3.6.1 on 04.01.2017

1. 更新教程文件和README，增加了關於樣式的說明；

ver 2.3.6.1 on 03.31.2017

1. 修復IE8以下，resize多次執行bug；

## 使用

### JS

初始化iframeTab並返回實例：

```js
var tab = iframeTab.init();
```

但我想你們會有自己的配置：

```js
var tab = iframeTab.init({
    closesBtnClass: 'fa fa-close',
    callback: {
        beforeChange: function () {
            $('.tab-panel.active iframe').hide();
        },
        onChange: function () {
            $('.tab-panel.active iframe').hide();
        },
        afterChange: function () {
            $('.tab-panel.active iframe').hide();
        }
    }
});
```


### HTML

#### 超鏈接

這是最簡單的超鏈接，`data-num=0` 是必須包含的，否則會作為一般鏈接在瀏覽器窗口打開：

```html
<a href="iframeTab-demo.html" data-num="0">主頁</a>
```

標籤欄上每個頁面的名字默認是超鏈接上的文字，如果你希望有所不同的話，你可以使用 `data-name`，例如：

```html
<a href="iframeTab-demo.html" data-num="0" data-name="我才不是主頁">主頁</a>
```

#### 標籤欄結構

```html
<div id="tabHeader">
	<ul>
    	<li class="active tab-keep" data-tab="my-desktop.html" data-num="0">首頁</li>
    	<li data-tab="tabPage.html">標籤頁 <i data-btn="close"></i></li>
	</ul>
</div>>
```

`<li>` 中的 `data-tab` 應與對應的iframe頁 `<iframe>` 中的 `src` 和 `data-iframe` 保持一致，內容應為iframe的 `src` 屬性。同時也必須包含 `data-num="0"` 。

`li.active` 表示當前標籤已激活，`li.tab-keep` 表示右鍵刪除所有標籤時將保留當前標籤。
若需添加 `data-btn="close"` 為刪除標籤按鈕。

#### iframe結構

```html
<div id="tabBody">
    <div class="tab-panel tab-keep active" data-iframe="my-desktop.html" data-num="0">
        <!-- 包裹iFrame的外部元素，可按自己需求更改，如需設置，應同時在option中配置iframeBox -->
        <div class="right_col" role="main">
            <iframe src="my-desktop.html" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" onload="iframeTab.iframeHeight()" height="188"></iframe>
        </div>
    </div>
</div>
```

`<iframe>` 中的 `src` 和 `data-iframe` 應與對應的標籤 `<li>` 中的 `data-tab` 保持一致，內容應為iframe的 `src` 屬性。同時也必須包含 `data-num="0"` 。

`.tab-panel.active` 表示當前iframe已激活，`.tab-panel.tab-keep` 表示右鍵刪除所有標籤時將保留當前iframe頁。

```html
<div class="right_col" role="main">
```
為 `div.tab-panel` 和 `<iframe>` 間的容器，並非必要，若需自行配置或不需要該容器，可在option中配置 `iframeBox` 參數。

### CSS

雖然css都是自由搭配，但有幾個影響功能的樣式是必須要加上的（以下代碼摘自本demo未經過編譯的iframeTab.scss文件，僅供參考，選擇器請按需自行搭配）：

```scss
.tabs-body {
  .tab-panel {
    display: none; /*隱藏窗口*/
    &.active {
      display: block; /*顯示窗口*/
	}
	iframe {
	  width: 100%;  /*iframe寬度*/
	}
  }
}
.tab-contextmenu {
  position: absolute; /*右鍵菜單位置*/
}
.tabs-header {
  ul {
    li {
	  &.active {
        /*激活狀態標籤樣式*/
	  }
	}
    &.hide-tab {
      height: 90px; /*標籤欄折疊高度*/
    }
  }
}
```

#### 重要提示

1. 標籤激活狀態和窗口的顯隱務必通過 `.active` 控制；
2. 標籤關閉圖標和標籤欄折疊圖標都是自行設計的，若非項目已有使用，不建議按照本demo引用文件。兩個圖標的樣式可通過初始化時傳遞參數設置，詳情請參看教程頁面；

## gulp

因為本插件涉及iframe操作，在本地直接打開將報錯，你需要在服務器上調試，本插件提供 `gulp` 調試方式，你可以以此進行插件模擬和代碼編譯。

可用的 `gulp` 命令如下：

* `gulp` 運行服務器并編譯所有代碼
* `gulp browser-sync` 運行服務器
* `gulp watch` 進入watch模式
* `gulp sass-to-css` 將sass編譯成css
* `gulp minify-css` 壓縮css
* `gulp jscompress` 壓縮js


## 分支說明

* `build` 開發分支
* `dist` 包含全部編譯後代碼的分支
* `example` 示例頁面分支
* `vendor` 其他插件分支


## 聯繫與討論

QQ：3088680950

如果發現八阿哥了或者有功能上的建議，推薦通過 `issue` 發起討論。


## License

[MIT license](https://opensource.org/licenses/MIT). 有好的想法歡迎提供。
