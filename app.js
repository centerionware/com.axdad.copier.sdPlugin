/* global $CC, Utils, $SD */


$SD.on('connected', (jsonObj) => connected(jsonObj));

function connected(jsn) {
    // Subscribe to the willAppear and other events
    $SD.on('com.axdad.copier.action.willAppear', (jsonObj) => action.onWillAppear(jsonObj));
    $SD.on('com.axdad.copier.action.keyUp', (jsonObj) => action.onKeyUp(jsonObj));
    $SD.on('com.axdad.copier.action.sendToPlugin', (jsonObj) => action.onSendToPlugin(jsonObj));
    $SD.on('com.axdad.copier.action.didReceiveSettings', (jsonObj) => action.onDidReceiveSettings(jsonObj));
    $SD.on('com.axdad.copier.action.propertyInspectorDidAppear', (jsonObj) => {
        console.log('%c%s', 'color: white; background: black; font-size: 13px;', '[app.js]propertyInspectorDidAppear:');
    });
    $SD.on('com.axdad.copier.action.propertyInspectorDidDisappear', (jsonObj) => {
        console.log('%c%s', 'color: white; background: red; font-size: 13px;', '[app.js]propertyInspectorDidDisappear:');
    });
};

// ACTIONS

const action = {
    settings:{},
    onDidReceiveSettings: function(jsn) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[app.js]onDidReceiveSettings:');
        this.settings = Utils.getProp(jsn, 'payload.settings', {});
    },
    onWillAppear: function (jsn) {
        console.log("You can cache your settings in 'onWillAppear'", jsn.payload.settings);
        this.settings = jsn.payload.settings;
        if(this.settings["mymessage"] == "") 
            this.settings["mymessage"] = "Enter your text to be copied here." // Breaks localization.. idk how to get the localization strings.
    },
    onKeyUp: function (jsn) {
        function l_copy(copyText_in) {
            function htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            }
            copyText_in_html = htmlEntities(copyText_in) 
            // First just make sure there are no old "copy_text" in memory for whatever reason (precautionary)
            var all_copies = document.querySelectorAll('#copy_text')
            all_copies.forEach(element => {
                element.remove()
            });
            // Now get going. Dump the text out to an html element on the dom, select it, run the copy command through the document.execCommand
            var copyText = document.createElement("pre"); // Create a pre node so newlines, tabs, spaces are preserved.
            copyText.id = "copy_text"
            copyText.innerHTML = copyText_in_html // Set the innerHTML to the htmlEntified text.
            document.body.append(copyText);
            var range = document.createRange();
            var selection = window.getSelection();
            range.selectNodeContents(copyText);  // Set the range for the selection ? Not sure how this works, it was copied from probably stack overflow but who knows
            selection.removeAllRanges();
            selection.addRange(range); // Select the text ?
            document.execCommand("copy"); // This is depricated but should still work since I think the steam deck stuff is QT which uses a _really_ old browser engine (even in QT6)
            console.log('Tried to copy with document.execCommand("copy")')
            navigator.clipboard.writeText(copyText_in) // I don't think this is working because it's not SSL? But it might be and is the "preferred" way
            console.log("Tried to set the navigator clipboard .. ")
        }

        l_copy(this.settings["mymessage"])
        //navigator.clipboard.writeText(this.settings["message"]) // This is the preferred way, however, only works when connected to an SSL site? 
        //child_process.spawn('clip').stdin.end(this.settings["message"]); // This would probably work if using node.js
    },

    onSendToPlugin: function (jsn) {
        /**
         * This is a message sent directly from the Property Inspector 
         * (e.g. some value, which is not saved to settings) 
         * You can send this event from Property Inspector (see there for an example)
         */ 

        const sdpi_collection = Utils.getProp(jsn, 'payload.sdpi_collection', {});
        if (sdpi_collection.value && sdpi_collection.value !== undefined) {
            console.log({ [sdpi_collection.key] : sdpi_collection.value }, 'onSendToPlugin', 'fuchsia');            
        }
    },

};

