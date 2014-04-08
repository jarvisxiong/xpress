var nokiaAdModule  = {
	params: {
		adtype: 'display',
		rtype: 'point',
		sver: '2.0',
		pub: 'xpress',
		app: 'nxn',
		id: widget.preferences['nokiaAdsUserID'],
		lat: '',
		lon: '',
		nmcc: '',

		// adsize: '216x36',
		maxads: '10'
	},
	servers: {
		"production": "http://lcapi.here.com/getTeaser?",
		"staging": "http://na.stage.nlcapi.com/getTeaser?",
		"testing": "http://na.verif.nlcapi.com/getTeaser?"
	},
	selectedServer: 'production',	// from which server ad's to be pulled
	currentAd: 0,
	adsResponse: [], // this will be filled, when we get the Ad's from server

	init: function (params) {
		var self = this;
		self.params.lat = params.latitude;
		self.params.lon = params.longitude;
		self.params.nmcc = params.mcc;
	},

	load: function (referer, successCallback, errorCallback) {
		var self = this;

		klog.start('ad');
		$.ajax({
			url: self.servers[self.selectedServer] + self.buildRequestString(),
			type: "GET",
			success: function (data) {
				klog.end('ad');

				data = data[0];
				if(data.ads && data.ads.id) {
					widget.preferences['nokiaAdsUserID'] = data.ads.id;
				}

				successCallback.call(referer, data.ads.display);
			},
			error: function () {
				klog.end('ad');
				errorCallback([]);
			}
		});
	},

	buildRequestString: function () {
		var self = this, query = [], key, value;

		for (key in self.params) {
			value = self.params[key];
			if (value) {
				query.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
			}
		}

		return query.join("&");
	}
};