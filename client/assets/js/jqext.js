"use strict";
// 2015-09-19 08:15
(function ($)
{
    $.fn.invisible = function ()
    {
        return this.each(function ()
        {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function ()
    {
        return this.each(function ()
        {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));
(function ($)
{

    $.fn.firstChild = function ()
    {
        return ($(this[0].children[0]));
    }

}(jQuery));

(function ($)
{

    $.fn.dataattr = function (key, obj)
    {
        var $el = $(this[0]);
        if (typeof (obj) == "undefined")
        {
            var val = $el.attr("data-" + key);
            return (JSON.parse(val));
        }
        var str = JSON.stringify(obj);
        $el.attr("data-" + key, str);
    }
}(jQuery));

(function ($)
{
    if (!$.outerHTML)
    {
        $.extend({
            outerHTML: function (ele)
            {
                var $return = undefined;
                if (ele.length === 1)
                {
                    $return = ele[0].outerHTML;
                }
                else if (ele.length > 1)
                {
                    $return = {};
                    ele.each(function (i)
                    {
                        $return[i] = $(this)[0].outerHTML;
                    })
                };
                return $return;
            }
        });
        $.fn.extend({
            outerHTML: function ()
            {
                return $.outerHTML($(this));
            }
        });
    }
})(jQuery);

(function ($)
{
    jQuery.fn.jqext = function (settings)
    {
        var dispatch = {};
        dispatch["attachEvents"] =
            function ($container, settings)
            {
                if ($container.length == 0)
                {
                    return;
                }
                var $list = $container.find("*");
                $list.push($container[0]);        // there may be an event handler on the container itself
                $list.each
                    (
                        function (index, el)
                        {
                            var $el = $(el);
                            if ($el.hasClass("events_attached"))
                            {
                                return;
                            }
                            var attrs = el.attributes;
                            for (var j = 0; j < attrs.length; j++)
                            {
                                var attr = attrs[j];
                                if (attr.name.indexOf("data-on") != 0)
                                {
                                    continue;
                                }
                                var val = attr.value;
                                try
                                {
                                    var funct = eval(val);
                                }
                                catch (ex)
                                {
                                    console.log("function: " + val + " does not exist");
                                }
                                var ev = attr.name.substring(7);
                                $el.on(ev, funct).addClass("events_attached");
                            }
                        }
                    );
                return ($container);
            };

        var method = settings["method"];
        return (dispatch[method](this, settings));
    }
}(jQuery));

$.jqext = {};
$.jqext.global = {};
$.jqext.global.devicetype = 0;   // 0=desktop, 1=tablet, 2=phone
$.jqext.global.initdevicetype = function()
{
    var agent = navigator.userAgent;
    var h = $(window).height();
    var w = $(window).width();
    console.log("h:" + h + " w:" + w);
    if (agent.indexOf("iPhone") >= 0) return (2);
    if (agent.indexOf("iPad") >= 0) return (1);
}
$.jqext.global.init = function()
{
    $.jqext.global.devicetype = $.jqext.global.initdevicetype();
}

$.jqext.resize = {};
$.jqext.resize.list = {};
$.jqext.resize.add = function(key, funct)
{
    $.jqext.resize.list[key] = funct;
}
$.jqext.resize.remove = function (key) {
    delete $.jqext.resize.list[key];
}
$.jqext.resize.setModalMaxsize = function ($item) {
    var $content = $item.find(".modal-content");
    var h = $(window).height();
    $content.css("max-height", (h * .80) + "px");
    $content.css("overflow-y", "auto");
}

$.jqext.resize.sizemodal = function($modal) {
    var $dialog = $modal.find('.modal-dialog');
    $modal.css('display', 'block');
    $.jqext.resize.setModalMaxsize($dialog);
    // center the dialog
    $dialog.css("margin-top", Math.max(0, ($(window).height() - $dialog.height()) / 2));
}

$.jqext.resize.init = function ()
{
    $(window).resize($.jqext.resize.resizing);
    $(window).on("orientationchange", function () {
        $.jqext.resize.resizedone();
    });
    // Reposition when a modal is shown
    $('.modal').on('show.bs.modal', function () {
        $.jqext.resize.sizemodal($(this));
    }
        );
    // Reposition when the window is resized
    $(window).on('resize', function () {
        // process re-size for each visible window
        $('.modal:visible').each(function () {
            $.jqext.resize.sizemodal($(this));
        });
    });
}
$.jqext.resize.rtime;
$.jqext.resize.timeout = false;
$.jqext.resize.delta = 200;
$.jqext.resize.resizing = function()
{
    $.jqext.resize.rtime = new Date();
    if ($.jqext.resize.timeout === false) {
        $.jqext.resize.timeout = true;
        setTimeout($.jqext.resize.resizeend, $.jqext.resize.delta);
    }
}
$.jqext.resize.resizeend = function() {
    if (new Date() - $.jqext.resize.rtime < $.jqext.resize.delta) {
        setTimeout($.jqext.resize.resizeend, $.jqext.resize.delta);
    } else {
        $.jqext.resize.timeout = false;
        $.jqext.resize.resizedone();
    }
}
$.jqext.resize.resizedone = function () {
    function reposition() {
        var modal = $(this);
        var $dialog = modal.find('.modal-dialog');
        modal.css('display', 'block');
        $.jqext.resize.setModalMaxsize($dialog);
        // center the dialog
        $dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
    }
    for (var funct in $.jqext.resize.list)
    {
        var callthis = $.jqext.resize.list[funct];
        callthis();
    }
    $('.modal:visible').each(function () {
        $.jqext.resize.sizemodal($(this));
    });
}

// --- string manipulation functions ----
$.jqext.str = {};
$.jqext.str.qs2obj = function(qs)
{
    var obj = {}; 
    var parts = qs.split("&");
    for(var i=0; i<parts.length;i++)
    {
        var part = parts[i];
        var pieces = part.split("=");
        var name = pieces[0];
        var value = null;
        if(pieces.length > 1)
        {
            value = decodeURIComponent(pieces[1]);
        }
        obj[name] = value;
    }
    return (obj);
}

$.jqext.str.obj2qs = function(obj)
{
    var txt = [];
    for(var prop in obj)
    {
        txt.push(prop+"="+encodeURIComponent(obj[prop]));
    }
    return (txt.join("&"));
}
$.jqext.str.stripPx = function(val)
{
    var cur = parseInt(val);
    return (cur);
}
$.jqext.str.convertRgbToHex = function (val)
{
    function rgb(red, green, blue)
    {
        var decColor = 65536 * red + 256 * green + blue;
        var hex = "00000" + decColor.toString(16);
        var len = hex.length;
        hex = hex.substring(len - 6);
        return ("#" + hex);
    }
    if (val.indexOf("rgb") == -1)
    {
        return (val);
    }
    var ret = eval("(" + val + ")");
    return (ret);
}
$.jqext.str.replace = function (This, from, to)
{
    var st = This;
    var idx = 0;
    var tolen = to.length;
    var fromlen = from.length;
    if (fromlen === 0)
        return (st);
    while ((idx = st.indexOf(from, idx)) >= 0)
    {
        st = st.slice(0, idx) + to + st.slice(idx + fromlen, 99999);
        idx += tolen;
    }
    return st;
};
$.jqext.str.FormatUsingTemplate = function (template, obj)
{
    if (typeof(template) != "string")
    {
        // jquery object
        var real_template = $.jqext.html.outer(template.find(".template")[0]);
        template.empty();
        var template1 = real_template.replace("template", "generated");
        var generated_html = $.jqext.str.FormatUsingTemplate(template1, obj);
        template.html(real_template + generated_html);
        return;
    }
    if (obj.length)
    {
        var html = [];
        for(var i=0; i<obj.length;i++)
        {
            html.push($.jqext.str.FormatUsingTemplate(template, obj[i]));
        }
        return (html.join(""));
    }
    var s = template;
    var checkdate = s.indexOf("{{[") > 0;
    for (var key in obj)
    {
        if (obj[key] == null)
        {
            continue;
        }
        var sobj = obj[key].toString();
        // 0123456789012345678
        // 2015-01-23T23:13:55
        
        if (sobj.length == 10 &&checkdate)
        {
            var dobj = sobj.substring(0, 10);
            s = $.jqext.str.replace(s, "{{[" + key + "]}}", dobj);
        }
        
        s = $.jqext.str.replace(s, "{{{" + key + "}}}", sobj);
        s = $.jqext.str.replace(s, "{{" + key + "}}", $.jqext.html.encode(sobj));
    }
    return (s);
};
$.jqext.str.TwoDigits = function (s)
{
    var ss = s.toString();
    if (ss.length == 2)
    {
        return (ss);
    }
    return ("0" + ss);
}

$.jqext.str.yyyymmdd = function (d) {
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = d.getDate().toString();
    return(yyyy + "-" + $.jqext.str.TwoDigits(mm) + "-" + $.jqext.str.TwoDigits(dd));
};

$.jqext.str.UTCDateString = function (d) {
    var yyyy = d.getUTCFullYear().toString();
    var MM = (d.getUTCMonth() + 1).toString(); // getMonth() is zero-based
    var dd = d.getUTCDate().toString();
    var HH = d.getUTCHours().toString();
    var mm = d.getUTCMinutes().toString();
    var ss = d.getUTCSeconds().toString()
    return (yyyy + "-" + $.jqext.str.TwoDigits(MM) + "-" + $.jqext.str.TwoDigits(dd) + "T" + $.jqext.str.TwoDigits(HH) + ":" + $.jqext.str.TwoDigits(mm) + ":" + $.jqext.str.TwoDigits(ss));
};

$.jqext.str.Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
$.jqext.str.FormatDateUsingTemplate = function (template, dateThing)
{
    var dateObj;
    if (typeof (dateThing) == "string")
    {
        dateObj = new Date(dateThing);
    }
    else
    {
        dateObj = dateThing;
    }
    var hour = dateObj.getUTCHours();
    var ampm = "pm";
    if (hour >= 12)
    {
        hour -= 12;
        ampm = "am";
    }
    var obj = {
        year: dateObj.getUTCFullYear(),
        month: $.jqext.str.Months(dateObj.getUTCMonth()),
        day: $.jqext.str.TwoDigits(dateObj.getUTCDate()),
        hour: $.jqext.str.TwoDigits(hour),
        min: $.jqext.str.TwoDigits(dateObj.getUTCMinutes()),
        sec: $.jqext.str.TwoDigits(dateObj.getUTCSeconds())
    }
    return ($.jqext.str.FormatUsingTemplate(template, obj));
};
$.jqext.str.centerElementInDivTemplateStart = '<table cellspacing="0" cellpadding="0" style="height:100%;width:100%"><tr><td valign="middle" align="center"><table cellspacing="0" cellpadding="0"><tr><td></td><td><div>';
$.jqext.str.centerElementInDivTemplateEnd = '</div><td></td></tr></table></td></tr></table>';
$.jqext.str.centerElementInDiv = function (elToCenter)
{
    return ($.jqext.str.centerElementInDivTemplateStart + elToCenter + $.jqext.str.centerElementInDivTemplateEnd);
}

$.jqext.validation = {};
$.jqext.validation.clearerrors = function ($container)
{
    if ($container == null)
    {
        return;
    }
    var $list = $container.find(".i18nerror");
    $list.text("");
}

$.jqext.validation.showerrors = function ($container, errors)
{
    var $list = $container.find(".i18nerror");
    $list.hide();
    for (var i = 0; i < $list.length; i++)
    {
        var el = $list[i];
        var $el = $(el);
        $el.text("");
        var name = $.jqext.i18n.findI18nKey(el);
        if (name in errors)
        {
            var errmsg = $.jqext.str.FormatUsingTemplate($el.attr("data-errmsg"), errors[name])
            $el.html(errmsg);
            $el.show();
        }
    }
}
// --- dom  manipulation ----------
$.jqext.dom = {};
$.jqext.dom.inputdatesupported = function() {
    var input = document.createElement('input');
    input.setAttribute('type', 'date');

    var notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue);

    return !(input.value === notADateValue);
}
$.jqext.dom.addToSelect = function (selectObj, options)
{
    for (var i = 0; i < options.length; i++)
    {
        var option = options[i];
        var len = selectObj.options.length;
        selectObj.options.length++;
        selectObj.options[len].value = option["value"];
        selectObj.options[len].text = option["text"];
    }
}
$.jqext.dom.updateCssClass = function (theClass, element, value)
{
    //Last Updated on July 4, 2011
    //documentation for this script at
    //http://www.shawnolson.net/a/503/altering-css-class-attributes-with-javascript.html
    var cssRules;
    if (document.styleSheets.length == 0)
    {
        return;
    }
    if (document.styleSheets[0]['rules']) {
        cssRules = 'rules';
    } else if (document.styleSheets[0]['cssRules']) {
        cssRules = 'cssRules';
    } else {
        return;
    }

    for (var S = 0; S < document.styleSheets.length; S++)
    {
        for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
            if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
                if(document.styleSheets[S][cssRules][R].style[element]){
                    document.styleSheets[S][cssRules][R].style[element] = value;
                    break;
                }
            }
        }
    }
}

$.jqext.dom.load = function ()
{
    function success(data, status, jqXHR)
    {
        var obj = { list: JSON.parse(data) }
        var $content = $("#ContentArea");
        $content.empty();
        $content.load("app/" + method + ".html",
            function ()
            {
                var tmpl = $("#template").html();
                var rendered = Mustache.render(tmpl, obj);
                $("#template-target").html(rendered);
                $content.find(".on_").jqext({ method: "attachEvents" });
            }
        );
    };

    function fail(jqXHR, status, errorThrown)
    {
        var status = jqXHR.status;
        if (status === 405)
        {
            window.alert("invalid method");
        };
    };

    var method = "";
    var htmlfile = "app/" + method + ".html";
    $.jqext.restful.send(null, method, {}, success, fail);

};
$.jqext.dom.center = function ($parent, $child)
{
    var childHeight = $child.height();
    var childWidth = $child.width();
    var parentHeight = $parent.height();
    var parentWidth = $parent.width();
    var pos = $parent.position();
    var left = (parentWidth - childWidth) / 2;
    var top = (parentHeight - childHeight) / 2;
    $child.css({
        position: "absolute",
        top: top + "px",
        left: left + "px"
    });
};

$.jqext.i18n = {};
$.jqext.i18n.attrs =
{
    "placeholder": "placeholder",
    "errmsg": "data-errmsg",
    "title": "title",
    "alt": "alt"
};
$.jqext.i18n.data = null;
$.jqext.i18n.findI18nKey = function (el)
{
    return ($.jqext.i18n.findDataId(el));
}

$.jqext.i18n.findDataId = function (el)
{
    var id;
    var $el = $(el);
    while (true)
    {
        id = $el.attr("data-id");
        if (id != null)
        {
            return (id);
        }
        $el = $el.parent();
        if ($el.length === 0)
        {
            return (null);
        }
    }
    return (null);
}

$.jqext.i18n.setLanguageText = function (text, $container)
{
    if (typeof (text) == "undefined")
    {
        return;
    }
    var langObj = {};
    var textObj = eval("(" + text + ")");
    for (var container_name in textObj)
    {
        if (langObj.hasOwnProperty(container_name) == false)
        {
            langObj[container_name] = {};
        }
        var i18nContainer = langObj[container_name];
        var thisContainer = textObj[container_name]
        for (var key in thisContainer)
        {
            var key1 = $.jqext.str.replace(key, "_", ".");
            i18nContainer[key1] = thisContainer[key];
        }
    }
    var $list = $(".FormContainer")
    for (var i = 0; i < $list.length; i++)
    {
        var thisId = $list[i].id;
        $.jqext.i18n.setSpecificContainer(thisId, langObj);
    }
}

$.jqext.i18n.setSpecificContainer = function (containerId, langObj)
{
    var val = null;
    var key;
    var key1;
    var keyx;
    var item;
    var $list;
    var i;
    var $container = $("#" + containerId);
    var containerText = langObj[containerId];
    if (containerText)
    {
        $list = $container.find(".FormLabel");
        for (i = 0; i < $list.length; i++)
        {
            item = $list[i];
            key = $.jqext.i18n.findI18nKey(item);
            if (key == null)
            {
                continue;
            }
            keyx = key + ".text";
            if (keyx in containerText)
            {
                val = containerText[keyx];
                $(item).html(val);
            }
        }

        $list = $container.find(".FormLabelRight");
        for (i = 0; i < $list.length; i++)
        {
            item = $list[i];
            key = $.jqext.i18n.findI18nKey(item);
            if (key == null)
            {
                continue;
            }
            keyx = key + ".text";
            if (keyx in containerText)
            {
                val = containerText[keyx];
                $(item).html(val);
            }
        }

        $list = $container.find(".FormText");
        for (i = 0; i < $list.length; i++)
        {
            item = $list[i];
            key = $.jqext.i18n.findI18nKey(item);
            if (key == null)
            {
                continue;
            }
            keyx = key + ".text";
            if (keyx in containerText)
            {
                val = containerText[keyx];
                $(item).html(val);
            }
        }

        $list = $container.find(".FormError");
        for (i = 0; i < $list.length; i++)
        {
            item = $list[i];
            key = $.jqext.i18n.findI18nKey(item);
            if (key == null)
            {
                continue;
            }
            keyx = key + ".errmsg";
            if (keyx in containerText)
            {
                val = containerText[keyx];
                $(item).attr("data-errmsg", val);
            }
        }

        $list = $container.find(".FormInput");
        for (i = 0; i < $list.length; i++)
        {
            var itemx = $list[i];
            var item = itemx.children[0];
            key = $.jqext.i18n.findI18nKey(itemx);
            if (key == null)
            {
                continue;
            }
            if (item.tagName == "INPUT")
            {
                keyx = key + ".placeholder";
                if (keyx in containerText)
                {
                    val = containerText[keyx];
                    $(item).attr("placeholder", val);
                }
                keyx = key + ".title";
                if (keyx in containerText)
                {
                    val = containerText[keyx];
                    $(item).attr("title", ($.jqext.html.encode(val)));
                }
            }
            if (item.tagName == "SELECT")
            {
                var $optlist = $(item).find("OPTION");
                for (var j = 0; j < $optlist.length; j++)
                {
                    var $optitem = $($optlist[j]);
                    var optkey = key + ".option." + j.toString();
                    if (optkey in containerText)
                    {
                        val = containerText[optkey];
                        $optitem.html($.jqext.html.encode(val));
                    }
                }
            }
        }

        $list = $container.find(".FormImg");
        for (i = 0; i < $list.length; i++)
        {
            item = $list[i];
            key = $.jqext.i18n.findI18nKey(item);
            if (key == null)
            {
                continue;
            }
            keyx = key + ".alt";
            if (keyx in containerText)
            {
                val = containerText[keyx];
                $(item).attr("alt", val);
                $(item).attr("title", val);
            }
        }
        $list = $container.find(".i18noption");
        for (i = 0; i < $list.length; i++)
        {
            item = $list[i];
            var optionValue = item.getAttribute("value");
            key = $.jqext.i18n.findI18nKey(item);
            if (key == null)
            {
                continue;
            }
            keyx = key + ".option." + optionValue;
            if (keyx in containerText)
            {
                val = containerText[keyx];
                $(item).html(val);
            }
        }
    }
};

// used to translate non-dom elements
$.jqext.i18n.xlate = function (containerId, key)
{
    if ($.jqext.i18n.data !== null)
    {
        return ($.jqext.i18n.data[containerId][key]);
    }
    window.alert("i18n key: " + containerId + "/" + key + " does not exist");
    return ("************");
};


$.jqext.html = {};
$.jqext.html.outer = function (el)
{
    var s = $(el).clone().wrapAll("<div/>").parent().html();
    return (s);
};

$.jqext.html.encode = function (str)
{
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
};

$.jqext.html.decode = function (value)
{
    return $('<div/>').html(value).text();
};

// -- rpc ------------------
$.jqext.restful = {};
$.jqext.restful.url = "/rest.ashx";
$.jqext.restful.authError = null;
$.jqext.restful.seskey = "0";
$.jqext.restful.useEval = true;
$.jqext.restful.usePost = true;
$.jqext.restful.roles = 0;
$.jqext.restful.isCrossOrigin = false;
$.jqext.restful.get = function (resourceName, id, qsObj, success, error)
{
    function internalSuccess(data)
    {
        var dataObj = $.jqext.restful.processResponse(data);
        success(dataObj)
    }
    // Set a default error message if there is none.
    if ((typeof error !== "function") || (error === null))
    {
        error = function (jqXHR, status, errorThrown)
        {
            if (jqXHR.status == 401)
            {
                Global.ShowContainer($("#auth401"));
                return;
            }
            window.alert("There was a problem connecting to the server.");
        }
    }
    var url = $.jqext.restful.url + "/" + resourceName;
    if (id != null)
    {
        url += "/" + id;
    }
    /*
    if ($.jqext.restful.isCrossOrigin)
    {
        url += "?seskey=" + $.jqext.restful.seskey;
    }
    */
    if (qsObj !== null)
    {
        url += "?" + $.jqext.str.obj2qs(qsObj);
    }
    $.ajax(
        {
            beforeSend: function (request)
            {
                request.setRequestHeader("seskey", $.jqext.restful.seskey);
            },
            url: url,
            type: 'GET',
            dataType: 'html',
            cache: false,
            error: error,
            success: internalSuccess,
            statusCode: {
                405: function ()
                {
                    // auth error
                    if($.jqext.restful.authError != null)
                    {
                        $.jqext.restful.authError();
                    }
                }
            }

        });
}

$.jqext.restful.put = function (resourceName, id, parms, success, error)
{
    function internalSuccess(data)
    {
        var dataObj = $.jqext.restful.processResponse(data);
        success(dataObj)
    }
    var url = $.jqext.restful.url + "/" + resourceName + "/" + id;
    if ($.jqext.restful.isCrossOrigin)
    {
        url += "?seskey=" + $.jqext.restful.seskey;
    }

    var parmstxt = JSON.stringify(parms);

    // Set a default error message if there is none.
    if ((typeof error !== "function") || (error === null))
    {
        error = function (jqXHR, status, errorThrown)
        {
            if (jqXHR.status == 401)
            {
                Global.ShowContainer($("#auth401"));
                return;
            }
            window.alert("There was a problem connecting to the server.");
        }
    }
    $.ajax(
        {
            beforeSend: function (request)
            {
                request.setRequestHeader("seskey", $.jqext.restful.seskey);
                if ($.jqext.restful.usePost)
                {
                    request.setRequestHeader("X-HTTP-Method-Override", "PUT");
                }
            },
            url: url,
            type: $.jqext.restful.usePost ? 'POST' : 'PUT',
            dataType: 'html',
            cache: false,
            data: parmstxt,
            error: error,
            success: internalSuccess
        })
}
$.jqext.restful.putMultipart = function (resourceName, id, formdata, success, error)
{
    function internalSuccess(data)
    {
        var dataObj = $.jqext.restful.processResponse(data);
        success(dataObj)
    }
    var url = $.jqext.restful.url + "/" + resourceName + "/" + id;
    if ($.jqext.restful.isCrossOrigin)
    {
        url += "?seskey=" + $.jqext.restful.seskey;
    }

    // Set a default error message if there is none.
    if ((typeof error !== "function") || (error === null))
    {
        error = function (jqXHR, status, errorThrown)
        {
            if (jqXHR.status == 401)
            {
                Global.ShowContainer($("#auth401"));
                return;
            }
            window.alert("There was a problem connecting to the server.");
        }
    }
    $.ajax(
        {
            beforeSend: function (request)
            {
                request.setRequestHeader("seskey", $.jqext.restful.seskey);
                if ($.jqext.restful.usePost)
                {
                    request.setRequestHeader("X-HTTP-Method-Override", "PUT");
                }
            },
            url: url,
            type: $.jqext.restful.usePost ? 'POST' : 'PUT',
            dataType: 'html',
            cache: false,
            data: formdata,
            enctype: 'multipart/form-data',
            processData: false,  // tell jQuery not to process the data
            contentType: false,   // tell jQuery not to set contentType
            error: error,
            success: internalSuccess
        })
}

$.jqext.restful.post = function (resourceName, parms, success, error)
{
    function internalSuccess(data)
    {
        var dataObj = $.jqext.restful.processResponse(data);
        success(dataObj)
    }
    var url = $.jqext.restful.url + "/" + resourceName;
    if ($.jqext.restful.isCrossOrigin)
    {
        url += "?seskey=" + $.jqext.restful.seskey;
    }

    var parmstxt = JSON.stringify(parms);

    // Set a default error message if there is none.
    if ((typeof error !== "function") || (error === null))
    {
        error = function (jqXHR, status, errorThrown)
        {
            if (jqXHR.status == 401)
            {
                Global.ShowContainer($("#auth401"));
                return;
            }
            window.alert("There was a problem connecting to the server.");
        }
    }
    $.ajax(
        {
            beforeSend: function (request)
            {
                request.setRequestHeader("seskey", $.jqext.restful.seskey);
            },
            url: url,
            type: 'POST',
            dataType: 'html',
            cache: false,
            data: parmstxt,
            error: error,
            success: internalSuccess
        })
}
$.jqext.restful.postMultipart = function (resourceName, formdata, success, error)
{
    function internalSuccess(data)
    {
        var dataObj = $.jqext.restful.processResponse(data);
        success(dataObj)
    }
    var url = $.jqext.restful.url + "/" + resourceName;
    if ($.jqext.restful.isCrossOrigin)
    {
        url += "?seskey=" + $.jqext.restful.seskey;
    }

    // Set a default error message if there is none.
    if ((typeof error !== "function") || (error === null))
    {
        error = function (jqXHR, status, errorThrown)
        {
            if (jqXHR.status == 401)
            {
                Global.ShowContainer($("#auth401"));
                return;
            }
            window.alert("There was a problem connecting to the server.");
        }
    }
    $.ajax(
        {
            beforeSend: function (request)
            {
                request.setRequestHeader("seskey", $.jqext.restful.seskey);
            },
            url: url,
            type: 'POST',
            dataType: 'html',
            cache: false,
            data: formdata,
            enctype: 'multipart/form-data',
            processData: false,  // tell jQuery not to process the data
            contentType: false,   // tell jQuery not to set contentType
            error: error,
            success: internalSuccess
        })
}

$.jqext.restful.delete = function (resourceName, id, success, error)
{
    function internalSuccess(data)
    {
        var dataObj = $.jqext.restful.processResponse(data);
        success(dataObj)
    }
    var url = $.jqext.restful.url + "/" + resourceName + "/" + id;
    if ($.jqext.restful.isCrossOrigin)
    {
        url += "?seskey=" + $.jqext.restful.seskey;
    }

    var parmstxt = JSON.stringify(parms);

    // Set a default error message if there is none.
    if ((typeof error !== "function") || (error === null))
    {
        error = function (jqXHR, status, errorThrown)
        {
            if (jqXHR.status == 401)
            {
                Global.ShowContainer($("#auth401"));
                return;
            }
            window.alert("There was a problem connecting to the server.");
        }
    }
    $.ajax(
        {
            beforeSend: function (request)
            {
                request.setRequestHeader("seskey", $.jqext.restful.seskey);
                if ($.jqext.restful.usePost)
                {
                    request.setRequestHeader("X-HTTP-Method-Override", "DELETE");
                }
            },
            url: url,
            type: $.jqext.restful.usePost ? 'POST' : 'DELETE',
            dataType: 'html',
            cache: false,
            data: parmstxt,
            error: error,
            success: internalSuccess
        })
}

$.jqext.restful.send = function (url, method, parms, success, error)
{
    url = url || $.jqext.restful.url;

    var parmstxt = JSON.stringify(parms);

    // Set a default error message if there is none.
    if ((typeof error !== "function") || (error === null))
    {
        error = function (jqXHR, status, errorThrown)
        {
            if (jqXHR.status == 401)
            {
                Global.ShowContainer($("#auth401"));
                return;
            }
            window.alert("There was a problem connecting to the server.");
        }
    }
    $.ajax(
        {
            url: url + "?method=" + method + "&auth=" + $.jqext.restful.auth,
            type: 'post',
            dataType: 'html',
            cache: false,
            data: parmstxt,
            error: error,
            success: success
        })
}

$.jqext.restful.processResponse = function (data)
{
    $("#GlobalWaitSpinner").hide();
    $("#GlobalLoginButton").removeAttr("disabled");
    if ($.jqext.restful.useEval)
    {
        var responseObj = eval("(" + data + ")");
    }
    else
    {
        var responseObj = JSON.parse(data);
    }
    $.jqext.validation.clearerrors($.jqext.data.$detailscontainer);
    if ("******" in responseObj)
    {
        $.jqext.validation.showerrors($.jqext.data.$detailscontainer, responseObj["******"]);
        return (null);
    }
    return (responseObj);
}

// ---- container methods -----------
$.jqext.container = {};

$.jqext.container.findElementByDataId = function (dataId, $Container)
{
    var $list = $.jqext.container.$findElementByDataId(dataId, $Container);
    if ($list.length == 0)
    {
        return (null);
    }
    return ($list[0]);

}
$.jqext.container.$findElementByDataId = function (dataId, $Container)
{
    return ($Container.find("[data-id='" + dataId + "']"));
}

$.jqext.container.$findParentWithDataIdAttribute = function (el)
{
    var id;
    var $el = $(el);
    while (true)
    {
        id = $el.attr("data-id");
        if (id != null)
        {
            return ($el);
        }
        $el = $el.parent();
        if ($el.length === 0)
        {
            return (null);
        }
    }
    return (null);
}


$.jqext.container.reset = function ($container)
{
    var $list = $("[data-default]", $container);
    var len = $list.length;
    for (var i = 0; i < len; i++)
    {
        var el = $list[i];
        var val = el.getAttribute("data-default")
        if (val != null)
        {
            if (val.length > 0)
            {
                if (val[0] === '[')
                {
                    var newval = JSON.parse(val);
                    $.jqext.container.setValue(el, newval);
                    continue;
                }
            }
            $.jqext.container.setValue(el, val);
        }
    }
    return ($container);
}

$.jqext.container.findInputElementById = function ($container, dataId)
{
    var $dataId = $container.find("[data-id=" + dataId + "]");
    if ($dataId.length == 0)
    {
        return (null);
    }
    var $el = $dataId.find(".form-control");
    if ($el.length == 0)
    {
        return (null);
    }
    return ($el[0]);
}
$.jqext.container.bind = function ($container, selector, obj)
{
    // usage: $.jqext.container.setValues($Container, $(".set"), obj)
    var $list = $container.find(selector);
    var len = $list.length;
    for (var i = 0; i < len; i++)
    {
        var el = $list[i];
        var id = $.jqext.i18n.findDataId(el)
        if (id === null)
        {
            continue;
        }
        if (obj.hasOwnProperty(id) === false)
            continue;
        var val = obj[id];
        $.jqext.container.setValue(el, val);
    }
};

$.jqext.container.setValue = function (el, val)
{
    function setOption(el, val)
    {
        for (var i = 0; i < el.length; i++)
        {
            if (el.options[i].value == val)
            {
                el.selectedIndex = i;
                return;
            }
        }

    }
    function setOptionMultiple(el, val)
    {
        for (var i = 0; i < el.length; i++)
        {
            if (el.options[i].value == val)
            {
                el.options[i].selected = true;
                return;
            }
        }

    }
    switch (el.tagName)
    {
        case "INPUT":
            if (el.type == "checkbox")
            {
                el.checked = val;
                return;
            }
            if (el.type == "radio")
            {
                var list = document.getElementsByName(el.name);
                for (var i = 0; i < list.length; i++)
                {
                    if (list[i].value == val)
                    {
                        list[i].checked = true;
                        return;
                    }
                }
                return;
            }
            if (el.type == "datetime-local")
            {
                val = val.substring(0, val.length - 1);     // get rid of the 'Z'
            }
            if (el.type == "date")
            {
                val = val.substring(0, 10);     // make sure only 10 long
            }
            if (el.type == "time")
            {
                val = val.substring(0, 10);     // make sure only 10 long
            }
            el.value = val;
            return;
        case "SELECT":
            if (el.getAttribute("multiple") != null)
            {
                var opts = el, options;
                for (var i = 0; i < opts.length; i++)
                {
                    opts[i].selected = false;
                }
                for (var j = 0; j < val.length; j++)
                {
                    var val1 = val[j];
                    setOptionMultiple(el, val[j])

                }
                return;
            }
            el.selectedIndex = -1;
            setOption(el, val);
            return;
        case "TEXTAREA":
            el.value = val;
            return;
        case "SPAN":
            $(el).html($.jqext.html.encode(val));
            return;
        case "IMG":
            el.src = $(el).attr("data-src") + val + "?_=" + (new Date()).getTime();  // defeat caching
            $(el).attr("value", val);
            return;
    }
};

$.jqext.container.getValues = function ($Container, selector)
{
    // usage: $.jqext.container.getValues($Container, ".get")
    selector = selector || ".get";
    if (typeof ($Container) == "string")
    {
        $Container = $($Container);
    }
    var $getThese = $Container.find(selector);
    var len = $getThese.length;
    var obj = {};
    for (var i = 0; i < len; i++)
    {
        var el = $getThese[i];
        var id = $.jqext.i18n.findDataId(el)
        if (id === null)
        {
            continue;
        }
        if (el.tagName == "TABLE" || el.tagName == "TBODY")
        {
            var tableData = [];
            var $el = $(el);
            var $rows = $el.find("TR");
            var sel = selector + "_table";
            for (var j = 0; j < $rows.length; j++)
            {
                var $row = $($rows[j]);
                var tobj = $.jqext.container.getValues($row, sel);
                if (Object.keys(tobj).length > 0)
                {
                    tableData.push(tobj);
                }
            }
            obj[id] = tableData;
            continue;
        }
        obj[id] = $.jqext.container.getValue(el);
    }
    return (obj);
}

$.jqext.container.getValue = function (el)
{
    switch (el.tagName)
    {
        case "INPUT":
            if (el.type == "checkbox")
                return (el.checked);
            if (el.type == "radio")
            {
                var list = document.getElementsByName(el.name);
                for (var i = 0; i < list.length; i++)
                {
                    if (list[i].checked)
                    {
                        return (list[i].value);
                    }
                }
                return ("0");
            }
            return (el.value);
        case "SELECT":
            if (el.getAttribute("multiple"))
            {
                var mult = [];
                for (var i = 0; i < el.options.length; i++)
                {
                    var opt = el.options[i];
                    if (opt.selected)
                    {
                        mult.push(opt.value);
                    }
                }
                return (mult)
            }
            var sel = el.selectedIndex;
            if (sel == -1) return ("");
            return (el.options[sel].value);
        case "TEXTAREA":
            return (el.value);
        case "SPAN":
            return ($(el).html());
        case "IMG":
            return ($(el).attr("value"));
    }
}

$.jqext.container.$currentPopup = null;
$.jqext.container.popupOpenInContainer = function ($container, $popup, top, left)
{
    var offset = $container.offset();
    $.jqext.container.popupOpen($popup, top - offset.top, left - offset.left);
}
$.jqext.container.popupOpen = function ($popup, top, left)
{
    $.jqext.container.$currentPopup = $popup;
    $popup.css('left', left);
    $popup.css('top', top);
    $popup.show();
}
$.jqext.container.popupClose = function ($popup)
{
    $popup = $popup || $.jqext.container.$currentPopup;
    if ($popup)
    {
        $popup.hide();
    }
}

$.jqext.container.$currentDialog = null;
$.jqext.container.dialogOpenInContainer = function ($dialog, top, left)
{
    var $container = $dialog.closest("DIV");
    var offset = $container.offset();
    $.jqext.container.dialogOpen($dialog, top - offset.top, left - offset.left);
}
$.jqext.container.dialogOpen = function ($dialog, top, left)
{
    $.jqext.container.dialogClose();
    var $bk = $("#jqextdlgbackground");
    if ($bk.length == 0)
    {
        $("BODY").append("<div id='jqextdlgbackground' style ='background-colorx:gray;position:absolute; top:0px; left:0px;display:none;opacity: 0.9;z-index:200'></div>");
        $bk = $("#jqextdlgbackground");
    }
    $bk.height($(document).height());
    $bk.width($(document).width());
    $bk.show();
    $.jqext.container.$currentDialog = $dialog;
    $dialog.css('left', left);
    $dialog.css('top', top);
    $dialog.css('zIndex', "201");
    $dialog.show();
}
$.jqext.container.dialogClose = function ($dialog)
{
    $("#jqextdlgbackground").hide();
    $dialog = $dialog || $.jqext.container.$currentDialog;
    if ($dialog)
    {
        $dialog.hide();
    }
}
$.jqext.container.sizeTableToContainer = function($container, $table)
{
    var containerHeight = $.jqext.str.stripPx($container.css("height"));
    var tableHeight = $.jqext.str.stripPx($table.css("height"));
    var $TRs = $table.find("TR");
    var nrows = $TRs.length;
    var rowHeight = containerHeight / nrows;
    $TRs.css("height", rowHeight.toString() + "px");
    var newTableHeight = $.jqext.str.stripPx($table.css("height"));
    var diff = newTableHeight - tableHeight;
    var delta = diff / nrows;
    var newRowHeight = rowHeight - delta;
    $TRs.css("height", newRowHeight.toString() + "px");
}
$.jqext.container.centerContentInContainerHelper = function($container)
{
    var containerHeight = $.jqext.str.stripPx($container.css("height"));
    var $centeredContent = $container.find(".content");
    var centeredHeight = $.jqext.str.stripPx($centeredContent.css("height"));
    var diff = containerHeight - centeredHeight;
    var delta = diff / 2;
    $container.find(".shim").css("height", delta.toString() + "px");
}
$.jqext.container.centerContentInContainer = function($container)
{
    var $list = $container.find(".centercontent");
    for (var i = 0; i < $list.length; i++)
    {
        $.jqext.container.centerContentInContainerHelper($($list[i]));
    }
}
$.jqext.data = {};
$.jqext.data.$listcontainer = null;
$.jqext.data.$list = null;
$.jqext.data.$detailscontainer = null;
$.jqext.data.name = null;
$.jqext.data.listTemplate = null;
$.jqext.data.listTemplates = {};

$.jqext.data.init = function (objname)
{
    $.jqext.data.listTemplate = $.jqext.data.listTemplates[objname];
    $.jqext.data.name = objname;
    $.jqext.data.$listcontainer = $("#" + objname + "List").jqext({ method: "attachEvents" });
    $.jqext.data.$list = $("#" + objname + "ListTbody");
    $.jqext.data.$detailscontainer = $("#" + objname + "Details").jqext({ method: "attachEvents" });
}

$.jqext.data.getParams = function (obj)
{
    if (obj.hasOwnProperty("currentTarget"))
    {
        // we came in via a jQuery click
        var $c = $(obj.currentTarget);
        var params = $c.attr("data-params");
        var paramsObj = {};
        if (params)
        {
            return(JSON.parse(params));
        }
        else
        {
            var dataId = $c.attr("data-id");
            if(dataId)
            {
                return ({ _id: dataId });
            }
        }
        return (null);
    }
    if (obj instanceof jQuery)
    {
        return (obj[0]);
    }
    // came in as a normal object
    return (obj);
}
$.jqext.data.setFieldsToDisplayInListView = function (objName, fields)
{
    var html = [];
    html.push('<tr data-onclick="$.jqext.data.get" data-id="{{{_id}}}">');
    var len = fields.length;
    for (var i = 0; i < len; i++)
    {
        html.push("<td>{{" + fields[i] + "}}</td>")
    }
    html.push("</tr>");
    $.jqext.data.listTemplates[objName] = html.join("");
}
$.jqext.data.showContainer = function ($container)
{
    if (!($container instanceof jQuery))
    {
        // coming in as event
        var $c = $($container.currentTarget);
        $container = $($c.attr("data-params"));
    }
    $(".FormContainer").hide();
    $container.show();
}
$.jqext.data.setActiveTab = function($el)
{
    var $tabbar = $el.closest(".nav-tabs");
    if ($tabbar.length == 0)
        return;
    $tabbar.find("LI").removeClass("active");
    var $li = $el.closest("LI");
    $li.addClass("active");
}
$.jqext.data.list = function (ev)
{
    function success(dataObj)
    {
        var rows = dataObj;
        if (rows === null)
        {
            return;
        }
        var html = [];
        var _unique = new Date().getTime().toString();
        for (var i = 0; i < rows.length; i++)
        {
            var row = rows[i];
            row["_unique"] = _unique;   // helper to make sure images are always retrieved from server and not from cache
            html.push($.jqext.str.FormatUsingTemplate($.jqext.data.listTemplate, row));

        }   // success
        $.jqext.data.$list.empty().html(html.join("")).jqext({ method: "attachEvents" });
        $.jqext.data.showContainer($.jqext.data.$listcontainer);
    }
    if (ev)
    {
        if (ev.preventDefault)
        {
            // we came in through an event
            $.jqext.data.setActiveTab($(ev.currentTarget));     // set active tab (if any)
            ev.preventDefault();
        }

        var paramsObj = $.jqext.data.getParams(ev);
        if (paramsObj)
        {
            $.jqext.data.init(paramsObj["obj"]);
        }
    }
    var _id = null;
    if (paramsObj.hasOwnProperty("_id"))
    {
        _id = paramsObj["_id"]
    }
    $.jqext.restful.get($.jqext.data.name, _id, null, success);
}
$.jqext.data.reload = function ()
{
    function success(dataObj)
    {
        if (dataObj === null)
        {
            return;
        }
        $.jqext.container.bind($.jqext.data.$detailscontainer, ".set", dataObj);
    }   // success
    $.jqext.validation.clearerrors($.jqext.data.$detailscontainer);
    var params = $.jqext.container.getValues($.jqext.data.$detailscontainer, ".id");
    $.jqext.restful.send(null, $.jqext.data.name, params["_id"], success);

}
$.jqext.data.get = function (ev)
{
    function success(dataObj)
    {
        if (dataObj === null)
        {
            return;
        }
        $.jqext.container.bind($.jqext.data.$detailscontainer, ".set", dataObj);
        $.jqext.data.$detailscontainer.find(".btnadd").hide();
        $.jqext.data.$detailscontainer.find(".btndelete").hide();
        $.jqext.data.$detailscontainer.find(".btnupdate").show();
        $.jqext.data.showContainer($.jqext.data.$detailscontainer);
    }   // success
    var paramsObj = $.jqext.data.getParams(ev);
    $.jqext.container.reset($.jqext.data.$detailscontainer);
    $.jqext.validation.clearerrors($.jqext.data.$detailscontainer)
    $.jqext.restful.get($.jqext.data.name, paramsObj["_id"], null, success);
}

$.jqext.data.delete = function (ev)
{
    var params = $.jqext.container.getValues($.jqext.data.$detailscontainer, ".id");
    var el = $.jqext.container.getElementByDataId("areyousure", $.jqext.data.$detailscontainer).value;
    var areyousure = $(el).text();
    if (window.confirm(areyousure) == false)
    {
        return;
    }
    window.alert("deleting is disabled in this demo");
}
$.jqext.data.add = function (ev)
{
    $.jqext.container.reset($.jqext.data.$detailscontainer);
    $.jqext.validation.clearerrors($.jqext.data.$detailscontainer);
    $.jqext.data.$detailscontainer.find(".btnadd").show();
    $.jqext.data.$detailscontainer.find(".btndelete").hide();
    $.jqext.data.$detailscontainer.find(".btnupdate").hide();
    $.jqext.data.showContainer($.jqext.data.$detailscontainer);
}

$.jqext.data.put = function (ev)
{
    var params;
    function success(dataObj)
    {
        if (params)
        {
            if (params.hasOwnProperty("refresh"))
            {
                params["refresh"] == true;
                var _id = dataObj["_id"];
                $.jqext.data.get({ _id: _id });
                return;
            }
        }
        $.jqext.data.list({ "obj": $.jqext.data.name });
    }   // success
    if (ev.preventDefault)
        ev.preventDefault();
    params = $.jqext.container.getValues($.jqext.data.$detailscontainer, ".get");
    $.jqext.validation.clearerrors($.jqext.data.$detailscontainer);
    var _id = params["_id"];
    delete params["_id"];
    $.jqext.restful.put($.jqext.data.name, _id, params, success);
}
$.jqext.data.putMultipart = function (ev)
{
    var methodParams = null;
    function success(dataObj)
    {
        if (methodParams)
        {
            if (methodParams.hasOwnProperty("refresh"))
            {
                methodParams["refresh"] == true;
                var _id = dataObj["_id"];
                $.jqext.data.get({ _id: _id });
                return;
            }
        }
        $.jqext.data.list({ "obj": $.jqext.data.name });
    }   // success
    if (ev)
    {
        methodParams = $.jqext.data.getParams(ev);
        if (ev.preventDefault)
            ev.preventDefault();
    }
    $.jqext.validation.clearerrors($.jqext.data.$detailscontainer);
    var params = $$($("#" + $.jqext.data.name + "Details"));
    var fd = new FormData(document.getElementById($.jqext.data.name + "DetailsForm"));
    $.jqext.restful.putMultipart($.jqext.data.name, params["_id"], fd, success);
}
$.jqext.data.post = function (ev)
{
    var params;
    function success(dataObj)
    {
        if (params)
        {
            if (params.hasOwnProperty("refresh"))
            {
                params["refresh"] == true;
                var _id = dataObj["_id"];
                $.jqext.data.get({ _id: _id });
                return;
            }
        }
        $.jqext.data.list({ "obj": $.jqext.data.name });
    }   // success
    if (ev.preventDefault)
        ev.preventDefault();
    $.jqext.validation.clearerrors($.jqext.data.$detailscontainer);
    params = $.jqext.container.getValues($.jqext.data.$detailscontainer, ".get");
    delete params["_id"];
    $.jqext.restful.post($.jqext.data.name, params, success);
}
$.jqext.data.postMultipart = function (ev)
{
    var params;
    function success(dataObj)
    {
        $.jqext.data.list({ "obj": $.jqext.data.name });
    }   // success
    if (ev.preventDefault)
        ev.preventDefault();
    $.jqext.validation.clearerrors($.jqext.data.$detailscontainer);
    var params = $$($("#" + $.jqext.data.name + "Details"));
    var fd = new FormData(document.getElementById($.jqext.data.name + "DetailsForm"));
    $.jqext.restful.postMultipart($.jqext.data.name, fd, success); 
}

$.jqext.data.form = {};
$.jqext.data.form.expandingList = {};
$.jqext.data.form.expandingList.images = {};
$.jqext.data.form.expandingList.SetParams = function(paramObj)
{
    $.jqext.data.form.expandingList.images = paramObj;
}
$.jqext.data.form.expandingList.Create = function ($el, data, defs, radiocallback)
{
    var type = radiocallback ? "radio" : "checkbox";
    var html = [];
    html.push('<ul class="FormExpandingList" data-isdirty="false">\r\n')

    var typetemplatewithchildren = '\t<li style="list-style-type:none;" data-isparent="true" data-isopen="false" class="FormExpandingListItem"><img src="' + $.jqext.data.form.expandingList.images["shim"] + '" style="width:' + $.jqext.data.form.expandingList.images["shimleft"] + '" /><img src="' + $.jqext.data.form.expandingList.images["plus"] + '" style="width:12px" /><img src="' + $.jqext.data.form.expandingList.images["shim"] + '" style="width:' + $.jqext.data.form.expandingList.images["shimright"] + '" /><span>{{name}}</span>\r\n\t\t<ul>\r\n';
    var typetemplatewithoutchildren = '\t<li style="list-style-type:none;" class="FormExpandingListItemNoChildren"><input type="' + type + '" value="{{{dataid}}}" /> <span>{{name}}</span></li>\r\n';
    var subtypetemplate = '\t\t\t<li style="list-style-type:none;" class="FormExpandingListSubItem"><input type="' + type + '" value="{{{dataid}}}" data-hasparent="true" />{{name}}</li>\r\n';
    for (var i = 0; i < data.length; i++)
    {
        var typeObj = data[i];
        if (typeObj["subitems"] == null)
        {
            html.push($.jqext.str.FormatUsingTemplate(typetemplatewithoutchildren, { dataid: typeObj["_id"], name: typeObj["item"] }));
            continue;
        }
        html.push($.jqext.str.FormatUsingTemplate(typetemplatewithchildren, { name: typeObj["item"] }));
        var children = typeObj["subitems"];
        for (var j = 0; j < children.length; j++)
        {
            var child = children[j];
            html.push($.jqext.str.FormatUsingTemplate(subtypetemplate, { name: child["subitem"], dataid: typeObj["_id"] + "_" + child["_id"] }));
        }
        html.push('\t\t</ul>\r\n\t</li>\r\n');
    }
    html.push('</ul>')
    var txt = html.join("");
    $el.html(txt);

    // set default values (only for checkboxes)
    var $list = $el.find('INPUT[TYPE="CHECKBOX"]');
    for (var i = 0; i < defs.length; i++)
    {
        var def = defs[i];
        for (j = 0; j < $list.length; j++)
        {
            var $item = $($list[j]);
            if ($item.val() == def)
            {
                $item[0].checked = true;
                var $li = $item.closest(".FormExpandingListItem");
                if ($li.length > 0)
                {
                    var $highlightthis = $li.find("SPAN");
                    $highlightthis.addClass("FormExpandingListItemHasCheckedSubItems");
                }
                break;
            }
        }
    }

    // attach click handlers
    var $list = $el.find($(".FormExpandingListItem"))
    for (var i = 0; i < $list.length; i++)
    {
        var $item = $($list[i]);
        $item.children('ul').css('display', 'none');
        $item.on("click", function ()
        {
            var $this = $(this);
            var $imgs = $this.find("IMG");
            var plusminus = $imgs[1];
            var isopen = $this.attr("data-isopen");
            if (isopen == "true")
            {
                $this.attr("data-isopen", "false");
                plusminus.src = $.jqext.data.form.expandingList.images["plus"];
            }
            else
            {
                $this.attr("data-isopen", "true");
                plusminus.src = $.jqext.data.form.expandingList.images["minus"];
            }

            $(this).children('ul').toggle();
        }
        )
    }
    var $list = $el.find($('INPUT[TYPE="CHECKBOX"]'))
    for (var i = 0; i < $list.length; i++)
    {
        var $item = $($list[i]);
        var $li = $item.closest("LI");
        // hook up event so that if text is clicked, it will also work
        $li.on("click", function (ev)
        {
            ev.stopPropagation();
            var $el = $(this);
            var $inp = $el.find("INPUT");
            var inp = $inp[0];
            inp.checked = !inp.checked;
            var $root = $el.closest(".FormExpandingList");
            $root.attr("data-isdirty", "true");
            if ($el.find("INPUT").attr("data-hasparent"))
            {
                $.jqext.data.form.expandingList.PossiblySetParentInUse($el);
            }
        }
        )
        // hook up event to checkbox
        $item.on("click", function (ev)
        {
            ev.stopPropagation();
            var $el = $(this);
            var $root = $el.closest(".FormExpandingList");
            $root.attr("data-isdirty", "true");
            if ($el.attr("data-hasparent"))
            {
                $.jqext.data.form.expandingList.PossiblySetParentInUse($el);
            }
        }
        )
    }
    var $list = $el.find($('INPUT[TYPE="RADIO"]'));
    for (var i = 0; i < $list.length; i++)
    {
        var $item = $($list[i]);
        var $li = $item.closest("LI");
        $li.on("click", function (ev)
        {

            ev.stopPropagation();
            var $el = $(this);
            var $inp = $el.find("INPUT");
            var inp = $inp[0];
            inp.checked = false;
            radiocallback($el);
        }
        )
        $item.on("click", function (ev)
        {
            ev.stopPropagation();
            var $el = $(this);
            $el[0].checked = false;
            radiocallback($el);
        }
        )
    }
    return (txt);
    // $("#cat999").html(txt);
}
$.jqext.data.form.expandingList.PossiblySetParentInUse = function ($el)
{

    var $parent = $el.closest('[data-isparent="true"]');
    var $highlightthis = $parent.find("SPAN");;
    $highlightthis.removeClass("FormExpandingListItemHasCheckedSubItems");
    var $list = $parent.find(".FormExpandingListSubItem");
    for (var i = 0; i < $list.length; i++)
    {
        var $item = $($list[i]);
        var $inp = $item.find("INPUT");
        if ($inp[0].checked)
        {
            $highlightthis.addClass("FormExpandingListItemHasCheckedSubItems");
            break;
        }
    }
}

$.jqext.data.form.expandingList.IsDirty = function ($el)
{
    var $root = $el.find(".FormExpandingList");
    var is_dirty = $root.attr("data-isdirty");
    return (is_dirty === "true");
}
$.jqext.data.form.expandingList.ClearDirty = function ($el)
{
    var $root = $el.find(".FormExpandingList");
    $root.attr("data-isdirty", "false");
}

$.jqext.data.form.expandingList.GetChecked = function ($el)
{
    var checked = [];
    var $list = $el.find('INPUT[TYPE="CHECKBOX"]');
    for (var i = 0; i < $list.length; i++)
    {
        var item = $list[i];
        if (item.checked)
        {
            checked.push(item.value);
        }
    }
    return (checked);
}

$.jqext.login = {};
$.jqext.login.next = null;
$.jqext.login.init = function (next)
{
    $.jqext.login.next = next;
    function langsuccess(dataObj)
    {
        $.jqext.i18n.setLanguageText(dataObj["text"], $("BODY"))
        $.jqext.data.showContainer($.jqext.data.$detailscontainer);
    }   // langsuccess
    if ($.cookie("lang"))
    {
        $.jqext.restful.get("langtext", $.cookie("lang"), null, langsuccess, null);
        return;
    }
    else
    {
        $.jqext.restful.get("langtext", "fr", null, langsuccess, null);
        return;
    }

    $.jqext.data.showContainer($.jqext.data.$detailscontainer);
}
$.jqext.login.nonspa = function ()
{
    var nonspa = JSON.parse($.cookie("nonspa"));
    $.jqext.restful.seskey = nonspa["seskey"];
    $.jqext.restful.useEval = nonspa["useEval"];
    $.jqext.restful.usePost = nonspa["usePost"];
}
$.jqext.login.loginnonspa = function (credentials, nexturl)
{
    function loginsuccess(dataObj)
    {
        if (dataObj == null)
            return;
        var nonspa = {
            seskey: dataObj["seskey"],
            useEval: dataObj["useEval"],
            usePost: dataObj["usePost"]
        }
        var nonspa_json = JSON.stringify(nonspa);
        $.cookie("nonspa", nonspa_json, { path: "/" });
        location.href = nexturl;
    }
    $.jqext.data.$detailscontainer = $("BODY");
    $("#GlobalWaitSpinner").show();
    $("#GlobalLoginButton").attr("disabled", "disabled");
    $.jqext.restful.post("login", credentials, loginsuccess);

}

$.jqext.login.login = function (next)
{
    function loginsuccess(dataObj)
    {
        if (dataObj == null)
            return;
        var lang = "";
        function langsuccess(dataObj)
        {
            $.jqext.i18n.setLanguageText(dataObj["text"], $("BODY"));
            $.cookie("lang", lang);     // remember language for next time
            $.jqext.login.next();
        }   // langsuccess
        if (dataObj == null)
        {
            return;     // was a validation error
        }
        if (dataObj.hasOwnProperty("seskey") == false)
        {
            // we have a tenant list
            var $sel = $("#authDetailsTenantListSel");
            $sel.empty();
            $.jqext.dom.addToSelect($sel[0], dataObj);
            $("#authDetailsTenantList").show();
            return;
        }
        $.jqext.restful.seskey = dataObj["seskey"];
        $.jqext.restful.useEval = dataObj["useEval"];
        $.jqext.restful.usePost = dataObj["usePost"];
        $.jqext.restful.roles = dataObj["roles"];
        var logininfo = $$($("#authDetails"));
        $$($("#headeremail"), logininfo);
        lang = dataObj["lang"];
        if ($.cookie("lang"))
        {
            if ($.cookie("lang") === lang)
            {
                // we already have the proper language text loaded
                $.jqext.login.next();
                return;
            }
        }
        $.jqext.restful.get("langtext", lang, null, langsuccess, null);
    }   // loginsuccess
    $.jqext.data.$detailscontainer = $("#authDetails");
    var credentials = $.jqext.container.getValues($.jqext.data.$detailscontainer)
    $.jqext.restful.post("login", credentials, loginsuccess);
}
$.jqext.login.loginnolang = function (next)
{
    function loginsuccess(dataObj)
    {
        $("#GlobalWaitSpinner").show();
        $("#GlobalLoginButton").attr("disabled", "disabled");
        if (dataObj == null)
        {
            return;     // was a validation error
        }
        $.jqext.restful.seskey = dataObj["seskey"];
        $.jqext.restful.useEval = dataObj["useEval"];
        $.jqext.restful.usePost = dataObj["usePost"];
        $.jqext.restful.roles = dataObj["roles"];
        next();
    }   // loginsuccess
    $.jqext.data.$detailscontainer = $("#authDetails");
    $("#GlobalWaitSpinner").show();
    $("#GlobalLoginButton").attr("disabled", "disabled");
    var credentials = $.jqext.container.getValues($.jqext.data.$detailscontainer)
    $.jqext.restful.post("login", credentials, loginsuccess);
}

$.jqext.dom.findCenter = function ($el)
{
    console.log($el.attr("id"));
    var $el1 = $el.find(".RoutePointText");
    if ($el1.length > 0)
    {
        $el = $el1;
    }
    var offset = $el.offset();
    var top = offset.top;
    var left = offset.left;
    var height = $el.height();
    var width = $el.width();
    return (
        {
            top: top + height / 2,
            left: left + width / 2
        });
}
$.jqext.line = {};
$.jqext.line.drawPoly = function(className, color, points)
{
    var arr = [];
    var $thisStart = $("#" + points[0]);
    for (var i = 1; i < points.length; i++)
    {
        var $thisEnd = $("#" + points[i]);
        var line = $.jqext.line.drawCenterToCenter(className, color, $thisStart, $thisEnd);
        arr.push(line);
        $thisStart = $thisEnd;
    }
    return(arr);
}

$.jqext.line.drawCenterToCenter = function (className, color, $from, $to)
{
    var start = $.jqext.dom.findCenter($from);
    var end = $.jqext.dom.findCenter($to);
    var line = $.jqext.line.draw(className, color, start.left, start.top, end.left, end.top);
    return (line);
}
$.jqext.line.draw = function (className, color, x1, y1, x2, y2)
{
    if (x2 < x1)
    {
        var temp = x1;
        x1 = x2;
        x2 = temp;
        temp = y1;
        y1 = y2;
        y2 = temp;
    }
    var line = document.createElement("div");
    line.position = "absolute";
    line.className = className;
    line.style.borderColor = color;
    var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    line.style.width = length + "px";

    var angle = Math.atan((y2 - y1) / (x2 - x1));
    line.style.top = y1 + 0.5 * length * Math.sin(angle) + "px";
    line.style.left = x1 - 0.5 * length * (1 - Math.cos(angle)) + "px";
    line.style.transform = "rotate(" + angle + "rad)";
    line.transformOrigin = "top left";
    line.style.top = y1 + "px";
    line.style.left = x1 + "px";
    return (line);
}

$.jqext.lang = {};
$.jqext.lang.load = function (langObj) {
    if (langObj["global"].hasOwnProperty("_dir_")) {
        var dir = langObj["global"]["_dir_"]["text"]["val"];
        $("BODY").attr("dir", dir);
    }
    for (var container in langObj) {
        var thiscontainer = langObj[container];
        var $thiscontainer;
        if (container == "global") {
            $thiscontainer = $("BODY");
        }
        else {
            $thiscontainer = $("#" + container);
        }
        for (var item in thiscontainer) {
            var $thisitem;
            if (container == "global") {
                $thisitem = $thiscontainer.find("[data-i18n=" + item + "]");
            }
            else {
                $thisitem = $thiscontainer.find("[data-id=" + item + "]");
            }
            var thisitem = thiscontainer[item];
            for (var fld in thisitem) {
                var thisfld = thisitem[fld]["val"];
                switch (fld) {
                    case "label":
                        var $lab = $thisitem.find("LABEL");
                        var $spans = $lab.find("SPAN");
                        if ($spans.length > 1) {
                            var $labspan = $($spans[0]);
                            $labspan.html(thisfld);
                            break;
                        }
                        $lab.html(thisfld);
                        break;
                    case "text":
                        $thisitem.html(thisfld);
                        break;
                    case "placeholder":
                        var $inp = $thisitem.find("INPUT");
                        $inp.attr("placeholder", thisfld);
                        break;
                    case "errmsg":
                        var $err = $thisitem.find(".i18nerror");
                        $err.attr("data-errmsg", thisfld);
                        break;
                }
            }
        }
    }
}
$.jqext.lang.gatherfields = function ($wrapper) {
    function processThisDataid(thiscontainer, $el, attr) {
        var dataid = $el.attr(attr);
        thiscontainer[dataid] = {};
        var obj = thiscontainer[dataid];
        if ($el.hasClass("form-group")) {
            // looking for label, input
            var $label = $el.find("LABEL");
            if ($label.length > 0) {
                var $spans = $label.find("SPAN");
                if ($spans.length > 0) {
                    obj["label"] = {};
                    obj["label"]["upd"] = ""
                    obj["label"]["val"] = $($spans[0]).html();
                }
                if ($spans.length > 1) {
                    obj["errmsg"] = {};
                    obj["errmsg"]["upd"] = "";
                    obj["errmsg"]["val"] = $($spans[1]).attr("data-errmsg");
                }
                else {
                    // just text
                    obj["label"] = {};
                    obj["label"]["upd"] = "";
                    obj["label"]["val"] = $label.html();
                }
            }
            var $input = $el.find("INPUT");
            if ($input.length > 0) {
                var $thisinput = $($input[0]);
                var placeholder = $thisinput.attr("placeholder");
                if (placeholder) {
                    obj["placeholder"] = {};
                    obj["placeholder"]["upd"] = "";
                    obj["placeholder"]["val"] = placeholder;
                }
                var title = $thisinput.attr("title");
                if (title) {
                    obj["title"] = {};
                    obj["title"]["upd"] = "";
                    obj["title"]["val"] = title;
                }
            }
            return;
        }
        var innerHtml = $.trim($el.html());
        var tagname = $el[0].tagName;
        switch (tagname) {
            case "SPAN":
                if ($el.hasClass("get") || $el.hasClass("set")) {
                    return;     // not text that needs to be translated
                }
                break;
            case "IMG":
                var alt = $el.attr("alt");
                if (alt) {
                    obj["alt"] = {};
                    obj["alt"]["upd"] = "";
                    obj["alt"]["val"] = alt;
                }
                break;
        }
        if (innerHtml.length > 0) {
            obj["text"] = {};
            obj["text"]["upd"] = "";
            obj["text"]["val"] = innerHtml;
        }
    }
    function processThisContainer($container) {
        var $dataids = $container.find("[data-id]");
        if ($dataids.length == 0) {
            return;
        }
        var id = $container.attr("id");
        containers[id] = {};
        var thiscontainer = containers[id];
        for (var i = 0; i < $dataids.length; i++) {
            processThisDataid(thiscontainer, $($dataids[i]), "data-id");
        }

    }
    var containers = {};
    var $containers = $wrapper.find(".i18ncontainer");
    for (var i = 0; i < $containers.length; i++) {
        processThisContainer($($containers[i]));
    }

    // process the globals
    var $globals = $wrapper.find("[data-i18n]");
    containers["global"] = {};
    var thiscontainer = containers["global"];
    for (var i = 0; i < $globals.length; i++) {
        processThisDataid(thiscontainer, $($globals[i]), "data-i18n");
    }
    return (containers);
}
$.jqext.lang.toHtmlTable = function ($div, containers, thisLang, defaultLang) {
    var html = [];
    html.push("<table>");
    var lastContainer = "";
    for (var container in containers) {
        var thiscontainer = containers[container]
        for (var item in thiscontainer) {
            var thisitem = thiscontainer[item];
            for (var fld in thisitem) {
                var col = "black";
                var defval = "***";
                var defupd = "2015-01-01T00:00:00";
                if (typeof (defaultLang[container]) == "object") {
                    if (typeof (defaultLang[container][item]) == "object") {
                        if (typeof (defaultLang[container][item][fld]) == "object") {
                            defval = defaultLang[container][item][fld]["val"];
                            defupd = defaultLang[container][item][fld]["upd"];
                        }
                    }
                }
                var thisupd = "2000-01-01T00:00:00";
                if (typeof (thisLang[container]) == "object") {
                    if (typeof (thisLang[container][item]) == "object") {
                        if (typeof (thisLang[container][item][fld]) == "object") {
                            thisupd = thisLang[container][item][fld]["upd"];
                        }
                    }
                }
                if (thisupd < defupd)
                {
                    col = "red";
                }
                var txt = '<tr><td>' + container + '.' + item + '.' + fld + '</td><td>&nbsp</td><td data-upd="' + defupd + '" style="color:' + col + '">' + defval + '</td><td>&nbsp</td><td><input type="input" style="width:400px" value="' + thisitem[fld]["val"] + '" data-upd="' + thisupd + '"/></td></tr>';
                html.push(txt);
            }
        }
        $div.html(html.join(""));
    }
    html.push("</table>")
}
$.jqext.lang.updateDefault = function (gatheredFlds, jsFlds) {
    var newflds = {};
    for (var container in gatheredFlds)
    {
        newflds[container] = {};
        var thiscontainer = gatheredFlds[container];
        for (var item in thiscontainer)
        {
            newflds[container][item] = {};
            var thisitem = thiscontainer[item];
            for (var fld in thisitem)
            {
                newflds[container][item][fld] = {};
                // set the update time to now, if the field exists in jsFlds and its value has not changed, then use the date from jsFlds
                newflds[container][item][fld]["upd"] = $.jqext.str.UTCDateString(new Date());
                newflds[container][item][fld]["val"] = thisitem[fld]["val"];
                if(typeof(jsFlds[container]) == "object")
                {
                    if (typeof (jsFlds[container][item]) == "object") {
                        if (typeof (jsFlds[container][item][fld]) == "object") {
                            if (newflds[container][item][fld]["val"] == jsFlds[container][item][fld]["val"])
                            {
                                newflds[container][item][fld]["upd"] = jsFlds[container][item][fld]["upd"];
                            }
                        }

                    }

                }
            }
        }
    }
    return (newflds);
}

$.jqext.lang.generatelangobj = function ($div) {
    var langObj = {};
    var $tbody = $div.find("TBODY");
    var $trs = $tbody.find("TR")
    for (var i = 0; i < $trs.length; i++) {
        var row = $trs[i];
        var $tds = $(row).find("TD");
        var name = $($tds[0]).text();
        var $obj = $($tds[4]).find("INPUT");
        var val = $obj.val();
        var upd = $obj.attr("data-upd");
        var nameparts = name.split(".");
        if (langObj.hasOwnProperty(nameparts[0]) == false)
        {
            langObj[nameparts[0]] = {};
        }
        if (langObj[nameparts[0]].hasOwnProperty(nameparts[1]) == false) {
            langObj[nameparts[0]][nameparts[1]] = {};
        }
        if (langObj[nameparts[0]][nameparts[1]].hasOwnProperty(nameparts[2]) == false) {
            langObj[nameparts[0]][nameparts[1]][nameparts[2]] = {};
        }
        var obj = langObj[nameparts[0]][nameparts[1]][nameparts[2]];
        obj["upd"] = upd;
        obj["val"] = val;
    }
    return (langObj);
    var json = JSON.stringify(langObj, null, 4);
    var txt = '????["' + langObj["global"]["_lang_"]["text"] + '"] =\r\n' + json + "\r\n;";
    return (txt);
}


$.jqext.array = {};
$.jqext.array.remove = function(arr, val)
{
    var i = arr.indexOf(val);
    if(i != -1)
    {
        arr.splice(i, 1);
        return (true);
    }
    return (false);
}
$.jqext.array.removeAt = function (arr, index)
{
    arr.splice(index, 1);
}

$.jqext.util = {};
$.jqext.util.ScaleImage = function (srcwidth, srcheight, targetwidth, targetheight, fLetterBox)
{
    // http://selbie.wordpress.com/2011/01/23/scale-crop-and-center-an-image-with-correct-aspect-ratio-in-html-and-javascript/

    var result = { width: 0, height: 0, fScaleToTargetWidth: true };

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0))
    {
        return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth)
    {
        fScaleOnWidth = fLetterBox;
    } else
    {
        fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth)
    {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    } else
    {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
};

function ISODate(s)
{
    return (s);
}
function NumberLong(n)
{
    return (n);
}
function ObjectId(n)
{
    return (n);
}

function $$($container, obj)
{
    if (typeof (obj) == "undefined")
    {
        return ($.jqext.container.getValues($container, ".get"));
    }
    $.jqext.container.bind($container, ".set", obj);
}
function $$$(dataId, $container)
{
    return ($.jqext.container.$findElementByDataId(dataId, $container));
}

