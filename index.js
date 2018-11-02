const htmlent = require('html-entities');
const fs = require('fs');

function processSEO(page) {
	var seo = this.config.get('pluginsConfig')['myseo']
	if(seo.titlePrefix){
		var title = seo.titlePrefix + page.title;
		page.content = page.content + '\n<div id="title---">' + title + '</div>';
	}
	if(seo.keywords){
		page.content = page.content + '\n<div id="meta-keywords---">' + seo.keywords + '</div>';
	}
	if(seo.description){
		page.content = page.content + '\n<div id="meta-description---">' + seo.description + '</div>';
	}
	return page;
}

function makeSEO() {	
	var rootDir = this.output.root();
	var ignoreDir = rootDir + "/" + "gitbook";
	var batchModify = function (rootDir) {
		var files = fs.readdirSync(rootDir);
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var fpath = rootDir + "/" + file;
			if (/\.html$/.test(file)) {
				var data = fs.readFileSync(fpath, 'utf-8');
				// 描述和关键字
				var rule1 = /<meta name="description" [^>]+>/im;
				var rule2 = /<div id="meta-description---">([^>]+)?<\/div>/im;
				var rule3 = /<div id="meta-keywords---">([^>]+)?<\/div>/im;
				var match1 = rule1.exec(data);
				if(match1){
					var match2 = rule2.exec(data);
					if(match2){
						var descriptionHTML = '<meta name="description" content="' + htmlent.Html5Entities.decode(match2[1]) + '">';
						data = data.replace(match2[0], '');
						data = data.replace(match1[0], descriptionHTML);
					}
					var match3 = rule3.exec(data);
					if (match3) {
						var keywordsHTML = '<meta name="keywords" content="' + htmlent.Html5Entities.decode(match3[1]) + '">'
						data = data.replace(match3[0], '');
						if(descriptionHTML){
							data = data.replace(descriptionHTML, descriptionHTML + keywordsHTML);
						}else{
							data = data.replace(match1[0], match1[0] + keywordsHTML);
						}
					}
				}
				// 标题
				var rule5 = /<title>([^>]+)?<\/title>/im;
				var rule6 = /<div id="title---">([^>]+)?<\/div>/im;
				var match5 = rule5.exec(data);
				if(match5){
					var match6 = rule6.exec(data);
					if(match6){
						data = data.replace(match6[0], '');
						data = data.replace(match5[0], '<title>' + htmlent.Html5Entities.decode(match6[1]) + '</title>')
					}
				}
				fs.writeFileSync(fpath, data, 'utf-8');
			} else if (fpath != "." &&
				fpath != ".." &&
				fpath != ignoreDir &&
				fs.lstatSync(fpath).isDirectory()) {
				batchModify(fpath);
			}
		}
	};
	batchModify(rootDir);
}

module.exports = {
	// Map of hooks
	hooks: {
		'page:before': processSEO,
		'finish': makeSEO
	},

	// Map of new blocks
	blocks: {},

	// Map of new filters
	filters: {}
};
