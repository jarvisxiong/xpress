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

var _globalFontSize=getCookie("globalFontSize")==""?"medium":getCookie("globalFontSize");	// 20130806 add by wangwen
var _globalBgColorType=getCookie("globalBgColor")==""?"default":getCookie("globalBgColor");

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

		case 'Toolbars':
			$.ajax({
				url: _path+'toolbars.html', 
				success: function(data){
					$("#toolbar-container").append($("<div></div>").html(data).children());

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
							'id_about': 				locale.get('id_about'),
							'id_font_setting':			locale.get('id_font_setting'),
							'id_bgcolor_setting':		locale.get('id_bgcolor_setting')
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
						settingFontSize(_globalFontSize);	//20130815 add .
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
						settingFontSize(_globalFontSize);	//20130815 add .
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
		case 'SettingFontSize':
			if(!$("#fontsize-setting").exist()){
				$.ajax({
					url: _path+'fontsize-setting.html', 
					success: function(data){
						$("body").append( $("<div></div>")
								.html( locale.tmpl( data, {
									'id_font_setting':	locale.get('id_font_setting'),
									'id_small':			locale.get('id_small'),
									'id_medium':		locale.get('id_medium'),
									'id_large':			locale.get('id_large')
								}) ).children());

							$('#options-menu')
								.removeClass('show')
								.addClass('hide');
							if(_globalFontSize!=""){
								$("#"+_globalFontSize).addClass("selected");
							}
							settingFontSize(_globalFontSize);	//20130815 add .
					}
				});
				
			}else{
				$('#fontsize-setting')
							.removeClass('hide')
							.addClass('show');

				$('#options-menu')
							.removeClass('show')
							.addClass('hide');
			}
			break;
		case 'SettingBackGround':
			if(!$("#background-setting").exist()){
				$.ajax({
					url: _path+'background-setting.html', 
					success: function(data){
						$("body").append( $("<div></div>")
								.html( locale.tmpl( data, {
									'id_bgcolor_setting':	locale.get('id_bgcolor_setting'),
									'id_default':			locale.get('id_default'),
									'id_black':				locale.get('id_black'),
									'id_blue':				locale.get('id_blue'),
									'id_red':				locale.get('id_red'),
									'id_cyan':				locale.get('id_cyan'),
									'id_green':				locale.get('id_green'),
									'id_gray':				locale.get('id_gray'),
									'id_yellow':			locale.get('id_yellow')
								}) ).children());

							$('#options-menu')
								.removeClass('show')
								.addClass('hide');
							if(_globalBgColorType!=""){
								$("#"+_globalBgColorType).addClass("selected");
							}
							settingFontSize(_globalFontSize);	//20130815 add .
					}
				});	
			}else{
				$('#background-setting')
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

function settingFontSize(_value,obj){
	if(obj!==null && obj!==undefined){
		$(obj).parent().find("li.selected").removeClass("selected");
		$(obj).addClass("selected");
	}
	var _arr =["small","medium","large"];
	var __index=_arr.indexOf(_value);

	if(_value!="" && __index>=0){
		$variabel=$("body,.s3title,#filters-title,.ss-title,.s2link,.s4link,#rate-this-app>div,.ss-content-body,.full-story-text,#verview-container div>span,.ui-window-page-content div,#ui-navig-toolbar,.s2titleImage");
		$variabel.css("font-size",_value);
		_globalFontSize=_value;
		
		deleteCookie("globalFontSize");
		setCookie("globalFontSize", _value);
		settingBackgroundColor(_globalBgColorType, null);
		
		if( dm=="RM952" || dm=="208" || dm=="2060" || dm=="X2-02" || dm=="X2-05" || dm=="3090" || dm=="C2-02" || dm=="C2-06"){
			$title=$(".s3title,.s2link,.s4link,.s2titleImage");
			
			//var __length=10;

			$.each($title,function(index,item){
				var __length=10;
				if(_value=="large"){
					__length=6;
				}
				var _title=$(item).text().replace(/\./g,"");
				var __title=$(item).attr("id");
				if($(item).hasClass("s2link")){
					if(_value=="large"){
						__length=11;
					}else{
						__length=18;
					}
				}
				if($(item).hasClass("s2titleImage")){
					if(_value=="large"){
						__length=3;
					}else{
						__length=4;
					}
				}

				if(__title.length>__length){
					$(item).text(__title.substring(0,__length)+"...");
				}
			});
		}
	}
	//mwl.switchClass('#fontsize-setting', 'show', 'hide');mwl.switchClass('#options-menu', 'hide', 'show');
}

function settingBackgroundColor(_colorType,obj) {
	if(obj!==null && obj!==undefined){
		$(obj).parent().find("li.selected").css("color","").removeClass("selected");
		$(obj).addClass("selected");
	}
	var __arr = ["default","black","blue","gray","green","yellow","red","cyan"];
	var __index = __arr.indexOf(_colorType);
	
	var _bgColor="",_titleColor="",_fontColor="",_pageBgColor="";
	switch (_colorType) {
	case "black":
		_bgColor="#0C1418";
		_titleColor="#0C1418";
		_fontColor="#05457F";
		_pageBgColor="#2066a1"; 
		break;
	case 'blue':
		_bgColor="#288DDF";
		_titleColor="#288DDF";
		_fontColor="#FFFFFF";
		_pageBgColor="#001527";
		break;
	case 'gray':
		_bgColor="#374754";
		_titleColor="#374754";
		_fontColor="#FFFFFF";
		_pageBgColor="#273341";
		break;
	case 'green':
		_bgColor="#DAF6A2";
		_titleColor="#DAF6A2";
		_fontColor="green";
		_pageBgColor="#98c753";
		break;
	case 'yellow':
		_bgColor="#FDAD00";
		_titleColor="#FDAD00";
		_fontColor="#584626";
		_pageBgColor="#2d2d2d";
		break;
	case 'red':
		_bgColor="#ad1514";
		_titleColor="#ad1514";
		_fontColor="#FFFFFF";
		_pageBgColor="#111111";
		break;
	case 'cyan':
		_bgColor="#00FFFF";
		_titleColor="#00FFFF";
		_fontColor="#333333";
		_pageBgColor="#005c5c";
		break;
	default:
		_bgColor="gainsboro";
		_titleColor="";
		_fontColor="";
		_pageBgColor="";
		break;
	}
	if(_bgColor!="" &&__index!=-1){
		$backgroundColor=$("#content-area,#entrysub,.ss-title-wrapper,.ui-window-toolbar,.ui-window-page,.ui-window-page-content,#toolbar-3,#ani-status-loading");
		$titleColor=$("#filters-title,.ss-title,.setting-content");
		$pagerbgColor=$("#ui-navig-toolbar,.share-toolbar");
		$contentFontColor=$(".ss-content-body,#verview-container div>span,#menu-items div,.ui-window-header,.ui-window-page-wrapper div,.fontLink:not(.fontSelected)");
		$selectFontColor=$("li.selected");

		_bgColor=_bgColor=="gainsboro"?"":_bgColor;
		$backgroundColor.css({"background-color":_bgColor});
		$titleColor.css({"background-color":_titleColor,"color":_fontColor});
		$pagerbgColor.css({"background-color":_pageBgColor});
		$contentFontColor.css({"color":_fontColor});
		if(_fontColor=="#FFFFFF"){
			$selectFontColor.css({"color":"#333333"});
		}
		
		_globalBgColorType=_colorType;
		deleteCookie("globalBgColor");
		setCookie("globalBgColor", _colorType);
	}
}

function setCookie(_name,_value,_time) {
	var _strCookie = _name+"="+escape(_value)+";";
	if(_time!=null && _time!=undefined && _time>0){
		var date = new Date();
		date.setTime(date.getTime()+parseInt(_time)*3600*1000);
		_strCookie+=";expires="+date.toUTCString();
	}
	document.cookie=_strCookie;
}

function getCookie(_name) {
	var arr, reg = new RegExp("(^| )" + _name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return "";
}

function deleteCookie(_name) {
	var exp = new Date();
	exp.setTime(exp.getTime()-1);
	var cval = getCookie(_name);
	if(cval!=""){
		document.cookie=_name+"="+cval+";expires="+exp.toUTCString();
	}
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