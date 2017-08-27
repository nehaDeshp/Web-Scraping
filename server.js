var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  url = 'https://www.ebay.com/b/Cell-Phones-Smartphones/9355/bn_320094'; 
  request(url, function(error, response, html){
		
		if(!error){
			var j=0;
			var $ = cheerio.load(html);

			var arr_product_name = [], arr_price = [], arr_brand = [], arr_link = [], arr_image = [], arr_rating=[];
			var json = {product_name : "", price : "", brand: "", link : "" , image : ""};
		
		    $('.s-item__title').filter(function(){
			    var data = $(this).text();
				json.product_name = data.slice(0,20);
				arr_product_name.push(json.product_name);	
			})
			
			$('.s-item__price').filter(function(){
				var data = $(this).text();
				json.price = data;
				arr_price.push(json.price);	
			})
			
			$('.s-item__link').filter(function(){        
				var data = $(this).attr("href");		
				json.link = data;
				arr_link.push(json.link);	
			})
				
			$('.s-item__dynamic').filter(function(){
				var data = $(this).text();
				json.brand = data.slice(7,20);
				arr_brand.push(json.brand);	
			   })
			   
			$('.s-item__image-img').filter(function(){
			var data = $(this).attr("src");
			json.image = data;
			arr_image.push(json.image);
		    })
		   
		    j++;
		    var i;
		    var new_data = [];
			for(i=0;i<10;i++)
			{
				new_data[i] = "{\n\"Product Name\": "	+	"\""	+arr_product_name[i]+	"\",\n"	  +  
							   "\"Price\": "        +   "\""    +arr_price [i]      +   "\",\n"   + 
							   "\"Brand\": "        +   "\""    +arr_brand[i]       +   "\",\n"   + 
							   "\"Link\" : "        +   "\""    +arr_link[i]        +   "\",\n"   +  
							   "\"Image\": "        +   "\""    +arr_image[i]       +   "\",\n"   + 
							   "\"Rating\": "       +   "\""    +arr_rating[i]      +   "\"}\n"   ; 
				fs.appendFile('output.json', new_data[i], function (err) {
				})
			}		
		}
    res.send('Check your console!');
	})
})
app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
