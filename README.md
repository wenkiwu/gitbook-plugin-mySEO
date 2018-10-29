# gitbook-plugin-mySEO

### 引用

``` json
"plugins": [
    "mySEO@git+https://github.com/WuWenhui/gitbook-plugin-mySEO.git"
],
```

### 配置

``` json
"pluginsConfig": {
    "mySEO":{
        "titlePrefix": "标题前缀",
        "description": "页面描述",
        "keywords": "关键字1,,关键字2,关键字3"
    }
}
```


如果 build 时报错
```
PluginError: Error with plugin "mySEO": Cannot find module 'html-entities'
```
直接在项目目录使用`npm install html-entities`安装模块即可
