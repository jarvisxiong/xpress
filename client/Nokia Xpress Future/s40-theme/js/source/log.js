var klog = {
		'perfMetrics': 0,

		'kscope': {
			startTime: null,
			endTime: null
		},
		
		'ad': {
			startTime: null,
			endTime: null
		},
		
		start: function(_type){
			this[_type].startTime = (new Date()).getTime();
		},
		
		end: function(_type){
			this[_type].endTime = (new Date()).getTime();
		},

		time: function(_type){
			return ( this[_type].endTime - this[_type].startTime );
		},

		setPerfMetrics: function(_value){
			this.perfMetrics = _value;
		},
		
		display: function() {
			var _html = "";
			_html += "<div id='klog-tile'>";
			
			_html += "<div id='klog-title'>"+_DEFAULT_SERVER+"</div>";

			if(this.perfMetrics){
				_html += "<div>KSCOPE Server</div>";
				_html += "<div class='klog-time'>"+this.perfMetrics+" ms</div>";

				_html += "<div>Network Time</div>";
				_html += "<div class='klog-time'>"+( this.time('kscope')-parseInt(this.perfMetrics) )+" ms</div>";
			}else{
				_html += "<div>KSCOPE + Network</div>";
				_html += "<div class='klog-time'>"+this.time('kscope')+" ms</div>";
			}

			
			_html += "<div>AD Server</div>";
			_html += "<div class='klog-time'>"+this.time('ad')+" ms</div>";
			
			_html += "</div>";
			return _html;
		}

};
