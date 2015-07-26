"use strict";
var fs = require("fs");
var juicer = require("juicer");


function setSiteDomain(sitesource, data){
	for(var i in sitesource){
		data[i] = sitesource[i];
	}
	return data;
}
var _template = {};
var layout_html = '';
module.exports = function(option) {
    option.cache = option.cache == false ? false : true;
    option.jviews = option.views || "/views_juicer/";
    option.views = option.views || "/views/";
    option.layout = option.layout || process.cwd() + option.jviews + "layout.html";
    option.layout = option.layout.indexOf(process.cwd()) >= 0 ? option.layout : process.cwd() + option.jviews + option.layout;
    option["tag::templateOpen"] = option["tag::templateOpen"] || "{@";
    option["tag::templateClose"] = option["tag::templateClose"] || "@}";
    option.domain = option.domain || {};
    return function(req, res, next) {
        res.jrender = function(view, data) {
        	data = data || {};
            view = view || "";
            view = view.indexOf(process.cwd() + option.views) >= 0 ? view : process.cwd() + option.views + view.replace(".html", "") + ".html";
            if (!view || !fs.existsSync(view)) {
            	var err = new Error();
            	err.status = 404;
                return next(err);
            }
            var layout = '';
            if( !!res.locals.layout ){
            	layout = res.locals.layout;
            	layout = layout.indexOf(process.cwd()+ option.jviews) >= 0 ? layout : process.cwd() + option.jviews + layout.replace(".html", "") + ".html";
            }
            if( !!layout && fs.existsSync(layout) ){
            	if( (option.cache && !layout_html) || !option.cache ){
            		layout_html = fs.readFileSync(layout, "utf-8") || [];
	            	var layout_tpl = layout_html.match(/{@([^{@}]*)@}/gi);
	            	for (var i = 0; i < layout_tpl.length; i++) {
	                    var reg = new RegExp(layout_tpl[i].replace("{","\\{").replace("}","\\}"),"g");
	                    if (layout_tpl[i] != "{@body@}") {
	                        var html = process.cwd() + option.jviews + layout_tpl[i].replace(/{@|@}/g, "").replace(".html", "") + ".html";
	                        html = fs.existsSync(html) ? fs.readFileSync(html, "utf-8") : "";
	                        layout_html = layout_html.replace(reg, html);
	                    }
	                }
            	}
                return res.send(juicer(layout_html.replace(/{@body@}/g, fs.readFileSync(view, "utf-8")),setSiteDomain(option.domain, data)));
            } else {

            	var view_html = fs.readFileSync(view, "utf-8");
            	var layout_tpl = view_html.match(/{@([^{@}]*)@}/gi) || [];
            	for (var i = 0; i < layout_tpl.length; i++) {
            		
            		var reg = new RegExp(layout_tpl[i].replace("{","\\{").replace("}","\\}"),"g");
            		if( (option.cache && !_template[layout_tpl[i]]) || !option.cache ){
            			
	                    var html = process.cwd() + option.jviews + layout_tpl[i].replace(/{@|@}/g, "").replace(".html", "") + ".html";
	                    _template[layout_tpl[i]] = fs.existsSync(html) ? fs.readFileSync(html, "utf-8") : "";
            		}
            		view_html = view_html.replace(reg,_template[layout_tpl[i]]);
                    
                }
                return res.send(juicer(view_html,setSiteDomain(option.domain, data)));
            }
        }
        next();
    }
}
// 废弃模板引擎
// var layout_html = '';
// module.exports = function(option) {
//     option.cache = option.cache == false ? false : true;
//     option.jviews = option.views || "/views_juicer/";
//     option.views = option.views || "/views/";
//     option.layout = option.layout || process.cwd() + option.jviews + "layout.html";
//     option.layout = option.layout.indexOf(process.cwd()) >= 0 ? option.layout : process.cwd() + option.jviews + option.layout;
//     option["tag::templateOpen"] = option["tag::templateOpen"] || "{@";
//     option["tag::templateClose"] = option["tag::templateClose"] || "@}";
//     option.domain = option.domain || {}
//     return function(req, res, next) {
//         res.locals.layout = res.locals.layout || option.layout;
//         res.jrender = function(view, data) {
//         	data = data || {};
//             view = view || "";
//             view = view.indexOf(process.cwd() + option.views) >= 0 ? view : process.cwd() + option.views + view.replace(".html", "") + ".html";
//             if (!view || !fs.existsSync(view)) {
//             	var err = new Error();
//             	err.status = 404;
//                 return next(err);
//             }
//             if( (!option.cache && !layout_html) || option.cache || res.locals.layout != option.layout ){
//             	layout_html = fs.existsSync(option.layout) ? fs.readFileSync(option.layout, "utf-8") : "";
//             	var layout_tpl = layout_html.match(/{@([^{@}]*)@}/gi);
//                 for (var i = 0; i < layout_tpl.length; i++) {
//                     var reg = new RegExp(layout_tpl[i].replace("{","\\{").replace("}","\\}"),"g");
//                     if (layout_tpl[i] != "{@body@}") {
//                         var html = process.cwd() + option.jviews + layout_tpl[i].replace(/{@|@}/g, "").replace(".html", "") + ".html";
//                         html = fs.existsSync(html) ? fs.readFileSync(html, "utf-8") : "";
//                         layout_html = layout_html.replace(reg, html);
//                     }
//                 }
//             }
// 			return res.send(juicer(layout_html.replace(/{@body@}/g, fs.readFileSync(view, "utf-8")),setSiteDomain(option.domain, data)));
//         }
//         next();
//     }
// }
