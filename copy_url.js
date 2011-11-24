// Print link:
// clear ; echo -n "javascript:"; java -jar ~/shared/local/yuicompressor-*.jar copy_url.js ; echo

(function() {
    // Change to following to your liking
    var hostEntries = [
        [ "www.2ality.com", { htag: "#2ality" } ],
        [ "addyosmani.com", { twit: "@addyosmani" } ],
        [ "arstechnica.com", { twit: "@arstechnica" } ],
        [ "daringfireball.net", { re: /^Daring Fireball Linked List: (.*)$/, twit: "@daringfireball" } ],
        [ "functionsource.com", { re: /^FunctionSource: (.*)$/, twit: "@functionsource" } ],
        [ "hacks.mozilla.org", { re: /^(.*) ✩ Mozilla Hacks – the Web developer blog$/, twit: "@mozhacks" } ],
        [ "www.macrumors.com", { re: /^(.*) - Mac Rumors$/, twit: "@MacRumors" } ],
        [ "www.marco.org", { re: /^(.*) – Marco.org$/, twit: "@marcoarment" } ],
        [ "mashable.com", { twit: "@mashable" } ],
        [ /^.*nytimes.com$/, { re: /^(.*) - NYTimes.com$/, twit: "@nytimes" } ],
        [ "spinoff.comicbookresources.com", { re: /^(.*) « Spinoff Online – TV, Film and Entertainment News Daily$/, twit: "@SpinoffOnline" } ],
        [ "www.theverge.com", { re: /^(.*) [|] The Verge$/, twit: "@verge" } ],
        [ "unscriptable.com", { re: /^(.*) [|] Unscriptable.com$/, twit: "@unscriptable" } ],
    ];
    
    //----- Step 1: collect the input from the current page
    
    var sel = (window.getSelection ? ""+window.getSelection() : "")
          .replace("<", "&lt;"); // even in textarea, we have to escape <
    var ttl = document.title;
    var twit = "";
    var htag = "";
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
        if (hostDesc.re) {
            var match = hostDesc.re.exec(ttl);
            if (match) {
                ttl = match[1];
            } else {
                alert("Warning: The title “"+ttl+"” does not match regex "+hostDesc.re);
            }
        }
        if (hostDesc.twit) {
            twit = hostDesc.twit + " ";
        }
        if (hostDesc.htag) {
            htag = " " + hostDesc.htag;
        }
    }
    var a={
        ttl: ttl,
        twit: twit,
        href: document.location.href,
        htag: htag,
        selt: (sel ? "\n\n"+sel : ""), // plain text separator + selection
        selh: (sel ? "<br>"+sel : "")  // HTML separator + selection
    };

    //----- Step 2: write the output to a new page
    
    var d=window.open().document;
    // Poor man's templating
    d.write(
        ( '<html><head><title>Copy link: {ttl}</title></head><body>'
        // First rendered HTML for WYSIWYG editors (a single chunk for easy copying)
        + '<a href="{href}">{ttl}</a>{selh}<br><br>'
        // Then plain text: ...
        + '<textarea id="text" cols="80" rows="10">'
        // ...Twitter
        + '{ttl} {twit}{href}{htag}'
        // ...HTML source
        + '\n\n&lt;a href="{href}"&gt;{ttl}&lt;/a&gt;'
        // ...selection
        + '{selt}'
        + '</textarea>'
        + '</body></html>'
        ).replace(/{([a-z]+)}/g, function(g0,g1){return a[g1]})
    );
    d.close(); // finish writing the HTML
}())
