'use strict';

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

