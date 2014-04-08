var adsBox  = {
    run: true,
    currentAd: 0,
    adsResponse: [], // this will be filled, when we get the Ad's from server
    latitude: '',
    longitude: '',
    adSource: (( widget.preferences['nokiaAdsSource'] ) ? widget.preferences['nokiaAdsSource'] : 'nokia'),

    init: function() {
        var self = this;
        self.load();
        
        /*
         if(widget.preferences['accessLocationAllowed'] === 'true') {
            navigator.geolocation.getCurrentPosition(function(position){
                self.latitude = position.coords.latitude;
                self.longitude = position.coords.longitude;
                self.load();
                });
        }else{
            self.load();
        }
        */
    },

   load: function(){
        var self = this;
        if(self.adSource === 'nokia'){
            nokiaAdModule.init({
                'latitude': self.latitude,
                'longitude': self.longitude,
                'mcc': _METADATA['countryCode']
            });
           nokiaAdModule.load(this, self.onSuccess, self.onFailure);
        }else if(self.adSource === 'inneractive'){
            inneractiveAdModule.init({
                'latitude': self.latitude,
                'longitude': self.longitude,
                'mcc': _METADATA['countryCode']
            });
           inneractiveAdModule.load(this, self.onSuccess, self.onFailure);
        }
	},

    onSuccess: function(_response){
        var self = this;
        if(_response.length){
            self.adsResponse = self.adsResponse.concat( _response );
     }else{
            self.onFailure();
        }
    },

    onFailure: function(){
        // console.info('failure');
    },

    isReady: function(){
        var self = this;
        return (self.adsResponse.length)? true : false;
    },
    
    display: function(){
        var self = this;
        if(!self.isReady())
            return '';
        
        return '<div id="adBanner"><div id="adTitle">Advertisement</div><div id="adContainerOuter"><div id="adContainer">'+adsBox.render('return')+'</div></div></div>';
    },
    
    render: function(_type){
        var self = this;
        if(!self.isReady())
            return "No ad found";
        
        // if the number of ads < 2, pull next set of ad's
        if(self.adsResponse.length < 2){
            self.load(false);
        }

        self.currentAd = Math.floor(Math.random() * self.adsResponse.length);

        var _html = '';
        if(self.adSource === 'nokia'){
            var _image = self.adsResponse[ self.currentAd ].image,
                _link = self.adsResponse[ self.currentAd ].action,
                _track = self.adsResponse[ self.currentAd ].track;
            
            _html = '<img src="'+_image+'" onclick="mwl.loadURL(\''+ _link +'\');">';
            
            // if track url exists
            if(_track && _track !== null && _track !== ''){
                $("#adTrackingImage").attr({'src': _track});
            }else{
                $("#adTrackingImage").attr({'src': ''});
            }
            
        }else if(self.adSource === 'inneractive'){
            _html = self.adsResponse[ self.currentAd ].html;
        }

        // remove the AD from the list
        self.adsResponse.splice(self.currentAd, 1);

        if(_type === 'return')
            return _html;
        else
            $("#adContainer").html(_html);
    }
};