// ==UserScript==
// @name           Table Formatter
// @author         DavidG
// @grant          GM_addStyle
// @license        MIT
// @version        1.1.0.0
// @description    Allow copy & paste of tables on Stack Overflow (ALT+V to paste CSV into a table)
// @include        /^https?:\/\/([\w-]*\.)*((stackoverflow|stackexchange|serverfault|superuser|askubuntu|stackapps)\.com|mathoverflow.net)\/(c\/[^\/]*\/)?(questions|posts|review|tools)\/(?!tagged\/|new\/).*/
// @exclude       *://chat.stackoverflow.com/*
// @exclude       *://chat.stackexchange.com/*
// @exclude       *://chat.*.stackexchange.com/*
// @exclude       *://api.*.stackexchange.com/*
// @exclude       *://data.stackexchange.com/*
// ==/UserScript==

(function() {
    var copyButton = '<svg enable-background="new 0 0 24 24" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m20.5 24h-12c-1.378 0-2.5-1.121-2.5-2.5v-15c0-1.379 1.122-2.5 2.5-2.5h12c1.378 0 2.5 1.121 2.5 2.5v15c0 1.379-1.122 2.5-2.5 2.5zm-12-19c-.827 0-1.5.673-1.5 1.5v15c0 .827.673 1.5 1.5 1.5h12c.827 0 1.5-.673 1.5-1.5v-15c0-.827-.673-1.5-1.5-1.5z"/><path d="m4.5 21h-1c-1.378 0-2.5-1.121-2.5-2.5v-16c0-1.379 1.122-2.5 2.5-2.5h12c1.378 0 2.5 1.121 2.5 2.5 0 .276-.224.5-.5.5s-.5-.224-.5-.5c0-.827-.673-1.5-1.5-1.5h-12c-.827 0-1.5.673-1.5 1.5v16c0 .827.673 1.5 1.5 1.5h1c.276 0 .5.224.5.5s-.224.5-.5.5z"/><path d="m18.5 17h-8c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h8c.276 0 .5.224.5.5s-.224.5-.5.5z"/><path d="m18.5 21h-8c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h8c.276 0 .5.224.5.5s-.224.5-.5.5z"/><path d="m18.5 13h-8c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h8c.276 0 .5.224.5.5s-.224.5-.5.5z"/><path d="m18.5 9h-8c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h8c.276 0 .5.224.5.5s-.224.5-.5.5z"/></svg>';

    var tables = document.querySelectorAll(".s-table-container>.s-table");
    tables.forEach(function(table) {
        var parent = table.parentNode
        var hoverButton = document.createElement("div");
        hoverButton.classList.add("copy-button");

        hoverButton.innerHTML = copyButton;
        parent.insertBefore(hoverButton, table);

        hoverButton.addEventListener("click", function() {
            var text = "";

            for (let row of table.rows) {
                for(let cell of row.cells) {
                    text += cell.innerText;
                    text += ",";
                }
                text = text.slice(0, -1);
                text += "\n";
            }

            navigator.clipboard.writeText(text);
        }, true);

    });

    GM_addStyle('.s-table-container>.copy-button{opacity:0;transition: opacity 0.2s;position:absolute;float:right;background-color:white;padding:3px;border-radius:5px;margin:5px;height:26px;cursor:pointer;}.s-table-container:hover>.copy-button{opacity:1;}.s-table-container>.copy-button:active{background-color:#ccc;}');
})();

function KeyPress(e, f) {
    // We're only looking for ALT+V...
    if (e.keyCode != 86 || !e.altKey) {
        return;
    }

    // ... and only in a textarea
    if(!e.srcElement instanceof HTMLTextAreaElement) {
        return;
    }

    // Time to paste a table!
    navigator.clipboard.readText().then(clipText => {
        e.srcElement.value =
            e.srcElement.value.substring(0, e.srcElement.selectionStart) +
            formatAsTable(clipText) +
            e.srcElement.value.substring(e.srcElement.selectionEnd, e.srcElement.value.length);
    });

}

function formatAsTable(text) {
    var table = "";
    var isFirstLine = true;

    var lines = text.split("\n");

    lines.forEach(function (line) {
        var cells = line.split(",");
        cells.forEach(function(cell) {
            table += "|" + cell;
        });

        if(isFirstLine) {
            cells.forEach(function(cell) {
                table += "|-----";
            });
            table += "\n";
        }
        isFirstLine = false;
    });

    return table;
}

document.onkeydown = KeyPress;



