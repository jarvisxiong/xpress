var filters = (function(){
		var arr = {
			'WHATSHOT': 'Filter1',
			'RECOM': 'Filter2',
			'LIKE': 'Filter3'
		}

		return {

			alias: function(filter){
				return arr[filter];
			},

			exists: function(filter){
				return ((widget.preferences[filter+'_highlightFlag'] !== null) || (widget.preferences[filter+'_highlightFlag'] !== undefined)) ? true : false;
			},

			check: function(filter){
				return (widget.preferences[filter+'_highlightFlag'] === 'show')? true : false;
			},
		
			render: function(){
				var filter = this.alias(Kismet.reqFilter);
				if(!this.exists(filter))
					return '';

				if(this.check(filter)){
					filter = "id_filterHighlightText_"+filter;
					return	"<div id='filter-message' class='show'>"
							+"	<div id='filter-message-text'>"+locale.get(filter)+"</div>"
							+"	<div id=\"filter-message-btn\"><img src=\"s40-theme/images/close-icon-blue.png\" width=\"18\" height=\"19\" onclick=\"mwl.switchClass('#filter-message', 'show', 'hide'); filters.close();\"/></div>"
							+"</div>";
				}
				return '';
			},

			close: function(){
				var filter = this.alias(Kismet.reqFilter);
				widget.preferences[filter+'_highlightFlag'] = 'hide';
				return false;
			},

			reset: function(){
				widget.preferences['Filter1_highlightFlag'] = null;
				widget.preferences['Filter2_highlightFlag'] = 'show';
				return false;
			}
		};
})();