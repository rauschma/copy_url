// Print link:
// clear ; echo -n "javascript:"; java -jar ~/shared/local/yuicompressor-*.jar copy_url.js ; echo

(function() {
    // Change to following to your liking
    var hosts = {
        "www.macrumors.com": { re: /^(.*) - Mac Rumors$/, twit: "@MacRumors" },
        "www.2ality.com": { htag: "#2ality" }
    }
    
    //----- Step 1: collect the input from the current page
    
    var sel = (window.getSelection ? ""+window.getSelection() : "")
          .replace("<", "&lt;"); // even in textarea, we have to escape <
    var ttl = document.title;
    var twit = "";
    var htag = "";
    var hostDesc = hosts[document.location.host];
    if (hostDesc) {
        if (hostDesc.re) {
            ttl = hostDesc.re.exec(ttl)[1];
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
        selt: (sel ? "\n\n"+sel : sel), // selection as text
        selh: (sel ? "<br>"+sel : sel)  // selection as HTML
    };

    //----- Step 2: write the output to a new page
    
    var d=window.open().document;
    // Poor man's templating
    d.write(
        ( '<html><head><title>Copy link: {ttl}</title></head><body>'
        // First rendered HTML for WYSIWYG editors (a single chunk for easy copying)
        + '<a href="{href}">{ttl}</a><br>{selh}<br><br>'
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
