// Copy bookmarklet URL to clipboard (--no-copyright => remove leading comments)
// (echo -n "javascript:"; uglifyjs --no-copyright copy_url.js ; echo) | pbcopy

(function() {
    // Change to following to your liking
    var hostEntries = [
        [ "www.2ality.com", {
            func: function (data) {
                data.ttitle = '“'+data.ttitle+'” by @rauschma #2ality';
                data.thref = data.thref+" ^ar"
            }
          }
        ],
        [ "addyosmani.com", { twit: "@addyosmani" } ],
        [ "arstechnica.com", { twit: "@arstechnica" } ],
        [ "badassjs.com", { twit: "@badass_js" } ],
        [ "blog.chromium.org", { twit: "@ChromiumDev" } ],
        [ "blog.mozilla.com", { twit: "@firefox" } ],
        [ "blog.nodejs.org", { twit: "@nodejs" } ],
        [ "dailyjs.com", { twit: "@dailyjs" } ],
        [ "daringfireball.net", { twit: "@daringfireball" } ],
        [ "developer.palm.com", { twit: "@hpnews" } ],
        [ "functionsource.com", { twit: "@functionsource" } ],
        [ "hacks.mozilla.org", { twit: "@mozhacks" } ],
        [ "www.html5rocks.com", { twit: "@ChromiumDev" } ],
        [ "www.macrumors.com", { twit: "@MacRumors" } ],
        [ "www.marco.org", { twit: "@marcoarment" } ],
        [ "mashable.com", { twit: "@mashable" } ],
        [ "www.nczonline.net", { twit: "@slicknet" } ],
        [ /^.*nytimes.com$/, { twit: "@nytimes" } ],
        [ "www.remotesynthesis.com", { twit: "@remotesynth" } ],
        [ /^.*smashingmagazine.com$/, { twit: "@smashingmag" } ],
        [ "spinoff.comicbookresources.com", { twit: "@SpinoffOnline" } ],
        [ "tagneto.blogspot.ca", { twit: "@jrburke" } ],
        [ "thenextweb.com", { twit: "@TheNextWeb" } ],
        [ "www.theverge.com", { twit: "@verge" } ],
        [ "unscriptable.com", { twit: "@unscriptable" } ],
    ];

    //----- Step 1: collect the input from the current page
    
    var data = {};
    var sel = (window.getSelection ? String(window.getSelection()) : "");

    // HTML
    data.htitle = document.title;
    data.hhref = document.location.href;
    
    // Plain text, Twitter
    data.ttitle = document.title;
    data.thref = document.location.href;

    var hostDesc;
    hostEntries.some(function(hostEntry) {
        var key = hostEntry[0];
        if (key instanceof RegExp) {
            if (key.test(document.location.host)) {
                hostDesc = hostEntry[1];
                return true; // break
            }
        } else {
            if (key === document.location.host) {
                hostDesc = hostEntry[1];
                return true; // break
            }
        }
    });
    if (hostDesc) {
        if (hostDesc.func) {
            hostDesc.func(data);
        } else {
            if (hostDesc.twit) {
                data.ttitle = '“'+data.ttitle+'” by '+hostDesc.twit;
            }
        }
    }

    //----- Step 2: write the output to a new page

    var htmlProlog = tmpl(data,
        '<html><head><title>Copy link: {htitle}</title></head><body>'
        + '<textarea id="text" cols="80" rows="10">'
    );
    // Plain text/Twitter
    var text = tmpl(data,
        '{ttitle}\n{thref}'
        + '\n\n'
    );
    // HTML link
    var selectionStart = text.length;
    text += tmpl(data,
        '<a href="{hhref}">{htitle}</a>'
    );
    var selectionEnd = text.length;
    // Optionally: selection
    if (sel) {
        text += "\n\n" + sel;
    }
    var htmlEpilog = tmpl(data,
        '</textarea>'
        + '</body></html>'
    );

    var doc = window.open().document;
    doc.write(htmlProlog + htmlEscape(text) + htmlEpilog);
    doc.close(); // finish writing the HTML

    var area = doc.getElementById("text");
    area.focus();
    area.selectionStart = selectionStart;
    area.selectionEnd = selectionEnd;

    function htmlEscape(text) {
        return text.replace("<", "&lt;");
    }

    // Poor man's templating
    function tmpl(data, text) {
        return text.replace(/{([a-z]+)}/g, function(g0,g1){return data[g1]});
    }
}())
