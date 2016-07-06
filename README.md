# iframeTab plug-in for jQuery

iframeTab是一個利用jQuery JavaScript模擬瀏覽器多窗口+標籤開啟頁面的插件。盡量與HTML分離，插件配有默認樣式，但也提供參數讓你可以自己配置tab的樣式、模塊分佈，每個模塊的關係結構不超過三層。

將來，也將提供API讓你更方便更自由地拓展本插件，讓你輕易地使用本插件到你的頁面上。


## 使用

### JS

使用本默認框架的話這樣就可以了：

```js
iframeTab.init();
```

但我想你們會有自己的配置：

```js
iframeTab.init({
    tabUl: '.tabs-header ul',
    tabLi: '.tabs-header li',
});
```


### HTML

#### 超鏈接

這是最簡單的超鏈接，'data-num=0' 是必須包含的，否則會作為一般鏈接在瀏覽器窗口打開：

```html
<a href="iframeTab-demo.html" data-num="0">主頁</a>
```

標籤欄上每個頁面的名字默認是超鏈接上的文字，如果你希望有所不同的話，你可以使用 'data-name'，例如：

```html
<a href="iframeTab-demo.html" data-num="0" data-name="我才不是主頁">主頁</a>
```

#### 標籤欄結構

雖然允許你自己定義標籤欄的模塊，但還是有一個基本的結構。

```html
<ul>
  <li data-tab="iframeTab-demo">標籤一 <i data-btn="close"></i></li>
  <li data-tab="">標籤二 <i data-btn="close"></i></li>
</ul>
```

HTML標籤可以隨意更換，只要確保 'tabLi' 確實包含在 'tabUl' 之下，'.tab-close' 於 'tabLi' 下，之間添加別的元素也是沒有關係的。

#### iframe結構

同上iframe結構只要層級正確，之間添加什麼都可以。

```html
<div>
  <div>
    <iframe src="iframeTab-demo.html" data-iframe="iframeTab-demo" data-num="0" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" onload="iframeTab.iFrameHeight()"></iframe>
  </div>
</div>
```

第二個div為 'tabPan'，用來存放 '<iframe>'，第一個為 'tabBody'，以存放 'tabPan'。


## gulp

因為本插件涉及iframe操作，在本地直接打開將報錯，你需要在服務器上調試，本插件提供 'gulp' 調試方式，你可以以此進行插件模擬和代碼編譯。

可用的 'gulp' 命令如下：

* 'gulp' 運行服務器并編譯所有代碼
* 'gulp browser-sync' 運行服務器
* 'gulp watch' 進入watch模式
* 'gulp sass-to-css' 將sass編譯成css
* 'gulp minify-css' 壓縮css
* 'gulp jscompress' 壓縮js


## 分支說明

* 'build' 開發分支
* 'dist' 包含全部編譯後代碼的分支
* 'example' 示例頁面分支
* 'vendor' 其他插件分支


## 聯繫與討論

QQ：3088680950

如果發現八阿哥了或者有功能上的建議，推薦通過 'issue' 發起討論。


## License

[MIT license](https://opensource.org/licenses/MIT). 有好的想法歡迎提供。
