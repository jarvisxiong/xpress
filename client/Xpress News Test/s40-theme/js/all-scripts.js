
/****************** log.js ********************/

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

/****************** filters.js ********************/

var filters = (function(){
		var arr = {
			'WHATSHOT': 'Filter1',
			'RECOM': 'Filter2',
			'LIKE': 'Filter3'
		};

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

/*
 * Kaleidoscope
 * Date: 9/20/2012
 * Copy Right 2012: Nokia Corp.
 */

var d = new Date();
var startTime= d.getTime()/1000;
//KScope class
var oriData0=[],oriData1=[];
var prevDataCount=0, nextDataCount=0;
var ctry= "404";
var deviceid="3450133665393951438";
var titleStr = "";
var gOptimized=false;
var curData=[];
var dataCount=0;
var curpage="Init";
var news_provider="";
var advertisement;
// add by wangwen
var totalDataCount=0;
var _pagesize=20;
var _index=1;

function KScope(){
	// loading metadata like device-id, country-code
	loadDeviceMetaData();
	this.reqFilter = "WHATSHOT";
	this.renderFilter = function (_mode) {
		var mode = _mode;
		var self = this;
		var successCallback = function(){
			// if current filter & new filter are same, don't bother modifying DOM
			// return back
			if(_mode === self.reqFilter){
				return false;
			}

			$("#filter-items > div.active").removeClass('active');
			if(mode === "WHATSHOT" || mode == null) {
				self.reqFilter = "WHATSHOT";
				$("#filters-title-text").html(locale.get('id_filterName_Filter1'));
				$("#filters-title").removeClass().addClass("filter-fire-icon");
				
				$("#filter-fire-icon").removeClass('active').addClass('active');
				$("#filter-hand-icon").removeClass('active');
			} else if (mode === "RECOM") {
				self.reqFilter = "RECOM";
				$("#filters-title-text").html(locale.get('id_filterName_Filter2'));
				$("#filters-title").removeClass().addClass("filter-hand-icon");
				
				$("#filter-hand-icon").removeClass('active').addClass('active');
				$("#filter-fire-icon").removeClass('active');
			}
		};

	};
	
	this.setFilter = function (filterMode) {
		this.renderFilter(filterMode);
		this.setStoriesListAndDetailView();
	};

	this.setStoriesListAndDetailView = function () {
	    var paramData;
	    var requestURL = serverURL + "/xpress/newsServlet";
	    if(this.reqFilter === "WHATSHOT") {
	    	requestURL = serverURL + "/xpress/newsServlet2";
	    	titleStr = locale.get('id_filterName_Filter1');
	    }else if(this.reqFilter === "RECOM"){
	    	requestURL = serverURL + "/iKaleidoscope/recommended4you";
	    	titleStr = locale.get('id_filterName_Filter2');
	    }

		if ( dm== "undefined" || dm ==undefined) {
			paramData = "ua=501s";
		}else{
			paramData = "ua="+ dm;	
		}

	    oriData0=null;
	    oriData1=null;
	    oriData0=[];
	    oriData1=[];
	    var ks = this;
	    klog.start('kscope');
	    $.ajax({
		    url: requestURL,
	    	type: "POST",
	    	data:paramData,	    	
		    dataType: "json",	   
		    //contentType: "application/json;charset=utf-8", 
		    timeout: 30000,
		    success: function(data){
		    	klog.end('kscope');
		    	if (data == undefined || data == null ||  data.length === 0){
		    		showPage('ErrorMessage');
		    	}else if( data.apiVersion && (parseInt(data.apiVersion) === 1) && (data.response != null) ){
		    		klog.setPerfMetrics( data.perfMetrics.serverTimeMilliseconds );
		    		ks.generateStoriesAndDetailPagesView(data.news);
		    	}else{
		    		if(data.provider != "" && data.provider != null && data.provider != undefined){
			    		news_provider=data.provider;
		    		}
		    		advertisement=data.advertisement;
		    		klog.setPerfMetrics(0);
		    		// 20130805 add by wangwen
		    		totalDataCount = data.news.length;
		    		oriData1 = data.news;
		    		
			    	ks.generateStoriesAndDetailPagesView(data.news);
			    	optionOnClick(data.device);
			    }

			    // remove settings & error-page
			    $("#error-page").remove();
			    $("#settings-page").remove();			   

		    },		    
		    error: function(){ 
				showPage('ErrorMessage');
		    }
	    });
	};

	this.generateStoriesAndDetailPagesView = function(data){
		if (data == null || data[0]==null ||  data.length === 0){
			showPage('ErrorMessage');
			return false;
		}
		var datac = [];
		datac=data;
		data=[];
		
		if( timeOut == true){
			showPage('ErrorMessage');
			return false;
		}
		data=putTheFirstLargeImageArticleAtTheTop(datac);
	
		this.generateStoriesPagesView(_index);
		
	    var d1 = new Date();
	    endTime= d1.getTime()/1000;
	    //showProfile();
	    data2=null;
	    datac=null;
	    return true;
	};
	
	this.generateStoriesPagesView = function(index){
		_index = index;
		var _data = separateValueDataForCurAndNextData(oriData1, _pagesize, index);
		
		if (_data == null){
			showPage('ErrorMessage');
			return false;
		}

		var data3=[];
		data3=putTheFirstLargeImageArticleAtTheTop(_data);

		var data1=[];
		data1=rearrangeData(data3);	

		if(isS3Image(data3[0])==false){
			gOptimized=false;
			data1=null;
			curData=data3;
			getStoriesAndDetailPagesView(data3, true);			
		}else{
			gOptimized=true;
			data3=null;
			curData=data1;
			getStoriesAndDetailPagesViewWithOptimization(data1, true);
		}
		var __fontsize= (_globalFontSize=="" || _globalFontSize==undefined)?(getCookie("globalFontSize")==""?"medium":getCookie("globalFontSize")):_globalFontSize;
		settingFontSize(__fontsize);
		data3=null;
	    return true;
	};
}

function separateValueDataForCurAndNextData(data,pagesize,index){
	oriData0=[];
	for(var i=(index-1)*pagesize,j=0;i<index*pagesize && i<totalDataCount;i++){
		oriData0[j]=data[i];
		j++;
	}
	return oriData0;
}

function addNPSTileHtml()
{
	var outputstr="";	
	outputstr +='<div class="g4">';
	if( advertisement.length >=1){
		var itemSitelogo2=advertisement[1].value.replace(/[ ]/g, "");
		outputstr +='<div class="s2 type2  backgroundLightGreen " onclick="mwl.loadURL(\''+advertisement[1].link+'\');">';
		outputstr +='<div class="s2link" style="color:#00808F;font-size:medium;">';
		outputstr +='<div>'+itemSitelogo2+'</div></div></div>';
	}
	if(advertisement.length >=3){
		var itemSitelogo3=advertisement[2].value.replace(/[ ]/g, "");
		outputstr +='<div class="s2 type2 rightside backgroundLightBlue " style="margin-left:117px;margin-top:-108px;"  onclick="mwl.loadURL(\''+advertisement[2].link+'\');">';
		outputstr +='<div class="s2link" style="color:white;font-size:medium;">';
		outputstr +='<div>'+itemSitelogo3+'</div></div></div>';
	}

	outputstr +='</div>';
	
	if(advertisement.length >=1){
		var itemSitelogo=advertisement[0].value.replace(/[ ]/g, "");
		outputstr+='<div class="" style="padding-bottom:6px;">';
		outputstr+='<div id="rate-this-app"';
		outputstr += 'onclick="';
		
		outputstr += 'mwl.loadURL(\''+advertisement[0].link+'\');';
		outputstr += '">';
		outputstr+='<div  style="font-size:medium;">'+itemSitelogo+'</div>';
		outputstr+='</div>';
		outputstr+='</div>';
	}
	
	var itemsrc=news_provider.replace(/[ ]/g, "");	
	if(itemsrc != "")
	outputstr+='<div><span >'+itemsrc+'</span></div>';
	
	return outputstr;
}

function putTheFirstLargeImageArticleAtTheTop(datap)
{
	var dataImage=null;
	var k=datap.length;
	var imageWidth=0;
	var imageHeight=0;

	for (var i = 0; i<k; i++)
	{
		if(datap[i].image_url != null && datap[i].image_url != undefined) {
			if(datap[i].image_width !=null && datap[i].image_width !=undefined){
				imageWidth=datap[i].image_width;
			}else {
				continue;
			}
			if(datap[i].image_height !=null && datap[i].image_height != undefined){
				imageHeight=datap[i].image_height;
			}else {
				continue;
			}
			
			if((imageWidth >= 171 )&& (imageHeight >= 81 ))
			{
				dataImage=datap[i];
				break;
			}
		}
	}	

	if(dataImage!=null){
		for (var j = i-1; j>=0; j--)
		{
			datap[j+1]=datap[j];	
		}			
		datap[0]=dataImage;		
	}
	return datap;
};
function getStoriesAndDetailPagesViewWithOptimization(data1, bShowNPS)
{
	var outputstr = "";
	var detailHTMLstr=''; 
	dataCount = data1.length;
	var tileGroup=null;
	var prevGroup="";
	var aGroup=0;
	var k=0;
	var imgHeight=124;

	 detailHTMLstr += '<div id="entries">'; 

	g4clr=0;
	g6clr=0;

	// add a tile only if LOGGING is enabled
	if(_METADATA['logging'] && _DEBUG_MODE){
		outputstr += klog.display();
	}
	$('#toolbar-2-center-btn').html("");
	for (var i = 0; i<dataCount;)
	{
		tileGroup = checkWhichGroupOfTiles(data1,i);
		aGroup= new Group(tileGroup,data1,i);
    	outputstr = outputstr + aGroup.getHTMLStrForTheTileGroup();
    	//Launch Modes ON-DEMAND, FULL-SSP, EVO
    	//For checking FULL-SSP or not for now

    	// add the AD-BANNER after first two row's of tiles
    	
    	i = i + aGroup.getTileCount();
    	aGroup=0;
    	
	}
	if((Kismet.reqFilter =='WHATSHOT') && (dataCount >=15 && bShowNPS ==true) && _index==1){
		outputstr += addNPSTileHtml();
	}
	 detailHTMLstr +='</div>'; //entries
	 
	 // add by wangwen
	 var pager = (totalDataCount+_pagesize-1)/_pagesize;
	 
	 outputstr+='<div id="ui-navig-toolbar">';
	 if(_index==1){
			outputstr+='	<div id="left-navig-btn" class="inactive">'+locale.get('id_previous')+'</div>';
			if(parseInt(pager)>1){
				outputstr+='	<div id="right-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  Kismet.generateStoriesPagesView('+(_index+1)+');">'+locale.get('id_next')+'</div>';
			}else{
				outputstr+='	<div id="right-navig-btn" class="inactive">'+locale.get('id_next')+'</div>';
			}
	 }else if (parseInt(_index)== parseInt(pager)) {
			outputstr+='	<div id="left-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  Kismet.generateStoriesPagesView('+(_index-1)+');">'+locale.get('id_previous')+'</div>';
			outputstr+='	<div id="right-navig-btn" class="inactive">'+locale.get('id_next')+'</div>';
	 }else {
			outputstr+='	<div id="left-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  Kismet.generateStoriesPagesView('+(_index-1)+');">'+locale.get('id_previous')+'</div>';
			outputstr+='	<div id="right-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  Kismet.generateStoriesPagesView('+(_index+1)+');">'+locale.get('id_next')+'</div>';
	 }
	 outputstr+='</div>';

	outputstr = filters.render() + outputstr;
	$("#verview-container").html(outputstr);

	$("#horview").html(detailHTMLstr);
	
	$('#toolbar-3').removeClass().addClass('hide');
    $('#toolbar-1').removeClass().addClass('show');  

    toggleSettingsButton();
    createSingleStoryBackButton();

    return true;
}

function getStoriesAndDetailPagesView(data1, bShowNPS){
	var outputstr = "";
	var detailHTMLstr=''; 
	dataCount = data1.length;
	var tileGroup=null;
	var prevGroup="";
	var aGroup=0;
	var k=0;
	var imgHeight=124;

	 detailHTMLstr += '<div id="entries">'; 
	$('#toolbar-2-center-btn').html("");
	for (var i = 0; i<dataCount;)
	{
		tileGroup = checkWhichGroupOfTilesShouldBe(data1,i,prevGroup);
		aGroup= new Group(tileGroup,data1,i);
    	outputstr += aGroup.getHTMLStrForTheTileGroup();

    	// add the AD-BANNER after first two row's of tiles
    	
    	i = i + aGroup.getTileCount();
    	prevGroup=tileGroup;
    	aGroup=0;
	}
	if((Kismet.reqFilter =='WHATSHOT') && (dataCount >=15 && bShowNPS ==true) && _index==1 ){
		outputstr += addNPSTileHtml();
	}
	 detailHTMLstr +='</div>'; //entries
	 
	 // add by wangwen
	 var pager = (totalDataCount+_pagesize-1)/_pagesize;
	 
	 outputstr+='<div id="ui-navig-toolbar">';
	 if(_index==1){
			outputstr+='	<div id="left-navig-btn" class="inactive">'+locale.get('id_previous')+'</div>';
			if(parseInt(pager)>1){
				outputstr+='	<div id="right-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  Kismet.generateStoriesPagesView('+(_index+1)+');">'+locale.get('id_next')+'</div>';
			}else{
				outputstr+='	<div id="right-navig-btn" class="inactive">'+locale.get('id_next')+'</div>';
			}
	 }else if (parseInt(_index)== parseInt(pager)) {
			outputstr+='	<div id="left-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  Kismet.generateStoriesPagesView('+(_index-1)+');">'+locale.get('id_previous')+'</div>';
			outputstr+='	<div id="right-navig-btn" class="inactive">'+locale.get('id_next')+'</div>';
	 }else {
			outputstr+='	<div id="left-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  Kismet.generateStoriesPagesView('+(_index-1)+');">'+locale.get('id_previous')+'</div>';
			outputstr+='	<div id="right-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  Kismet.generateStoriesPagesView('+(_index+1)+');">'+locale.get('id_next')+'</div>';
	 }
	 outputstr+='</div>';
	
	outputstr = filters.render() + outputstr;
	$("#verview-container").html(outputstr);    
	
	$("#horview").html(detailHTMLstr);
	
    $('#toolbar-1').removeClass().addClass('show'); 
    $('#toolbar-3').removeClass().addClass('hide');

    toggleSettingsButton();
    createSingleStoryBackButton();

    return true;
}

function createSingleStoryBackButton(_dataCount){
	
	var outputstr = '';
	outputstr += '<img src=\'s40-theme/images/bm-toolbar-back-button.png\' width=\'46\' height=\'46\'';
	outputstr += ' onclick="mwl.switchClass(\'#toolbar-1\', \'hide\', \'show\');';
	outputstr += 'mwl.switchClass(\'#toolbar-3\', \'show\', \'hide\');';
	outputstr += 'mwl.switchClass(\'#toolbar-2\', \'show\', \'hide\');';
	outputstr += 'mwl.switchClass(\'#content-area\', \'singlestory\', \'maintimeline\'); ';
	outputstr += 'mwl.switchClass(\'#verview-container\', \'heightZero\', \'freeflow\');';

	outputstr += 'mwl.removeClass(\'#entries\', \'entry*\');';
	outputstr += 'mwl.switchClass(\'#entries\', \'animate\', \'noanimate\');';
	outputstr += 'mwl.scrollTo(\'#tile6\');';
	outputstr += 'mwl.removeClass(\'#entries\', \'hortransition\');';

	outputstr += '" />';
	$("#backBtnFromSingleStory").html(outputstr); 
}

function hideDeatilPageButtons(i){
	var outputstr = '';
	if(i == 0){
		outputstr +="mwl.switchClass('#btn" + (i+1)+ "','show', 'hide' );";
		outputstr +="mwl.switchClass('#btn" + i+ "', 'show', 'hide'); ";
    }
	else if( i == dataCount - 1){
		outputstr +="mwl.switchClass('#btn" + (i)+ "','show', 'hide' );";
		outputstr +="mwl.switchClass('#btn" + (i-1)+ "', 'show', 'hide'); ";
	}else {
		outputstr +="mwl.switchClass('#btn" + (i+1)+ "','show', 'hide' );";
		outputstr +="mwl.switchClass('#btn" + (i)+ "','show', 'hide' );";
		outputstr +="mwl.switchClass('#btn" + (i-1)+ "', 'show', 'hide'); ";
    }
	return outputstr;
}

function showDeatilPageButtons(i){
	var outputstr = '';
	outputstr +="mwl.switchClass('#btn" + i+ "', 'hide', 'show'); ";
	return outputstr;
}
function generateBMNextPrevButtonsODL(i)
{
	var emptyPrevImg 	= ' src="s40-theme/images/5px-polyfill.png" alt="" width="206px" height="33px" ';
	var emptyNextImg 	= ' src="s40-theme/images/5px-polyfill.png" alt="" width="206px" height="33px" ';
	var spacerImg 		= ' src="s40-theme/images/5px-polyfill.png" alt="spacer" width="172px" height="33px" ';
	var nextImg 		= ' src="s40-theme/images/btn-next.png" alt="Next" width="34px" height="33px" ';
	var prevImg 		= ' src="s40-theme/images/btn-prev.png" alt="Previous" width="34px" height="33px" ';
	var outputstr 		= '<div class="btns">';
    
	 outputstr += '<div class="show" id="btn' + i + '">';  
        if (i == 0)
        {
        	outputstr += '<img ';
            outputstr += emptyPrevImg;
            outputstr += ' />';
            if(dataCount > 1){
            outputstr += '<img onclick="';
            outputstr += 'getBtnStoryDetailPageHTMLStr('+(i+1)+');';       
           
            outputstr += '"' + nextImg + ' />';
            }else{
            	outputstr += '<img ';
                outputstr += emptyNextImg;
                outputstr += ' />';
            }
            
        }
        else if ( i == dataCount - 1)
        {
                               
            outputstr += '<img onclick="';
            outputstr += 'getBtnStoryDetailPageHTMLStr('+(i-1)+');';
          
            outputstr += '"' + prevImg + ' />';
           
            outputstr += '<img '+emptyNextImg+' />';
        }
        else
        {
            outputstr += '<img onclick="';
            outputstr += 'getBtnStoryDetailPageHTMLStr('+(i-1)+');';
            
            outputstr += '"' + prevImg + ' />';
           
            // spacer-image
            outputstr += '<img '+spacerImg+ '/>';
            
            outputstr += '<img onclick="';
            outputstr += 'getBtnStoryDetailPageHTMLStr('+(i+1)+');';
            
            outputstr += '"' + nextImg + ' />';
           
        }
           
        outputstr += '</div>';
    outputstr += '</div>'; // end btns
    return outputstr;
}
function generateBMNextPrevButtons(i){
	var emptyPrevImg 	= ' src="s40-theme/images/5px-polyfill.png" alt="" width="206px" height="33px" ';
	var emptyNextImg 	= ' src="s40-theme/images/5px-polyfill.png" alt="" width="206px" height="33px" ';
	var spacerImg 		= ' src="s40-theme/images/5px-polyfill.png" alt="spacer" width="172px" height="33px" ';
	var nextImg 		= ' src="s40-theme/images/btn-next.png" alt="Next" width="34px" height="33px" ';
	var prevImg 		= ' src="s40-theme/images/btn-prev.png" alt="Previous" width="34px" height="33px" ';
	var outputstr 		= '<div class="btns">';
    
	 outputstr += '<div class="hide" id="btn' + i + '">';  
        if (i == 0)
        {
        	outputstr += '<img ';
            outputstr += emptyPrevImg;
            outputstr += ' />';
            if(dataCount > 1){
            outputstr += '<img onclick="';
            outputstr += hideDeatilPageButtons(i);
            outputstr += "mwl.switchClass('#entries', 'noanimate','animate');";
            outputstr += "mwl.switchClass('#entries', 'entry"+i+"','entry"+(i+1)+"');";
            outputstr += "mwl.setGroupTarget('#toolbar-2-center-btn','#center-btn_ssp"+(i+1)+"', 'show', 'hide');";
            outputstr += showDeatilPageButtons(i+1);
           
            outputstr += '"' + nextImg + ' />';
            }else{
            	outputstr += '<img ';
                outputstr += emptyNextImg;
                outputstr += ' />';
            }
            
        }
        else if ( i == dataCount - 1)
        {
                               
            outputstr += '<img onclick="';
            outputstr += hideDeatilPageButtons(i);
            outputstr += "mwl.switchClass('#entries', 'entry"+i+"','entry"+(i-1)+"');";
            outputstr += "mwl.switchClass('#entries', 'noanimate','animate');";
            outputstr += "mwl.setGroupTarget('#toolbar-2-center-btn','#center-btn_ssp"+(i-1)+"', 'show', 'hide');";
            outputstr += showDeatilPageButtons(i-1);
          
            outputstr += '"' + prevImg + ' />';
           
            outputstr += '<img '+emptyNextImg+' />';
        }
        else
        {
            outputstr += '<img onclick="';
            outputstr += hideDeatilPageButtons(i);
            outputstr += "mwl.switchClass('#entries', 'entry"+i+"','entry"+(i-1)+"');";
            outputstr += "mwl.switchClass('#entries', 'noanimate','animate');";
            outputstr += "mwl.setGroupTarget('#toolbar-2-center-btn','#center-btn_ssp"+(i-1)+"', 'show', 'hide');";
            outputstr += showDeatilPageButtons(i-1);
            
            outputstr += '"' + prevImg + ' />';
           
            // spacer-image
            outputstr += '<img '+spacerImg+ '/>';
            
            outputstr += '<img onclick="';
            outputstr += hideDeatilPageButtons(i);
            outputstr += "mwl.switchClass('#entries', 'entry"+i+"','entry"+(i+1)+"');";
            outputstr += "mwl.switchClass('#entries', 'noanimate','animate');";
            outputstr += "mwl.setGroupTarget('#toolbar-2-center-btn','#center-btn_ssp"+(i+1)+"', 'show', 'hide');";
            outputstr += showDeatilPageButtons(i+1);
            
            outputstr += '"' + nextImg + ' />';
           
        }
           
        outputstr += '</div>';
    outputstr += '</div>'; // end btns
    return outputstr;
}

//Group class
function Group(name,data,i)
{
	this.groupName = name;
	this.data = data;
	this.i=i;
	this.gtiles=[];
	this.getTileArray=function()
	{
		var tileArray;
		switch (this.groupName) {
		case "g1":
			tileArray=['s1,,,,','s1,rightside,,,'];
			break;
		case "g2":
			tileArray=['s1,,type2,,','s2,rightside,type2,,','s1,downside,type2,,'];
			break;
		case "g3":
			tileArray=['s2,,type2,,','s1,rightside,type2,,','s1,downside,type2,,'];
			break;
		case "g4":
			tileArray=['s2,,type2,,','s2,rightside,type2,,'];
			break;
		case "g5":
			tileArray=['s3,,,,'];
			break;
		case "g6":
			tileArray=['s4,,,backgroundGray,'];
			break;
		default:
			tileArray=[];
			break;
		}
		return tileArray;
	};
	this.getTileCount =function ()
	{
		var tiles;
		var count=0;
		tiles = this.getTileArray();
		count = tiles.length;
		return count;
	};
	this.getHTMLStrForTheTileGroup =function()
	{
		var type=""; var side=""; var bgclr=""; var category="";
		var outputstr="";
		var k=0;
		var tiles = this.getTileArray();
		var num = this.getTileCount();
		var atile=0;
		var bChangeBG=false;
		outputstr += '<div class="';
		outputstr += this.groupName +'">';
		if(gOptimized==true){
			for (var k = 0; k < num; k++)
			{
				atile=new s_tile(this.groupName,tiles[k], this.data[this.i+k],this.i+k );
				if(this.groupName=="g4"){ // || this.groupName=="g1" || this.groupName=="g6"){
					this.setBackgroundColorForTileGroup(k,atile);
					//bChangeBG=true;
					if(g4clr>=7){
						g4clr=0;
					}else{
						g4clr++;
					}
				}else if (this.groupName=="g6"){
					this.setBackgroundColorForTileGroup(k,atile);
					if(g6clr>=2){
						g6clr=0;
					}else{
						g6clr++;
					}
				}
				outputstr += atile.getTileStoryViewHTMLStr();
				this.gtiles[this.i+k]=atile;
			}
		
		}else {
			for (var k = 0; k < num; k++)
			{
				atile=new s_tile(this.groupName,tiles[k], this.data[this.i+k],this.i+k );
				if(this.groupName=="g4" || this.groupName=="g1" || this.groupName=="g6"){
					this.setBackgroundColorForTileGroup(k,atile);
					bChangeBG=true;
				}
				outputstr += atile.getTileStoryViewHTMLStr();
				this.gtiles[this.i+k]=atile;
			}
			if(bChangeBG==true)g4clr++;
		}
		outputstr+= '</div>';
		
		return outputstr;
	};
	this.setBackgroundColorForTileGroup =function(k, atile)
	{
		if(gOptimized==true){
			if(atile.clsname=="s4"){
				if(g6clr==1 && nTotalImages < 4){
					 atile.bgclr="backgroundLightBlue";
					 atile.txtclr="white";//"blue";
				}else{
					 atile.bgclr="backgroundWhite";
					 atile.txtclr="black";//"blue";
				}
			}else if (atile.clsname=="s2"){
				switch(g4clr){
				case 0:
					 atile.bgclr="backgroundLightBlue";
					 atile.txtclr="white";
					 break;
				case 1:
					 atile.bgclr="backgroundWhite";
					 atile.txtclr="black";
					 break;
				case 2:
					 atile.bgclr="backgroundWhite";
					 atile.txtclr="black";
					 break;
				case 3:
					 atile.bgclr="backgroundLightGreen";
					 atile.txtclr="#00808F";
					 break;
				case 4:
					 atile.bgclr="backgroundLightGreen";
					 atile.txtclr="#00808F";
					 break;
				case 5:
					 atile.bgclr="backgroundLightBlue";
					 atile.txtclr="white";
					 break;
				case 6:
					 atile.bgclr="backgroundWhite";
					 atile.txtclr="black";
					 break;
				case 7:
					if(this.i>=18 ){
						atile.bgclr="backgroundWhite";
						atile.txtclr="black";
						if(this.data[this.i].image_url==null){
							 atile.bgclr="backgroundLightGreen";
							 atile.txtclr="#00808F";
						}
					}else if(this.data[this.i].image_url==null){
					 atile.bgclr="backgroundLightGreen";
					 atile.txtclr="#00808F";
					}else {
					 atile.bgclr="backgroundWhite";
					 atile.txtclr="black";
					}
					 break;
				
				default:
					 atile.bgclr="backgroundLightGreen";
				 	 atile.txtclr="#00808F";
				 	 break;
				}
			}else {
				 atile.bgclr="backgroundLightGreen";
			 	 atile.txtclr="#00808F";
			}
		}else {
		
			switch(g4clr){
			case 0:
				 if(k==0){
					 if(atile.clsname=="s4"){
						 atile.bgclr="backgroundWhite";
						 atile.txtclr="black";//"blue";
						
					 }else{
						 atile.bgclr="backgroundLightBlue";
						 atile.txtclr="white";
						 
					 }
				 }else{
					 atile.bgclr="backgroundLightGreen";
					 atile.txtclr="#00808F";
				 }
				 break;
			case 1:
				 if(k==0){
					 if(atile.clsname=="s4"){
						 atile.bgclr="backgroundWhite";
						 atile.txtclr="black";
					 }else{
						 atile.bgclr="backgroundWhiteTile";
						 atile.txtclr="#00808F";//"blue";
					 }
				 }else{
					 atile.bgclr="backgroundLightBlue";
					 atile.txtclr="white";
				 }
				 break;
			case 2: 
				if(k==0){
					 if(atile.clsname=="s4"){
						 atile.bgclr="backgroundWhite";
						 atile.txtclr="black";
						 
					 }else{
						 atile.bgclr="backgroundWhiteTile";
						 atile.txtclr="#00808F";//"blue";
					 }
				}else{
					 atile.bgclr="backgroundLightBlue";
					 atile.txtclr="white";
				}
				break;
			case 3:
				if(k==0){
					 if(atile.clsname=="s4"){
						 atile.bgclr="backgroundWhite";
						 atile.txtclr="black";//"blue";
						 
					 }else{
					 atile.bgclr="backgroundLightGreen";
					 atile.txtclr="#00808F";
					 }
				}else{
					 atile.bgclr="backgroundWhiteTile";
					 atile.txtclr="#00808F";//"blue";
				}
				break;
			case 4:
				if(k==0){
					 if(atile.clsname=="s4"){
						 atile.bgclr="backgroundWhite";
						 atile.txtclr="black";
						 
					 }else{
						 atile.bgclr="backgroundLightGreen";
						 atile.txtclr="#00808F";
					 }
				}else{
					 atile.bgclr="backgroundLightBlue";
					 atile.txtclr="white";
				}
				break;
			case 5:
				if(k==0){
					 if(atile.clsname=="s4"){
						 atile.bgclr="backgroundWhite";
						 atile.txtclr="black";
						 
					 }else{
					 atile.bgclr="backgroundWhiteTile";
					 atile.txtclr="#00808F";//"blue";
					 }
				}else{
					 atile.bgclr="backgroundLightGreen";
					 atile.txtclr="#00808F";
				}
				break;
			case 6:
				if(k==0){
					 if(atile.clsname=="s4"){
						 atile.bgclr="backgroundWhite";
						 atile.txtclr="black";
						 
					 }else{
					 atile.bgclr="backgroundLightBlue";
					 atile.txtclr="white";
					 }
				}else{
					 atile.bgclr="backgroundLightGreen";
					 atile.txtclr="#00808F";//"blue";
				}
				break;
			default:
				if(k==0){
					 if(atile.clsname=="s4"){
						 atile.bgclr="backgroundWhite";
						 atile.txtclr="black";
						
					 }else{
					 atile.bgclr="backgroundWhiteTile";
					 atile.txtclr="#00808F";
					 }
				}else{
					 atile.bgclr="backgroundLightGreen";
					 atile.txtclr="#00808F";
				}
				break;
			}
			if(g4clr>=6)g4clr=-1;
			
		}
	};
}
//end of group class

//s_tile class for different size tiles
function s_tile(groupName, tileClsSizeTypeBgclrCat, item, index )
{
	var rslt =tileClsSizeTypeBgclrCat.split(',');
	this.groupName=groupName;
	this.clsname=rslt[0];
	this.side=rslt[1];
	this.type=rslt[2];
	this.bgclr=rslt[3];
	this.category=rslt[4];
	this.txtclr="";
	this.item=item;
	this.index=index;
	this.itemIcon= "";
	this.widthVal=228;
	this.heightVal=111;
	this.scaledSSPImgWidth=240;
	this.scaledSSPImgHeight=120;
	//BM
	//this.itemBgImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url)+"&ws="+this.widthVal+"&hs="+this.heightVal ;
	this.getScaledSSPImgWidth = function()
	{
		return this.scaledSSPImgWidth;
	};
	this.getScaledSSPImgHeight = function()
	{
		return this.scaledSSPImgHeight;
	};
	this.getTileStoryViewHTMLStr = function()
	{
		if(this.item == undefined || this.item == null){
			return '';
		}

		var widthVal=228; var heightVal=111;
		var bgscaleimgstr=''; var outputstr='';
		var itemsrc=''; var itemSitelogo='';
		var playVideoIcon='';
		var off=0;
		if(this.item.source!=null && this.item.source!=""){
			itemsrc=this.item.source;
		}else if(this.item.domain!=null && this.item.domain!=""){
			itemsrc=this.item.domain;
		}
		if(this.item.sitelogo!=null && this.item.sitelogo!=""){
			itemSitelogo=this.item.sitelogo;
		}	
		var swidthVal=0;
		var sheightVal=0;
		itemSitelogo="";
		itemsrc="";
		outputstr += '<div class="'+this.clsname;
		outputstr += ' '+this.type;
		outputstr += ' '+this.side;
		outputstr += ' '+this.bgclr;
		outputstr += ' '+this.category;
		outputstr += '"';
		
		var __fontsize= (_globalFontSize=="" || _globalFontSize==undefined)?(getCookie("globalFontSize")==""?"medium":getCookie("globalFontSize")):_globalFontSize;
		
		switch (this.clsname){
		case "s1":
			outputstr += ' onclick="';
			outputstr += this.onclickToShowStoryDetailHTMLStr();
			outputstr += '">';
			if(this.item.icon!=null){
				outputstr += '<div style="margin-left:0px;margin-top:21px;">';
				outputstr += '<img src="'+this.item.icon+'" alt="'+this.item.title.substr(0,10)+'" width="16px" height="16px" />';
				outputstr += '</div>';
				if(this.item.title!=null){
					outputstr += '<div style="margin-left:20px;margin-top:-17px;">';
					outputstr += '<b>';
					outputstr += this.item.title.substr(0,8);
					if(item.title.length > 8){
						outputstr += ' ...';
					}
					outputstr += '</b>';
					outputstr += '</div>';
				}
			}else if(this.item.domain!=null){
				outputstr += '<div style="margin-left:0px;margin-top:10px;">';
				outputstr += '<b>';
				outputstr += getTheTextWithFinalCompleteWord(this.item.domain, 10);//this.item.domain.substr(0,10);
				if(itemDomain.length > 10){
					outputstr += ' ...';
				}
				outputstr += '</b>';
				outputstr += '</div>';
			}else if(this.item.title!=null){
				outputstr += getTheTextWithFinalCompleteWord(this.item.title, 10);//this.item.title.substr(0,10);
				if(this.item.title.length > 10){
					outputstr += ' ...';
				}
			}else if(this.item.tags!=null){
				outputstr += getTheTextWithFinalCompleteWord(this.item.tags, 10);//this.item.tags.substr(0,10);
				if(this.item.tags.length > 10){
					outputstr += ' ...';
				}
			}
			outputstr += '</div>';
			break;
		case "s2":
			if(this.item.image_url != null && this.item.image_url != undefined && this.item.image_url!=""
					&&  isS2Image(this.item)==true
					){
				if(this.side=="rightside"){
					outputstr +=' style="margin-left:117px;margin-top:-108px;background-image: url( ';
				}else {
					outputstr += 'style="background-image: url(';
				}
				widthVal=111;
				heightVal=108;
				if(this.item.image_url != null && this.item.image_url != undefined){
					swidthVal=this.item.image_width;
					sheightVal=this.item.image_height;
					if(swidthVal < widthVal && sheightVal < heightVal ){
						if(swidthVal < sheightVal){
							swidthVal=widthVal;
							sheightVal=swidthVal/this.item.image_width * this.item.image_height;
						}else if (swidthVal > sheightVal){
							sheightVal=heightVal;
							swidthVal=sheightVal/this.item.image_height *this.item.image_width;
						}else {
							swidthVal=widthVal;
							sheightVal=swidthVal/this.item.image_width * this.item.image_height;
						}
					}else if (swidthVal < widthVal && sheightVal > heightVal){
						swidthVal=widthVal;
						sheightVal=swidthVal/this.item.image_width * this.item.image_height;
					}else if (swidthVal > widthVal && sheightVal < heightVal){
						sheightVal=heightVal;
						swidthVal=sheightVal/this.item.image_height *this.item.image_width;
					}else if (swidthVal > widthVal && sheightVal > heightVal){
						
						if(swidthVal < sheightVal){
							swidthVal=widthVal;
							sheightVal=swidthVal/this.item.image_width * this.item.image_height;
						}else if (swidthVal > sheightVal){
							sheightVal=heightVal;
							swidthVal=sheightVal/this.item.image_height *this.item.image_width;
						}else {
							swidthVal=widthVal;
							sheightVal=swidthVal/this.item.image_width * this.item.image_height;
						}
					}
					swidthVal=Math.round(swidthVal);
					sheightVal=Math.round(sheightVal);
					if(sheightVal>(heightVal+20)) {
						off=(sheightVal-heightVal)/6;
						off=Math.round(off);
					}
					if(sheightVal<heightVal)heightVal=sheightVal;
					bgscaleimgstr=serverURLForImage +"?url="+encodeURIComponent(this.item.image_url)+"&ws="+swidthVal+"&hs="+sheightVal+"&wc="+widthVal+"&hc="+heightVal+"&ho="+off+"&newsId="+this.item.urlId+"&type=1";
				}
				outputstr += '\''+bgscaleimgstr+'\'';
				outputstr += '); background-repeat: no-repeat;" ';		
				outputstr += ' onclick="';
				outputstr += this.onclickToShowStoryDetailHTMLStr();
				outputstr += '">';				
				outputstr += '<div class="startBlock2"></div>'; /* style="text-align: left;" */
				outputstr += '<div class="'+this.clsname+'titleImage" style="font-size:medium;" id=\''+this.item.title+'\'>';
				
				var num=4;
				if((dm=="RM952" || dm=="208" || dm=="2060" || dm=="x2-02" || dm=="X2-02" || dm=="x2-05" || dm=="X2-05") && __fontsize=="large"){
					num=3;
				}
				
				if(this.item.title!=null){
					outputstr += getTheTextWithFinalCompleteWord(this.item.title, num);//this.item.title.substr(0,10);
					if( this.item.title.length > num){
						outputstr += " ...";
					}
				}
				outputstr += '</div>';
				break;
			}else {
				if(this.side=="rightside"){
					outputstr +=' style="margin-left:117px;margin-top:-108px;" ';
				}	
				outputstr += ' onclick="';
				outputstr += this.onclickToShowStoryDetailHTMLStr();
				outputstr += '">'; //text-align:left;padding-top:8px;padding-left:7px;padding-right:5px;
				
				//outputstr += '<div class="'+this.clsname+'link" style="color:'+this.txtclr+';font-size:medium;" id="'+this.item.title+'">';
				
				var __length=18;
				if((dm=="RM952" || dm=="208" || dm=="2060" || dm=="x2-02" || dm=="X2-02" || dm=="x2-05" || dm=="X2-05") && __fontsize=="large"){
					__length=12;
				}

				if(this.item.title!=null && this.item.title!=""){
					outputstr += '<div class="'+this.clsname+'link" style="color:'+this.txtclr+';font-size:medium;" id=\''+this.item.title+'\'>';
					outputstr += '<div>';
					outputstr += getTheTextWithFinalCompleteWord(this.item.title, __length);//this.item.title.substr(0,38);
					if( this.item.title.length > __length){
						outputstr += ' ...';
					}
					outputstr += '</div>';
				}else {
					outputstr += '<div class="'+this.clsname+'link" style="color:'+this.txtclr+';font-size:medium;" id=\''+this.item.url+'\'>';
					outputstr += getTheTextWithFinalCompleteWord(this.item.url,__length);//this.item.url.substring(0,38);
					if( this.item.url.length > __length){
						outputstr += ' ...';
					}
				}
				outputstr += '</div>';
				if(itemsrc!=""){
				outputstr += '<div class="'+this.clsname+'title" style="margin-left:26px;margin-top:-5px;">'+itemsrc+'</div>';
				}
				if( itemSitelogo !=""){
				outputstr += '<div class="'+this.clsname+'icon" style="margin-left:6px;margin-top:-19px;">';
				outputstr += '<img src="'+itemSitelogo+'" alt="'+this.item.title.substr(0,10)+'" width="16" height="16" />';
				outputstr += '</div>';
				}
			}
			break;
		case "s3":
			outputstr += 'style="text-align:center;padding-top:0px;background-position: center top; background-image: url(';
			widthVal=228;
			heightVal=111;
			if(this.item.image_url!=null){
				//bgscaleimgstr=serverURL +"/scale?url="+encodeURIComponent(this.item.image_url)+"&w="+widthVal+"&h="+heightVal+"&f=png";
				swidthVal=this.item.image_width;
				sheightVal=this.item.image_height;
				if(swidthVal < widthVal && sheightVal < heightVal ){
					if(swidthVal < sheightVal){
						swidthVal=widthVal;
						sheightVal=swidthVal/this.item.image_width * this.item.image_height;
					}else if (swidthVal > sheightVal){
						sheightVal=heightVal;
						swidthVal=sheightVal/this.item.image_height *this.item.image_width;
					}else {
						swidthVal=widthVal;
						sheightVal=swidthVal/this.item.image_width * this.item.image_height;
					}
				}else if (swidthVal < widthVal && sheightVal > heightVal){
					swidthVal=widthVal;
					sheightVal=swidthVal/this.item.image_width * this.item.image_height;
				}else if (swidthVal > widthVal && sheightVal < heightVal){
					sheightVal=heightVal;
					swidthVal=sheightVal/this.item.image_height *this.item.image_width;
				}else if (swidthVal > widthVal && sheightVal > heightVal){
					if(swidthVal < sheightVal){
						swidthVal=widthVal;
						sheightVal=swidthVal/this.item.image_width * this.item.image_height;
					}else if (swidthVal > sheightVal){
						sheightVal=heightVal;
						swidthVal=sheightVal/this.item.image_height *this.item.image_width;
					}else {
						swidthVal=widthVal;
						sheightVal=swidthVal/this.item.image_width * this.item.image_height;
					}
				}
				swidthVal=Math.round(swidthVal);
				sheightVal=Math.round(sheightVal);
				if(sheightVal>(heightVal+180)) {
					off=(sheightVal-heightVal)/4;
					off=Math.round(off);
				}else if(sheightVal>(heightVal+120)) {
					off=(sheightVal-heightVal)/5;
					off=Math.round(off);
				}else if(sheightVal>(heightVal+25)) {
					off=(sheightVal-heightVal)/7.5;
					off=Math.round(off);
				}
				var type=1;
				if(sheightVal<heightVal)heightVal=sheightVal;
				if(this.item.image_height>this.item.image_width)type=2;
				bgscaleimgstr=serverURLForImage +"?url="+encodeURIComponent(this.item.image_url)+"&ws="+swidthVal+"&hs="+sheightVal+"&wc="+widthVal+"&hc="+heightVal+"&newsId="+this.item.urlId+"&type="+type;
			}
			outputstr += '\''+bgscaleimgstr+'\'';
			outputstr += '); background-repeat: no-repeat;" ';		
			outputstr += ' onclick="';
			outputstr += this.onclickToShowStoryDetailHTMLStr();
			outputstr += '">';
			outputstr += '<div class="startBlock" style="height:80px;"></div>';
			outputstr += '<div class="'+this.clsname+'title" style="font-size:medium;" id=\''+this.item.title+'\'>';
			if(this.item.title!=null){
				var __length=10;
				
				if((dm=="RM952" || dm=="208" || dm=="2060" || dm=="x2-02" || dm=="X2-02" || dm=="x2-05" || dm=="X2-05") && __fontsize=="large"){
					__length=6;
				}
				if((dm=="3090") && __fontsize=="large"){
					__length=9;
				}
				outputstr += getTheTextWithFinalCompleteWord(this.item.title, __length);//this.item.title.substr(0,23);
				if( this.item.title.length > __length){
					outputstr += ' ...';
				}
			}
			outputstr += '</div>';
			break;
		case "s4":
			var itemSitelogo="";
			var itemsrc="";	
			outputstr += ' onclick="';
			outputstr += this.onclickToShowStoryDetailHTMLStr();
			outputstr += '">';
			var num=18;
			if(itemSitelogo!="" || itemsrc!="" ) num=30;
			if(num==18){
				outputstr += '<div class="'+this.clsname+'link" style="color:'+this.txtclr+'; padding-top:0px;" id=\''+this.item.title+'\'>';
			}else{
				outputstr += '<div class="'+this.clsname+'link" style="color:'+this.txtclr+'; padding-top:0px;" id=\''+this.item.title+'\'>';
			}
			if(this.item.title!=null && this.item.title!=""){
				outputstr += getTheTextWithFinalCompleteWord(this.item.title, num);//this.item.title.substring(0,num);
				if( this.item.title.length > num){
					outputstr += ' ...';
				}
			}else {
				outputstr += getTheTextWithFinalCompleteWord(this.item.url, num);//this.item.url.substring(0,num);
				if( this.item.url.length > num){
					outputstr += ' ...';
				}
			}
			outputstr += '</div>';
			if(itemsrc!=""){
			outputstr +='<div class="'+this.clsname+'title" style="margin-top:-12px;margin-left:28px;">'+itemsrc+'</div>';
			}
			if(itemSitelogo!=""){
				outputstr += '<div class="'+this.clsname+'icon" style="margin-left:6px; margin-top:-21px;">';
				outputstr += '<img src="'+itemSitelogo+'" alt="image" width="16" height="16" />';
				outputstr += '</div>';
			}
			break;
		default:
			break;
		}
		outputstr += '</div>';
		return outputstr;
	};	

	this.onclickToShowStoryDetailHTMLStr = function()
	{
		var entryToShow = "entry"+( this.index) ;
		var outputstr='';
		outputstr += "getStoryDetailPageHTMLStr("+this.index+");";
		
		return outputstr;
	};
		
}

//end of s_tile class
function isS2Image(item)
{
	var bres=false; var imageWidth=0; var imageHeight=0;
	
	if(item.image_url==null || item.image_width==null || item.image_height==null)
	{
		bres=false;
		return bres;
	}
	 
	if(item.image_width!=null){
		imageWidth=item.image_width;
	}else {
		return bres;
	}
	if(item.image_height!=null){
		imageHeight=item.image_height;
	}else {
		return bres;
	}
	if((imageWidth >= 75  ) && (imageHeight >= 75))
	{
		bres=true;
	}
	return bres;
}
function isS3Image(item)
{
	var bres=false; var imageWidth=0; var imageHeight=0;
	if(item.image_url==null || item.image_width==null || item.image_height==null)
	{
		bres=false;
		return bres;
	}
	if(item.image_width!=null){
		imageWidth=item.image_width;
	}else {
		return bres;
	}
	if(item.image_height!=null){
		imageHeight=item.image_height;
	}else {
		return bres;
	}
	//171 x 81
	if((imageWidth >= 171 )&& (imageHeight >= 81 ))
	{
		bres=true;
	}
	return bres;
}
function checkTileType(item)
{
	var itemImage = "";var itemTitle = "";var itemDesc = "";
	var itemUrl = "";var itemKeywords= "";var itemType= "";
	var itemTags=""; var tileType="s4"; var itemSource= "";var itemDomain= "";
	if(item.image_url!=null ) {
		itemImage=item.image_url;
	}
	if(item.title!=null) {
		itemTitle=item.title;
	}
	if(item.description!=null ) {
		itemDesc=item.description;
	}
	if(item.keywords!=null) {
		itemKeywords=item.keywords;
	}
	if(item.url!=null) {
		itemUrl=item.url;
	}
	if(item.type!=null) {
		itemType=item.type;
	}
	if(item.tags!=null) {
		itemTags=item.tags;
	}
	if(item.domain!=null) {
		itemDomain=item.domain;
	}
	if(item.source!=null) {
		itemSource=item.source;
	}
	/*
	item.url
	S3
	item.title item.image  S3
	S4
	item.title item.image item.tags  S4 
	S2
	item.image and Favicon  S2
	item.title, Favicon and item.tags S2
	item.image item.keywords S2
	S1
	item.url s1
	item.url Favicon s1
	item.keywords s1
	Title, Icon and Source
	*/

	if (itemTitle!="" && (itemDomain!="" || itemSource!="") && itemImage==""){
		tileType="s2";
	}else if((itemTitle=="" && itemImage=="")&&
			(itemType=="Favicon" || itemKeywords!="")){
		tileType="s1";
	}else if ((itemTitle=="" && itemImage!="" && (itemKeywords!="" || itemType=="Favicon"))||	
			(itemTitle!="" && itemImage=="" && itemTags!="" && itemType=="Favicon")){
		tileType="s2";
	}else if (itemTitle!="" && itemImage!="" && itemTags!=""){
		if(isS3Image(item)){
			tileType="s3";
		}else if(isS2Image(item)){
			tileType="s2";
		}else{
			tileType="s4";
		}
	}else if (itemTitle!="" && itemImage!=""){
		if(isS3Image(item)){
			tileType="s3";
		}else if(isS2Image(item)){
			tileType="s2";
		}else{
			tileType="s4";
		}
	}else{
		tileType="s2";
	}
	return tileType;
}

function checkWhichGroupOfTilesShouldBe(data,i, prevGroup)
{
	var count=data.length;
	var tileGroup="g5";
	var k=i;
	if (k <count )
	{ 
		dataTile=checkTileType(data[k]);
		if(dataTile=="s3" )
		{
			if(prevGroup!="g5" && prevGroup!="g6"){
				tileGroup= "g5";
			}else {
				if( k +1 < count && prevGroup!="g4" ) {
					tileGroup= "g4";
				}else if(k +2 < count && prevGroup!="g3") {
					tileGroup= "g3";
				} else if(k +1 < count) {
					tileGroup= "g4";
				}
			}
		}else if(dataTile=="s4" &&
				(prevGroup!="g5" && prevGroup!="g6"))
		{
			tileGroup= "g6";
		}else if(dataTile=="s4" &&
				(prevGroup=="g5" || prevGroup=="g6")&& (k+1 < count) && 
				(checkTileType(data[k+1])=="s2" ))
		{
			tileGroup= "g4";
		}
		else if(dataTile=="s1" && 
			(k+1 < count) && 
			(checkTileType(data[k+1])=="s1" ))
		{
			tileGroup= "g1";
		}
		else if(dataTile=="s1" && 
			(k+2 < count) && 
			checkTileType(data[k+1])=="s2" && 
			checkTileType(data[k+2])=="s1")
		{
			tileGroup= "g2";
		}else if(dataTile=="s2" && 
			(k+2 < count) && 
			checkTileType(data[k+1])=="s1" && 
			checkTileType(data[k+2])=="s1")
		{
			tileGroup= "g3";
		}
		else if(dataTile=="s2" && 
			(k+1 < count) && 
			checkTileType(data[k+1])=="s2")
		{
			if(prevGroup=="g4"){
				tileGroup= "g6";
			}else
			tileGroup= "g4";
		}else {
			if(data[k].image_url!=null && isS3Image(data[k])==true){
				tileGroup= "g5";
			}else{
				if((k+1 < count) &&  prevGroup!="g4"){
					tileGroup= "g4";
				}else
				tileGroup= "g6";
			}
		}
	}
	return tileGroup;
}
function checkWhichGroupOfTiles(data,i)
{
	var count=data.length;
	var tileGroup="g4";
	var k=i;
	if(data[k]==null){return tileGroup;}
	dataTile=data[k].tileType;
	if(dataTile=="s2" )
	{
		tileGroup= "g4";
	}
	else if(dataTile=="s3" )
	{
		tileGroup= "g5";
	}else if(dataTile=="s4")
	{
		tileGroup= "g6";
	}else if(dataTile=="s1" )
	{
		tileGroup= "g1";
	}
	return tileGroup;
}

function clearPersonalData(){
	var requestURL = serverURL+"/iKaleidoscope/reset";

	$.ajax({
	    url: "https://nxn.novarra.net:1086/iKaleidoscope/reset",
	    type: "POST",
	    dataType: "json",
	    data: '{ "userId": "'+ _METADATA['deviceID'] +'" }',
	    contentType: "application/json;charset=utf-8", 
	    timeout: 30000,
		success: function(data){
			filters.reset();
			$('#option-menu-status-bar').html(locale.get('id_clearPersonalDataSuccessNotification'));
		},
		error: function(data){
			$('#option-menu-status-bar').html(locale.get('id_clearPersonalDataFailedNotification'));
		}
    });
    $("#personal-data").remove();
}

function uidGenerator() {
	var str = '';
	var i;
	for (i = 0; i < 20; i++) {
	  var number = Math.floor(Math.random() * 10) % 10;
	  str += number;
	}
	return str;
}

function trimImagesToLessThanTenAndAssignTileInData(data)
{
	var nS3Image=getNumberOfS3Image(data);
	var nImage=getNumberOfImage(data);
	var dataT=[];
	var n=0;
	var i=0;
	if(data.length <=0) return;
	data[0].image_url_ssp=data[0].image_url;
	data[0].tileType="";
	for (i = 1; i < data.length; i++) {
		if(data[i]!=null) data[i].tileType="";
		if(data[i]!=null && data[i].image_url!=null){
			data[i].image_url_ssp=data[i].image_url;
			if(isS2Image(data[i]) || isS3Image(data[i])) {
				n++;
				
			}else {
				data[i].image_url=null;
				data[i].image_url_ssp=null;
			}
		}
		if(n>8){
			data[i].image_url=null;
			data[i].image_url_ssp=null;
		}
	}
	if(n>8) {
		n=8;
	}
	nTotalImages=n+1;
	//0, 3, 4, 8, 9, 12, 13, 18, 19 - 9 images
	var tmpdata=null;
	var bendS3=false;
	if(isS3Image(data[0])){
		data[0].tileType="s3";
	}else{
		data[0].tileType="s2";
	}
	var is3=0;
	for (i = 1; i < data.length; i++) {
		tmpdata=null;
		if(data[i]!=null && data[i].image_url!=null ) {
			if(isS3Image(data[i])&& bendS3==false){
				data[i].tileType="s3";
			}	
		}
		if(tmpdata!=null) {
			data[i]=tmpdata;
		}
	}
	for (i = 1; i < data.length; i++) {
		tmpdata=null;
		if(data[i]!=null && (data[i].image_url!=null && (data[i].tileType==null || data[i].tileType==""))) {
			if(isS2Image(data[i]) ){
				data[i].tileType="s2";
			}
		}
		if(tmpdata!=null) {
			data[i]=tmpdata;
		}
	}
	for (i = 0; i < data.length; i++) {
		if(data[i]!=null && (data[i].tileType==null || data[i].tileType=="")){
			if(i==1||((i==10) && (n!=8))||((i==15) && (n<=5) )){
				data[i].tileType="s4";
			}else if((( i==11 || i== 17) && (nS3Image >=3) && (n==8))){
				data[i].tileType="s4";
			}else {
				data[i].tileType="s2";
			}
		}
		if(n==8 ){
			if((i==6 || i==16) && data[i]!=null && data[i].tileType=="s3" && isS3Image(data[i])!=true){
				data[i].tileType="s4";
			}
		}else if(n==7 ||n==6 ||n==5  ){
			if((i==15) && data[i] !=null && data[i].tileType=="s3" && isS3Image(data[i])!=true){
				data[i].tileType="s4";
			}
		}
	}
	dataT=data;
	return dataT;
}
function getNumberOfImage(data)
{
	var n=0;
	for (var i = 0; i < data.length; i++) {
		if(data[i]!=null && data[i].image_url!=null) n++;
	}
	return n;
}
function getNumberOfS3Image(data)
{
	var n=0;
	for (var i = 0; i < data.length; i++) {
		if(data[i]!=null && data[i].image_url!=null && isS3Image(data[i])) n++;
	}
	return n;
}
function rearrangeData(data)
{
	//Trim and assign the image and data
	var datac=[];
	datac=data;
	var dataT =[];
	
	if(isS3Image(datac[0])==false){
		assignTileToDataWhenNoImage(datac);
		dataT=datac;
	}else {
		dataT = trimImagesToLessThanTenAndAssignTileInData(datac);
	}
	return dataT;
}
function assignTileToDataWhenNoImage(data)
{
	var i=0;
	for (i = 0; i < data.length; i++) {
		data[i].image_url_ssp=data[i].image_url;
		if(i==0){
			data[i].tileType="s2";
		}else if( i==1){
			data[i].tileType="s2";
		}else if( i==2){
			data[i].tileType="s4";
		}else if( i==3){
			data[i].tileType="s2";
		}else if( i==4){
			data[i].tileType="s2";
		}else if( i==5){
			data[i].tileType="s2";
		}else if( i==6){
			data[i].tileType="s2";	
		}else if( i==7){
			data[i].tileType="s2";
		}else if( i==8){
			data[i].tileType="s2";
		}else if( i==9){
			data[i].tileType="s2";
		}else if( i==10){
			data[i].tileType="s2";
		}else if( i==11){
			data[i].tileType="s4";
		}else if( i==12){
			data[i].tileType="s2";
		}else if( i==13){
			data[i].tileType="s2";
		}else if( i==14){
			data[i].tileType="s2";
		}else if( i==15){
			data[i].tileType="s2";
		}else if( i==16){
			data[i].tileType="s4";
		}else if( i==17){
			data[i].tileType="s2";
		}else if( i==18){
			data[i].tileType="s2";
		}else if( i==19){
			data[i].tileType="s4";
		}
	}
}

function getTheTextWithFinalCompleteWord(string, n)
{
	var finalString=string.substring(0,n);
	/*var finalString=nstring;
	var words = string.match(/[-\w]+/g);
	if(words==null || words.length==0) return nstring;
	var nwords=nstring.match(/[-\w]+/g);
	if(nwords==null || nwords.length==0) return nstring;
	var lastWord=nwords[nwords.length-1];
	var postWord="";
	if(words.length >= nwords.length){
		postWord=words[nwords.length-1];
	}
	if(lastWord.length >= postWord.length){
		k=string.indexOf(postWord);
		if(k>=0){
			finalString=string.substring(0,k+postWord.length);
		}
	}else{
		if(nwords.length-2 >=0){
			k=string.indexOf(words[nwords.length-2]);
			finalString=string.substring(0,k+words[nwords.length-2].length);
		}
	}
	
	if(finalString.length <= 1 || finalString.length+18 < n){
		finalString = string.substring(0,n);
	}*/
	
	return finalString;
}

function getScaledCroppedImageForDetailPage(item)
{	
	var finalImage=serverURLForImage +"?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+240+"&hs="+120+"&newsId="+item.urlId+"&type=3" ;
	return finalImage;
}

function getStoryDetailPageHTMLStr(i)
{
	var detailHTMLstr=generateStoryDetailPageHTMLStrForSubBlocks(i);//generateStoryDetailPageHTMLStr(i);
	$("#entries").html("");
	$("#entries").html(detailHTMLstr);
	$('#verview-container').removeClass('freeflow'); 
	$('#verview-container').addClass('heightZero'); 
	$('#toolbar-2').removeClass('hide'); 
	$('#toolbar-2').addClass('show'); 
	$('#toolbar-3').removeClass('show'); 
	$('#toolbar-3').addClass('hide'); 
	$('#toolbar-1').removeClass('show'); 
	$('#toolbar-1').addClass('hide'); 
	$('#content-area').removeClass('maintimeline'); 
	$('#content-area').addClass('singlestory'); 
	/*$('#toolbar-2-center-btn').removeClass('hide'); 
	$('#toolbar-2-center-btn').addClass('show'); */
	//$('#center-btn_ssp'+i).removeClass('hide'); 
	//$('#center-btn_ssp'+i).addClass('show'); 
	//$('#btn'+i).removeClass('hide'); 
	//$('#btn'+i).addClass('show'); 
	addSwipeListenerScriptAt(i);
	
	// redirect detail view show
	var __fontsize= (_globalFontSize=="" || _globalFontSize==undefined)?(getCookie("globalFontSize")==""?"medium":getCookie("globalFontSize")):_globalFontSize;
	settingFontSize(__fontsize);
}
function generateStoryDetailPageHTMLStrForSubBlocks(i)
{
	//Here we need to generate HTML for each story detail 
	var itemImage = "",itemTitle = "",itemDesc = "";
	var itemUrl = "", itemType= "";
	var itemTags="", outputstr=""; 
	var itemWidth=0, itemHeight=0;
	var scaleimgstr="";
	
	if(curData[i].image_url_ssp!=null ) {
		itemImage=curData[i].image_url_ssp;
	}
	if(curData[i].title!=null) {
		itemTitle=curData[i].title;
	}
	if(curData[i].description!=null ) {
		itemDesc=curData[i].description;
	}
	
	if(curData[i].url!=null) {
		itemUrl=curData[i].url;
	}
	if(curData[i].type!=null) {
		itemType=curData[i].type;
	}
	
	if(curData[i].image_width!=null){
		itemWidth=curData[i].image_width;
	}
	if(curData[i].image_height!=null){
		itemHeight=curData[i].image_height;
	}
	
	
	outputstr += '<div id="entrysub" class="entry-view" data-scrollbar="no">';
	
	if(itemImage!="" && (itemHeight>=30 && itemWidth>=30)){
		outputstr += '<div id="ss-content" class="imageYes">';
	}else {
		outputstr += '<div id="ss-content">';
	}
	
	outputstr += '<div class="ss-title-wrapper">';
	
	if(itemTitle!=""){
		outputstr += '<div class="ss-title"  style="font-size:medium;"';
		if(itemTitle.length > 40){
			//itemTitle = getTheTextWithFinalCompleteWord(itemTitle,40);
			itemTitle = itemTitle.substr(0,40);
			itemTitle +=" ...";
		}

		outputstr += '>'+itemTitle+'</div>';
	}
	outputstr += '</div>'; // ss-title-wrapper
	

	if(itemImage!="" && (itemHeight>=30 && itemWidth>=30)){
		if(curData[i].image_url_ssp!=null){
			scaleimgstr=getScaledCroppedImageForDetailPage(curData[i]);
		}
		
			outputstr += '<div id="ss-image-div" class="ss-image-div">';

				outputstr += '<div id="ss-image-area" align="center" style="display: table-cell;text-align:center; height:120px; width:240px;';

			outputstr += ' background-image: url(\'';
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;padding-top:0px;background-position: center top;" ';	
			outputstr += '>';
			outputstr += generateBMNextPrevButtonsODL(i);
			outputstr += '</div>';
			outputstr += '</div>';

	}else {
		outputstr += '<div id="ss-image-div" class="ss-image-div">';
		outputstr += '<div id="ss-image-area" align="center" style="margin-left:0px; display: table-cell;text-align:center; height:120px; width:240px;';	
		outputstr += ' background-image: url(\'./s40-theme/images/no-image-bg.png\'); background-repeat: no-repeat;" ';	
		outputstr += '>';
		
		outputstr += generateBMNextPrevButtonsODL(i);
		outputstr += '</div>';
		outputstr += '</div>';
	}

	if(itemDesc != ""){
		outputstr += '<div id="ss-content-body-block" class="ss-content-body" style="font-size:medium;">'+itemDesc+'</div>';
	}else{
		outputstr += '<div style="height:10px;">&nbsp;</div>';
	}
	
	outputstr += '</div>';
	
	// FULL-STORY-LINK
	outputstr += '<div class="full-story-link"';
	outputstr += 'onclick="mwl.loadURL(\''+itemUrl+'\');"';
	outputstr += '><div class="full-story-image" ></div><div class="full-story-text" style="font-size:medium;">'+locale.get('id_fullStory_Button')+'</div></div>';
	
	// SHARE-BUTTONS
	outputstr += '<div class="share-toolbar">';
	outputstr += '<div class="share-toolbar-title" style="font-size:medium;">'+locale.get('id_share')+'</div>'; 

	outputstr += '<div class="share-btn">';
	var st=Math.round(new Date().getTime()/1000);
	outputstr += '	<a onclick="mwl.loadURL(\'http://weibo.cn/ext/share?ru='+encodeURIComponent(itemUrl)+'&rt='+itemTitle+'&st='+st+'\'); ">';
	outputstr += '		<img src="s40-theme/images/facebook-icon.jpg" alt="FB" width="40" height="40" />';
	outputstr += '	</a>';
	outputstr += '</div>';
	
	outputstr += '<div class="share-btn">';
	outputstr += '	<a href="sms:?body='+encodeURIComponent(itemUrl)+'">';
	outputstr += '		<img src="s40-theme/images/sms-icon.png" alt="sms" width="40" height="40" />';
	outputstr += '	</a>';
	outputstr += '</div>';

	outputstr += '</div>'; //share-toolbar
	outputstr += '<div style="height:1px;">&nbsp;</div>'; //for spacing below share-buttons
	outputstr += '</div>';
	return outputstr;
}
function addSwipeListenerScriptAt(j)
{
	var oldSwipeScript = document.getElementById("swipeScript");
	if(oldSwipeScript!=null){
		var bodyNode = document.getElementsByTagName('body')[0];
		bodyNode.removeChild(oldSwipeScript);
	}
	  
	var scriptNode = document.createElement('SCRIPT');
	scriptNode.setAttribute('id',"swipeScript");
	var listenerText = "";
	k=0;
    if(j+1 < dataCount){
	listenerText += "mwl.addSwipeLeftListener('#entries',\"";
	listenerText += 'mwl.timer(\'LoadSSPBySwipeLeft\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+(j+1)+')\');';
	listenerText += "\");";
    }else{
	listenerText += "mwl.addSwipeLeftListener('#entries',\"";
	listenerText += 'mwl.timer(\'LoadSSPBySwipeLeft\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+dataCount+')\');';
	listenerText += "\");";
    }
	if(j-1 >=0){
	listenerText += "mwl.addSwipeRightListener('#entries',\"";
	listenerText += 'mwl.timer(\'LoadSSPBySwipeRight\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+(j-1)+')\');';
	listenerText += "\");";
	}else{
	listenerText += "mwl.addSwipeRightListener('#entries',\"";
	listenerText += 'mwl.timer(\'LoadSSPBySwipeRight\', 1, 1, \'getBtnStoryDetailPageHTMLStr(0)\');';
	listenerText += "\");";	
	}
	
	
	var listenerScriptText = document.createTextNode(listenerText);
	scriptNode.appendChild(listenerScriptText);
	var bodyNode = document.getElementsByTagName('body')[0];
	bodyNode.appendChild(scriptNode);
}
function getBtnStoryDetailPageHTMLStr(i)
{		
	var detailHTMLstr=generateStoryDetailPageHTMLStrForSubBlocks(i);
	$("#entries").html("");
	$('#verview-container').removeClass('heightZero'); 
	$('#verview-container').addClass('freeflow'); 
	$('#content-area').removeClass('singlestory'); 
	$('#content-area').addClass('maintimeline'); 
	
	$("#entries").html(detailHTMLstr);

	$('#verview-container').removeClass('freeflow'); 
	$('#verview-container').addClass('heightZero'); 
	$('#content-area').removeClass('maintimeline'); 
	$('#content-area').addClass('singlestory'); 
	
	addSwipeListenerScriptAt(i);
	// add by wangwen 20130809
	var __fontsize= (_globalFontSize=="" || _globalFontSize==undefined)?(getCookie("globalFontSize")==""?"medium":getCookie("globalFontSize")):_globalFontSize;
	settingFontSize(__fontsize, null);
}

//Kismet object
var Kismet = new KScope(),
	//startTime = "",
	endTime = "",
	timeOut = false,
	g4clr = 0,
	g6clr = 0,
	nTotalImages = 0,
	gscaledSSPImgHeight=0,
	gscaledSSPImgWidth=0;

function timestamp(url){
	//  var getTimestamp=Math.random();
    var getTimestamp=new Date().getTime();
   if(url.indexOf("?")>-1){
	   url=url+"&timestamp="+getTimestamp;
   }else{
    url=url+"?timestamp="+getTimestamp;
  }
 return url;
}

//动态生成选项按钮点击事件
function optionOnClick(data){
	if(data.showSetting == "true" || data.showSetting == true){
		$("#active-toolbar-btn").click(function (){
			mwl.switchClass('#options-menu', 'hide', 'show'); 
			mwl.switchClass('#containerid', 'show', 'hide');
		});
	}else{
		$("#active-toolbar-btn").click(function (){
			mwl.loadURL(data.settingLink);
		});
	}
	
}

/* 
*******************************************
        call the method to render
*******************************************
*/
everythingIsFineRenderAppNow();