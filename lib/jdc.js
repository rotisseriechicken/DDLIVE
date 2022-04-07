/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

/*!
 * Js-Draggable-Console
 */
/**
 * The draggable console
 * Creates the DOM element, append it and make it draggable.
 * @type {Object}
 */
const dragConsole = 
  '<div class="container-fluid">'																																	
+		'<div class="row">'																																						
+			'<div class="col-xl-12">'																																		
+				'<div id="js-draggable-console" class="window">'																					
+					'<div class="topbar">'																																	
+           '<div class="stoplight">'																															
+             '<span id="console-close-icon" class="close"></span>'																
+           '</div>'																																							
+						'<span class="title">JS Draggable Console<span>'																																							
+					'</div>'																																								
+					'<div class="content">'																																	
+						'<div class="window-body">'																														
+							'<table id="messages">'																															
+							'</table>'																																					
+							'<table class="cmd">'																																								
+								'<tr>'																																								
+									'<th class="placeholder">&gt;</th>'																		
+									'<th class="input-cmd">'																																							
+										'<input type="text" placeholder="Enter your command here..." id="js-input-text">' 
+									'</th>'
+								'<tr>'							
+							'</table>'
+						'</div>'																																							
+					'</div>'																																								
+				'</div>'																																									
+			'</div>'																																										
+		'</div>'																																											
+	'</div>';
$("body").append(dragConsole);
// If draggable touches on input are not recognized...
//$("#js-draggable-console").draggable();
/**
 * The draggable button that opens the console.
 * Creates the DOM element, append it and make it draggable.
 * @type {Object}
 */
const dragButton = '<div id="js-draggable-button"><i class="fas fa-terminal"></i></div>';
$("body").append(dragButton);
$("#js-draggable-button").draggable();

/**
 * onClick event handler to toggle ON/OFF console.
 */
$("#js-draggable-button").on("click", () => {
	/**
	 * Select the element and cache it in a constant.
	 * @type {Object}
	 */
	const consoleElem = $("#js-draggable-console");
	if (consoleElem.css('display') === 'none') {
		/**
		 * The element is currently hidden, show it.
		 */
		consoleElem.show(500);
	} else {
		/**
		 * The element is currently displayed, hide it.
		 */
		consoleElem.hide(500);
	}
});
/**
 * Additional onClick event handler to toggle OFF the console.
 */
$("#console-close-icon").on("click", () => {
	$("#js-draggable-console").hide(500);
});

const HTMLMessages = {
	log: (param) => '<tr><th class="icon"><i class="fas fa-terminal"></i></th><th class="message"><span class="jdc-message jdc-message-log">' + param + '</span></th></tr>',
	warn: (param) => '<tr><th class="icon icon-warn"><i class="fas fa-exclamation-triangle"></i></th><th class="message"><span class="jdc-message jdc-message-warn">' + param + '</span></th></tr>',
	info: (param) => '<tr><th class="icon"><i class="fas fa-info-circle"></i></th><th class="message"><span class="jdc-message jdc-message-info">' + param + '</span></th></tr>',
	err: (param) => '<tr><th class="icon icon-error"><i class="fas fa-times-circle"></i></th><th class="message"><span class="jdc-message jdc-message-error">' + param + '</span></th></tr>',
	ajax: (param) => '<tr><th class="icon"><i class="fas fa-exclamation"></i></th><th class="message"><span class="jdc-message jdc-message-ajax">' + param + '</span></th></tr>',
	inspect: (param) => '<tr><th class="icon"><i class="fas fa-search"></i></th><th class="message"><span class="jdc-message">' + param + '</span></th></tr>',
}

const JDC = {
	log: (param) => $("#messages").append(HTMLMessages.log(param)),
	warn: (param) => $("#messages").append(HTMLMessages.warn(param)),
	info: (param) => $("#messages").append(HTMLMessages.info(param)),
	error: (param) => $("#messages").append(HTMLMessages.err(param)),
	ajax: (param) => $("#messages").append(HTMLMessages.ajax(param)),
	inspect: (param) => $("#messages").append(HTMLMessages.inspect(param)),
}

const console = {
	log: (param) => JDC.log(param),
	warn: (param) => JDC.warn(param),
	error: (param) => JDC.error(param),
	info: (param) => JDC.info(param),
	inspect: (param) => JDC.inspect(JSON.stringify(param, null, 4)),
};

window.console = console;

const clear = () => {
	/** 
	 * Removes all the rows of the messages table 
	 * If the table is empty, does nothing.
	 */
	const messages = $("#messages tr");
	messages.length < 1 ? true : messages.remove();
}

$("#js-input-text").on("keydown", (e) => {
	"use strict";
  if (e.which === 9 || e.which === 13) {
  	const input = $("#js-input-text");
    const command = input.val();
    input.val("");
    if (command === 'clear') {
    	clear();
    	return;
    }
    JDC.info(command);
    try {
    	eval(command);
    } catch(error) {
    	const helpUrl = `https://stackoverflow.com/search?q=[js]+${error}`;
    	const link = `<a href="${helpUrl}" target="_blank">here</a>`;
    	JDC.error(`${error}. [Get help! Click ${link}! (opens in a new page)]`);
    } 
  }
});
