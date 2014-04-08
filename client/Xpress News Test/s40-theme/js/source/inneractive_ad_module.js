var inneractiveAdModule  = {
	
	buildRequestString: function(){
		var self = this, 
			currentTime = (new Date()).getTime(),
			VERSION = "2.0.1-S40w-1.0.5",
			params = {
				"po":  	551,
				"test": "true",
				"time": currentTime,
				"v":  	VERSION,
				"f":    "4",    
				"aid": 	self.parameters.appID,
				"a":  	self.parameters.age ,
				"g":  	self.parameters.gender, 
				"k":  	self.parameters.keywords,
				"c":  	self.parameters.category,
				"l":  	self.parameters.location,
				"lg":  	self.parameters.GPSLocation,
				"hid":  self.parameters.deviceID,

				// optional - recommended
				// added by @RAGHAVA
				"w": self.parameters.deviceWidth,
				"rw": self.parameters.bannerWidth, 	// banner width
				"rh": self.parameters.bannerHeight,
				"mcc": self.parameters.mcc
			},
			query = [],
			key,
			value;

		for(key in params) {
			value = params[key];
			if(value){
				query.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
			} 
		}
		  
		return query.join("&");
	},

	parameters : {
			appID : "Nokia_kaleidoscope_Nokia", //must
			age : "",
			gender : "",
			keywords: "",
			category: "",
			location :"",
			GPSLocation: "",
			deviceID: "",
			
			deviceWidth: window.innerWidth,	// device width
			bannerWidth: "216", 	// banner width
			bannerHeight: "36", 	// banner height
			mcc: ""
	},

	init: function(_params){
		var self = this;
		self.parameters.GPSLocation = _params.latitude + ',' + _params.longitude;
		self.parameters.mcc = _params.mcc;
	},


	load: function(_referer, _successCallback, _errorCallback){	
		var self = this, 
			url = "http://m2m1.inner-active.mobi/simpleM2M/clientRequestEnhancedHtmlAd?" + self.buildRequestString();

		klog.start('ad');	
		$.ajax({
		    url: url,
		    type: "GET",
		    success: function(data){
		    	klog.end('ad');

				var response = $("<div>").html(data),
					_clone = response.find('a').clone(),
					_html = '<a href="'+_clone.attr('href')+'">'+_clone.html()+'</a>';

				_successCallback.call(_referer, [ { "html": _html } ] );
		    },
		    error: function(){
		    	klog.end('ad');
		    	_errorCallback(_referer, [ ] );
		    }
	    });
	}
}