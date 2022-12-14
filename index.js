!function() {
    "use strict";
    function c(e) {
        return e.displayName ? u(e.displayName) : p(e.id)
    }

    // function exist(urlToFile) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('HEAD', urlToFile, false);
    //     xhr.send();

    //     return xhr.status != "404";
    // }

    // const exist = file =>
    //     fetch(file, {method: 'HEAD', cache: 'no-store'})
    //     .then(response => ({200: true, 404: false})[response.status])
    //     .catch(e => undefined);

    function m(e) {
        e.preventDefault();
        var t = parseInt(e.target.getAttribute("data-conv"), 10)
          , n = document.getElementById("messages");
        n.innerHtml = "",
        n.textContent = "",
        document.getElementById("selected-conversation-header").textContent = c(window.Skype.conversations[t]);
        for (var a = window.Skype.conversations[t] && window.Skype.conversations[t].MessageList ? window.Skype.conversations[t].MessageList : [], s = 0; s < a.length; s++)
            if ("" !== a[s].content) {
                var r = document.createElement("li");
                r.className = "message",
                r.setAttribute("id", a[s].id);
                var o = document.createElement("div");
                r.appendChild(o);
                var i = document.createElement("span");
                i.className = "author",
                i.textContent = p(a[s].from),
                o.appendChild(i);
                var l = document.createElement("span");
                l.className = "timestamp",
                l.textContent = new Date(a[s].originalarrivaltime).toLocaleString(),
                o.appendChild(l);
                var u_content = u(a[s].content);
                var d = document.createElement("div");
                d.className = "message-body";
                if (!u_content) {
                    ; // pass
                } else if (typeof u_content == 'string') {
                    d.innerText = u_content;
                } else {
                    r.appendChild(u_content);
                }
                r.appendChild(d);
                n.appendChild(r)
            }
    }
    function a(e, t) {
        document.getElementById(e).textContent = t
    }
    function p(e) {
        return e.replace(/^8:/, "")
    }
    function u(e) {
        var data = e.replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        if (data.startsWith('<URIObject uri')) {
            var el = (new DOMParser).parseFromString(e, "text/html");
            var URIObject = el.querySelector('[doc_id]');
            var doc_id = URIObject.getAttribute('doc_id');
            var OriginalName_ext = el.querySelector('OriginalName').getAttribute('v').split(".").at(-1);

            if (["mp4", "m4a"].includes(OriginalName_ext.toLowerCase()))
                return null;

            var width = URIObject.getAttribute('width');
            var height = URIObject.getAttribute('height');

            var img = document.createElement("img");
            img.setAttribute("src", '../8 live .cid.930f95666ffeb1cb_export/media/' + doc_id + '.1.' + OriginalName_ext);
            img.setAttribute("width", width/2);
            img.setAttribute("height", height/2);

            return img;
        }

        return data;
    }
    function s(e, t) {
        for (var n = document.getElementsByClassName(e), a = 0; a < n.length; a++)
            n[a].style.display = t ? "block" : "none"
    }
    document.getElementById("btnLoad").addEventListener("click", function() {
        var e, t, n;
        "function" == typeof window.FileReader ? (e = document.getElementById("fileinput")) && e.files ? e.files[0] ? (document.getElementById("progress").style.display = "block",
        t = e.files[0],
        (n = new FileReader).onload = function(e) {
            var t = e.target.result;
            !function(e) {
                if (e && e.userId && e.conversations && e.exportDate) {
                    var t = new Date(e.exportDate)
                      , n = e.conversations.filter(function(e) {
                        return e.id && "ALL" !== e.id && !/@cast\.skype$/.test(e.id) && e.MessageList && e.MessageList.length
                    });
                    a("hdr-user", p(e.userId)),
                    a("hdr-exported", t.toLocaleString()),
                    a("hdr-stats", n.length + " conversations"),
                    function(e) {
                        for (var t = document.getElementById("conversations"), n = 0; n < e.length; n++) {
                            var a = document.createElement("li");
                            a.className = "conversations";
                            var s = document.createElement("a");
                            s.setAttribute("href", "#"),
                            s.setAttribute("data-conv", n),
                            s.className = "conv-link",
                            s.textContent = c(e[n]),
                            a.appendChild(s);
                            var r = document.createElement("div");
                            a.appendChild(r);
                            var o = document.createElement("span");
                            o.className = "messageCount",
                            o.textContent = e[n].MessageList.length + " messages",
                            r.appendChild(o);
                            var i = e[n].properties && e[n].properties.lastimreceivedtime ? e[n].properties.lastimreceivedtime : null;
                            if (i) {
                                var l = document.createElement("span");
                                l.className = "timestamp-conv",
                                l.textContent = "Last from: " + new Date(i).toLocaleString(),
                                r.appendChild(l)
                            }
                            t.appendChild(a)
                        }
                        for (var d = document.getElementsByClassName("conv-link"), n = 0; n < d.length; n++)
                            d[n].addEventListener("click", m)
                    }(n),
                    window.Skype = {},
                    window.Skype.conversations = n,
                    s("step-1", !1),
                    s("step-2", !0)
                } else
                    alert("Sorry, we are unable to load this file")
            }(JSON.parse(t))
        }
        ,
        n.readAsText(t, "utf8")) : alert("Please select a file before clicking 'Load'") : alert("This browser doesn't seem to support the 'files' property of file inputs.") : alert("The file API isn't supported on this browser. Please use a more modern browser.")
    }),
    s("step-2", !1),
    s("step-1", !0)
}();