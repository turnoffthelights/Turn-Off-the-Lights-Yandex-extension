//================================================
/*

Turn Off the Lights
The entire page will be fading to dark, so you can watch the video as if you were in the cinema.
Copyright (C) 2018 Stefan vd
www.stefanvd.net
www.turnoffthelights.com

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/

*/
//================================================

chrome.storage.sync.get(['autostop','autostoponly','autostopDomains','autostopchecklistwhite','autostopchecklistblack','autostopred','autostoptrans'], function(response){
var autostop = response['autostop'];
var autostoponly = response['autostoponly'];
var autostopDomains = response['autostopDomains'];
var autostopchecklistwhite = response['autostopchecklistwhite'];
var autostopchecklistblack = response['autostopchecklistblack'];
var autostopred = response['autostopred'];
var autostoptrans = response['autostoptrans'];
if(autostop == true){
document.addEventListener("DOMContentLoaded", function(event) {
if(autostoponly == true){
var currenturl = window.location.protocol + '//' + window.location.host;
var stoprabbit = false;
if(typeof autostopDomains == "string") {
	autostopDomains = JSON.parse(autostopDomains);
	var atbuf = [];
	for(var domain in autostopDomains)
		atbuf.push(domain);
        atbuf.sort();
		for(var i = 0; i < atbuf.length; i++){
			if(autostopchecklistwhite == true){
				if(currenturl == atbuf[i]){autostopfunction();}
			}
			else if(autostopchecklistblack == true){
				if(currenturl == atbuf[i]){stoprabbit=true;}
			}
		}
    }
	if(autostopchecklistblack == true){
		if(stoprabbit == false){autostopfunction();}
	}
} else {autostopfunction();}
}, false);

function autostopvideo(video){
	video.pause();
	video.currentTime = 0;
	video.autostart = false;
	video.autoplay = false;
	video.preload = "none";
	video.setAttribute("data-stopvideo","true");
}

var tempvisscrollleft = window.pageXOffset || document.documentElement.scrollLeft;
var tempvisscrolltop = window.pageYOffset || document.documentElement.scrollTop;

function getPosition(el) {
var xPos = 0;var yPos = 0;
while (el){xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);yPos += (el.offsetTop - el.scrollTop + el.clientTop);el = el.offsetParent;}
return{x:xPos,y:yPos};
}

function autostopfunction(){
	// A regular on first run
	autostopdetectionstart();
	// B New Mutation Summary API Reference
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	if(MutationObserver){
	// setup MutationSummary observer
	var videolist = document.body;
	var observer = new MutationObserver(function (mutations, observer) {
		mutations.forEach(function (mutation) {
			if(mutation.target.tagName == "VIDEO") {

				if(mutation.attributeName === "src" && mutation.target.currentSrc != ""){
					autostopvideo(mutation.target);
					autostopdetectionstart();

					var reqId;
					var stopTracking = function () {
						if(mutation.target.getAttribute("data-stopvideo") == "true"){
							if (reqId) {
							cancelAnimationFrame(reqId);
							}
						}
					};
					mutation.target.addEventListener('play', function() {
						reqId = requestAnimationFrame(function play() {
							if(mutation.target.getAttribute("data-stopvideo")){
							}else{
								mutation.target.setAttribute("data-stopvideo","true");
							}
							if(mutation.target.getAttribute("data-stopvideo")){
								if(mutation.target.getAttribute("data-stopvideo") == "true"){
									if(!mutation.target.paused){
										mutation.target.pause();mutation.target.currentTime = 0;
										stopTracking();
									}
									rock = mutation.target.getAttribute("data-video");
									if(document.getElementById('stefanvdautostoppanel'+rock)){
										document.getElementById('stefanvdautostoppanel'+rock).style.display = "block";
										refreshsize();
									}
									//console.log(Math.round(mutation.target.currentTime * 1000));
									reqId = requestAnimationFrame(play);
								}
							}
						});
					},false);
					mutation.target.addEventListener('pause', stopTracking);

				}
			}
			// dynamic add and remove video
			if(mutation.type == 'childList'){
				for (var i, i = 0; i < mutation.addedNodes.length; i++){
					if(mutation.addedNodes[i].tagName == "VIDEO"){
						autostopdetectionstart();
					}
				}
				for (var i, i = 0; i < mutation.removedNodes.length; i++){
					if(mutation.removedNodes[i].tagName == "VIDEO"){
						autostopdetectionstart();
					}
				}
			}
			// inside it
			for (var i = 0; i < mutation.addedNodes.length; i++){
				if(mutation.addedNodes[i]){
					for (var j = 0; j < mutation.addedNodes[i].childNodes.length; j++){
						var detail = mutation.addedNodes[i].childNodes[j];
						if(detail.nodeName == "VIDEO"){
							autostopdetectionstart();
						}
					}
				}
			}
			// detect change style - this for floating box in div detection
			if(mutation.attributeName == 'style'){
				refreshsize();
			}
		});
	});

	observer.observe(videolist, {
		subtree: true,       // observe the subtree rooted at ...videolist...
		childList: true,     // include childNode insertion/removals
		characterData: false, // include textContent changes
		attributes: true     // include changes to attributes within the subtree
	});
	
	}
}

function autostopdetectionstart(){
	// first remove the excisting autostop panels
	var firstautostopremove = document.getElementsByClassName("stefanvdautostop");
	while(firstautostopremove.length > 0){
		firstautostopremove[0].parentNode.removeChild(firstautostopremove[0]);
	}
	
	var visualvideos = document.getElementsByTagName("video");
	for(var i = 0; i < visualvideos.length; i++){
		video = visualvideos[i];
		video.setAttribute("data-video",i);
		var reqId;
		var stopTracking = function () {
			if(video.getAttribute("data-stopvideo") == "true"){
				if (reqId) {
				cancelAnimationFrame(reqId);
				}
			}
		};
		video.addEventListener('play', function() {
			reqId = requestAnimationFrame(function play() {
				if(video.getAttribute("data-stopvideo")){
				}else{
					video.setAttribute("data-stopvideo","true");
				}
				if(video.getAttribute("data-stopvideo")){
					if(video.getAttribute("data-stopvideo") == "true"){
						if(!video.paused){
							video.pause();video.currentTime = 0;
							stopTracking();
						}
						rock = video.getAttribute("data-video");
						if(document.getElementById('stefanvdautostoppanel'+rock)){
							document.getElementById('stefanvdautostoppanel'+rock).style.display = "block";
							refreshsize();
						}
						//console.log(Math.round(video.currentTime * 1000));
						reqId = requestAnimationFrame(play);
					}
				}
			});
		},false);
		video.addEventListener('pause', stopTracking);

		// design panel
		var myElement = document.getElementsByTagName("video")[i];
		if(myElement.currentStyle){
			var d = myElement.currentStyle["display"];
			var v = myElement.currentStyle["visibility"];
			var w = myElement.currentStyle["width"];
			var h = myElement.currentStyle["height"];
		}
		else if (window.getComputedStyle){
			var st = document.defaultView.getComputedStyle(myElement, null);
			var d = st.getPropertyValue("display");
			var v = st.getPropertyValue("visibility");
			var w = st.getPropertyValue("width");
			var h = st.getPropertyValue("height");
		}

		var visposition = getPosition(myElement);

		var newautostoppanel = document.createElement("div");
		newautostoppanel.setAttribute("id","stefanvdautostoppanel"+i);
		newautostoppanel.setAttribute("data-video",i);

		newautostoppanel.setAttribute("class","stefanvdautostop");
		if(autostopred == true){
			newautostoppanel.setAttribute("style","background:rgba(165,8,0,0.88)!important");
		}

		if(myElement.currentSrc == ""){newautostoppanel.style.display = "none";}

		if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
			if(parseInt(myElement.style.top, 10) < 0){myElement.style.top = "0px";}
		}
		newautostoppanel.style.top = visposition.y+"px";
		newautostoppanel.style.left = visposition.x+"px";
		newautostoppanel.style.width = w;
		newautostoppanel.style.height = h;
		if(d == "none"){newautostoppanel.style.display = "none";}
		else if(v == "hidden" || v == "collapse"){newautostoppanel.style.display = "none";}

		newautostoppanel.addEventListener("click", function(event){
			var templearn = event.target.id;
			templearn = templearn.substr(0, 26);
			if(templearn != "stefanvdautostoppanellearn"){
			rock = this.getAttribute("data-video");
			document.getElementById('stefanvdautostoppanel'+rock).style.display = "none";
			document.getElementsByTagName("video")[rock].setAttribute("data-stopvideo","false");
			document.getElementsByTagName("video")[rock].play();
			}
		},false);
		newautostoppanel.addEventListener('contextmenu', event => event.preventDefault());
		document.body.appendChild(newautostoppanel);

		if(autostopred == true){
		var newautostoptitel = document.createElement("div");
		newautostoptitel.setAttribute("class","stefanvdautostoptitel");
		newautostoptitel.innerText = chrome.i18n.getMessage("autostopenabled");
		newautostoppanel.appendChild(newautostoptitel);

		var newautostopdes = document.createElement("div");
		newautostopdes.setAttribute("class","stefanvdautostopdes");
		newautostopdes.innerText = chrome.i18n.getMessage("autostopclickme");
		newautostoppanel.appendChild(newautostopdes);

		var newautostoplearn = document.createElement("div");
		newautostoplearn.setAttribute("id","stefanvdautostoppanellearn"+i);
		newautostoplearn.setAttribute("class","stefanvdautostoplearn");
		newautostoplearn.addEventListener("click", function(event){
			window.open("https://www.turnoffthelights.com/support/browser-extension/what-is-the-autostop-feature/", "_blank");
		},false);
		newautostoplearn.innerText = chrome.i18n.getMessage("autostopdetails");
		newautostoppanel.appendChild(newautostoplearn);

		var newautostopfoot = document.createElement("div");
		newautostopfoot.setAttribute("class","stefanvdautostopfoot");
		newautostopfoot.innerText = chrome.i18n.getMessage("autostopblocked");
		newautostoppanel.appendChild(newautostopfoot);
		}
	}
}

function refreshsize(){
tempvisscrollleft = window.pageXOffset || document.documentElement.scrollLeft;
tempvisscrolltop = window.pageYOffset || document.documentElement.scrollTop;

var cusid_ele = document.getElementsByClassName('stefanvdautostop');
for (var i = 0; i < cusid_ele.length; ++i) {
	var item = cusid_ele[i];  
	myElement = document.getElementsByTagName("video")[i];
	if(myElement){
		if(myElement.currentStyle){
			var d = myElement.currentStyle["display"];
			var v = myElement.currentStyle["visibility"];
			var w = myElement.currentStyle["width"];
			var h = myElement.currentStyle["height"];
		}
		else if (window.getComputedStyle){
			var st = document.defaultView.getComputedStyle(myElement, null);
			var d = st.getPropertyValue("display");
			var v = st.getPropertyValue("visibility");
			var w = st.getPropertyValue("width");
			var h = st.getPropertyValue("height");
		}

		visposition = getPosition(myElement);
		if(myElement.currentSrc == ""){item.style.display = "none";}

		if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		if(parseInt(myElement.style.top, 10) < 0){myElement.style.top = "0px";}
		}
		item.style.top = visposition.y+"px";
		item.style.left = visposition.x+"px";
		item.style.width = w;
		item.style.height = h;
	
		if(d == "none"){item.style.display = "none";}
		else if(v == "hidden" || v == "collapse"){item.style.display = "none";}
	} else{
		// remove this stop layer
		item.parentNode.removeChild(item);
	}
}
}
window.addEventListener('resize', function(){refreshsize()},false);
window.addEventListener('scroll', function(){refreshsize()},false);

} // option autostop on end
});