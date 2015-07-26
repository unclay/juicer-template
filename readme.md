## 基于juicer的模板引擎
引入juicer，基于express开发个人使用的模板引擎，它是一个中间件

## demo
	
	var express = require("express");
	var jTemp = require("juicer-template");
	var app = express();
	app.use(jTemp({}));

## api
调用时需传入一个json对象参数
+ cache, 默认true, 即默认使用模板缓存
+ jviews, 默认"views_juicer", 存放模板文件的目录
+ views, 默认"views", 存放视图文件的目录
+ domain, 默认为空对象{}, 用于定义domain变量

## 详细demo，待定

## 单元测试，待定