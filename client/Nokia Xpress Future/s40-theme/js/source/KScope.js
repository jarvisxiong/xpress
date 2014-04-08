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

/*
		// ENABLE THIS WHEN FILTERS NEEDED
		if($("#filter-menu").exist()){
			successCallback();
		}else{
			showPage('FilterMenu', successCallback);
		}
*/
	};
	
	this.setFilter = function (filterMode) {
		this.renderFilter(filterMode);
		this.setStoriesListAndDetailView();
	};

	this.setStoriesListAndDetailView = function () {
	    var paramData;
	    var requestURL = serverURL + "/iKaleidoscope/whatshot";
	    if(this.reqFilter === "WHATSHOT") {
	    	requestURL = serverURL + "/iKaleidoscope/whatshot";
	    	titleStr = locale.get('id_filterName_Filter1');
	    }else if(this.reqFilter === "RECOM"){
	    	requestURL = serverURL + "/iKaleidoscope/recommended4you";
	    	titleStr = locale.get('id_filterName_Filter2');
	    }
		if(_METADATA['logging'] && _DEBUG_MODE){
			paramData = '{ "req":40, "loc" : "'+ _METADATA['countryCode'] +'", "userId" : "'+ _METADATA['deviceID'] +'", "sortby" : "relevant",'+
			'"fields": ["url","keywords","domain","title","description","image_url","image_width","image_height","type","tags"],'+
			'"apiVersion": "1", "perfMetrics": true }';
		}else{
			paramData = '{ "req":40, "loc" : "'+ _METADATA['countryCode'] +'", "userId" : "'+ _METADATA['deviceID']  +'", "sortby" : "relevant"'+
			', "fields": ["url","keywords","domain","title","description","image_url","image_width","image_height","type","tags"]'+
			'}';
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
		    dataType: "json",
		    data: paramData,
		    contentType: "application/json;charset=utf-8", 
		    timeout: 30000,
		    success: function(data){
		    	klog.end('kscope');
		    	if (data == undefined || data == null ||  data.length === 0){
		    		showPage('ErrorMessage');
		    	}else if( data.apiVersion && (parseInt(data.apiVersion) === 1) && (data.response != null) ){
		    		klog.setPerfMetrics( data.perfMetrics.serverTimeMilliseconds );
		    		ks.generateStoriesAndDetailPagesView(data.response);
		    	}else{
		    		klog.setPerfMetrics(0);
			    	ks.generateStoriesAndDetailPagesView(data);
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
		//datac=convertFromATToBM(data);
		//datac=addTestData(data);
		datac=data;
		data=[];
		
		if( timeOut == true){
			showPage('ErrorMessage');
			return false;
		}
		data=putTheFirstLargeImageArticleAtTheTop(datac);
		//current data
		separate20DataForCurAndNextData(data);
		
		if(curpage=="Next" ){
			this.generateNextStoriesAndDetailPagesView();
		}else{
			this.generatePrevStoriesAndDetailPagesView();
		}
	
	    var d1 = new Date();
	    endTime= d1.getTime()/1000;
	    //showProfile();
	    data2=null;
	    datac=null;
	    return true;
	};
	this.generateNextStoriesAndDetailPagesView = function()
	{
		curpage="Next";
		if (oriData1 == null || oriData1[0]==null ){
			showPage('ErrorMessage');
			return false;
		}
		flagAllInappropriateURLs();
		likeAllStoryURLs();
		nextDataCount=0;
		prevDataCount=oriData0.length;
		//current data
		var data2=[];
		data2=putTheFirstLargeImageArticleAtTheTop(oriData1);
		
		var data1=[];
		data1=rearrangeData(data2);
			
		if(isS3Image(data2[0])==false){
			gOptimized=false;
			data1=null;
			curData=data2;
			getStoriesAndDetailPagesView(data2, false);
			
		}else{
			gOptimized=true;
			data2=null;
			curData=data1;
			getStoriesAndDetailPagesViewWithOptimization(data1, false);
			
		}
		
		data2=null;
	    return true;
	};
	this.generatePrevStoriesAndDetailPagesView = function()
	{
		curpage="Prev";
		if (oriData0 == null || oriData0[0]==null ){
			showPage('ErrorMessage');
			return false;
		}
		flagAllInappropriateURLs();
		likeAllStoryURLs();
		nextDataCount=oriData1.length;
		prevDataCount=0;
		var data3=[];
		data3=putTheFirstLargeImageArticleAtTheTop(oriData0);
		
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
		
		data3=null;
	    return true;
	};
}
function convertFromATToBM(data)
{
	var datact=[];
	for (var i = 0; i< data.length; i++)
	{
		datact[i]=data[i];
		datact[i].image_url=data[i].image;
		datact[i].image_url_ssp=data[i].image;
		datact[i].description=data[i].desc;
	}
	return datact;
}
function addTestData(data)
{
	var datact=[];
	var j = data.length;
	for (var i = 0; i< data.length; i++)
	{
		datact[i]=data[i];
		datact[i].image_url=data[i].image;
		datact[i].image_url_ssp=data[i].image;
		datact[i].description=data[i].desc;
		datact[j]=data[i];
	}
	datact[j].title = ctry;
	datact[j].description = _METADATA['deviceID'];
	return datact;
}
function separate20DataForCurAndNextData(data)
{
	oriData0=[];
	oriData1=[];
	for (var i = 0; i< data.length; i++)
	{
		if(i<20){
			oriData0[i]=data[i];
		}else{
			oriData1[i-20]=data[i];
		}
	}
}

function addNPSTileHtml()
{
	var itemSitelogo="";
	var itemsrc="";	
	var outputstr="";
	
	outputstr+='<div class="g6" style="padding-bottom:6px;">';
	outputstr+='<div id="rate-this-app"';
	outputstr += 'onclick="';
	
	outputstr += 'mwl.loadURL(\'http://cpq.nokia.com/widget/s40/nps/scripts/s40_nps.php?project_name=Nokia%20Xpress%20Now%20Prod%20-%20Mobile\');Analytics.logEvent(\'TileView\', \'ClickOnNPSFeedbackTile\', Analytics.eventType.ACTIVITY);';
	//outputstr += 'mwl.loadURL(\'http://cpq.nokia.com/widget/s40/nps/scripts/s40_nps.php?project_name=Nokia%20Now%20BM%20Prod%20-%20Mobile\');Analytics.logEvent(\'TileView\', \'ClickOnNPSFeedbackTile\', Analytics.eventType.ACTIVITY);';
	outputstr += '">';
	outputstr+='<strong id="rate-this-app-title">'+locale.get('id_rateThisApp')+'</strong><br/><span style="font-size: small">'+locale.get('id_rateThisAppDesc')+'</span>';
	outputstr+='</div>';
	outputstr+='</div>';

	return outputstr;
}
function putTheLargeImagesArticleAtTheTop(datap)
{
	var dataImage=null;
	var k=datap.length;
	var imageWidth=0;
	var imageHeight=0;
	//pull three s3 images to the top
	for (var ni=0; ni<3; ni++)
	{
		dataImage=null;
		for (var i = ni; i<k; i++)
		{
			if(datap[i].image_url != null && datap[i].image_url !=undefined) {
				if(datap[i].image_width !=null && datap[i].image_width !=undefined){
					imageWidth=datap[i].image_width;
				}else {
					continue;
				}
				if(datap[i].image_height != null && datap[i].image_height != undefined){
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
			for (var j = i-1; j>=ni; j--)
			{
				datap[j+1]=datap[j];	
			}
			datap[ni]=dataImage;
		}else{
			break;
		}
	}
	return datap;
};
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
    	if(getLaunchedMode() != "ON-DEMAND"){
    		detailHTMLstr += aGroup.getStoryDetailHTMLStrForTheTileGroup();
    	}

    	// add the AD-BANNER after first two row's of tiles
    	if(i == 4 && adsBox.isReady()){
    		outputstr += adsBox.display();
    	}
    	
    	i = i + aGroup.getTileCount();
    	aGroup=0;
    	
	}
	if((Kismet.reqFilter =='WHATSHOT') && (dataCount >=15 && bShowNPS ==true)){
		outputstr += addNPSTileHtml();
	}
	 detailHTMLstr +='</div>'; //entries

	if(nextDataCount >= 10){
		outputstr+='<div id="ui-navig-toolbar">';
		outputstr+='	<div id="left-navig-btn" class="inactive">'+locale.get('id_previous')+'</div>';
		outputstr+='	<div id="right-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\'); mwl.timer(\'LoadNextResults\', 1, 1, \'Kismet.generateNextStoriesAndDetailPagesView()\'); Analytics.logEvent(\'TileView\', \'ClickMore\', Analytics.eventType.ACTIVITY);">'+locale.get('id_next')+'</div>';
		outputstr+='</div>';
	}
	if(prevDataCount > 0) {
		outputstr+='<div id="ui-navig-toolbar">';
		outputstr+='	<div id="left-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  mwl.timer(\'LoadNextResults\', 1, 1, \'Kismet.generatePrevStoriesAndDetailPagesView()\'); Analytics.logEvent(\'TileView\', \'ClickPrev\', Analytics.eventType.ACTIVITY);">'+locale.get('id_previous')+'</div>';
		outputstr+='	<div id="right-navig-btn" class="inactive">'+locale.get('id_next')+'</div>';
		outputstr+='</div>';
	}

	// space b/w bottom toolbar & navigation buttons
	outputstr+='<div style="height:5px;"></div>';

	outputstr = filters.render() + outputstr;
	$("#verview-container").html(outputstr);

	$("#horview").html(detailHTMLstr);
	
	//generateStoryCollections(detailHTMLstr);

    $('#toolbar-1').removeClass().addClass('show'); 
    $('#toolbar-3').removeClass().addClass('hide');

    if(getLaunchedMode() != "ON-DEMAND"){
    	addSwipeListenerScript();  
    }
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
    	detailHTMLstr += aGroup.getStoryDetailHTMLStrForTheTileGroup();

    	// add the AD-BANNER after first two row's of tiles
    	if(i == 1 && adsBox.isReady()){
    		outputstr += adsBox.display();
    	}
    	
    	i = i + aGroup.getTileCount();
    	prevGroup=tileGroup;
    	aGroup=0;
	}
	if((Kismet.reqFilter =='WHATSHOT') && (dataCount >=15 && bShowNPS ==true)){
		outputstr += addNPSTileHtml();
	}
	 detailHTMLstr +='</div>'; //entries
	
	if(nextDataCount >= 10){
		outputstr+='<div id="ui-navig-toolbar">';
		outputstr+='	<div id="left-navig-btn" class="inactive">'+locale.get('id_previous')+'</div>';
		outputstr+='	<div id="right-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\'); mwl.timer(\'LoadNextResults\', 1, 1, \'Kismet.generateNextStoriesAndDetailPagesView()\'); Analytics.logEvent(\'TileView\', \'ClickMore\', Analytics.eventType.ACTIVITY);">'+locale.get('id_next')+'</div>';
		outputstr+='</div>';
	}
	if(prevDataCount > 0) {
		outputstr+='<div id="ui-navig-toolbar">';
		outputstr+='	<div id="left-navig-btn" class="active" onclick="mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.addClass(\'#ui-navig-toolbar\', \'hide\'); mwl.switchClass(\'#toolbar-1\', \'show\', \'hide\'); mwl.switchClass(\'#toolbar-3\', \'hide\', \'show\');  mwl.timer(\'LoadNextResults\', 1, 1, \'Kismet.generatePrevStoriesAndDetailPagesView()\'); Analytics.logEvent(\'TileView\', \'ClickPrev\', Analytics.eventType.ACTIVITY);">'+locale.get('id_previous')+'</div>';
		outputstr+='	<div id="right-navig-btn" class="inactive">'+locale.get('id_next')+'</div>';
		outputstr+='</div>';
	}
	
	// space b/w bottom toolbar & navigation buttons
	outputstr+='<div style="height:5px;"></div>';
	
	outputstr = filters.render() + outputstr;
	$("#verview-container").html(outputstr);    
	
	$("#horview").html(detailHTMLstr);
	
	//generateStoryCollections(detailHTMLstr);

    $('#toolbar-1').removeClass().addClass('show'); 
    $('#toolbar-3').removeClass().addClass('hide');

	addSwipeListenerScript();
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


function rehideAllDescText(){
	 var outputstr ='';
	 for (var i=0; i<dataCount; i++){
		 outputstr +='mwl.switchClass(\'#ss-content-body' + i + '\', \'show\', \'hide\' );';
	 }
	 return outputstr;
}

function hideAllOtherPages(icur){
	
	var outputstr ='';

	for (var i=0; i<dataCount; i++)
    {
        if (i != icur){
        	 outputstr +='mwl.switchClass(\'#entry' + i + '\', \'width240\', \'widthZero\' );';
        	 outputstr +='mwl.addClass(\'#entry' + i + '\', \'heightZero\' );';
        	 outputstr +='mwl.switchClass(\'#entry' + i + '\', \'show\', \'hide\' );';
        }else {
        	 outputstr +='mwl.switchClass(\'#entry' + i + '\', \'widthZero\', \'width240\' );';
        	 outputstr +='mwl.removeClass(\'#entry' + i + '\', \'heightZero\' );';
        	 outputstr +='mwl.switchClass(\'#entry' + i + '\', \'hide\', \'show\' );';
        }
    }
	return outputstr;
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
            //outputstr += 'getBtnStoryDetailPageHTMLStr('+(i+1)+');';
            outputstr += 'mwl.timer(\'LoadSSP\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+(i+1)+')\');';
            outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickNextDetailPage\', Analytics.eventType.ACTIVITY);';
           
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
            //outputstr += 'getBtnStoryDetailPageHTMLStr('+(i-1)+');';
            outputstr += 'mwl.timer(\'LoadSSP\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+(i-1)+')\');';
            outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickPrevDetailPage\', Analytics.eventType.ACTIVITY);';
          
            outputstr += '"' + prevImg + ' />';
           
            outputstr += '<img '+emptyNextImg+' />';
        }
        else
        {
            outputstr += '<img onclick="';
            //outputstr += 'getBtnStoryDetailPageHTMLStr('+(i-1)+');';
            outputstr += 'mwl.timer(\'LoadSSP\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+(i-1)+')\');';
            outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickPrevDetailPage\', Analytics.eventType.ACTIVITY);';
            
            outputstr += '"' + prevImg + ' />';
           
            // spacer-image
            outputstr += '<img '+spacerImg+ '/>';
            
            outputstr += '<img onclick="';
            //outputstr += 'getBtnStoryDetailPageHTMLStr('+(i+1)+');';
            outputstr += 'mwl.timer(\'LoadSSP\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+(i+1)+')\');';
            outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickNextDetailPage\', Analytics.eventType.ACTIVITY);';
            
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
            outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickNextDetailPage\', Analytics.eventType.ACTIVITY);';
           
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
            outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickPrevDetailPage\', Analytics.eventType.ACTIVITY);';
          
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
            outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickPrevDetailPage\', Analytics.eventType.ACTIVITY);';
            
            outputstr += '"' + prevImg + ' />';
           
            // spacer-image
            outputstr += '<img '+spacerImg+ '/>';
            
            outputstr += '<img onclick="';
            outputstr += hideDeatilPageButtons(i);
            outputstr += "mwl.switchClass('#entries', 'entry"+i+"','entry"+(i+1)+"');";
            outputstr += "mwl.switchClass('#entries', 'noanimate','animate');";
            outputstr += "mwl.setGroupTarget('#toolbar-2-center-btn','#center-btn_ssp"+(i+1)+"', 'show', 'hide');";
            outputstr += showDeatilPageButtons(i+1);
            outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickNextDetailPage\', Analytics.eventType.ACTIVITY);';
            
            outputstr += '"' + nextImg + ' />';
           
        }
           
        outputstr += '</div>';
    outputstr += '</div>'; // end btns
    return outputstr;
}

function addSwipeListenerScript()
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
	
	for (var j = 0; j<dataCount; j++)
	{
		k = j+1;
		if( k !=  dataCount){
			listenerText += "mwl.addSwipeLeftListener('#entry"+j+"', \"";
			listenerText += "mwl.switchClass('#btn"+j+"', 'show','hide');";
			listenerText += "mwl.switchClass('#entries', 'noanimate','animate');";
			listenerText += "mwl.switchClass('#entries', 'entry"+j+"','entry"+k+"');";
			listenerText += "mwl.switchClass('#btn"+(j+1)+"', 'hide','show');";
			listenerText += "mwl.setGroupTarget('#toolbar-2-center-btn','#center-btn_ssp"+(j+1)+"', 'show', 'hide');";
			listenerText += 'Analytics.logEvent(\'DetailPage\', \'SwipeToLeft\', Analytics.eventType.ACTIVITY);';
			listenerText += "\");";
		}

		if(j > 0){
			listenerText += "mwl.addSwipeRightListener('#entry"+j+"',\"";
			listenerText += "mwl.switchClass('#btn"+j+"', 'show','hide');";
			listenerText += "mwl.switchClass('#entries', 'noanimate','animate');";
			listenerText += "mwl.switchClass('#entries', 'entry"+j+"','entry"+(j-1)+"');";
			listenerText += "mwl.switchClass('#btn"+(j-1)+"', 'hide','show');";
			listenerText += "mwl.setGroupTarget('#toolbar-2-center-btn','#center-btn_ssp"+(j-1)+"', 'show', 'hide');";
			listenerText += 'Analytics.logEvent(\'DetailPage\', \'SwipeToRight\', Analytics.eventType.ACTIVITY);';
			listenerText += "\");";
		}
	}
	var listenerScriptText = document.createTextNode(listenerText);
	scriptNode.appendChild(listenerScriptText);
	var bodyNode = document.getElementsByTagName('body')[0];
	bodyNode.appendChild(scriptNode);
};
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
	this.getStoryDetailHTMLStrForTheTileGroup = function ()
	{
		var type=""; var side=""; var bgclr=""; var category="";
		var outputstr="";
		var k=0;
		var tiles = this.getTileArray();
		var num = this.getTileCount();
		var atile=0;
		for (var k = 0; k < num; k++)
		{
			atile=this.gtiles[this.i+k];
			outputstr += atile.generateStoryDetailPageHTMLStr();
		}
		return outputstr;
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
					bgscaleimgstr=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url)+"&ws="+swidthVal+"&hs="+sheightVal+"&wc="+widthVal+"&hc="+heightVal+"&ho="+off;//+"&ri=108*108_wi.png" ;
				}
				outputstr += '\''+bgscaleimgstr+'\'';
				outputstr += '); background-repeat: no-repeat;" ';		
				outputstr += ' onclick="';
				outputstr += this.onclickToShowStoryDetailHTMLStr();
				outputstr += '">';
				outputstr += '<div class="startBlock2"></div>'; /* style="text-align: left;" */
				outputstr += '<div class="'+this.clsname+'titleImage" >';
				if(this.item.title!=null){
					outputstr += getTheTextWithFinalCompleteWord(this.item.title, 10);//this.item.title.substr(0,10);
					if( this.item.title.length > 10){
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
				outputstr += '<div class="'+this.clsname+'link" style="color:'+this.txtclr+';">';
				if(this.item.title!=null && this.item.title!=""){
					outputstr += '<b>';
					outputstr += getTheTextWithFinalCompleteWord(this.item.title, 38);//this.item.title.substr(0,38);
					if( this.item.title.length > 38){
						outputstr += ' ...';
					}
					outputstr += '</b>';
				}else {
					outputstr += getTheTextWithFinalCompleteWord(this.item.url,38);//this.item.url.substring(0,38);
					if( this.item.url.length > 38){
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
			outputstr += 'style="background-image: url(';
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
				if(sheightVal<heightVal)heightVal=sheightVal;
				bgscaleimgstr=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url)+"&ws="+swidthVal+"&hs="+sheightVal+"&wc="+widthVal+"&hc="+heightVal+"&ho="+off;
			}
			outputstr += '\''+bgscaleimgstr+'\'';
			outputstr += '); background-repeat: no-repeat;" ';		
			outputstr += ' onclick="';
			outputstr += this.onclickToShowStoryDetailHTMLStr();
			outputstr += '">';
			outputstr += '<div class="startBlock"></div>';
			outputstr += '<div class="'+this.clsname+'title" >';
			if(this.item.title!=null){
				outputstr += getTheTextWithFinalCompleteWord(this.item.title, 23);//this.item.title.substr(0,23);
				if( this.item.title.length > 23){
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
			var num=38;
			if(itemSitelogo!="" || itemsrc!="" ) num=30;
			if(num==38){
				outputstr += '<div class="'+this.clsname+'link" style="color:'+this.txtclr+'; padding-top:0px;">';
			}else{
				outputstr += '<div class="'+this.clsname+'link" style="color:'+this.txtclr+'; padding-top:0px;">';
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
	
	this.getScaledCroppedImageForDetailPage = function()
	{
		var dpImgWidth=240;
		var dpImgHeight=120;
		var heightVal=dpImgHeight;
		var widthVal=dpImgWidth;
		var image_width = 0;
		var image_height = 0;
		if(this.item.image_width!=null) image_width = this.item.image_width;
		if(this.item.image_height!=null) image_height = this.item.image_height;
		var finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal+"&hs="+heightVal ;
		if(image_width !=0 && image_height !=0){
		if(image_width > image_height){
			//Landscape
			if(image_width > dpImgWidth && image_height > dpImgHeight){
				widthVal=dpImgWidth;
				var off= ((widthVal/image_width * image_height)-dpImgHeight)/6.0;//close to top
				if(off > 0.0){
					off=0;
					heightVal=dpImgHeight;
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal+"&wc="+widthVal+"&hc="+dpImgHeight+"&ho="+off;
				}else {
					heightVal=widthVal/image_width * image_height;
					heightVal=Math.round(heightVal);
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal ;
				}
				
			}else {
				if(image_height > dpImgHeight){
					heightVal=dpImgHeight;
					widthVal=heightVal/image_height *image_width;
					widthVal=Math.round(widthVal);
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&hs="+heightVal ;
				}else if (image_height < dpImgHeight){
					widthVal=dpImgWidth;
					var off= ((widthVal/image_width * image_height)-dpImgHeight)/6.0;//close to top
					if(off > 0.0){
						off=0;
						heightVal=dpImgHeight;
						finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal+"&wc="+widthVal+"&hc="+dpImgHeight+"&ho="+off;
					}else {
						heightVal=widthVal/image_width * image_height;
						heightVal=Math.round(heightVal);
						finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal ;
					}
				}else{
					widthVal=dpImgWidth;
					heightVal=dpImgHeight;
					if(image_width > widthVal){
						var off= (image_width-widthVal)/2;//equal on horizontal
						finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&hs="+heightVal+"&hc="+heightVal+"&wc="+widthVal+"&wo="+off ;
					}else {
						finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&hs="+heightVal+"&ws="+widthVal ;
					}
				}
			}
		}else if (image_height > image_width){
			//PORTRAIT
			if(image_width > dpImgWidth && image_height > dpImgHeight){
				widthVal=dpImgWidth;
				heightVal= image_width/dpImgWidth * image_height;
				if(heightVal > dpImgHeight){
					heightVal=dpImgHeight;
					var off= (heightVal-dpImgHeight)/6.0;//close to top
					off=0;
					heightVal=Math.round(heightVal);
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal+"&wc="+widthVal+"&hc="+heightVal+"&ho=" +off;
				}else {
					heightVal=Math.round(heightVal);
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal;
				}
			}else{
				if(image_width > dpImgWidth){
					widthVal=dpImgWidth;
					heightVal=  image_height;
					var off=(image_width-dpImgWidth)/2;
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&hs="+image_height+"&hc="+image_height+"&wc="+widthVal+"&wo="+off ;
				}else if (image_width < dpImgWidth){
					heightVal=dpImgHeight;
					var off=((heightVal/image_height * image_width)-dpImgWidth)/2;
					if(off>0){
						widthVal=dpImgWidth;
						finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&hs="+heightVal+"&hc="+heightVal +"&wc="+dpImgWidth+"&wo="+off ;
					}else {
						widthVal=heightVal/image_height * image_width;
						widthVal=Math.round(widthVal);
						finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&hs="+heightVal;
					}
				}else{
					widthVal=dpImgWidth;
					if(image_height > dpImgHeight){
						heightVal=dpImgHeight;
						var off= (image_height-dpImgHeight)/6.0;//close to top
						off=0;
						finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal+"&wc="+widthVal+"&hc="+heightVal+"&ho="+off;
					}else {
						heightVal= image_width/dpImgWidth * image_height;
						heightVal=Math.round(heightVal);
						finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal;
					}
				}
			}
		}else {
			heightVal=dpImgHeight;
			widthVal=heightVal/image_height * image_width;
			widthVal=Math.round(widthVal);
			finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&hs="+heightVal ;
		}
		}else{
			widthVal=dpImgWidth;
			heightVal=dpImgHeight;
			finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(this.item.image_url_ssp)+"&ws="+widthVal+"&hs="+heightVal ;
		}
		this.scaledSSPImgWidth=widthVal;
		this.scaledSSPImgHeight=heightVal;
		return finalImage;
	};

	this.onclickToShowStoryDetailHTMLStr = function()
	{
		var entryToShow = "entry"+( this.index) ;
		var outputstr='';
		if(getLaunchedMode() != "ON-DEMAND"){
			outputstr += "mwl.switchClass('#verview-container','freeflow','heightZero');";
			outputstr += "mwl.switchClass('#toolbar-2', 'hide', 'show');";
			outputstr += "mwl.switchClass('#toolbar-3', 'show', 'hide');";
			outputstr += "mwl.switchClass('#toolbar-1', 'show', 'hide');";
	
			outputstr += "mwl.setGroupTarget('#toolbar-2-center-btn','#center-btn_ssp"+(this.index)+"', 'show', 'hide');";
			
			// SCR-60136
			// to enable this feature, uncomment the below statement
			//outputstr += "mwl.switchClass('#filters-title-icon', 'show', 'hide');";
			
			outputstr += "mwl.addClass('#entries', '"+entryToShow+"');";
			outputstr += "mwl.switchClass('#content-area', 'maintimeline', 'singlestory');";
			outputstr += "mwl.switchClass('#btn"+ this.index+ "', 'hide', 'show');";
		}else{
			outputstr += "getStoryDetailPageHTMLStr("+this.index+");";
		}
		
		outputstr += "Analytics.logEvent('TileView', 'ClickToDetailPage', Analytics.eventType.ACTIVITY);";
		return outputstr;
	};
	
	this.generateStoryDetailPageHTMLStr= function()
	{
		//Here we need to generate HTML for each story detail 
		var itemImage = "";var itemTitle = "";var itemDesc = "";
		var itemUrl = "";var itemKeywords= "";var itemType= "";
		var itemTags="";var outputstr="";var itemSource=""; 
		var itemWidth=0; var itemHeight=0;var itemDomain="";
		var widthVal=0; var heightVal=0; var topoff=0;
		var scaleimgstr="";
		
		if(this.item.image_url_ssp!=null ) {
			itemImage=this.item.image_url_ssp;
		}
		if(this.item.title!=null) {
			itemTitle=this.item.title;
		}
		if(this.item.description!=null ) {
			itemDesc=this.item.description;
		}
		if(this.item.keywords!=null) {
			itemKeywords=this.item.keywords;
		}
		if(this.item.url!=null) {
			itemUrl=this.item.url;
		}
		if(this.item.type!=null) {
			itemType=this.item.type;
		}
		if(this.item.tags!=null) {
			itemTags=this.item.tags;
		}
		if(this.item.source!=null){
			itemSource=this.item.source;
		}
		if(this.item.domain!=null){
			itemDomain=this.item.domain;
		}
		if(this.item.image_width!=null){
			itemWidth=this.item.image_width;
		}
		if(this.item.image_height!=null){
			itemHeight=this.item.image_height;
		}
		
//	    outputstr += '<td valign="top">';
		
		outputstr += '<div id="entry'+this.index+'" class="entry-view" data-scrollbar="no">';
		
		if(itemImage!="" && (itemHeight>=30 && itemWidth>=30)){
			outputstr += '<div id="ss-content" class="imageYes">';
		}else {
			outputstr += '<div id="ss-content">';
		}
		
		outputstr += '<div class="ss-title-wrapper">';
		
		if(itemTitle!=""){
			outputstr += '<div class="ss-title"';
			if(itemTitle.length > 40){
				//itemTitle = getTheTextWithFinalCompleteWord(itemTitle,40);
				itemTitle = itemTitle.substr(0,40);
				itemTitle +=" ...";
			}

			outputstr += '>'+itemTitle+'</div>';
		}
		if(itemSource!="")
			outputstr += '<div class="ss-source">'+itemSource+'</div>';
		else if(itemDomain!=""){
			outputstr += '<div class="ss-source">'+itemDomain+'</div>';
		}
		outputstr += '</div>'; // ss-title-wrapper
		
		var imgWidth=240;
		var imgHeight=120;
		var maxSWidth=178;
		//always show image as Won wanted it
		if(itemImage!="" && (itemHeight>=30 && itemWidth>=30)){
			if(this.item.image_url_ssp!=null){
				scaleimgstr=this.getScaledCroppedImageForDetailPage();
				itemHeight=this.scaledSSPImgHeight;
				itemWidth=this.scaledSSPImgWidth;
			}
			if(itemWidth > imgWidth && itemHeight > imgHeight) {
				outputstr += '<div class="ss-image-div">';
				var leftoff=(imgWidth-itemWidth)/2;
				if(leftoff>0){
					outputstr += '<div id="ss-image-area" align="center" style=" margin-left:'+leftoff+'px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
				}else{
					outputstr += '<div id="ss-image-area" align="center" style=" margin-left:0px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
				}
				outputstr += ' background-image: url(';
				outputstr += scaleimgstr;
				outputstr += '); background-repeat: no-repeat;" ';	
				outputstr += '>';
				outputstr += generateBMNextPrevButtons(this.index);
				outputstr += '</div>';
				outputstr += '</div>';
			}else if(itemWidth == imgWidth && itemHeight == imgHeight) {
				outputstr += '<div class="ss-image-div">';
				var leftoff=(imgWidth-itemWidth)/2;
				if(leftoff>0){
					outputstr += '<div id="ss-image-area" align="center" style=" margin-left:'+leftoff+'px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
				}else {
					outputstr += '<div id="ss-image-area" align="center" style=" margin-left:0px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
				}
				outputstr += ' background-image: url(';
				outputstr += scaleimgstr;
				outputstr += '); background-repeat: no-repeat;" ';	
				outputstr += '>';
				
				outputstr += generateBMNextPrevButtons(this.index);
				outputstr += '</div>';
				outputstr += '</div>';
				
			}else if(itemWidth >= imgWidth && itemHeight < imgHeight) {
				heightVal=itemHeight;
				widthVal=itemWidth;
				var topoff=(imgHeight-heightVal)/2 ;
				var leftoff=(imgWidth-widthVal)/2; 
				outputstr += '<div class="ss-image-div">';
				outputstr += generateBMNextPrevButtons(this.index); //-20px;
				outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';	
				outputstr += ' background-image: url(';
				
				outputstr += scaleimgstr;
				outputstr += '); background-repeat: no-repeat;" ';	
				outputstr += '>';
				
				outputstr += '</div>';
				outputstr += '</div>';
				
			}else if(itemWidth < imgWidth && itemHeight >= imgHeight) {
				//API scale to the smaller size
				heightVal=itemHeight;
				widthVal=itemWidth;
				topoff=(imgHeight-heightVal)/2 ;
				leftoff=(imgWidth-widthVal)/2 ;
				outputstr += '<div class="ss-image-div">';
				outputstr += generateBMNextPrevButtons(this.index);
				if(widthVal < (imgWidth-61)){
					outputstr += '<div id="ss-image-area" align="center" style="margin-top:-20px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';
				}else{
					outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';
				}
				outputstr += ' background-image: url(';
				
				outputstr += scaleimgstr;
				outputstr += '); background-repeat: no-repeat;" ';	
				outputstr += '>';
				outputstr += '</div>';
				outputstr += '</div>';
				
			}else if(itemWidth >0 && itemHeight >0 && itemWidth < imgWidth && itemHeight < imgHeight){
				//use original image
				if(itemHeight>=30 && itemWidth>=30){
					heightVal=itemHeight;
					widthVal=itemWidth;
					topoff=(imgHeight-heightVal)/2 ;
					leftoff=(imgWidth-widthVal)/2 ;
					outputstr += '<div class="ss-image-div">';
					outputstr += generateBMNextPrevButtons(this.index);
					outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px;margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+'height:'+heightVal+'px;';	
					outputstr += ' background-image: url(';
					
					outputstr += scaleimgstr;
					outputstr += '); background-repeat: no-repeat;" ';	
					outputstr += '>';
					outputstr += '</div>';
					outputstr += '</div>';
					
				}else{
					
					outputstr += generateBMNextPrevButtons(this.index);
				}
			}else {
				
				heightVal=itemHeight;
				widthVal=itemWidth;
				
				outputstr += '<div class="ss-image-div">';
				outputstr += '<div id="ss-image-area" align="center" style="margin-left:0px; display: table-cell;text-align:center; height:'+heightVal+'px;width:'+widthVal+'px;';	
				outputstr += ' background-image: url(';
				outputstr += scaleimgstr;
				outputstr += '); background-repeat: no-repeat;" ';	
				outputstr += '>';
				
				outputstr += generateBMNextPrevButtons(this.index);
				outputstr += '</div>';
				outputstr += '</div>';
				
			}
		}else {
			// outputstr +=generateBMNextPrevButtons(this.index);
			outputstr += '<div class="ss-image-div">';
			outputstr += '<div id="ss-image-area" align="center" style="margin-left:0px; display: table-cell;text-align:center; height:120px; width:240px;';	
			outputstr += ' background-image: url(./s40-theme/images/no-image-bg.png); background-repeat: no-repeat;" ';	
			outputstr += '>';
			
			outputstr += generateBMNextPrevButtons(this.index);
			outputstr += '</div>';
			outputstr += '</div>';
		}

		if(itemDesc !== ""){
			outputstr += '<div id="ss-content-body'+this.index+'" class="ss-content-body">'+itemDesc+'</div>';
		}else{
			outputstr += '<div style="height:10px;">&nbsp;</div>';
		}
		
		outputstr += '</div>';
		
		// FULL-STORY-LINK
		outputstr += '<div class="full-story-link"';
		outputstr += 'onclick="mwl.loadURL(\''+serverURL+'/iKaleidoscope/view?'+getViewFullStoryUrlStr(itemUrl)+'\');';
		outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickToOriginalPage\', Analytics.eventType.ACTIVITY);return false;"';
		outputstr += '><div class="full-story-image"></div><div class="full-story-text">'+locale.get('id_fullStory_Button')+'</div></div>';
		
		// SHARE-BUTTONS
		outputstr += '<div class="share-toolbar">';
		outputstr += '<div class="share-toolbar-title">'+locale.get('id_share')+'</div>'; 

		outputstr += '<div class="share-btn">';
		//outputstr += '	<a onclick="mwl.loadURL(\'http://m.facebook.com/sharer.php?u='+encodeURIComponent(itemUrl)+'&t='+encodeURIComponent(itemTitle)+'\'); Analytics.logEvent(\'DetailPage\', \'ClickToFacebookShare\', Analytics.eventType.ACTIVITY);return false;">';
		outputstr += '	<a onclick="mwl.loadURL(\'http://m.facebook.com/sharer.php?u='+itemUrl+'\'); Analytics.logEvent(\'DetailPage\', \'ClickToFacebookShare\', Analytics.eventType.ACTIVITY);return false;">';
		outputstr += '		<img src="s40-theme/images/facebook-icon.png" alt="FB" width="40" height="40" />';
		outputstr += '	</a>';
		outputstr += '</div>';

		outputstr += '<div class="share-btn">';
		outputstr += '	<a onclick="mwl.loadURL(\'http://mobile.twitter.com/home?status='+encodeURIComponent(itemUrl)+'\'); Analytics.logEvent(\'DetailPage\', \'ClickToTwitterShare\', Analytics.eventType.ACTIVITY);return false;">';
		outputstr += '		<img src="s40-theme/images/twitter-icon.png" alt="twitter" width="40" height="40" />';
		outputstr += '	</a>';
		outputstr += '</div>';

		
		outputstr += '<div class="share-btn">';
		outputstr += '	<a href="sms:?body='+itemUrl+'">';
		outputstr += '		<img src="s40-theme/images/sms-icon.png" alt="sms" width="40" height="40" />';
		outputstr += '	</a>';
		outputstr += '</div>';

		outputstr += '</div>'; //share-toolbar
		outputstr += '<div style="height:1px;">&nbsp;</div>'; //for spacing below share-buttons
		outputstr += this.addFlaggingUIHTML();
		outputstr += '</div>';
		//append the like ui for this ssp to the toolbar-2 div
		var likedivstr=this.addLikingUIHTML();
		$('#toolbar-2-center-btn').append(likedivstr);
//		outputstr += '</td>'; 
		return outputstr;
	};
	this.addFlaggingUIHTML = function()
	{
		var itemUrl='';
		if(this.item.url!=null) {
			itemUrl=this.item.url;
		}
		var outputstr='';
		outputstr= '<div id="flagg-Unflag'+(this.index)+'" class="show">'; 
		if(isInFlagged(itemUrl)==true){
			outputstr+= '<div id="flagging'+(this.index)+'" class="hide">'; 
		}else{
			outputstr+= '<div id="flagging'+(this.index)+'" class="show">'; 
		}
		
		outputstr+=' <div class="ui-window-unflagging positive-action"';
		outputstr+=' onclick="';
		outputstr+=' mwl.setGroupTarget(\'#flagg-Unflag'+(this.index)+'\',\'#unflagging'+(this.index)+'\', \'show\', \'hide\');';
		outputstr+=' addFlaggedURL(\''+itemUrl+'\');';
		outputstr+=' Analytics.logEvent(\'DetailPage\', \'ClickToFlagStory\', Analytics.eventType.ACTIVITY);';
		outputstr+='"';
		outputstr+=' >';
		outputstr+='<div class="flagtext">'+locale.get('id_reportAsOffensive')+'</div><img class="flagImg" width="16" height="16"  src="s40-theme/images/flag-normal.png" /></div>';
		outputstr+='</div>';
		if(isInFlagged(itemUrl)==true){
			outputstr+= '<div id="unflagging'+(this.index)+'" class="show">'; 
		}else{
			outputstr+= '<div id="unflagging'+(this.index)+'" class="hide">'; 
		}
		outputstr+=' <div class="ui-window-unflagging positive-action"';
		outputstr+=' onclick="';
		outputstr+=' mwl.setGroupTarget(\'#flagg-Unflag'+(this.index)+'\',\'#flagging'+(this.index)+'\', \'show\', \'hide\');';
		outputstr+=' removeFlaggedURL(\''+itemUrl+'\');';
		outputstr+=' Analytics.logEvent(\'DetailPage\', \'ClickToUnflagStory\', Analytics.eventType.ACTIVITY);';
		outputstr+='"';
		outputstr+=' ><div class="flagtext">'+locale.get('id_storyReported')+'</div><img class="flagImg" width="17" height="17" src="s40-theme/images/flag-flagged.png"  /></div>';
		outputstr+='</div>';
		outputstr+=' <input type=hidden class="flaggedInput" id="#flaggedURL'+(this.index) +'" value="'+itemUrl+'" />';
		outputstr+='</div>';
		return outputstr;
	};
	this.addLikingUIHTML = function()
	{
		var itemUrl='';
		if(this.item.url!=null) {
			itemUrl=this.item.url;
		}
		var outputstr='';
		outputstr= '<div id="center-btn_ssp'+(this.index)+'" class="hide">'; 
		outputstr+='<img id="like_ssp'+(this.index)+'"';
		if(isInLiked(itemUrl)==true){
			outputstr+=' class="show"';
		}else{
			outputstr+=' class="hide"';
		}
		outputstr+=' src="s40-theme/images/like-on.png" width="46" height="46"'; 
		outputstr+=' onclick="';
		outputstr+=' mwl.setGroupTarget(\'#center-btn_ssp'+(this.index)+'\',\'#unlike_ssp'+(this.index)+'\', \'show\', \'hide\');';
		outputstr+=' removeLikedURL(\''+itemUrl+'\');';
		outputstr+=' Analytics.logEvent(\'DetailPage\', \'ClickToUnLikeStory\', Analytics.eventType.ACTIVITY);';
		outputstr+='"';
		outputstr+=' >';
		outputstr+='<img id="unlike_ssp'+(this.index)+'"';
		if(isInLiked(itemUrl)==true){
			outputstr+=' class="hide"';
		}else{
			outputstr+=' class="show"';
		}
		outputstr+=' src="s40-theme/images/like-off.png" width="46" height="46"'; 
		outputstr+=' onclick="';
		outputstr+=' mwl.setGroupTarget(\'#center-btn_ssp'+(this.index)+'\',\'#like_ssp'+(this.index)+'\', \'show\', \'hide\');';
		outputstr+=' addLikedURL(\''+itemUrl+'\');';
		outputstr+=' Analytics.logEvent(\'DetailPage\', \'ClickToLikeStory\', Analytics.eventType.ACTIVITY);';
		outputstr+='"';
		outputstr+=' >';
		outputstr+=' <input type=hidden class="likedInput" id="#likedURL'+(this.index) +'" value="'+itemUrl+'" />';
		outputstr+='</div>';
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
function generateFilterPopupHTML()
{
	var outputstr="";
	outputstr += '<!--  FILTERS SCREEN -->';
	outputstr += '<div class="ui-Filter-page" id="filters-menu">';
	outputstr += '<div id="content-region" class="ui-vertical-scroll"	data-scrollbar="no">';
	outputstr += '<ul>';
	//outputstr += '<li><img src="s40-theme/images/bm-mostwatched-b.png" alt="test" width="35" height="49" /><div class="filter-label">Most Watched</div></li>';
	//outputstr += '<li><img src="s40-theme/images/bm-friends-activity-b.png" width="35" height="49" /><div class="filter-label">Friends Activity</div></li>';
	outputstr += '<li onclick="';
	outputstr += 'mwl.addClass(\'#filterPopupDiv\', \'heightZero\');';
	outputstr += 'mwl.removeClass(\'#containerid\', \'heightZero\');'; 
	outputstr += 'mwl.switchClass(\'#filterPopupDiv\', \'show\', \'hide\');';
	outputstr += 'mwl.switchClass(\'#containerid\', \'hide \', \'show\');';
	outputstr += 'Kismet.showTileViewWithFilter(\'WHATSHOT\');';
	outputstr += 'Analytics.logEvent(\'FilterPopupView\', \'ClickOnWhatsHot\', Analytics.eventType.ACTIVITY);';
	if(Kismet.reqFilter == "WHATSHOT"){
		outputstr += '" class="selected"><img src="s40-theme/images/bm-whatshot-w.png" width="35" height="49" /><div class="filter-label">'+locale.get('id_filterName_Filter1')+'</div></li>';
	}else {
		outputstr += '"><img src="s40-theme/images/bm-whatshot-b.png" width="35" height="49" /><div class="filter-label">'+locale.get('id_filterName_Filter1')+'</div></li>';
	}
	//outputstr += '<li><img src="s40-theme/images/bm-trending-b.png" width="35" height="49" /><div class="filter-label">Trending Topics</div></li>';
	outputstr += '<li onclick="';
	outputstr += 'mwl.addClass(\'#filterPopupDiv\', \'heightZero\');';
	outputstr += 'mwl.removeClass(\'#containerid\', \'heightZero\');'; 
	outputstr += 'mwl.switchClass(\'#filterPopupDiv\', \'show\', \'hide\');';
	outputstr += 'mwl.switchClass(\'#containerid\', \'hide \', \'show\');';
	outputstr += 'Kismet.showTileViewWithFilter(\'RECOM\');';
	outputstr += 'Analytics.logEvent(\'FilterPopupView\', \'ClickOnRecommendedForYou\', Analytics.eventType.ACTIVITY);';
	if(Kismet.reqFilter == "RECOM"){
		outputstr += '" class="selected"><img src="s40-theme/images/bm-recommended-w.png" width="35" height="49" /><div class="filter-label">'+locale.get('id_filterName_Filter2')+'</div></li>';
	}else {
		outputstr += '" ><img src="s40-theme/images/bm-recommended-b.png" width="35" height="49" /><div class="filter-label">'+locale.get('id_filterName_Filter2')+'</div></li>';
	}
	outputstr += '</ul>';//#F4F4F4  D0D0D0
	outputstr += '<div style="width: 150px; height: 55px; background-color: #F4F4F4; display: block;"></div>';
	outputstr += '</div>';
//	outputstr += '<div id="main-timeline-toolbar">';
	outputstr += '<div class="maintltbackground">';
	outputstr += '<div>';
	outputstr += '<div class="toolbar-options">';
	outputstr += '<img width="90" height="54" src="s40-theme/images/bm-toolbar-options-button-empty.png" alt="test"';
	outputstr += 'width="90" height="48" />';
	outputstr += '</div>';
	outputstr += '<div class="toolbar-refresh" onclick="';
	outputstr += 'mwl.addClass(\'#filterPopupDiv\', \'heightZero\');';
	outputstr += 'mwl.removeClass(\'#containerid\', \'heightZero\');'; 
	outputstr += 'mwl.switchClass(\'#filterPopupDiv\', \'show\', \'hide\');';
	outputstr += 'mwl.switchClass(\'#containerid\', \'hide \', \'show\');';
	outputstr += 'Analytics.logEvent(\'FilterPopupView\', \'ClickBackToTileView\', Analytics.eventType.ACTIVITY);';
	outputstr += '" >';
	outputstr += '<img src="s40-theme/images/bm-toolbar-back-button.png" alt="test"';
	outputstr += 'width="48" height="48" />';
	outputstr += '</div>';
	outputstr += '</div>';
	outputstr += '</div>';
	outputstr += '</div>';
//	outputstr += '</div>';
	return outputstr;
}

function showProfile(){
	/*
	elaspseTime = endTime - startTime;
	document.getElementById("profilediv").innerHTML="Start Time: "+startTime+ "<br> End Time: "+endTime + "<br> Elapse Time: "+ elaspseTime;
	mwl.addClass('#profilediv', 'heightZero');
	*/
}

function clearPersonalData(){
	var requestURL = serverURL+"/iKaleidoscope/reset";

	$.ajax({
	    url: requestURL,
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

function getAllFlaggedUrl()
{
	var url='';
	for (var i=0;i<dataCount;i++)
	{
		url='';
		if($('#unflagging'+(i)).hasClass('show')==true){
			url=document.getElementById('#flaggedURL'+(i)).value;
			addFlaggedURL(url);
		}
	}
}

function addFlaggedURL(url)
{
	if(curpage=="Init" || curpage=="Prev"){
		for (var i=0; i<oriData0.length ; i++){
			if(oriData0[i]!=null && oriData0[i].flaggedURL!=null && oriData0[i].flaggedURL==url) {
				return;
			}else if(oriData0[i]!=null && oriData0[i].url==url){
				oriData0[i].flaggedURL=url;
				oriData0[i].flagged=1;
				break;
			}
		}
		
	}else if(curpage=="Next"){
		for (var i=0; i<oriData1.length ; i++){
			if(oriData1[i]!=null && oriData1[i].flaggedURL!=null && oriData1[i].flaggedURL==url) {
				return;
			}else if(oriData1[i]!=null && oriData1[i].url==url){
				oriData1[i].flaggedURL=url;
				oriData1[i].flagged=1;
				break;
			}
		}
	}
    //temperary solution
	flagInappropriateURLs();
}

function removeFlaggedURL(url)
{
	if(curpage=="Init" || curpage=="Prev"){
		for (var i=0; i<oriData0.length ; i++){
			if(oriData0[i]!=null && oriData0[i].flaggedURL!=null && oriData0[i].flaggedURL==url) {
				oriData0[i].flaggedURL='';
				oriData0[i].flagged=0;
				return;
			}
		}
		
	}else if(curpage=="Next"){
		for (var i=0; i<oriData1.length ; i++){
			if(oriData1[i]!=null && oriData1[i].flaggedURL!=null && oriData1[i].flaggedURL==url) {
				oriData1[i].flaggedURL='';
				oriData1[i].flagged=0;
				return;
			}
		}
	}
}
function flagAllInappropriateURLs()
{
	//getAllFlaggedUrl();
	flagInappropriateURLs();
}
function flagInappropriateURLs()
{
	var dateStamp = getTimeStamp();
	var idata='[';
	var nflaggedURLs=0;
		if(curpage=="Init"||curpage=="Prev"){
			for ( var i=0; i<oriData0.length; i++){
			if(oriData0[i]!=null && oriData0[i].flaggedURL!=null && oriData0[i].flaggedURL!=''){
				if(nflaggedURLs > 1){
					idata += ',';
				}
				idata +='{"timestamp":"' + dateStamp+'",';
				idata +='"loc":"' + ctry+'",';
				idata +='"userId":"' + _METADATA['deviceID']+'",';
				idata +='"activity":"flag",';
				idata +='"url":"' + oriData0[i].flaggedURL+'"';
				oriData0[i].flaggedURL='';
				nflaggedURLs++;
				idata +='}';
			}
			}
		}else{
			for ( var i=0; i<oriData1.length; i++){
			if(oriData1[i]!=null && oriData1[i].flaggedURL!=null && oriData1[i].flaggedURL!=''){
				if(nflaggedURLs > 1){
					idata += ',';
				}
				idata +='{"timestamp":"' + dateStamp+'",';
				idata +='"loc":"' + ctry+'",';
				idata +='"userId":"' + _METADATA['deviceID']+'",';
				idata +='"activity":"flag",';
				idata +='"url":"' + oriData1[i].flaggedURL+'"';
				oriData1[i].flaggedURL='';
				nflaggedURLs++;
				idata +='}';
			}
			}
		}
	if(nflaggedURLs >= 1) {
		idata = idata+']';
		apiForActivityCall(idata);
	}
}
function getTimeStamp()
{
	    var str = "";

	    var currentTime = new Date();
	    var curyear= currentTime.getUTCFullYear();
	    var curMonth= currentTime.getUTCMonth()+1;
	    var curdate= currentTime.getUTCDate();
	    var hours = currentTime.getUTCHours();
	    var minutes = currentTime.getUTCMinutes();
	    var seconds = currentTime.getUTCSeconds();

	    if (hours < 10) {
	    	hours = "0" + hours;
	    }
	    if (minutes < 10) {
	        minutes = "0" + minutes;
	    }
	    if (seconds < 10) {
	        seconds = "0" + seconds;
	    }
	    if (curMonth < 10) {
	    	curMonth = "0" + curMonth;
	    }
	    if (curdate < 10) {
	    	curdate = "0" + curdate;
	    }
	    str = curyear+"-"+curMonth+"-"+curdate+"T"+hours + ":" + minutes + ":" + seconds+ ":00";
	    
	    return str;
	
}
function apiForActivityCall(inputData){
	var requestURL = serverURL+"/iKaleidoscope/activity";
	sendEvents(requestURL,inputData);
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
function ping()
{
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
				is3 =is3 + 1;
				switch (n){
				case 8:
					{
						if(is3 == 1 && data[6]!=null){
							tmpdata=data[6];
							data[6]=data[i];
							data[6].tileType="s3";
						}else if(is3 == 2 && data[16]!=null){
							tmpdata=data[16];
							data[16]=data[i];
							data[16].tileType="s3";
							bendS3=true;
						}
					}
					break;
				case 5:
				case 7:
				case 6:
					{
						if(is3 == 1 && data[15]!=null){
							tmpdata=data[15];
							data[15]=data[i];
							data[15].tileType="s3";
							bendS3=true;
						}
					
					}
					break;
				}
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
				switch (n){
				case 8:
					{
						if(data[3]!=null && data[3].image_url==null){
							tmpdata=data[3];
							data[3]=data[i];
							data[3].tileType="s2";
						}else if(data[4]!=null && data[4].image_url==null){
							tmpdata=data[4];
							data[4]=data[i];
							data[4].tileType="s2";
						}else if(data[9]!=null && data[9].image_url==null){
							tmpdata=data[9];
							data[9]=data[i];
							data[9].tileType="s2";
						}else if(data[10]!=null && data[10].image_url==null){
							tmpdata=data[10];
							data[10]=data[i];
							data[10].tileType="s2";
						}else if(data[13]!=null  && data[13].image_url==null){
							tmpdata=data[13];
							data[13]=data[i];
							data[13].tileType="s2";
						}else if(data[14]!=null  && data[14].image_url==null){
							tmpdata=data[14];
							data[14]=data[i];
							data[14].tileType="s2";
						}
					}
					break;
				case 5:
				case 6:
				case 7:
					{
						if(data[3]!=null && data[3].image_url==null){
							tmpdata=data[3];
							data[3]=data[i];
							data[3].tileType="s2";
						}else if(data[4]!=null && data[4].image_url==null && (n==7 || n==6)){
							tmpdata=data[4];
							data[4]=data[i];
							data[4].tileType="s2";
						}else if(data[8]!=null && data[8].image_url==null){
							tmpdata=data[8];
							data[8]=data[i];
							data[8].tileType="s2";
						}else if(data[9]!=null && data[9].image_url==null && n==7){
							tmpdata=data[9];
							data[9]=data[i];
							data[9].tileType="s2";
						}else if(data[12]!=null && data[12].image_url==null){
							tmpdata=data[12];
							data[12]=data[i];
							data[12].tileType="s2";
						}else if(data[18]!=null && data[18].image_url==null){
							tmpdata=data[18];
							data[18]=data[i];
							data[18].tileType="s2";
						}
					}
					break;
				case 3:
				case 4:
					{
						if(data[3]!=null && data[3].image_url==null){
							tmpdata=data[3];
							data[3]=data[i];
							data[3].tileType="s2";
						}else if(data[8]!=null && data[8].image_url==null){
							tmpdata=data[8];
							data[8]=data[i];
							data[8].tileType="s2";
						}else if(data[12]!=null && data[12].image_url==null){
							tmpdata=data[12];
							data[12]=data[i];
							data[12].tileType="s2";
						}else if((data[18] != null) && data[18].image_url==null){
							tmpdata=data[18];
							data[18]=data[i];
							data[18].tileType="s2";
						}
					}
					break;
				case 2:
				case 1:
					{
						if(data[3]!=null && data[3].image_url==null){
							tmpdata=data[3];
							data[3]=data[i];
							data[3].tileType="s2";
						}else if(data[8]!=null && data[8].image_url==null){
							tmpdata=data[8];
							data[8]=data[i];
							data[8].tileType="s2";
						}
					}
					break;
				}
				
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
		//console.log("in trim nS3Image= "+nS3Image+" n= "+n+" i= "+i+" tile="+data[i].tileType);
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
	datac=putTheLargeImagesArticleAtTheTop(data);
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
	var nstring=string.substring(0,n);
	var finalString=nstring;
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
	}
	
	return finalString;
}
function getAllLikedUrl()
{
	var url='';
	for (var i=0;i<dataCount;i++)
	{
		url='';
		if($('#like_ssp'+(i)).hasClass('show')==true){
			url=document.getElementById('#likedURL'+(i)).value;
			addLikedURL(url);//,i);
		}
	}
}
function addLikedURL(url)
{
	if(curpage=="Init" || curpage=="Prev"){
		for (var i=0; i<oriData0.length ; i++){
			if(oriData0[i]!=null && oriData0[i].likedURL!=null && oriData0[i].likedURL==url) {
				return;
			}else if(oriData0[i]!=null && oriData0[i].url==url){
				oriData0[i].likedURL=url;
				oriData0[i].liked=1;
				break;
			}
		}
	}else if(curpage=="Next"){
		for (var i=0; i<oriData1.length ; i++){
			if(oriData1[i]!=null && oriData1[i].likedURL!=null && oriData1[i].likedURL==url) {
				return;
			}else if(oriData1[i]!=null && oriData1[i].url==url){
				oriData1[i].likedURL=url;
				oriData1[i].liked=1;
				break;
			}
		}
	}
    //temperary solution
	likeStoryURLs();
}

function removeLikedURL(url)
{
	if(curpage=="Init" || curpage=="Prev"){
		for (var i=0; i<oriData0.length ; i++){
			if(oriData0[i]!=null && oriData0[i].likedURL!=null && oriData0[i].likedURL==url) {
				oriData0[i].likedURL='';
				oriData0[i].liked=0;
				return;
			}
		}
	}else if(curpage=="Next"){
		for (var i=0; i<oriData1.length ; i++){
			if(oriData1[i]!=null && oriData1[i].likedURL!=null && oriData1[i].likedURL==url) {
				oriData1[i].likedURL='';
				oriData1[i].liked=0;
				return;
			}
		}
	}
}
function likeAllStoryURLs()
{
	getAllLikedUrl();
	likeStoryURLs();
}
function likeStoryURLs()
{
	var dateStamp = getTimeStamp();
	var idata='[';
	var nlikedURLs=0;
	if(curpage=="Init"||curpage=="Prev"){
		for ( var i=0; i<oriData0.length; i++){
			if(oriData0[i]!=null && oriData0[i].likedURL!=null && oriData0[i].likedURL!=''){
				if(nlikedURLs > 1){
						idata += ',';
				}
				idata +='{"timestamp":"' + dateStamp+'",';
				idata +='"loc":"' + ctry+'",';
				idata +='"userId":"' + _METADATA['deviceID']+'",';
				idata +='"activity":"like",';
				idata +='"url":"' + oriData0[i].likedURL+'"';
				oriData0[i].likedURL='';
				nlikedURLs++;
				idata +='}';
				}
		}
	}else{
		for ( var i=0; i<oriData1.length; i++){
			if(oriData1[i]!=null && oriData1[i].likedURL!=null && oriData1[i].likedURL!=''){
				if(nlikedURLs > 1){
					idata += ',';
				}
				idata +='{"timestamp":"' + dateStamp+'",';
				idata +='"loc":"' + ctry+'",';
				idata +='"userId":"' + _METADATA['deviceID']+'",';
				idata +='"activity":"like",';
				idata +='"url":"' + oriData1[i].likedURL+'"';
				oriData1[i].likedURL='';
				nlikedURLs++;
				idata +='}';
			}
		}
	}
	if(nlikedURLs >= 1) {
		idata = idata+']';
		apiForActivityCall(idata);
	}
}

function getViewFullStoryUrlStr(viewURL)
{
	var dateStamp = getTimeStamp();
	var idata='';
	if(viewURL!=""){
		idata ='userId=' + encodeURIComponent(_METADATA['deviceID'])+'&';
		idata +='url=' + encodeURIComponent(viewURL)+'&';
		idata +='loc=' + encodeURIComponent(_METADATA['countryCode'])+'&';
		idata +='timestamp=' + encodeURIComponent(dateStamp);
	}
	return idata;
}
function apiForActivityCall(inputData){
	var requestURL = serverURL+"/iKaleidoscope/activity";
	sendEvents(requestURL,inputData);
}
function sendEvents(url,wireEvent) {
    //var msg = "e=" + jsonToString(wireEvent, true),
     //   encodedMsg = encodeURI(msg);

    //debugLog(["Sending message to ", url, ": ", msg].join(''));

    var xhReq = new XMLHttpRequest();
   
    xhReq.onreadystatechange = function() {
        if (this.readyState === 4) {
        	if (this.status === 200 || this.status === 202) {
            	;//debugLog("Sending to the url server succeeded.");
        	}
        	else {
            	;//debugLog("Sending to the url server failed. Server sends HTTP Status Code " + this.status);
            }
        }
    };
   
    xhReq.open("POST", url, true);
    //xhReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhReq.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhReq.send(wireEvent);
}
function isInLiked(url){
	if(curpage=="Init" || curpage=="Prev"){
		for (var i=0; i<oriData0.length ; i++){
			if(oriData0[i]!=null && oriData0[i].url==url && oriData0[i].liked !=null && oriData0[i].liked==1) {
				return true;
			}
		}
	}else if(curpage=="Next"){
		for (var i=0; i<oriData1.length ; i++){
			if(oriData1[i]!=null && oriData1[i].url==url && oriData1[i].liked !=null && oriData1[i].liked==1) {
				return true;
			}
		}
	}
	return false;
}
function isInFlagged(url){
	if(curpage=="Init" || curpage=="Prev"){
		for (var i=0; i<oriData0.length ; i++){
			if(oriData0[i]!=null && oriData0[i].url==url && oriData0[i].flagged!=null && oriData0[i].flagged==1) {
				return true;
			}
		}
	}else if(curpage=="Next"){
		for (var i=0; i<oriData1.length ; i++){
			if(oriData1[i]!=null && oriData1[i].url==url && oriData1[i].flagged!=null && oriData1[i].flagged==1) {
				return true;
			}
		}
	}
	return false;
}
function getScaledCroppedImageForDetailPage(item)
{
	var dpImgWidth=240;
	var dpImgHeight=120;
	var heightVal=dpImgHeight;
	var widthVal=dpImgWidth;
	var image_width = 0;
	var image_height = 0;
	if(item==null)return;
	gscaledSSPImgHeight=0,
	gscaledSSPImgWidth=0;
	if(item.image_width!=null && item.image_width!=0) image_width = item.image_width;
	if(item.image_height!=null && item.image_height!=0) image_height = item.image_height;
	
	var finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal+"&hs="+heightVal ;
	if(image_width !=0 && image_height !=0){
	if(image_width > image_height){
		//Landscape
		if(image_width > dpImgWidth && image_height > dpImgHeight){
			widthVal=dpImgWidth;
			var off= ((widthVal/image_width * image_height)-dpImgHeight)/6.0;//close to top
			if(off > 0.0){
				off=0;
				heightVal=dpImgHeight;
				finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal+"&wc="+widthVal+"&hc="+dpImgHeight+"&ho="+off;
			}else {
				heightVal=widthVal/image_width * image_height;
				heightVal=Math.round(heightVal);
				finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal ;
			}
			
		}else {
			if(image_height > dpImgHeight){
				heightVal=dpImgHeight;
				widthVal=heightVal/image_height *image_width;
				widthVal=Math.round(widthVal);
				finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&hs="+heightVal ;
			}else if (image_height < dpImgHeight){
				widthVal=dpImgWidth;
				var off= ((widthVal/image_width * image_height)-dpImgHeight)/6.0;//close to top
				if(off > 0.0){
					off=0;
					heightVal=dpImgHeight;
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal+"&wc="+widthVal+"&hc="+dpImgHeight+"&ho="+off;
				}else {
					heightVal=widthVal/image_width * image_height;
					heightVal=Math.round(heightVal);
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal ;
				}
			}else{
				widthVal=dpImgWidth;
				heightVal=dpImgHeight;
				if(image_width > widthVal){
					var off= (image_width-widthVal)/2;//equal on horizontal
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&hs="+heightVal+"&hc="+heightVal+"&wc="+widthVal+"&wo="+off ;
				}else {
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&hs="+heightVal+"&ws="+widthVal ;
				}
			}
		}
	}else if (image_height > image_width){
		//PORTRAIT
		if(image_width > dpImgWidth && image_height > dpImgHeight){
			widthVal=dpImgWidth;
			heightVal= image_width/dpImgWidth * image_height;
			if(heightVal > dpImgHeight){
				heightVal=dpImgHeight;
				var off= (heightVal-dpImgHeight)/6.0;//close to top
				off=0;
				heightVal=Math.round(heightVal);
				finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal+"&wc="+widthVal+"&hc="+heightVal+"&ho=" +off;
			}else {
				heightVal=Math.round(heightVal);
				finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal;
			}
		}else{
			if(image_width > dpImgWidth){
				widthVal=dpImgWidth;
				heightVal=  image_height;
				var off=(image_width-dpImgWidth)/2;
				finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&hs="+image_height+"&hc="+image_height+"&wc="+widthVal+"&wo="+off ;
			}else if (image_width < dpImgWidth){
				heightVal=dpImgHeight;
				var off=((heightVal/image_height * image_width)-dpImgWidth)/2;
				if(off>0){
					widthVal=dpImgWidth;
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&hs="+heightVal+"&hc="+heightVal +"&wc="+dpImgWidth+"&wo="+off ;
				}else {
					widthVal=heightVal/image_height * image_width;
					widthVal=Math.round(widthVal);
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&hs="+heightVal;
				}
			}else{
				widthVal=dpImgWidth;
				if(image_height > dpImgHeight){
					heightVal=dpImgHeight;
					var off= (image_height-dpImgHeight)/6.0;//close to top
					off=0;
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal+"&wc="+widthVal+"&hc="+heightVal+"&ho="+off;
				}else {
					heightVal= image_width/dpImgWidth * image_height;
					heightVal=Math.round(heightVal);
					finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal;
				}
			}
		}
	}else {
		heightVal=dpImgHeight;
		widthVal=heightVal/image_height * image_width;
		widthVal=Math.round(widthVal);
		finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&hs="+heightVal ;
	}
	}else{
		widthVal=dpImgWidth;
		heightVal=dpImgHeight;
		finalImage=serverURLForImage +"/imgproc?url="+encodeURIComponent(item.image_url_ssp)+"&ws="+widthVal+"&hs="+heightVal ;
	}
	gscaledSSPImgWidth=widthVal;
	gscaledSSPImgHeight=heightVal;
	return finalImage;
}
function addLikingUIHTML(item, index)
{
	var itemUrl='';
	if(item.url!=null) {
		itemUrl=item.url;
	}
	var outputstr='';
	outputstr= '<div id="center-btn_ssp'+(index)+'" class="show">'; 
	outputstr+='<img id="like_ssp'+(index)+'"';
	if(isInLiked(itemUrl)==true){
		outputstr+=' class="show"';
	}else{
		outputstr+=' class="hide"';
	}
	outputstr+=' src="s40-theme/images/like-on.png" width="46" height="46"'; 
	outputstr+=' onclick="';
	outputstr+=' mwl.setGroupTarget(\'#center-btn_ssp'+(index)+'\',\'#unlike_ssp'+(index)+'\', \'show\', \'hide\');';
	outputstr+=' removeLikedURL(\''+itemUrl+'\');';
	outputstr+=' Analytics.logEvent(\'DetailPage\', \'ClickToUnLikeStory\', Analytics.eventType.ACTIVITY);';
	outputstr+='"';
	outputstr+=' >';
	outputstr+='<img id="unlike_ssp'+(index)+'"';
	if(isInLiked(itemUrl)==true){
		outputstr+=' class="hide"';
	}else{
		outputstr+=' class="show"';
	}
	outputstr+=' src="s40-theme/images/like-off.png" width="46" height="46"'; 
	outputstr+=' onclick="';
	outputstr+=' mwl.setGroupTarget(\'#center-btn_ssp'+(index)+'\',\'#like_ssp'+(index)+'\', \'show\', \'hide\');';
	outputstr+=' addLikedURL(\''+itemUrl+'\');';
	outputstr+=' Analytics.logEvent(\'DetailPage\', \'ClickToLikeStory\', Analytics.eventType.ACTIVITY);';
	outputstr+='"';
	outputstr+=' >';
	outputstr+=' <input type=hidden class="likedInput" id="#likedURL'+(index) +'" value="'+itemUrl+'" />';
	outputstr+='</div>';
	return outputstr;
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
	$('#toolbar-2-center-btn').removeClass('hide'); 
	$('#toolbar-2-center-btn').addClass('show'); 
	//$('#center-btn_ssp'+i).removeClass('hide'); 
	//$('#center-btn_ssp'+i).addClass('show'); 
	//$('#btn'+i).removeClass('hide'); 
	//$('#btn'+i).addClass('show'); 
	addSwipeListenerScriptAt(i);
}
function generateStoryDetailPageHTMLStrForSubBlocks(i)
{
	//Here we need to generate HTML for each story detail 
	var itemImage = "",itemTitle = "",itemDesc = "";
	var itemUrl = "",itemKeywords= "", itemType= "";
	var itemTags="", outputstr="", itemSource=""; 
	var itemWidth=0, itemHeight=0, itemDomain="";
	var widthVal=0, heightVal=0, topoff=0;
	var scaleimgstr="";
	
	var imgWidth=240, imgHeight=120, maxSWidth=178;
	
	if(curData[i].image_url_ssp!=null ) {
		itemImage=curData[i].image_url_ssp;
	}
	if(curData[i].title!=null) {
		itemTitle=curData[i].title;
	}
	if(curData[i].description!=null ) {
		itemDesc=curData[i].description;
	}
	/*
	if(curData[i].keywords!=null) {
		itemKeywords=curData[i].keywords;
	}
	*/
	if(curData[i].url!=null) {
		itemUrl=curData[i].url;
	}
	if(curData[i].type!=null) {
		itemType=curData[i].type;
	}
	/*
	if(curData[i].tags!=null) {
		itemTags=curData[i].tags;
	}
	*/
	if(curData[i].source!=null){
		itemSource=curData[i].source;
	}
	if(curData[i].domain!=null){
		itemDomain=curData[i].domain;
	}
	if(curData[i].image_width!=null){
		itemWidth=curData[i].image_width;
	}
	if(curData[i].image_height!=null){
		itemHeight=curData[i].image_height;
	}
	
//    outputstr += '<td valign="top">';
	
	outputstr += '<div id="entrysub" class="entry-view" data-scrollbar="no">';
	
	if(itemImage!="" && (itemHeight>=30 && itemWidth>=30)){
		outputstr += '<div id="ss-content" class="imageYes">';
	}else {
		outputstr += '<div id="ss-content">';
	}
	
	outputstr += '<div class="ss-title-wrapper">';
	
	if(itemTitle!=""){
		outputstr += '<div id="ss-title" class="ss-title"';
		if(itemTitle.length > 40){
			//itemTitle = getTheTextWithFinalCompleteWord(itemTitle,40);
			itemTitle = itemTitle.substring(0,40);
			itemTitle +=' ...';
		}

		outputstr += '>'+itemTitle+'</div>';
	}
	if(itemSource!=""){
		outputstr += '<div id="ss-source" class="ss-source">'+itemSource+'</div>';
	}else if(itemDomain!=""){
		outputstr += '<div id="ss-source" class="ss-source">'+itemDomain+'</div>';
	}
	outputstr += '</div>'; // ss-title-wrapper
	
	
	//var atile=new s_tile("g7","s2,,type2,,", curData[i],i);
	//always show image as Won wanted it
	//itemHeight=29;
	//itemWidth=29;
	if(itemImage!="" && (itemHeight>=30 && itemWidth>=30)){
		if(curData[i].image_url_ssp!=null){
			scaleimgstr=getScaledCroppedImageForDetailPage(curData[i]);
			itemHeight=gscaledSSPImgHeight;
			itemWidth=gscaledSSPImgWidth;
		}
		if(itemWidth > imgWidth && itemHeight > imgHeight) {
			outputstr += '<div id="ss-image-div" class="ss-image-div">';
			var leftoff=(imgWidth-itemWidth)/2;
			if(leftoff>0){
				outputstr += '<div id="ss-image-area" align="center" style=" margin-left:'+leftoff+'px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
			}else{
				outputstr += '<div id="ss-image-area" align="center" style=" margin-left:0px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
			}
			outputstr += ' background-image: url(\'';
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			outputstr += generateBMNextPrevButtonsODL(i);
			outputstr += '</div>';
			outputstr += '</div>';
		}else if(itemWidth == imgWidth && itemHeight == imgHeight) {
			outputstr += '<div id="ss-image-div" class="ss-image-div">';
			var leftoff=(imgWidth-itemWidth)/2;
			if(leftoff>0){
				outputstr += '<div id="ss-image-area" align="center" style=" margin-left:'+leftoff+'px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
			}else {
				outputstr += '<div id="ss-image-area" align="center" style=" margin-left:0px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
			}
			outputstr += ' background-image: url(\'';
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			
			outputstr += generateBMNextPrevButtonsODL(i);
			outputstr += '</div>';
			outputstr += '</div>';
			
		}else if(itemWidth >= imgWidth && itemHeight < imgHeight) {
			heightVal=itemHeight;
			widthVal=itemWidth;
			var topoff=(imgHeight-heightVal)/2 ;
			var leftoff=(imgWidth-widthVal)/2; 
			outputstr += '<div id="ss-image-div" class="ss-image-div">';
			outputstr += generateBMNextPrevButtonsODL(i); //-20px;
			outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';	
			outputstr += ' background-image: url(\'';
			
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			
			outputstr += '</div>';
			outputstr += '</div>';
			
		}else if(itemWidth < imgWidth && itemHeight >= imgHeight) {
			//API scale to the smaller size
			heightVal=itemHeight;
			widthVal=itemWidth;
			topoff=(imgHeight-heightVal)/2 ;
			leftoff=(imgWidth-widthVal)/2 ;
			outputstr += '<div id="ss-image-div" class="ss-image-div">';
			outputstr += generateBMNextPrevButtonsODL(i);
			if(widthVal < (imgWidth-61)){
				outputstr += '<div id="ss-image-area" align="center" style="margin-top:-20px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';
			}else{
				outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';
			}
			outputstr += ' background-image: url(\'';
			
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			outputstr += '</div>';
			outputstr += '</div>';
			
		}else if(itemWidth >0 && itemHeight >0 && itemWidth < imgWidth && itemHeight < imgHeight){
			//use original image
			if(itemHeight>=30 && itemWidth>=30){
				heightVal=itemHeight;
				widthVal=itemWidth;
				topoff=(imgHeight-heightVal)/2 ;
				leftoff=(imgWidth-widthVal)/2 ;
				outputstr += '<div id="ss-image-div" class="ss-image-div">';
				outputstr += generateBMNextPrevButtonsODL(i);
				outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px;margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+'height:'+heightVal+'px;';	
				outputstr += ' background-image: url(\'';
				
				outputstr += scaleimgstr;
				outputstr += '\'); background-repeat: no-repeat;" ';	
				outputstr += '>';
				outputstr += '</div>';
				outputstr += '</div>';
				
			}else{
				
				outputstr += generateBMNextPrevButtonsODL(i);
			}
		}else {
			
			heightVal=itemHeight;
			widthVal=itemWidth;
			
			outputstr += '<div id="ss-image-div" class="ss-image-div">';
			outputstr += '<div id="ss-image-area" align="center" style="margin-left:0px; display: table-cell;text-align:center; height:'+heightVal+'px;width:'+widthVal+'px;';	
			outputstr += ' background-image: url(\'';
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			
			outputstr += generateBMNextPrevButtonsODL(i);
			outputstr += '</div>';
			outputstr += '</div>';
			
		}
	}else {
		// outputstr +=generateBMNextPrevButtons(this.index);
		outputstr += '<div id="ss-image-div" class="ss-image-div">';
		outputstr += '<div id="ss-image-area" align="center" style="margin-left:0px; display: table-cell;text-align:center; height:120px; width:240px;';	
		outputstr += ' background-image: url(\'./s40-theme/images/no-image-bg.png\'); background-repeat: no-repeat;" ';	
		outputstr += '>';
		
		outputstr += generateBMNextPrevButtonsODL(i);
		outputstr += '</div>';
		outputstr += '</div>';
	}

	if(itemDesc != ""){
		outputstr += '<div id="ss-content-body-block" class="ss-content-body">'+itemDesc+'</div>';
	}else{
		outputstr += '<div style="height:10px;">&nbsp;</div>';
	}
	
	outputstr += '</div>';
	
	// FULL-STORY-LINK
	
	outputstr += '<div id="full-story-link" class="full-story-link"';
	outputstr += 'onclick="mwl.loadURL(\''+serverURL+'/iKaleidoscope/view?'+getViewFullStoryUrlStr(itemUrl)+'\');';
	outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickToOriginalPage\', Analytics.eventType.ACTIVITY);return false;"';
	outputstr += '><div class="full-story-image"></div><div class="full-story-text">'+locale.get('id_fullStory_Button')+'</div></div>';
	
	// SHARE-BUTTONS
	outputstr += '<div id="share-toolbar" class="share-toolbar"';
	outputstr += '>';
	outputstr += '<div class="share-toolbar-title">'+locale.get('id_share')+'</div>'; 

	outputstr += '<div class="share-btn">';
	outputstr += '	<a onclick="';
	outputstr += 'mwl.loadURL(\'http://m.facebook.com/sharer.php?u='+itemUrl+'\');';
	//outputstr += ' addShareActivity(\''+itemUrl+'\');';
	outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickToFacebookShare\', Analytics.eventType.ACTIVITY);return false;">';
	outputstr += '		<img src="s40-theme/images/facebook-icon.png" alt="FB" width="40" height="40" />';
	outputstr += '	</a>';
	outputstr += '</div>';
	
	outputstr += '<div class="share-btn">';
	outputstr += '	<a onclick="';
	outputstr += 'mwl.loadURL(\'http://mobile.twitter.com/home?status='+encodeURIComponent(itemUrl)+'\');';
	//outputstr += ' addShareActivity(\''+itemUrl+'\');';
	outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickToTwitterShare\', Analytics.eventType.ACTIVITY);return false;">';
	outputstr += '		<img src="s40-theme/images/twitter-icon.png" alt="twitter" width="40" height="40" />';
	outputstr += '	</a>';
	outputstr += '</div>';
	
	outputstr += '<div class="share-btn"';
	outputstr += '>';
	outputstr += '	<a ';
	//outputstr += 'href="sms:?body='+encodeURIComponent(itemUrl)+'"';
	outputstr += ' onclick="';
	outputstr += ' addShareActivity(\''+itemUrl+'\');';
	outputstr += 'mwl.loadURL(\'sms:?body='+itemUrl+'\');';
	outputstr += '"';
	outputstr += '>';
	outputstr += '		<img src="s40-theme/images/sms-icon.png" alt="sms" width="40" height="40" />';
	outputstr += '	</a>';
	outputstr += '</div>';
	
	outputstr += '</div>'; //share-toolbar
	outputstr += '<div style="height:1px;">&nbsp;</div>'; //for spacing below share-buttons
	outputstr += addFlaggingUIHTML(curData[i],i);
	//outputstr += this.addFlaggingUIHTML();
	outputstr += '</div>';
	//append the like ui for this ssp to the toolbar-2 div
	var likedivstr= addLikingUIHTML(curData[i],i);
	//var likedivstr=this.addLikingUIHTML();
	$('#toolbar-2-center-btn').html(likedivstr);
//	outputstr += '</td>'; 
	//atile=null;
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
	listenerText += "mwl.addSwipeLeftListener('#entrysub',\"";
	listenerText += 'mwl.timer(\'LoadSSPBySwipeLeft\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+(j+1)+')\');';
	listenerText += 'Analytics.logEvent(\'DetailPage\', \'SwipeToLeft\', Analytics.eventType.ACTIVITY);';
	listenerText += "\");";
    }
	if(j-1 >=0){
	listenerText += "mwl.addSwipeRightListener('#entrysub',\"";
	listenerText += 'mwl.timer(\'LoadSSPBySwipeRight\', 1, 1, \'getBtnStoryDetailPageHTMLStr('+(j-1)+')\');';
	listenerText += 'Analytics.logEvent(\'DetailPage\', \'SwipeToRight\', Analytics.eventType.ACTIVITY);';
	listenerText += "\");";
	}
	
	
	var listenerScriptText = document.createTextNode(listenerText);
	scriptNode.appendChild(listenerScriptText);
	var bodyNode = document.getElementsByTagName('body')[0];
	bodyNode.appendChild(scriptNode);
}
function getBtnStoryDetailPageHTMLStr(i)
{
	generateStoryDetailPageHTMLStrForSubBlocksUpdate(i);
	addSwipeListenerScriptAt(i);
}
function generateStoryDetailPageHTMLStrForSubBlocksUpdate(i)
{
	//Here we need to generate HTML for each story detail 
	var itemImage = "",itemTitle = "",itemDesc = "";
	var itemUrl = "",itemKeywords= "", itemType= "";
	var itemTags="", outputstr="", itemSource=""; 
	var itemWidth=0, itemHeight=0, itemDomain="";
	var widthVal=0, heightVal=0, topoff=0;
	var scaleimgstr="";
	
	var imgWidth=240, imgHeight=120, maxSWidth=178;
	
	if(curData[i].image_url_ssp!=null ) {
		itemImage=curData[i].image_url_ssp;
	}
	if(curData[i].title!=null) {
		itemTitle=curData[i].title;
	}
	if(curData[i].description!=null ) {
		itemDesc=curData[i].description;
	}
	/*
	if(curData[i].keywords!=null) {
		itemKeywords=curData[i].keywords;
	}
	*/
	if(curData[i].url!=null) {
		itemUrl=curData[i].url;
	}
	if(curData[i].type!=null) {
		itemType=curData[i].type;
	}
	/*
	if(curData[i].tags!=null) {
		itemTags=curData[i].tags;
	}
	*/
	if(curData[i].source!=null){
		itemSource=curData[i].source;
	}
	if(curData[i].domain!=null){
		itemDomain=curData[i].domain;
	}
	if(curData[i].image_width!=null){
		itemWidth=curData[i].image_width;
	}
	if(curData[i].image_height!=null){
		itemHeight=curData[i].image_height;
	}
	outputstr="";
	if(itemImage!="" && (itemHeight>=30 && itemWidth>=30)){
		if(curData[i].image_url_ssp!=null){
			scaleimgstr=getScaledCroppedImageForDetailPage(curData[i]);
			itemHeight=gscaledSSPImgHeight;
			itemWidth=gscaledSSPImgWidth;
		}
		if(itemWidth > imgWidth && itemHeight > imgHeight) {
			//outputstr += '<div id="ss-image-div" class="ss-image-div">';
			var leftoff=(imgWidth-itemWidth)/2;
			if(leftoff>0){
				outputstr += '<div id="ss-image-area" align="center" style=" margin-left:'+leftoff+'px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
			}else{
				outputstr += '<div id="ss-image-area" align="center" style=" margin-left:0px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
			}
			outputstr += ' background-image: url(\'';
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			outputstr += generateBMNextPrevButtonsODL(i);
			outputstr += '</div>';
			//outputstr += '</div>';
		}else if(itemWidth == imgWidth && itemHeight == imgHeight) {
			//outputstr += '<div id="ss-image-div" class="ss-image-div">';
			var leftoff=(imgWidth-itemWidth)/2;
			if(leftoff>0){
				outputstr += '<div id="ss-image-area" align="center" style=" margin-left:'+leftoff+'px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
			}else {
				outputstr += '<div id="ss-image-area" align="center" style=" margin-left:0px; display: table-cell;text-align:center; height:'+itemHeight+'px; width:'+itemWidth+'px;';
			}
			outputstr += ' background-image: url(\'';
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			
			outputstr += generateBMNextPrevButtonsODL(i);
			outputstr += '</div>';
			//outputstr += '</div>';
			
		}else if(itemWidth >= imgWidth && itemHeight < imgHeight) {
			heightVal=itemHeight;
			widthVal=itemWidth;
			var topoff=(imgHeight-heightVal)/2 ;
			var leftoff=(imgWidth-widthVal)/2; 
			//outputstr += '<div id="ss-image-div" class="ss-image-div">';
			outputstr += generateBMNextPrevButtonsODL(i); //-20px;
			outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';	
			outputstr += ' background-image: url(\'';
			
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			
			outputstr += '</div>';
			//outputstr += '</div>';
			
		}else if(itemWidth < imgWidth && itemHeight >= imgHeight) {
			//API scale to the smaller size
			heightVal=itemHeight;
			widthVal=itemWidth;
			topoff=(imgHeight-heightVal)/2 ;
			leftoff=(imgWidth-widthVal)/2 ;
			//outputstr += '<div id="ss-image-div" class="ss-image-div">';
			outputstr += generateBMNextPrevButtonsODL(i);
			if(widthVal < (imgWidth-61)){
				outputstr += '<div id="ss-image-area" align="center" style="margin-top:-20px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';
			}else{
				outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px; margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+' height:'+heightVal+'px;';
			}
			outputstr += ' background-image: url(\'';
			
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			outputstr += '</div>';
			//outputstr += '</div>';
			
		}else if(itemWidth >0 && itemHeight >0 && itemWidth < imgWidth && itemHeight < imgHeight){
			//use original image
			if(itemHeight>=30 && itemWidth>=30){
				heightVal=itemHeight;
				widthVal=itemWidth;
				topoff=(imgHeight-heightVal)/2 ;
				leftoff=(imgWidth-widthVal)/2 ;
				//outputstr += '<div id="ss-image-div" class="ss-image-div">';
				outputstr += generateBMNextPrevButtonsODL(i);
				outputstr += '<div id="ss-image-area" align="center" style="margin-top:0px;margin-left:'+leftoff+'px; display: table-cell;width:'+widthVal+'px; '+'height:'+heightVal+'px;';	
				outputstr += ' background-image: url(\'';
				
				outputstr += scaleimgstr;
				outputstr += '\'); background-repeat: no-repeat;" ';	
				outputstr += '>';
				outputstr += '</div>';
				//outputstr += '</div>';
				
			}else{
				
				outputstr += generateBMNextPrevButtonsODL(i);
			}
		}else {
			
			heightVal=itemHeight;
			widthVal=itemWidth;
			
			//outputstr += '<div id="ss-image-div" class="ss-image-div">';
			outputstr += '<div id="ss-image-area" align="center" style="margin-left:0px; display: table-cell;text-align:center; height:'+heightVal+'px;width:'+widthVal+'px;';	
			outputstr += ' background-image: url(\'';
			outputstr += scaleimgstr;
			outputstr += '\'); background-repeat: no-repeat;" ';	
			outputstr += '>';
			
			outputstr += generateBMNextPrevButtonsODL(i);
			outputstr += '</div>';
			//outputstr += '</div>';
			
		}
	}else {
		// outputstr +=generateBMNextPrevButtons(this.index);
		//outputstr += '<div id="ss-image-div" class="ss-image-div">';
		outputstr += '<div id="ss-image-area" align="center" style="margin-left:0px; display: table-cell;text-align:center; height:120px; width:240px;';	
		outputstr += ' background-image: url(\'./s40-theme/images/no-image-bg.png\'); background-repeat: no-repeat;" ';	
		outputstr += '>';
		
		outputstr += generateBMNextPrevButtonsODL(i);
		outputstr += '</div>';
		//outputstr += '</div>';
	}
	
	if(itemTitle!=""){
		if(itemTitle.length > 40){
			//itemTitle = getTheTextWithFinalCompleteWord(itemTitle,40);
			itemTitle = itemTitle.substring(0,40);
			itemTitle +=' ...';
		}
	}
	if(itemImage!=""){
		$("#ss-content").addClass('imageYes');
	}else{
		$("#ss-content").removeClass('imageYes');
	}
	
	$("#ss-image-div").html(outputstr);
	$("#ss-title").html(itemTitle);
	if(itemSource!=""){
		$('#ss-source').html(itemSource);
	}else if(itemDomain!=""){
		$('#ss-source').html(itemDomain);
	}
	
	if(itemDesc != ""){
		$('#ss-content-body-block').html(itemDesc);
	}else{
		$('#ss-content-body-block').html(itemDesc);
	}
	
	//
// FULL-STORY-LINK
	outputstr='';
	outputstr += '<div id="full-story-link" class="full-story-link"';
	outputstr += 'onclick="mwl.loadURL(\''+serverURL+'/iKaleidoscope/view?'+getViewFullStoryUrlStr(itemUrl)+'\');';
	outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickToOriginalPage\', Analytics.eventType.ACTIVITY);return false;"';
	outputstr += '><div class="full-story-image"></div><div class="full-story-text">Full Story</div></div>';
	
	$('#full-story-link').remove();
	$(outputstr).insertBefore('#share-toolbar');
	
	// SHARE-BUTTONS
	outputstr='';
	//outputstr += '<div id="share-toolbar" class="share-toolbar"';
	//outputstr += '>';
	outputstr += '<div id="share-toolbar" class="share-toolbar-title">SHARE</div>'; 

	outputstr += '<div class="share-btn">';
	outputstr += '	<a onclick="';
	//outputstr += 'mwl.loadURL("http://m.facebook.com/sharer.php?u='+encodeURIComponent(itemUrl)+'&t='+encodeURIComponent(itemTitle)+'");';
	outputstr += 'mwl.loadURL(\'http://m.facebook.com/sharer.php?u='+itemUrl+'\');';
	//outputstr += ' addShareActivity(\''+itemUrl+'\');';
	outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickToFacebookShare\', Analytics.eventType.ACTIVITY);return false;">';
	outputstr += '		<img src="s40-theme/images/facebook-icon.png" alt="FB" width="40" height="40" />';
	outputstr += '	</a>';
	outputstr += '</div>';
	
	outputstr += '<div class="share-btn">';
	outputstr += '	<a onclick="';
	outputstr += 'mwl.loadURL(\'http://mobile.twitter.com/home?status='+encodeURIComponent(itemUrl)+'\');';
	//outputstr += ' addShareActivity(\''+itemUrl+'\');';
	outputstr += 'Analytics.logEvent(\'DetailPage\', \'ClickToTwitterShare\', Analytics.eventType.ACTIVITY);return false;">';
	outputstr += '		<img src="s40-theme/images/twitter-icon.png" alt="twitter" width="40" height="40" />';
	outputstr += '	</a>';
	outputstr += '</div>';
	
	outputstr += '<div class="share-btn"';
	outputstr += '>';
	outputstr += '	<a ';
	//outputstr += 'href="sms:?body='+encodeURIComponent(itemUrl)+'"';
	outputstr += ' onclick="';
	outputstr += ' addShareActivity(\''+itemUrl+'\');';
	outputstr += 'mwl.loadURL(\'sms:?body='+encodeURIComponent(itemUrl)+'\');';
	outputstr += '"';
	outputstr += '>';
	outputstr += '		<img src="s40-theme/images/sms-icon.png" alt="sms" width="40" height="40" />';
	outputstr += '	</a>';
	outputstr += '</div>';
	
	//outputstr += '</div>'; //share-toolbar
	
	$('#share-toolbar').html(outputstr);
	outputstr='';
	//outputstr += '<div style="height:1px;">&nbsp;</div>'; //for spacing below share-buttons
	//outputstr += addFlaggingUIHTML(curData[i],i);
	outputstr += flaggingUIHTML(curData[i],i);
	$('#flagg-Unflag').html(outputstr);
	//outputstr += this.addFlaggingUIHTML();
	//outputstr += '</div>';
	//append the like ui for this ssp to the toolbar-2 div
	var likedivstr= addLikingUIHTML(curData[i],i);
	//var likedivstr=this.addLikingUIHTML();
	$('#toolbar-2-center-btn').html(likedivstr);
}
function addFlaggingUIHTML(item, index)
{
	var itemUrl='';
	if(item.url!=null) {
		itemUrl=item.url;
	}
	var outputstr='';
	outputstr= '<div id="flagg-Unflag" class="show">'; 
	outputstr+=flaggingUIHTML(item, index)	;
	outputstr+='</div>';
	return outputstr;
}
function flaggingUIHTML(item, index)
{
	var itemUrl='';
	if(item.url!=null) {
		itemUrl=item.url;
	}
	var outputstr='';
	if(isInFlagged(itemUrl)==true){
		outputstr+= '<div id="flagging'+(index)+'" class="hide">'; 
	}else{
		outputstr+= '<div id="flagging'+(index)+'" class="show">'; 
	}
	
	outputstr+=' <div class="ui-window-unflagging positive-action"';
	outputstr+=' onclick="';
	outputstr+=' mwl.setGroupTarget(\'#flagg-Unflag\',\'#unflagging'+(index)+'\', \'show\', \'hide\');';
	outputstr+=' addFlaggedURL(\''+itemUrl+'\');';
	outputstr+=' Analytics.logEvent(\'DetailPage\', \'ClickToFlagStory\', Analytics.eventType.ACTIVITY);';
	outputstr+='"';
	outputstr+=' >';
	outputstr+='<div class="flagtext">'+locale.get('id_reportAsOffensive')+'</div><img class="flagImg" width="16" height="16"  src="s40-theme/images/flag-normal.png" /></div>';
	outputstr+='</div>';
	if(isInFlagged(itemUrl)==true){
		outputstr+= '<div id="unflagging'+(index)+'" class="show">'; 
	}else{
		outputstr+= '<div id="unflagging'+(index)+'" class="hide">'; 
	}
	outputstr+=' <div class="ui-window-unflagging positive-action"';
	outputstr+=' onclick="';
	outputstr+=' mwl.setGroupTarget(\'#flagg-Unflag\',\'#flagging'+(index)+'\', \'show\', \'hide\');';
	outputstr+=' removeFlaggedURL(\''+itemUrl+'\');';
	outputstr+=' Analytics.logEvent(\'DetailPage\', \'ClickToUnflagStory\', Analytics.eventType.ACTIVITY);';
	outputstr+='"';
	outputstr+=' ><div class="flagtext">'+locale.get('id_storyReported')+'</div><img class="flagImg" width="17" height="17" src="s40-theme/images/flag-flagged.png"  /></div>';
	outputstr+='</div>';
	outputstr+=' <input type=hidden class="flaggedInput" id="#flaggedURL'+(index) +'" value="'+itemUrl+'" />';
	return outputstr;
}
//Launch Modes ON-DEMAND, FULL-SSP, EVO
function getLaunchedMode(){
	var bres="ON-DEMAND";
	var dm=navigator.deviceModel;
	if( dm != null && inOnDemandList(dm)==true ){
		bres="ON-DEMAND";
	}else if( dm != null && inFullSSPList(dm)==true){
		bres="FULL-SSP";
	}else if( dm != null && inEVOList(dm)==true){
		bres="EVO";
	}
	//overwrite for test
	//bres="ON-DEMAND";
	return bres;
}
function inOnDemandList(dm){
	var bres=false;
	//List of low end memory limited devices
	var dms=["305","306","C2-02","C2-02.1"];
	for (var i=0; i<dms.length; i++){
		if(dm==dms[i]){
			bres=true;
			break;
		}
	}
	return bres;
}
function inFullSSPList(dm){
	var bres=false;
	//List of high end devices
	var dms=["311", "303", "300", "308", "309", "X3-02", "C3-01"];
	for (var i=0; i<dms.length; i++){
		if(dm==dms[i]){
			bres=true;
			break;
		}
	}
	return bres;
}
function inEVOList(dm){
	var bres=false;
	//List of EVO high end devices
	var dms=["501,501s"];
	for (var i=0; i<dms.length; i++){
		if(dm==dms[i]){
			bres=true;
			break;
		}
	}
	return bres;
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
