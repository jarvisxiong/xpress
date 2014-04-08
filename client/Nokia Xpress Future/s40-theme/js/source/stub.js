(function(){
	if(window.widget === undefined){
		window.widget = {
			'version': '2.0',
			'preferences': {
				"getItem": function(_key){
					return (window.widget.preferences[_key])? window.widget.preferences[_key] : null;
				},

				"setItem": function(_key, _value){
					window.widget.preferences[_key] = _value;
				},

				"acceptTC": "NO",
				"analyticsFirstUse": "false",
				"analyticsAllowed": "true",
				"debugServer": "secure_staging",
				"debugCountryCode": "",
				"debugDeviceID": "bob",
				"debugLog": "0",
				"nokiaAdsUserID": "nokia",
				"nokiaAdsSource": "",
				"accessLocationAllowed": "false",
        "Filter2_highlightFlag": "show"
			}
		};
	}
})();


/**
 * @fileOverview The Mobile Web Library (MWL) for use on Series 40 devices.
 * @author Nokia
 * @version 3.0
 */

/**
 * Shortcut method to remove the leading and trailing spaces of a string. This is built off of the String object so it
 * can be called from any String variable.
 *
 * @returns {String} The string with no leading or trailing spaces
 */
String.prototype.trim = function() {
  return (this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, ''));
};

/**
 * Shortcut method to check if a String starts with a certain string. This is built off of the String object so it can
 * be called from any String variable.
 *
 * @param {String} str The value to be matched
 * @return {Boolean} True if match, false if no match
 */
String.prototype.startsWith = function(str) {
  return (this.match('^' + str) == str);
};

/**
 * Shortcut method to check if a String ends with a certain string. This is built off of the String object so it can be
 * called from any String variable.
 *
 * @param {String} str The value to be matched
 * @return {Boolean} True if match, false if no match
 */
String.prototype.endsWith = function(str) {
  return (this.match(str + '$') == str);
};

if (!window.isOsre)
{
  // Attach an on-click event handler at the document level:
  AttachMWLEvent(document, "click", MWLEventHandler, null);
  AttachMWLEvent(document, "change", MWLEventHandler, null);
  AttachMWLEvent(document, "focus", MWLEventHandler, null);
  AttachMWLEvent(document, "blur", MWLEventHandler, null);
  AttachMWLEvent(document, "load", MWLEventHandler, null);
  AttachMWLEvent(document, "unload", MWLEventHandler, null);
  AttachMWLEvent(document, "resize", MWLEventHandler, null);
  AttachMWLEvent(document, "show", MWLEventHandler, null);
  AttachMWLEvent(document, "hide", MWLEventHandler, null);
  AttachMWLEvent(document, "touchstart", MWLEventHandler, null);
  AttachMWLEvent(document, "touchmove", MWLEventHandler, null);
  AttachMWLEvent(document, "touchend", MWLEventHandler, null);
  AttachMWLEvent(document, "keyup", MWLEventHandler, null);
}
else
{
  MWL_Event = null;
}


function AttachMWLEvent(obj, evType, fn, useCapture)
{
  if (!useCapture) {
    var useCapture = true;
  }
  if (obj.addEventListener){
    obj.addEventListener(evType, fn, useCapture);
    return true;
  } else if (obj.attachEvent){
    var r = obj.attachEvent("on"+evType, fn);
    return r;
  } else {
    return false;
  }
}

function MWLEventHandler(e)
{
  // Declare a global variable to trap events in FireFox or IE
  MWL_Event = null;
  MWL_Event = GetEventObject(e);
}

function GetEventObject(e)
{
  // e gives access to the event in all browsers
  if (!e) {
    var e = window.event;
  }
  return e;
}

function GetMWLEvent()
{
  if (window.isOsre)
  {
    return null;
  }

  var mockEvent = {};
  var eventToUse = (window.event) ? window.event : MWL_Event;

  if(eventToUse.currentTarget) {
    mockEvent.currentTarget = eventToUse.currentTarget;
  }
  if(eventToUse.type) {
    mockEvent.type = eventToUse.type;
  }
  if(eventToUse.timeStamp) {
    mockEvent.timeStamp = eventToUse.timeStamp;
  }

  return mockEvent;
}

if (window.isOsre)
{
  window.navigator.geolocation.getCurrentPosition = function(success, failure, opts) {
      window.options = opts;
      mwl.geoSuccess = success;
      mwl.geoFail = failure;
      var evt = document.createEvent("Events");
      evt.initEvent("CurrentPositionCalled", false, false);
      window.dispatchEvent(evt);
    }
}

/** @namespace mwl */
var mwl = function() {
  /**
   * The minimum number of pixels needed to constitute a left swipe. This should be a negative number because a left
   * swipe would be in the negative X axis.
   *
   * @type Number
   * @constant
   * @private
   */
  var LEFT_SWIPE_DISTANCE = -20;

  /**
   * The minimum number of pixels needed to constitute a right swipe. This should be a positive number because a right
   * swipe would be in the positive X axis.
   *
   * @type Number
   * @constant
   * @private
   */
  var RIGHT_SWIPE_DISTANCE = 20;

  /**
   * The minimum number of pixels needed to constitute a up swipe. This should be a positive number because a up swipe
   * would be in the positive Y axis.
   *
   * @type Number
   * @constant
   * @private
   */
  var UP_SWIPE_DISTANCE = -20;

  /**
   * The minimum number of pixels needed to constitute a down swipe. This should be a negative number because a up swipe
   * would be in the negative Y axis.
   *
   * @type Number
   * @constant
   * @private
   */
  var DOWN_SWIPE_DISTANCE = 20;

  /**
   * Contains the event codes for server side processing.
   * @type Array
   * @constant
   * @private
   */
  var SERVER_EVENT_CODES = new Array();
  SERVER_EVENT_CODES["click"] = 8;
  SERVER_EVENT_CODES["change"] = 28;
  SERVER_EVENT_CODES["focus"] = 500;
  SERVER_EVENT_CODES["blur"] = 501;
  SERVER_EVENT_CODES["load"] = 502;
  SERVER_EVENT_CODES["unload"] = 503;
  SERVER_EVENT_CODES["resize"] = 504;
  SERVER_EVENT_CODES["show"] = 505;
  SERVER_EVENT_CODES["hide"] = 506;
  SERVER_EVENT_CODES["longpress"] = 600;
  SERVER_EVENT_CODES["swipeleft"] = 601;
  SERVER_EVENT_CODES["swiperight"] = 602;
  SERVER_EVENT_CODES["swipeup"] = 603;
  SERVER_EVENT_CODES["swipedown"] = 604;
  SERVER_EVENT_CODES["navleft"] = 605;
  SERVER_EVENT_CODES["navright"] = 606;
  SERVER_EVENT_CODES["navup"] = 607;
  SERVER_EVENT_CODES["navdown"] = 608;

  /**
   * The rotation mode of the device
   * @type String
   * @private
   */
  var rotationMode = 'portrait';

  /**
   * Contains the events that need to be passed up to the server on the next callback.
   * @type Object
   * @private
   */
  var MWLEventsArray = new Array();

  /**
   * Holds information about the currently running timers.
   * @type Array
   * @private
   */
  var MWLTimerArray = new Array();




  /**
   * Shortcut method to find and element by a given selector. This is much like the shortcut used in JS libraries such as
   * jQuery.
   *
   * @param {String} selector The ID of the element to find
   * @return {Element} Element if found, null if element is not found
   * @private
   */
  function _get(selector) {
    if (typeof selector == 'object') {
      return selector;
    }
    if (typeof selector == 'string' && selector.startsWith('#')) {
      return document.getElementById(selector.substring(1));
    }
    return undefined;
  };
  /**
   * Method used to build the actual swipe listener. Since the code for all the listeners is so similar it is easier to
   * just use one generic method
   *
   * @param {String} targetNode The selector of the node to add the event/listener to
   * @param {String} listener The command(s) to run when the swipe has been executed
   * @param {String} direction The direction that the swipe should be listening for. (left, right, up, down)
   * @returns void
   * @private
   */
  function _buildSwipeListener(targetNode, listener, direction) {
  
if (window.isOsre) //Is OSRE Runtime
    {
      var swipeAttr = "onswipe" + direction;
      _get(targetNode).setAttribute(swipeAttr, listener);
      return;
    }
  
    var startX;
    var startY;
    var deltaX;
    var deltaY;

    function onTouchStart(event) {
      clearEverything();
      if(event.touches != null) {
        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
      }
      else {
        startX = event.pageX;
        startY = event.pageY;
      }
    }

    function onTouchMove(event) {
      if(event.touches != null) {
        deltaX = event.touches[0].pageX - startX;
        deltaY = event.touches[0].pageY - startY;
      }
      else {
        deltaX = event.pageX - startX;
        deltaY = event.pageY - startY; 
      }
    }

    function onTouchEnd() {
      var eventType = null;

      switch (direction.toLowerCase()) {
        case 'left':
          if (deltaX < 0 && deltaX < LEFT_SWIPE_DISTANCE) {
            eventType = "swipeleft";
            eval(listener);
          }
          break;
        case 'right':
          if (deltaX > 0 && deltaX > RIGHT_SWIPE_DISTANCE) {
            eventType = "swiperight";
            eval(listener);
          }
          break;
        case 'up':
          if (deltaY < 0 && deltaY < UP_SWIPE_DISTANCE) {
            eventType = "swipeup";
            eval(listener);
          }
          break;
        case 'down':
          if (deltaY > 0 && deltaY > DOWN_SWIPE_DISTANCE) {
            eventType = "swipedown";
            eval(listener);
          }
          break;
      }

      if(eventType != null) {
        _checkEvent(null, eventType, null);
      }
    }

    function clearEverything() {
      startX = null;
      startY = null;
      deltaX = null;
      deltaY = null;
    }

    _addMWLEventListener(targetNode, 'touchstart', onTouchStart);
    _addMWLEventListener(targetNode, 'touchmove', onTouchMove);
    _addMWLEventListener(targetNode, 'touchend', onTouchEnd);
  }
  /**
   * Used to find the URL to use. This is needed for clientless requests that are not in proxy mode otherwise the user
   * will break out of the server. Should only be called if there is a base tag available.
   *
   * @param {Element} baseElement The base tag
   * @param {String} url The URL to redirect/request
   * @returns {String} The full URL to be used for the request
   * @private
   */
  function _getRedirectURL(baseElement, url) {
    var reqUrl = url;
    var baseHref = _getRealBaseHref(baseElement.href, url);

    if (url.startsWith('http://')) {
      url = url.substring(7);
      if (!baseHref.endsWith('/')) {
        baseHref += '/';
      }
      reqUrl = baseHref + url;
    }
    else {
      if (url.startsWith('/')) {
        url = url.substring(1);
      }

      if (!baseHref.endsWith('/')) {
        baseHref += '/';
      }
      reqUrl = baseHref + url;
    }

    return reqUrl;
  }

  /**
   * Used to check all of the class names on a given node.
   *
   * @param {String} targetNode The selector of the node to be looked at.
   * @param {String} className The name of the class to be looked for.
   * @returns {Boolean} True if the class name is matched. False if not.
   * @private
   */
  function _isClassNamePresent(targetNode, className) {
    var wildcard = className;
    var re = new RegExp('\\b' + wildcard + '\\b', 'g');

    if (className.indexOf('*') > -1) {
      wildcard = className.substring(0, className.length - 1);
      re = new RegExp('\\b' + wildcard, 'g');
    }

    if (re.test(_get(targetNode).className)) {
      return true;
    }
    return false;
  }
  /*
   * Appends an element with specified attributes to a specified parent.
   * @param {Element} parent - The parent element to which the new element should be added.
   * @param {String} tagName - The element name to be added (e.g. input, div, etc.)
   * @param {Object} attrs - A list of attributes to be appended to the new element.
   * @private
   */
  function _appendElement(parent, tagName, attrs){  	
	var elm = document.getElementById(attrs['id']);
	
	if(elm == null){
		elm = document.createElement(tagName);
	}
	
	for(attr in attrs){
		elm.setAttribute(attr, attrs[attr]);
		
	}
	parent.appendChild(elm);
	return elm;					
  }

  /**
   * Used to get the useable URL from the base tag.
   *
   * @param {String} baseHref The href value from the base tag.
   * @param {String} reqUrl The URL that should be requested
   * @returns {String} The useable base URL
   * @private
   */
  function _getRealBaseHref(baseHref, reqUrl) {
    var novReq = 'NOVREQ';
    if (baseHref.indexOf(novReq) == -1 && reqUrl.startsWith('http://')) {
      return '';
    }

    //Getting the Real Base Href
    /*
     * i.e., if the base href is
     * http://127.0.0.1/NOVREQ(XYZ)/208.15.40.86/widgets/NovarraWeather/NovarraWeather.html
     * the base href would be:
     * http://127.0.0.1/NOVREQW/208.15.40.86/widgets/NovarraWeather/
     *
     */
    var indexOfFile = -1;
    if (baseHref.endsWith('.html')) {
      indexOfFile = baseHref.indexOf('.html');
    }
    else if (baseHref.endsWith('.php')) {
      indexOfFile = baseHref.indexOf('.php');
    }
    if (indexOfFile != -1) {
      var indexOfDir = baseHref.lastIndexOf('/');
      if (indexOfFile > indexOfDir) {
        baseHref = baseHref.substring(0, indexOfDir + 1);
      }
    }

    /*
     * If the Url being passes starts with 'http://', then it is an
     * absolute URL and we do not want to attach the whole base href
     * but rather only the http://server/NOVREQ(XYZ)/
     */

    if (reqUrl.startsWith('http://')) {
      var indexOfNovReq = baseHref.indexOf(novReq);
      if (indexOfNovReq != -1) {
        baseHref = baseHref.substring(0, indexOfNovReq + novReq.length + 3);
      }
    }
    /*
     * If the request url has a NOVREQ(W|P|PN|PB) string attached to it
     * then remove the one from the base href, because if the one from the base href
     * has a NOVREQW in it, we might end up attaching JS files and other things
     * to the response.
     */

    if (reqUrl.indexOf(novReq) != -1) {
      baseHref = baseHref.substring(0, baseHref.indexOf(novReq));
    }
    return baseHref;
  }

  /**
   * XMLHTTPRequest object is not passed to the event handler (callback method). For this reason the request object
   * always needs to be in the scope of the event handler. In order to be able to execute parallel ajax requests, we are
   * adding a wrapper object to associate request object with its handler.
   *
   * @param {Object} reqData
   * @class AjaxWrapper
   * @private
   */
  function _AjaxWrapper(reqData) {
    reqData.req = new XMLHttpRequest();
    var timerId = null;

    //Called when there is a change in the ReadyState of the XHR
    this.processUpdateResponse = function() {
      try {
        /*
         XMLHttpRequest ReadyState Values
         0 - Unsent
         1 - Opened
         2 - Headers Received
         3 - Loading
         4 - Done
         */
        if (reqData.req.readyState == 4) {
        
          var date_header = reqData.req.getResponseHeader("Date");
          _logConsole(new Date(date_header).getTime()); // if console log is available, fetch and write locally.

          //HTTP 200 OK
          if (reqData.req.status == 200) {
            //CallBack Request
            if (reqData.isCallback) {
              //If we get a JavaScript response we want to run it and then the onSuccess if it was supplied
              if (reqData.req.getResponseHeader('Content-Type').toLowerCase().indexOf('javascript') != -1) {
                new Function(reqData.req.responseText)();

                if (reqData.onSuccess) {
                  eval(reqData.onSuccess);
                }
              }
              /*
               If it is not JavaScript then we assume its HTML and should replace the current DOM.
               Due to WebKit security we need to update the head and body separately. WebKit does not allow changes to the innerHTML
               of the head tag so each element we want to update needs to be done by itself. Because the only part of the head that
               would change in a HTML response would be the style tag that is all we need to worry about.
               */
              else if (reqData.req.getResponseHeader('Content-Type').toLowerCase().indexOf('html') != -1) {
                var styleTagPattern = /<style((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>((.|\n|\r)*)<\/style>/;
                document.getElementsByTagName("style")[0].innerHTML = String(styleTagPattern.exec(String(reqData.req.responseText))[4]);

                var bodyTagPattern = /<body((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>((.|\n|\r)*)<\/body>/;
                document.body.innerHTML = String(bodyTagPattern.exec(String(reqData.req.responseText))[4]);

                var scriptTags = document.body.getElementsByTagName('script');
                for(var i in scriptTags) {
                  eval(scriptTags[i].innerHTML);
                }
              }
            }
            //UpdateGroup Request
            else {
              if (reqData.targetNode != null) {
                _get(reqData.targetNode).innerHTML = reqData.req.responseText;
              }

              if (reqData.onSuccess) {
                eval(reqData.onSuccess);
              }

              if (reqData.reloadTime != null) {
                timerId = setTimeout(_sendRequest, reqData.reloadTime, reqData);
              }
            }
          }
          //HTTP 204 NoOp
          //But we still want to run onSuccess for callbacks
          else if (reqData.req.status == 204) {
            if (reqData.isCallback) {
              if (reqData.onSuccess) {
                eval(reqData.onSuccess);
              }
            }
          }
          else {
            if (reqData.onFail) {
              eval(reqData.onFail);
            }
          }
        }
      }
      catch(ex) {
        if (reqData.onFail) {
          eval(reqData.onFail);
        }
      }
    };

    //Open up the XHR and set the needed values
    this.open = function() {
      if (reqData != null && reqData.req != null) {
        if(reqData.isCallback && MWLEventsArray.length > 0) {
          var baseURL = reqData.reqUrl;
          var urlSuffix = '';
          var specialChar = null;

          if(reqData.reqUrl.indexOf("?") > -1) {
            specialChar = "?";
          }
          else if(reqData.reqUrl.indexOf("#") > -1) {
            specialChar = "#";
          }

          if(specialChar != null) {
            baseURL = reqData.reqUrl.substring(0, reqData.reqUrl.indexOf(specialChar));
            urlSuffix = reqData.reqUrl.substring(reqData.reqUrl.indexOf(specialChar));
          }

          for(var i = MWLEventsArray.length; i > 0; i--) {
            baseURL += '/' + MWLEventsArray[i-1].eventTarget + '/' + MWLEventsArray[i-1].eventType;
          }

          MWLEventsArray = [];
          reqData.reqUrl = baseURL + urlSuffix;
        }

        reqData.req.open(reqData.reqType, reqData.reqUrl, true);
        reqData.req.setRequestHeader('Content-Type', 'text/html');
      }
    };

    //Set the POST data and send the XHR request
    this.send = function() {
      if (reqData != null && reqData.req != null) {
        reqData.req.send(reqData.postData);
      }
    };

    //Stop the request
    this.stop = function() {
      clearTimeout(timerId);
      reqData.req.abort();
      reqData.req = null;
      reqData = null;
    };

    reqData.req.onreadystatechange = this.processUpdateResponse;
  }

  /**
   * Called to start a asynchronous request. Usually called from updateGroup or callback. Uses the _AjaxWrapper to open
   * and send a request.
   *
   * @param {Object} reqData A object that is created by updateGroup or callback
   * @returns {AjaxWrapper}
   * @private
   */
  function _sendRequest(reqData) {
    if (reqData == null) {
      return null;
    }

    reqData.postData = _getPostData();

    //first time request
    if (reqData.reqWrapper == null && reqData.req == null) {
      reqData.reqWrapper = new _AjaxWrapper(reqData);
    }

    reqData.reqWrapper.open();
    reqData.reqWrapper.send();

    return reqData.reqWrapper;
  }

  /**
   * Gets all of the form's on the current page and encodes all of the values into a query string. First looks for
   * the "p" attribute which is inserted by the server. If a "p" attribute is not found the input's name attribute
   * will be used as the key.
   *
   * @returns {String}
   * @private
   */
  function _getPostData() {
    var inputs = document.getElementsByTagName('input');
    var textareas = document.getElementsByTagName('textarea');
    var selects = document.getElementsByTagName('select');
    var data = '';
    var key = '';
    var value = '';

    if (inputs != null) {
      for (var i = 0; i < inputs.length; i++) {
        data += (data == '') ? '' : '&';
        var pValue = inputs[i].getAttribute('p');

        /*If the page went through the server the input should have a p attribute which is what the server needs.
        Use the p value if it is there otherwise use the name of the input itself. */
        (pValue === '') ? key = '' : key = pValue || inputs[i].getAttribute('name');

        if(inputs[i].getAttribute('type') != null) {
          /*For most input types we can just send up the value of the element. This wont work for radio buttons or
          checkboxes as the server is looking for YES/NO or 1/0 */
          switch (inputs[i].getAttribute('type').toLowerCase()) {
            case 'radio':
            case 'checkbox':
              value = inputs[i].checked ? 1 : 0;
              break;
            default:
              value = inputs[i].value;
              break;
          }
        }
        /* If the type attribute is null then it assumes the HTML input default of text. */
        else {
          value = inputs[i].value;
        }

        data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
      }
    }

    /* Text Area's also need to be POSTed up. No special processing needed */
    if(textareas != null) {
      for (var j = 0; j < textareas.length; j++) {
        data += (data == '') ? '' : '&';

        var pValue = textareas[j].getAttribute('p');
        (pValue === '') ? key = '' : key = pValue || textareas[j].getAttribute('name');
        value = textareas[j].value;

        data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
      }
    }

    /* Selects require a bit of processing to figure out exactly what to send up to the server */
    if(selects != null) {
      for(var k = 0; k < selects.length; k++) {
        /* If it is a single select then only the option that is selected needs to be sent up */
        if(selects[k].type == 'select-one') {
          data += (data == '') ? '' : '&';

          var pValue = selects[k].options[selects[k].selectedIndex].getAttribute('p');
          (pValue === '') ? key = '' : key = pValue || selects[k].options[selects[k].selectedIndex].getAttribute('name');
          value = 1;

          data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
        /* If it is a multiple select all options need to be sent up with a 1 or 0 */
        if(selects[k].type == 'select-multiple') {
          for (var l = 0; l < selects[k].options.length; l++){
            data += (data == '') ? '' : '&';

            var pValue = selects[k].options[l].getAttribute('p');
            (pValue === '') ? key = '' : key = pValue || selects[k].options[l].getAttribute('name');
            (selects[k].options[l].selected == true) ? value = 1 : value = 0;

            data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
          }
        }
      }
    }

    return data;
  }

  function _checkEvent() {
    _checkEvent(null, null, null);
  }

  function _checkEvent(target, type, timeStamp) {
    var mwlEvent = GetMWLEvent();

    //Make sure the event is available or that all of the needed values were passed in
    //if((event && event.timeStamp) || (target != null && type != null && timeStamp != null)) {
    if((mwlEvent && mwlEvent.timeStamp) || (target != null && type != null && timeStamp != null)) {
      if(target == null) {
        //target = event.currentTarget;
        target = mwlEvent.currentTarget;
      }
      if(type == null) {
        //type = event.type;
        type = mwlEvent.type;
      }
      if(timeStamp == null) {
        //timeStamp = event.timeStamp;
        timeStamp = mwlEvent.timeStamp;
      }

      /* Need to maker sure this call is not coming from a partial page update */
      if((target != null && type != null && timeStamp != null) && (typeof target.getAttribute === "function" || target === window)) {
        _addToCallbackQueue(target, type, timeStamp);
      }
    }
  }

  function _addToCallbackQueue(target, type, timeStamp) {
    var timeInSeconds = null;
    /* Most browsers return a Date object for event.timeStamp but some just return seconds from Epoch. Need
      to be able to handle both cases. */
    if(typeof timeStamp == "object") {
      timeInSeconds = timeStamp.getTime();
    }
    else {
      timeInSeconds = timeStamp;
    }

    var nValue = null;
    if(target === window) {
      nValue = document.body.getAttribute("n");
    }
    else if(target.getAttribute("n")) {
      nValue = target.getAttribute("n")
    }

    if(nValue != null && !_isTimeStampPresent(timeInSeconds)) {
      var isTimer = false;
      var modifiedType = type;

      if(type.indexOf('_timerId_') > -1) {
        modifiedType = type.substr(0, type.indexOf('_timerId_'));
        isTimer = true;
      }

      var typeCode = SERVER_EVENT_CODES[modifiedType];
      
      if (typeCode == undefined)
      {
        return;
      }

      if(isTimer) {
        typeCode += '_' + type.substr(type.indexOf('_timerId_') + 9);
      }

      MWLEventsArray.push({eventTarget: nValue, eventType: typeCode, eventTimeStamp: timeInSeconds});
    }
  }

  function _isTimeStampPresent(timeStamp) {
    for(var i = 0; i < MWLEventsArray.length; i++) {
      if(MWLEventsArray[i].eventTimeStamp === timeStamp) {
        return true;
      }
    }
    return false;
  }

  function _addMWLEventListener(targetNode, event, listener) {
    if(_get(targetNode).addEventListener) {
      _get(targetNode).addEventListener(event, listener, false);
    }
    else if(_get(targetNode).attachEvent) {
      _get(targetNode).attachEvent(event, listener);
    }
  }  function _logConsole(millis){
    var logname_cookie = document.cookie.match ( '(^|;) ?' + 'logname' + '=([^;]*)(;|$)' );
    var deviceid = document.cookie.match ( '(^|;) ?' + 'Novarra-Device-Id' + '=([^;]*)(;|$)' );
    var fileid;
    if (millis != null && deviceid != null) {
      fileid = deviceid[2] + millis;
    }
    else if (logname_cookie != null){
      fileid = logname_cookie[2];
    }
    else {
      return;
    }
    var proto = window.location.protocol;
    var path_parts = window.location.pathname.split('/');
    var domain = path_parts[1];
    if(domain == "_nov_cookie_test_")
    {
      domain = path_parts[2];
    }
    var reqUrl = proto + "//" + domain + "/logs/" + fileid + ".log";

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4)
      {
        console.log(xhr.responseText);
      }
    }

    xhr.open('GET', reqUrl);
    xhr.send(null);
  }
  
  function _init() {
    _logConsole();
  }

  /**
    * Shortcut method to check if a given value is in an Array.
    *
    * @param {Array} array to check the value for
    * @param {String} value The value to be looked for in the array
    * @returns {Boolean}
  */
  function _inArray(array, value) {
  	if(array != null) {
   	     for (var i = 0; i < array.length; i++) {
    	     if (array[i] == value) {
			     return true;
		     }
	     }
	}
	return false;
  }



  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", _init, false);
  }



  //Public
  return {
	
	/**
     * Used to show a element on the page via the CSS display property. Regardless of the current value the display
     * property will be changed to 'block'.
     *
     * @param {String} targetNode The selector of the element to show
     * @returns void
     */
    show: function(targetNode) {
      _get(targetNode).style.display = 'block';

      _checkEvent();
      return false;
    },	
	/**
     * Used to show a element on the page via the CSS display property. Regardless of the current value the display
     * property will be changed to 'none'.
     *
     * @param {String} targetNode The selector of the element to hide
     * @returns void
     */
    hide: function(targetNode) {
      _get(targetNode).style.display = 'none';

      _checkEvent();
      return false;
    },	
	/**
     * Used to toggle the visibility of an element on the page via the CSS display property. The value of the display
     * property will change to 'none' if it is currently 'block' and 'block' if it is any other value.
     *
     * @param {String} targetNode The selector of the element to toggle
     * @returns void
     */
    toggle: function(targetNode) {
      _get(targetNode).style.display = _get(targetNode).style.display == 'none' ? 'block' : 'none';

      _checkEvent();
      return false;
    },
	/**
     * Used to add a class to an element. This will only add the class to the current class name attribute of the
     * element, see {@link mwl.switchClass} to add and remove classes at the same time.
     *
     * @param {String} targetNode The selector of the element to add the class to
     * @param {String} className The name of the class to be added
     * @returns void
     */
    addClass: function(targetNode, className) {
      if (_get(targetNode) != undefined) {
        if (!_isClassNamePresent(targetNode, className)) {
          if (_get(targetNode).className != "") {
            _get(targetNode).className += " " + className;
          }
          else {
            _get(targetNode).className = className;
          }
        }
      }

      _checkEvent();
      return false;
    },	
	/**
     * Used to remove a single class from an element. The <i>className</i> parameter can be a full class name or can be
     * a simple expression. Functionality for the simple expression is limited to adding a '*' to the end of the class
     * name string to indicate to match a class name prefix.
     *
     * @param {String} targetNode The selector of the element to add the class to
     * @param {String} className The name of the class to be removed
     * @returns void
     */
    removeClass: function(targetNode, className) {
      if (_get(targetNode) != undefined) {
        if (_isClassNamePresent(targetNode, className)) {
          var classes = _get(targetNode).className.split(' ');
          _get(targetNode).className = '';

          for (var i = 0; i < classes.length; i++) {
            if (className.indexOf('*') > -1) {
              if (!classes[i].startsWith(className.substring(0, className.length - 1))) {
                if(_get(targetNode).className != '') {
                  _get(targetNode).className += ' ';
                }
                _get(targetNode).className += classes[i];
              }
            }
            else if (classes[i] != className) {
              if(_get(targetNode).className != '') {
                _get(targetNode).className += ' ';
              }
              _get(targetNode).className += classes[i];
            }
          }
        }
      }

      _checkEvent();
      return false;
    },	
	/**
     * Used to toggle the class attribute of an element. If the <i>className</i> provided is already in the class
     * attribute of the element it will be removed. If the <i>className</i> provided is not present it will be added.
     *
     * @param {String} targetNode The selector of the element to add the class to
     * @param {String} className The name of the class to be toggled
     * @returns void
     */
    toggleClass: function(targetNode, className) {
      if (_get(targetNode) != undefined) {
        if (_isClassNamePresent(targetNode, className)) {
          mwl.removeClass(targetNode, className);
        }
        else {
          mwl.addClass(targetNode, className);
        }
      }

      _checkEvent();
      return false;
    },	
	/**
     * Combines the removal and addition of classes on an element into a single operation. The <i>removeClass</i>
     * attribute can be the name of a class or a simple expression. Functionality for the simple expression is limited
     * to adding a '*' to the end of the class name string to indicate to match a class name prefix.
     *
     * @param {String} targetNode The selector of the element to add the class to
     * @param {String} removeClass The name of the class to be removed
     * @param {String} addClass The name of the class to be added
     * @returns void
     */
    switchClass: function(targetNode, removeClass, addClass) {
      if (_get(targetNode) != undefined) {
        mwl.removeClass(targetNode, removeClass);
        mwl.addClass(targetNode, addClass);
      }

      _checkEvent();
      return false;
    },	
	/**
     * Target's one node in a group to have a distinct class from the rest of its siblings. Given a group of nodes
     * contained within an element identified by the <i>groupNode</i> selector, this method applies the
     * <i>targetClass</i> to the target node. Any sibling nodes that have the <i>targetClass</i>, will replace this with
     * the <i>defaultClass</i>.
     *
     * @param {String} groupNode The selector of the group to be changed
     * @param {String} targetNode The selector of the element to be made visible
     * @param {String} targetClass The class to be applied to the targetNode. Will also be removed from all other sibling nodes.
     * @param {String} defaultClass The class to be applied to all other sibling nodes.
     * @returns void
     */
    setGroupTarget: function(groupNode, targetNode, targetClass, defaultClass) {
      var group = _get(groupNode);
      var cn = group.childNodes;

      for (var k = 0; k < cn.length; k++) {
        if (cn[k].style != undefined) {
          if (_isClassNamePresent(cn[k], targetClass)) {
            mwl.removeClass(cn[k], targetClass);
            mwl.addClass(cn[k], defaultClass);
          }

          if (cn[k] === _get(targetNode)) {
            mwl.removeClass(cn[k], defaultClass);
            mwl.addClass(cn[k], targetClass);
          }
        }
      }

      _checkEvent();
      return false;
    },    
	/**
     * Used to iterate to the next or previous element in a given block. This method replaces the <i>targetClass</i>
     * with the <i>defaultClass</i> on the current node and applies the <i>targetClass</i> (while removing the
     * defaultClass) to the next or previous sibling node. Direction is either "next" or "prev". This method will cycle
     * back through the list of siblings.
     *
     * @param {String} groupId The ID of the group to be changed
     * @param {String} targetClass The class to be applied to the new current node.
     * @param {String} defaultClass The class to be applied to all other sibling nodes.
     * @param {String} direction The direction to go. Valid directions are next, or prev.
     * @returns void
     */
    setGroupNext: function(groupId, targetClass, defaultClass, direction) {
      var group = _get(groupId);
      var cn = group.childNodes;

      var forwardItem = -1;
      var reverseItem = -1;
      var currentItem = -1;
      var numOfItems = 0;
      var itemsArray = [];

      for (var i = 0; i < cn.length; i++) {
        if (cn[i].style != undefined) {
          itemsArray[numOfItems] = cn[i];

          if (_isClassNamePresent(cn[i], targetClass)) {
            currentItem = numOfItems;
            mwl.removeClass(cn[i], targetClass);
            mwl.addClass(cn[i], defaultClass);
          }

          numOfItems++;
        }
      }

      if (direction.toLowerCase() == 'next' && currentItem != -1) {
        forwardItem = currentItem + 1;
        if (forwardItem > numOfItems - 1) {
          forwardItem = 0;
        }
        mwl.removeClass(itemsArray[forwardItem], defaultClass);
        mwl.addClass(itemsArray[forwardItem], targetClass);
      }
      else if (direction.toLowerCase() == 'prev' && currentItem != -1) {
        reverseItem = currentItem - 1;
        if (reverseItem < 0) {
          reverseItem = numOfItems - 1;
        }
        mwl.removeClass(itemsArray[reverseItem], defaultClass);
        mwl.addClass(itemsArray[reverseItem], targetClass);
      }

      _checkEvent();
      return false;
    },

   /**
     * Used to insert HTML into a element. The current HTML in the element will be lost.
     * 
	   * @deprecated For version 1.0 and 1.5
     * @param {String} targetNode The selector of the element where the htmlData will be inserted
     * @param {String} htmlData The raw HTML to be inserted
     * @returns void
     * @private
     */
    insertHTML: function(targetNode, htmlData) {
      var approvedTagSelectors = ['body', 'style'];

      if(targetNode != null) {
        if(targetNode.startsWith('#')) {
          _get(targetNode).innerHTML = htmlData;
        }
        else if(_inArray(approvedTagSelectors,targetNode)) {
          document.getElementsByTagName(targetNode)[0].innerHTML = htmlData;
        }
      }
      _checkEvent();
      return false;
    },

    /**
     * This method replaces the node <i>oldNode</i> that is a child of <i>parentId</i> with the node <i>newNode</i>. The
     * <i>oldNode</i> will be deleted from the DOM.
     *
     * @param {String} parentNode The ID of the parent node
     * @param {String} oldNode The selector of the node to be removed from the DOM
     * @param {String} newNode The selector of the new node to be added to the DOM as a child of the parentNode
     * @returns void
     * @private
     */
    replaceChild: function(parentNode, oldNode, newNode) {
      if (_get(oldNode) != undefined && _get(newNode) != undefined) {
        var newNodeCopy = _get(newNode).cloneNode(true);
        _get(newNode).parentNode.removeChild(_get(newNode));
        _get(parentNode).replaceChild(newNodeCopy, _get(oldNode));
      }

      _checkEvent();
      return false;
    },

    /**
     * Scrolls the browser to the block with the specified selector. The scrolling action may be smooth or jump
     * directly depending on the browser capabilities. If the target element is already fully in the display screen, no
     * action will take place. If scrolling does occur it will place the element at the top left of the screen. Focus
     * will be set on the element as well.
     *
     * @param {String} targetNode The selector of the block to scroll to
     * @returns void
     */
    scrollTo: function(targetNode) {
      if(_get(targetNode)) {
        var node = _get(targetNode);

        window.scrollTo(node.offsetLeft, node.offsetTop);
        node.focus();
      }
      _checkEvent();
      return false;
    },
/**
 * Used to update the value of an HTML input. The input field must be marked with an id attribute. The following
 * input fields are supported: text, radio, and checkbox.
 *
 * @param {String} targetNode ID of the input field
 * @param {String} value The value that should be given to the target
 * @returns void
 */
setInputValue: function(targetNode, value) {
  if(_get(targetNode).tagName.toLowerCase() == 'textarea') {
    _get(targetNode).value = value;
  }
  else if(_get(targetNode).tagName.toLowerCase() == 'input') {
    switch (_get(targetNode).getAttribute('type').toLowerCase()) {
	  /* Text and hidden types just need to set the value */
	  case 'text':
	  case 'hidden':
	    _get(targetNode).value = value;
	  break;
	  /* Radio buttons need processing to make sure they are the only one in their group that are selected */
	  case 'radio':
	    value = value.toLowerCase();
	    if (value == 'true' || value == 'false') {
	      /* If it's not checked and they pass in false do nothing */
	      if((_get(targetNode).checked == false && value == 'false') || (_get(targetNode).checked == true && value == 'true')) {
		    break;
	      }
	      else {
		    var options = document.getElementsByName(_get(targetNode).getAttribute('name'));
		    for(var i = 0; i < options.length; i++) {
		      options[i].checked = false;
		    }
            _get(targetNode).checked = (value == 'true');
	      } 
	    }
	  break;
	  case 'checkbox':
	    if (value == 'true' || value == 'false') {
		  _get(targetNode).checked = (value == 'true');
	    }
	  break;
    }
  }

  _checkEvent();
  return false;
},
	/**
     * Used to make a asynchronous HTTP POST to the targetURL. Expects a response consisting of MWL commands (partial
     * page update) or HTML (full page update). All input field values in the document are included in the POST. For
     * Web App's <i>targetURL</i> is typically a request back to the Vision server to execute some remote JavaScript.
     *
     * @param {String} targetUrl URL to make the POST request to
     * @param {String} onSuccess MWL commands to run after a successful response. Note that in a HTTP response this will not be fired.
     * @param {String} onFail MWL commands to run after a response failure.
     * @returns void
     */
    callback: function(targetUrl, onSuccess, onFail) {
      var bName = document.getElementsByTagName('BASE')[0];
      var reqUrl = targetUrl;

      if (bName != undefined) {
        reqUrl = _getRedirectURL(bName, targetUrl);
      }

      var reqData = {};
      reqData.reqUrl = reqUrl;
      reqData.isCallback = true;
      reqData.reqType = 'POST';

      if (onSuccess) {
        reqData.onSuccess = onSuccess;
      }
      if (onFail) {
        reqData.onFail = onFail;
      }

      _checkEvent();
      return _sendRequest(reqData);
    },
    
	/**
     * Similar to callback but expect and HTML response back that is inserted into the targetNode node. All input field
     * values in the document are included in the POST.
     *
     * @param {String} targetNode The selector of the node where the response should be placed
     * @param {String} targetURL The URL that should be requested
     * @param {String} onSuccess MWL commands to run after a successful response.
     * @param {String} onFail MWL commands to run after a response failure.
     * @returns void
     */
    updateGroup: function(targetNode, targetURL, onSuccess, onFail) {
      //Wrap all
      //ables related to one ajax request in reqData object
      //to pass around to different functions.
      var reqUrl = targetURL;
      var bName = document.getElementsByTagName('BASE')[0];

      if (bName != undefined) {
        reqUrl = _getRedirectURL(bName, targetURL);
      }

      var reqData = {};
      reqData.targetNode = targetNode;
      reqData.reqUrl = reqUrl;
      reqData.reqType = 'GET';

      if (onSuccess) {
        reqData.onSuccess = onSuccess;
      }
      if (onFail) {
        reqData.onFail = onFail;
      }

      _checkEvent();
      return _sendRequest(reqData);
    },

    /**
     * Used to add a swipe left event to a element. When a swipe left is detected within the <i>targetNode</i> the
     * <i>listener</i> is executed.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the swipe has been executed
     * @returns void
     */
    addSwipeLeftListener: function(targetNode, listener) {
      return _buildSwipeListener(targetNode, listener, 'left');
    },

    /**
     * Used to add a swipe right event to a element. When a swipe right is detected within the <i>targetNode</i> the
     * <i>listener</i> is executed.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the swipe has been executed
     * @returns void
     */
    addSwipeRightListener: function(targetNode, listener) {
      return _buildSwipeListener(targetNode, listener, 'right');
    },

    /**
     * Used to add a swipe up event to a element. When a swipe up is detected within the <i>targetNode</i> the
     * <i>listener</i> is executed.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the swipe has been executed
     * @returns void
     */
    addSwipeUpListener: function(targetNode, listener) {
      return _buildSwipeListener(targetNode, listener, 'up');
    },

    /**
     * Used to add a swipe down event to a element. When a swipe down is detected within the <i>targetNode</i> the
     * <i>listener</i> is executed.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the swipe has been executed
     * @returns void
     */
    addSwipeDownListener: function(targetNode, listener) {
      return _buildSwipeListener(targetNode, listener, 'down');
    },

	/**
     * Used to add a long press event to an element. A long press occurs after the user presses on the display (or fire
     * button) for a period of time. This time is consistent with the overall platform implementation of longPress.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the long press has been executed
     * @returns void
     */
    addLongPressListener: function(targetNode, listener) {

      if (window.isOsre) //Is EMS Runtime
      {
        var longPressAttr = "longpress";
        _get(targetNode).setAttribute(longPressAttr, listener);
        return;
      }
    
      var timerID = null;

      function onTouchStart(event) {
        timerID = setTimeout(function(){eval(listener);_checkEvent(_get(targetNode), 'longpress', null);}, 2000);
      }

      function onTouchMove(event) {
        onTouchEnd();
      }

      function onTouchEnd() {
        clearTimeout(timerID);
      }

      _addMWLEventListener(targetNode, 'touchstart', onTouchStart);
      _addMWLEventListener(targetNode, 'touchmove', onTouchMove);
      _addMWLEventListener(targetNode, 'touchend', onTouchEnd);
    },
	/**
     * Adds a nav left event to an element. When a left nav event is detected on the <i>targetNode</i> the
     * <i>listener</i> is executed.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the left nav has been executed
     * @returns void
     */
    addNavLeftListener: function(targetNode, listener) {
      
      if (window.isOsre) //Is EMS Runtime
      {
        var navLeftAttr = "navleft";
        _get(targetNode).setAttribute(navLeftAttr, listener);
        return;
      }
    
      function onKeyUp(event) {
        if (event.keyCode == 37) {
          _checkEvent(null, 'navleft', null);
          eval(listener);
        }
      }

      _addMWLEventListener(targetNode, 'keyup', onKeyUp);
    },
    /**
     * Adds a nav up event to an element. When a up nav event is detected on the <i>targetNode</i> the
     * <i>listener</i> is executed.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the up nav has been executed
     * @returns void
     */
    addNavUpListener: function(targetNode, listener) {
    
      if (window.isOsre) //Is EMS Runtime
      {
        var navUpAttr = "navup";
        _get(targetNode).setAttribute(navUpAttr, listener);
        return;
      }
    
      function onKeyUp(event) {
        if (event.keyCode == 38) {
          _checkEvent(null, 'navup', null);
          eval(listener);
        }
      }

      _addMWLEventListener(targetNode, 'keyup', onKeyUp);
    },

    /**
     * Adds a nav right event to an element. When a right nav event is detected on the <i>targetNode</i> the
     * <i>listener</i> is executed.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the right nav has been executed
     * @returns void
     */
    addNavRightListener: function(targetNode, listener) {
    
      if (window.isOsre) //Is EMS Runtime
      {
        var navRightAttr = "navright";
        _get(targetNode).setAttribute(navRightAttr, listener);
        return;
      }
    
      function onKeyUp(event) {
        if (event.keyCode == 39) {
          _checkEvent(null, 'navright', null);
          eval(listener);
        }
      }

      _addMWLEventListener(targetNode, 'keyup', onKeyUp);
    },

	/**
     * Adds a nav down event to an element. When a down nav event is detected on the <i>targetNode</i> the
     * <i>listener</i> is executed.
     *
     * @param {String} targetNode The selector of the node to add the event/listener to
     * @param {String} listener The command(s) to run when the down nav has been executed
     * @returns void
     */
    addNavDownListener: function(targetNode, listener) {
    
      if (window.isOsre) //Is EMS Runtime
      {
        var navDownAttr = "navdown";
        _get(targetNode).setAttribute(navDownAttr, listener);
        return;
      }
    
      function onKeyUp(event) {
        if (event.keyCode == 40) {
          _checkEvent(null, 'navdown', null);
          eval(listener);
        }
      }

      _addMWLEventListener(targetNode, 'keyup', onKeyUp);
    },
    /**
     * Used to add a new or update a current style in the document.
     *
     * <p>Is labeled as private because this should only be used by the server during a callback response. In order for the
     * server to call this method it needs to be in the public section.</p>
     *
     * @param {String} selector The selector for the new style
     * @param {String} styleString The elements of the new style
     * @returns void
     * @private
     */
    addNewStyle: function(selector, styleString) {
      var styleSheets = document.styleSheets;

      for (var i = 0; i < styleSheets.length; i++) {
        var currentStyleSheetRules = styleSheets[i].cssRules;

        for (var j = 0; j < currentStyleSheetRules.length; j++) {
          if (currentStyleSheetRules[j].selectorText == selector) {
            styleSheets[i].deleteRule(j);
            styleSheets[i].insertRule(selector + "{" + styleString + "}", 0);
            return;
          }
        }
      }

      document.styleSheets[0].insertRule(selector + "{" + styleString + "}", 0);

      /*
       * No need to add this to the callbackQueue because this should only be called from an server response. That means
       * the server knows about the change already.
       */
      return false;
    },

    /**
     * Used to execute commands in response to a timer firing. Timers are automatically stopped when a page is unloaded,
     * they can also be stopped via the {@link mwl.stopTimer} method. If this method is invoked with the same
     * <i>label</i> as an existing timer, than the running timer is topped and replaced by the new one.
     *
     * <p>Note: the interval time is the time elapsed between the start of the firing of each event. It does not account
     * for the time to process the <i>methodString</i> actions. To create a sequence that fires timers after the
     * completion of each <i>methodString</i> you should set <i>numberOfTimes</i> to 1 and then invoke a new timer as
     * the last method in the <i>methodString</i>.</p>
     *
     * @param {String} label A string that identifies the timer.
     * @param {Number} interval The timer that elapses before firing the timer (milliseconds).
     * @param {Number} numberOfTimes How often the timer is repeated. Setting this to 0 result in the timer running with no upper bound.
     * @param {String} methodString A list of semicolon separated MWL commands to execute when the timer fires
     * @returns void
     */
    timer: function(label, interval, numberOfTimes, methodString) {
    
if (window.isOsre) //Is OSRE Runtime
      {
        return;
      }
    
      var mwlEvent = GetMWLEvent();
      var eventTarget = mwlEvent.currentTarget;
      var eventType = mwlEvent.type;
      var eventTimeStamp = mwlEvent.timeStamp;

      if(MWLTimerArray[label] != null) {
        mwl.stopTimer(label);
      }

      _checkEvent();

      if(numberOfTimes == 0) {
        MWLTimerArray[label] = {numOfTimes: 0, count: 1, timerId: setInterval('mwl.incrementMWLTimerCount(\'' + label + '\');' + methodString, interval), target: eventTarget, type: eventType, timeStamp: eventTimeStamp};
        return;
      }

      MWLTimerArray[label] = {numOfTimes: numberOfTimes, count: 1, timerId: setInterval('mwl.incrementMWLTimerCount(\'' + label + '\');' + methodString, interval), target: eventTarget, type: eventType, timeStamp: eventTimeStamp};


      return false;
    },

    /**
     * Used to stop any running timer. If a <i>label</i> is specified then that timer will be stopped. If no
     * <i>label</i> is specified then all timers associated with the document will be stopped.
     *
     * @param {String} [label] A string that identified the timer
     * @returns void
     */
    stopTimer: function(label) {
      var timer;
      if (label == null || label == undefined) {
        for (timer in MWLTimerArray) {
          clearInterval(MWLTimerArray[timer].timerId);
        }
      }
      else {
        clearInterval(MWLTimerArray[label].timerId);
        MWLTimerArray[label].count = null;
      }

      _checkEvent();
      return false;
    },

    /**
     * Used to keep track of and increment how many times a timer has run. If the upper bound has been hit
     * {@link mwl.stopTimer} is called and the timer is cleared out.
     *
     * <p>Is labeled as private because this should only be called from timer. Because it is a recurring call it has to be
     * in the public section.</p>
     *
     * @param {String} label The label of the timer to increase and check.
     * @returns void
     * @private
     */
    incrementMWLTimerCount: function(label) {
      if(MWLTimerArray[label].numOfTimes != 0) {
        if (MWLTimerArray[label].count == MWLTimerArray[label].numOfTimes) {
          mwl.stopTimer(label);
        }
        else {
          MWLTimerArray[label].count++;
        }
      }

      //Using a new timestamp because the value in the MWLTimerArray is from the original timer firing.
      _checkEvent(MWLTimerArray[label].target, MWLTimerArray[label].type + '_timerId_' + label, new Date());
      return false;
    },
	/**
	* Wrapper on the W3C geolocation getCurrentPostion function.
	*
	* @param {String} successFunction: The callback function to be called when geolocation information
	* is available. The successFunction should accept as a parameter, a Position object as
	* detailed in the W3C specification - http://www.w3.org/TR/geolocation-API/. 
	* @param {String} askForPermission: Indicates whether the user should be prompted with a
	* permission dialog.
	* @param {String} failureCallback: (Optional) The callback function to be called when geolocation information
	* cannot be retrieved. The failureCallback should accept an PositionError object as detailed
	* in the W3C specification - http://www.w3.org/TR/geolocation-API/.
	* @param {String} positionOptions: (Optional) Allows passing of optional parameters such as a timeout value.
	* Accepts a PositionOptions object as defined in the W3C specification - http://www.w3.org/TR/geolocation-API/.
	* @returns void
	* @private	
	*/
	getCurrentPosition: function(successCallback, askForPermission, failureCallback, positionOptions){

			var successFunction = function(position){
				//If this an mwl callback, append coordinates as querystring params to the
				//callback url.
				if(successCallback.indexOf('jscallback') != -1){					
					_appendElement(document.body, 'input', 
						{type:'hidden',name:'Latitude',id:'Latitude',value:position.coords.latitude});										
					
					_appendElement(document.body, 'input', 
						{type:'hidden',name:'Longitude',id:'Longitude',value:position.coords.longitude});					
					
					_appendElement(document.body, 'input', 
						{type:'hidden',name:'Accuracy',id:'Accuracy',value:position.coords.accuracy});					
					
					_appendElement(document.body, 'input', 
						{type:'hidden',name:'GeoPrivacy',id:'GeoPrivacy',value:'Allow'});
										
					mwl.callback(successCallback);
				}else{
					//If not mwl, call the successFunction with position as the function parameter
					eval(successFunction + "(position)");
				}
			};
		var failureFunction = function(errorObject){
				//If this an mwl callback, append coordinates as querystring params to the
				//callback url.
				if(failureCallback.indexOf('jscallback') != -1){					
					_appendElement(document.body, 'input', 
						{type:'hidden',name:'ErrorCode',id:'ErrorCode',value:errorObject.code});					
					
					_appendElement(document.body, 'input', 
						{type:'hidden',name:'ErrorMessage',id:'ErrorMessage',value:errorObject.message});
										
					mwl.callback(failureCallback);
				}else{
					//If not mwl, call the failureFunction with errorObject as the function parameter
					eval(failureCallback + "(errorObject)");
				}
			};
		
		    var callGeo = true; 
            if(askForPermission == "true"){ 
				if(mwlDialogs && mwlDialogs.geolocationConfirm){ 
					if(!mwlDialogs.geolocationConfirm()){ 
						failureFunction({code:1,message:'Permission denied'}); 
                        callGeo = false; 
                        } 
                    } 
                } 
            if(callGeo){ 
				navigator.geolocation.getCurrentPosition(successFunction, failureFunction, positionOptions); 
            } 
	},

    /**
     * This method either increments or decrements the class prefix name specified and applies it to the target node.
     * For example, if the class name is "frame5" then calling iterateClass will remove the "frame5" class from the
     * target node and apply "frame6".
     *
     * @param {String} targetNode The selector used to identify the target node.
     * @param {String} classPrefix The prefix of the class to iterate over.
     * @param {String} direction Use the keywords "next" or "prev" to increment the class suffix.
     * @param {String} numClasses The maximum number of classes to iterate over. Note counting starts at 0, so an upper
     * bound of 10 means classes using 0 - 9.
     * @param {Boolean} loop True means calling this method when the current class is the upper or lower bound resulting
     * in looping back to the other end. False, nothing happens at the upper bound ends.
     * @param {String} boundaryAction A MWL Method that should be called if the iterator value to set equals the
     * upper or lower bound.
     * @returns void
     */
    iterateClass: function(targetNode, classPrefix, direction, numClasses, loop, boundaryAction)  {
      if (_get(targetNode) != undefined && (direction == "next" || direction =="prev")) {
        if(_isClassNamePresent(targetNode, classPrefix + "*")) {
          /* First get the current index number being used */
          var pattern = new RegExp(classPrefix +"(\\d+)", 'g');
          var result = pattern.exec(_get(targetNode).className);
          var currentIndex = parseInt(result[1]);

          /* Figure out where we need to go next */
          var nextIndex = currentIndex + 1;
          if(direction == "prev") {
            nextIndex = currentIndex - 1;
          }

          /* If we are at the lower or upper bound run the boundary action */
          if(nextIndex == 0 || nextIndex == numClasses -1) {
            eval(boundaryAction);
          }

          /* Check bounds. We should not go below 0 or above the upperBound. */
          if(nextIndex < 0 || nextIndex > numClasses - 1) {
            if(loop) {
              if(nextIndex < 0) {
                nextIndex = numClasses - 1;
              }
              else if(nextIndex > numClasses - 1) {
                nextIndex = 0;
              }
            }
            /* If no looping then we are done. */
            else {
              _checkEvent();
              return false;
            }
          }

          /* Remove the old class and then add the new one */
          mwl.removeClass(targetNode, classPrefix + "*");
          mwl.addClass(targetNode, classPrefix + nextIndex);
        }
      }

      _checkEvent();
      return false;
    },


    /**
     * Breaks out of the web app and loads a specified resource directly into the root window.
     *
     * @param {String} URLtoLoad The URL that should be loaded
     * @returns void
     */
    loadURL: function(URLtoLoad) {
      if(URLtoLoad.startsWith("http://") ||
          URLtoLoad.startsWith("HTTP://") ||
          URLtoLoad.startsWith("https://") ||
          URLtoLoad.startsWith("HTTPS://") ||
          URLtoLoad.startsWith("sms:") ||
          URLtoLoad.startsWith("SMS:") ||
          URLtoLoad.startsWith("mailto:") ||
          URLtoLoad.startsWith("MAILTO:")) {
        window.location = URLtoLoad;
      }
      else {
        window.location = "http://" + URLtoLoad;
      }

      return false;
    },
    /**
    * Will remove any and all child elements of the targetNode.
    *
    * @param {String} targetNode The selector of the element to clear
    * @returns void
    */
    clear: function(targetNode) {
      if (_get(targetNode) != undefined) {
        _get(targetNode).innerHTML = "";
      }

      _checkEvent();
      return false;
    },


    /**
    * Will copy any and all children of the sourceNode to the targetNode. Any children of the targetNode will be overwritten
    * and lost during this process.
    *
    * @param {String} sourceNode The selector of the element to copy
    * @param {String} targetNode The selector of the element to place the copy into
    * @returns void
    */
    duplicate: function(sourceNode, targetNode) {
      if (_get(sourceNode) != undefined && _get(targetNode) != undefined) {
        _get(targetNode).innerHTML = _get(sourceNode).innerHTML;
      }

      _checkEvent();
      return false;
    },


    /**
    * Will copy any and all children of the sourceNode to the targetNode and then clear the sourceNode. Any children of
    * the targetNode will be overwritten and lost during this process.
    *
    * @param {String} sourceNode The selector of the element to copy and then clear
    * @param {String} targetNode The selector of the element to place the copy into
    * @returns void
    */
    move: function(sourceNode, targetNode) {
      if (_get(sourceNode) != undefined && _get(targetNode) != undefined) {
        mwl.duplicate(sourceNode, targetNode);
        mwl.clear(sourceNode);
      }

      _checkEvent();
      return false;
    },


    /**
    * Will exit the WebApp.
    *
    * @returns void
    */
    exit: function() {
    }


};
}();
