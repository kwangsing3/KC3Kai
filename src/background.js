
// 函数：动态删除所有重定向规则
function removeAllRedirectRules() {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        const ruleIds = rules.map(rule => rule.id);

        if (ruleIds.length > 0) {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: ruleIds
            }, () => {
                console.log("All rules removed:", ruleIds);
            });
        } else {
            console.log("No rules to remove.");
        }
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [
                {
                    "id": 1,
                    "priority": 1,
                    "action": {
                        "type": "redirect",
                        "redirect": {
                            "regexSubstitution": "https://kcwiki.github.io/cache/\\1"
                        }
                    },
                    "condition": {
                        "regexFilter": "http://203.104.209.7/(.*)",
                        "resourceTypes": ["main_frame", "script", "image", "other"]
                    }
                },
                // {
                //     "id": 2,
                //     "priority": 1,
                //     "action": {
                //         "type": "redirect",
                //         "redirect": {
                //             "extensionPath": "/kcs_const.js"
                //         }
                //     },
                //     "condition": {
                //         "urlFilter": "kcs_const.js",
                //         "resourceTypes": ["script"]
                //     }
                // }
            ]
        });

    });
}

// 调用函数以删除所有规则
removeAllRedirectRules();




/**
 background.js
 KC3改 Background Service Worker.

 https://developer.chrome.com/docs/extensions/mv3/service_workers
 https://developer.chrome.com/docs/extensions/migrating/to-service-workers/

 See Manifest File [manifest.json] under "background" > "service_worker"
**/
// Mock objects for DOM context
const window = self;
this.prototype = window.prototype || {};
const document = window.document || {};
document.createElement = document.createElement || (() => ({}));
document.getElementsByTagName = document.getElementsByTagName || (() => ({}));
const $ = window.$ || {};
$.extend = $.extend || Object.assign;

// Known issues and related docs:
//  * non-ES module dependencies to be loaded
//    https://github.com/w3c/ServiceWorker/issues/1356
//  * to load classic scripts (non-ES modules) in service worker
//    https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts
//  * web page document and jquery not work, has to modifiy or mock many dependencies, https://developer.chrome.com/docs/extensions/reference/offscreen/
//  * localStorage not work, no idea how to share existed data, https://developer.chrome.com/docs/extensions/migrating/to-service-workers/#convert-localstorage
//  * no window.open api, has to replace with chrome.tabs.create()
//  * no chrome.webRequest api, has to replace with chrome.declarativeNetRequest
importScripts(
	"assets/js/global.js",
//	"assets/js/jquery.min.js",
	"assets/js/Dexie.min.js",
	"library/objects/Messengers.js",
	"library/objects/Quest.js",
	"library/objects/Screenshot.js",
/*
	"library/managers/ConfigManager.js",
	"library/managers/QuestManager.js",
	"library/modules/ChromeSync.js",
	"library/modules/QuestSync/Background.js",
	"library/modules/QuestSync/Sync.js",
	"library/modules/Database.js",
	"library/modules/Log/Log.js",
	"library/modules/Log/Background.js",
	"library/modules/ImageExport.js",
	"library/modules/Master.js",
	"library/modules/RemodelDb.js",
	"library/modules/Meta.js",
	"library/modules/Translation.js",
*/
);

// copy-paste from Service.js
window.KC3Service = {
};

chrome.runtime.onInstalled.addListener(() => {
	console.info("KC3改 Background Service Worker installing...");
});

chrome.runtime.onSuspend.addListener(() => {
	console.info("KC3改 Background Service Worker suspending...");
});

chrome.runtime.onMessage.addListener(function(request, sender, callback){
	// Check if message is intended for this script
	if( (request.identifier || false) == "kc3_service"){
		// Log message contents and sender for debugging
		//console.debug(request.action, { "Request": request, "Sender": sender });
		
		// Check requested action is supported
		if(typeof window.KC3Service[ request.action ] != "undefined"){
			// Execute and pass callback to function
			window.KC3Service[ request.action ](request, sender, callback);
			return true; // dual-async response
		}else{
			// Unknown action
			callback({ success: false });
		}
	
	}
});

console.info("KC3改 Background Service Worker loaded");
