/* Extending jQuery for $(selector).exist() */
(function($) {
    if (!$.exist) {
        $.extend({
            exist: function(elm) {
                if (typeof elm == null) return false;
                if (typeof elm != "object") elm = $(elm);
                return elm.length ? true : false;
            }
        });
        $.fn.extend({
            exist: function() {
                return $.exist($(this));
            }
        });
    }
})(jQuery);

/*******************************	VARIABLES DEFINIFITION STARTS 	***********************************/


var serverURL_AT="http://kscope-1176221292.us-east-1.elb.amazonaws.com:1085";

var _DEFAULT_SERVER = ''; // defualt value is stored in the config.xml
var _DEBUG_MODE = false;
var _LAZY_LOADING = false;

var serverURL, serverURLForImage;
var _SERVERS = {
	'staging_BM': {
		'kscope': 'http://kscope-pub-KSCOPE-1387383696.us-east-1.elb.amazonaws.com:1084',
		'image': 'http://kscope-pub-IMAGE-1285382265.us-east-1.elb.amazonaws.com:1083'
	},
	'dev': {
		'kscope': 'http://107.23.23.51:1084',
		'image': 'http://107.23.23.51:1083'
	},
	'qa': {
		'kscope': 'http://107.23.23.51:8080',
		'image': 'http://107.23.23.51:8081'
	},
	'secure_staging':{
		'kscope': 'http://106.120.131.36:8080',
		'image': 'http://106.120.131.36:8080/xpress/imageScale'
	}
};

var _METADATA = {
	'deviceID': '3450133665393951438',	// default
	'countryCode': '404',				// default, points to INDIA
	'logging': false					// shows the log detail as FIRST TILE
};


/*******************************	VARIABLES DEFINIFITION ENDS 	***********************************/

function attachAppScript(){
	$("head").append(
			$("<script>").attr({
				'src': 's40-theme/js/all-scripts.js'
			})
		);
}

function checkWhetherAcceptTC(){
	loadPreference();
	checkAcceptTCAndSwitchView();
}

function setAcceptTermAndCondition(){
	$("#terms-conditions").remove();
	widget.preferences['acceptTC'] = "YES";
	
	attachAppScript();
}

function checkAcceptTCAndSwitchView(){
	$("#containerid").removeClass('hide').addClass('show');
	attachAppScript();
}

function everythingIsFineRenderAppNow(){
	loadToolbarsAndOptionMenu();
	Kismet.renderFilter(Kismet.reqFilter);
	Kismet.setStoriesListAndDetailView();
}

function loadToolbarsAndOptionMenu(){
	showPage('OptionMenu');
}

function showPage(_type, _callback){
	var _path = "s40-theme/templates/";
	switch(_type){
		case 'ErrorMessage':

			if(!$("#error-page").exist()){		
				$.ajax({
					url: _path+'error.html', 
					success: function(data){
						$("body").append( 
							$("<div></div>").html( locale.tmpl( data, {
								'id_pageLoadError':				locale.get('id_pageLoadError'),
								'id_tryAgain': 					locale.get('id_tryAgain'),
								'id_errorMsg_settings_button': 	locale.get('id_errorMsg_settings_button'),
								'className':  					( (_DEBUG_MODE)? 'show' : 'hide' )
							}) ).children() );

						$('#containerid')
							.addClass('hide')
							.removeClass('show');
					}
				});
			}else{
				$("#error-page")
					.removeClass('hide')
					.addClass('show');

				$('#containerid')
					.addClass('hide')
					.removeClass('show');
			}

			break;	


		case 'TermsAndConditions':
			$.ajax({
				url: _path+'terms-conditions.html', 
				success: function(data){
					$("body").append( $("<div></div>").html( locale.tmpl( data, {
							'id_termsDescA':	locale.get('id_termsDescA'),
							'id_termsDescB': 	locale.get('id_termsDescB'),
							'id_termsDescC': locale.get('id_termsDescC'),
							'id_serviceTerms': 	locale.get('id_serviceTerms'),
							'id_and': 			locale.get('id_and'),
							'id_PrivacyPolicy': locale.get('id_PrivacyPolicy'),
							'id_accept_button': locale.get('id_accept_button')
						}) ).children() );
				}
			});

			break;


		case 'FilterMenu':
			$.ajax({
				url: _path+'filter-menu.html', 
				success: function(data){
					$("body").append( $("<div></div>").html( locale.tmpl( data, {
							'id_filterTile':			locale.get('id_filterTile'),
							'id_filterName_Filter1': 	locale.get('id_filterName_Filter1'),
							'id_filterName_Filter2': 	locale.get('id_filterName_Filter2')
						}) ).children() );

					if(_callback !== undefined && $.isFunction(_callback)){ _callback(); }
				}
			});

			break;
		
		case 'OptionMenu':
			$.ajax({
				url: _path+'option-menu.html', 
				success: function(data){
					$("body").append( $("<div></div>").html( locale.tmpl( data, {
							'id_options':				locale.get('id_options'),
							'id_joinUsOnFacebook': 		locale.get('id_joinUsOnFacebook'),
							'id_tellUsWhatYouThink': 	locale.get('id_tellUsWhatYouThink'),
							'id_clearPersonalData':		locale.get('id_clearPersonalData'),
							'id_settings': 				locale.get('id_errorMsg_settings_button'),
							'id_about': 				locale.get('id_about')
						}) ).children() );
				}
			});

			break;


		case 'About':

			if(!$("#about-page").exist()){
				$.ajax({
					url: _path+'about.html', 
					success: function(data){
						$("body").append( $("<div></div>")
							.html( locale.tmpl( data, {
								'id_aboutTitle':	locale.get('id_aboutTitle'),
								'id_read': 			locale.get('id_read'),
								'id_serviceTerms': 	locale.get('id_serviceTerms'),
								'id_and': 			locale.get('id_and'),
								'id_PrivacyPolicy': locale.get('id_PrivacyPolicy'),
								'id_aboutVer': 		locale.get('id_aboutVer'),
								'id_appVersion': 	widget.version
							})).children());

						$('#options-menu')
							.removeClass('show')
							.addClass('hide');
					}
				});
			}else{
				$("#about-page")
					.removeClass('hide')
					.addClass('show');

				$('#options-menu')
						.removeClass('show')
						.addClass('hide');
			}
			break;
						
		case 'PesonalData':
			if(!$("#personal-data").exist()){
				$.ajax({
					url: _path+'personal-data.html', 
					success: function(data){
						$("body").append( $("<div></div>")
							.html( locale.tmpl( data, {
								'id_clearPersonalDataTitle':	locale.get('id_clearPersonalDataTitle'),
								'id_clearPersonalDataDesc': 	locale.get('id_clearPersonalDataDesc'),
								'id_clearPersonalDataNotification': 	locale.get('id_clearPersonalDataNotification'),
								'id_reset': 					locale.get('id_reset')
							}) ).children());

						$('#options-menu')
							.removeClass('show')
							.addClass('hide');
					}
				});
			}else{
				$('#personal-data')
							.removeClass('hide')
							.addClass('show');

				$('#options-menu')
							.removeClass('show')
							.addClass('hide');
			}
							
			break;
		
		case 'Settings':
			if(!$("#settings-page").exist()){
				$.ajax({
					url: _path+'settings.html', 
					success: function(data){
						$("body").append( $("<div></div>")
							.html(data).children());

						$('#options-menu')
							.removeClass('show')
							.addClass('hide');

						preFillSettings();
					}
				});
			}else{
				$('#settings-page')
							.removeClass('hide')
							.addClass('show');

				$('#options-menu')
							.removeClass('show')
							.addClass('hide');
			}			
			break;
	}
}


/*
 * SETTINGS functions
 */

function loadPreference(){
	if (typeof widget != 'undefined') {
	 if (typeof widget.preferences['acceptTC'] == 'undefined') {
		 widget.preferences['acceptTC'] = "NO";
	 }
	 
	 // for settings
	 if (widget.preferences['debugServer'] == 'undefined' || widget.preferences['debugServer'] == '') {
		 _DEFAULT_SERVER = "secure_staging";
		 widget.preferences['debugServer'] = _DEFAULT_SERVER;
	 }else{
		 _DEFAULT_SERVER = widget.preferences['debugServer'];
	 }
	 //To overite 
	 //_DEFAULT_SERVER = "secure_staging";
	 // for log
	 _METADATA['logging'] = ( (widget.preferences['debugLog'] == '1')? true : false );
	 
	 setServerDetails();
	}
}

function loadDeviceMetaData(){
	
	// get the device-id
	if ( (navigator.deviceID === undefined) || (navigator.deviceID === null) || (navigator.deviceID === 'null') ) {
		if( (widget.preferences['debugDeviceID'] === "bob") || (widget.preferences['debugDeviceID'] === 'null')) {
			widget.preferences['debugDeviceID'] = uidGenerator();
		}
	}else{
		widget.preferences['debugDeviceID'] = navigator.deviceID;
	}
	
	_METADATA['deviceID'] = widget.preferences['debugDeviceID'];

	// navigator.homeCountry = '999';

	// get the country-code
	if(navigator.homeCountry !== null) {
		if(navigator.homeCountry === '999' && _DEBUG_MODE == true){
			_METADATA['countryCode']=widget.preferences['debugCountryCode'];
		}else if(navigator.homeCountry === '999' && _DEBUG_MODE == false){
			if(widget.preferences['debugCountryCode']==''){
				_METADATA['countryCode']='999';
				widget.preferences['debugCountryCode']='999';
			}else {
				_METADATA['countryCode']=widget.preferences['debugCountryCode'];
			}
		}else{
			_METADATA['countryCode'] = navigator.homeCountry;
			widget.preferences['debugCountryCode']=navigator.homeCountry;
		}
	}else {
		if(widget.preferences['debugCountryCode'] === ''){
			_METADATA['countryCode'] = '404';
			widget.preferences['debugCountryCode']='404';
		}else{
			_METADATA['countryCode'] = widget.preferences['debugCountryCode'];
		}
	}

	// for DEBUG SETTING
	if(navigator.homeCountry === '999') {
		_DEBUG_MODE = true;

		$("#optionMenu_SettingsBtn").removeClass('hide').addClass('show');
	}
}

function preFillSettings(){
	var _html = '';
	$.each(_SERVERS, function(key, value){
		_html += '<div><input type="radio" name="serverTypeName" value="'+key+'" '+( (key == _DEFAULT_SERVER)? 'checked': ''  )+'> '+key+'</div>';
	});
	
	$('#serverListings').html(_html);
	
	// prefill the values
	$("#inputCountryCode").val(_METADATA['countryCode']);
	$("#inputDeviceID").val(_METADATA['deviceID']);
	$("#enableLogTile").attr('checked', ( (_METADATA['logging'])? true : false ));
}

function saveSettings(){
	
	// MCC
	widget.preferences['debugCountryCode'] = $.trim( $("#inputCountryCode").val() );
	widget.preferences['debugDeviceID'] = $.trim( $("#inputDeviceID").val() );

	_METADATA['logging'] = $("#enableLogTile").attr('checked');
	widget.preferences['debugLog'] = ( (_METADATA['logging'])? '1' : '0' );
	
	_DEFAULT_SERVER = $('input[name=serverTypeName]:checked').val();
	widget.preferences['debugServer'] = _DEFAULT_SERVER; 
	
	loadDeviceMetaData();
	setServerDetails();
	
	// $('#settings-page').removeClass('show').addClass('hide').html(''); 
	
	// load the stories with new settings
	Kismet.setStoriesListAndDetailView();
}

function toggleSettingsButton(){
	if(_DEBUG_MODE) {
		$("#optionMenu_SettingsBtn").addClass('show');
	}else{
		$("#optionMenu_SettingsBtn").addClass('hide');
	}
}


function setServerDetails(){
	serverURL = _SERVERS[ _DEFAULT_SERVER ]['kscope'];
	serverURLForImage = _SERVERS[ _DEFAULT_SERVER ]['image'];
}

function resetSettings(){
	_DEFAULT_SERVER = 'secure_staging';
	setServerDetails();
	
	_METADATA['logging'] = false;
	widget.preferences['debugCountryCode'] = '';
	_DEBUG_MODE = false;
	widget.preferences['debugDeviceID'] = 'bob';
	widget.preferences['debugLog'] = 0;
	widget.preferences['debugServer'] = '';
	
	loadDeviceMetaData();

	// $('#settings-page').removeClass('show').addClass('hide').html(''); 

	// load the stories with new settings
	Kismet.setStoriesListAndDetailView();
}


/*
	********************************************
		locale.js
	********************************************
*/

var locale = (function(){
		
		var strings = null,
			tmplCache = {};

		return {

			load: function( _strings ){
				strings = _strings;
			},

			init: function(){
				if(strings === null || strings === undefined){
					return false;
				}

				var self = this, 
					node = null;
				$("[data-lang]").each(function(key, value){
					node = $(value);
					node.html( self.get( node.data('lang') ) );
				});
			},
		
			get: function(key){

				if(key !== undefined && strings !== undefined && strings[ key ] !== undefined){
					return strings[ key ];
				}else{
					return key;
				}
			},

			tmpl: function(str, data) {
				//// http://www.west-wind.com/weblog/posts/2008/Oct/13/Client-Templating-with-jQuery
				/// <summary>
				/// Client side template parser that uses &lt;#= #&gt; and &lt;# code #&gt; expressions.
				/// and # # code blocks for template expansion.
				/// NOTE: chokes on single quotes in the document in some situations
				///       use &amp;rsquo; for literals in text and avoid any single quote
				///       attribute delimiters.
				/// </summary>    
				/// <param name="str" type="string">The text of the template to expand</param>    
				/// <param name="data" type="var">
				/// Any data that is to be merged. Pass an object and
				/// that object's properties are visible as variables.
				/// </param>    
				/// <returns type="string" />  
				var err = "";
				try {
					var func = tmplCache[str];
					if (!func) {
						var strFunc =
						"var p=[],print=function(){p.push.apply(p,arguments);};" +
						"with(obj){p.push('" +
						str.replace(/[\r\t\n]/g, " ")
						.replace(/'(?=[^#]*#>)/g, "\t")
						.split("'").join("\\'")
						.split("\t").join("'")
						.replace(/<#=(.+?)#>/g, "',$1,'")
						.split("<#").join("');")
						.split("#>").join("p.push('")
						+ "');}return p.join('');";

						//alert(strFunc);
						func = new Function("obj", strFunc);
						tmplCache[str] = func;
					}
					return func(data);
				} catch (e) { 
					err = e.message; 
				}
				return "< # ERROR: " + err.htmlEncode() + " # >";
			}
		};
})();