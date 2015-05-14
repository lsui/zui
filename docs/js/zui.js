/*!
 * ZUI - v1.3.0 - 2015-04-20
 * http://zui.sexy
 * GitHub: https://github.com/easysoft/zui.git 
 * Copyright (c) 2015 cnezsoft.com; Licensed MIT
 */

/* Some code copy from Bootstrap v3.0.0 by @fat and @mdo. (Copyright 2013 Twitter, Inc. Licensed under http://www.apache.org/licenses/)*/

/* ========================================================================
 * ZUI: jquery.extensions.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($, window, Math)
{
    'use strict';

    /* Check jquery */
    if(typeof($) === 'undefined')
    {
      throw new Error('ZUI requires jQuery');
    }

    $.extend(
    {
        uuid: function()
        {
            var d = (new Date()).getTime();
            while (d < 10000000000000000)
            {
                d *= 10;
            }
            return d + Math.floor(Math.random() * 9999);
        },

        getPropertyCount: function(obj)
        {
            if (typeof(obj) !== 'object' || obj === null) return 0;
            return Object.getOwnPropertyNames(obj).length;
        },

        callEvent: function(func, event, proxy)
        {
            if ($.isFunction(func))
            {
                if (typeof proxy != 'undefined')
                {
                    func = $.proxy(func, proxy);
                }
                var result = func(event);
                if(event) event.result = result;
                return !(result !== undefined && (!result));
            }
            return 1;
        },

        clientLang: function()
        {
            var lang;
            if (typeof(window.config) != 'undefined' && window.config.clientLang)
            {
                lang = window.config.clientLang;
            }
            else
            {
                var hl = $('html').attr('lang');
                lang = hl ? hl : (navigator.userLanguage || navigator.userLanguage || 'zh_cn');
            }
            return lang.replace('-', '_').toLowerCase();
        }
    });

    $.fn.callEvent = function(name, event, model)
    {
        var $this = $(this);
        var dotIndex = name.indexOf('.zui.');
        var shortName = name;
        if (dotIndex < 0 && model && model.name)
        {
            name += '.' + model.name;
        }
        else
        {
            shortName = name.substring(0, dotIndex);
        }
        var e = $.Event(name, event);

        // var result = $this.trigger(e);

        if ((typeof model === 'undefined') && dotIndex > 0)
        {
            model = $this.data(name.substring(dotIndex + 1));
        }

        if (model && model.options)
        {
            var func = model.options[shortName];
            if ($.isFunction(func))
            {
                $.callEvent(model.options[shortName], e, model);
            }
        }
        return e;
    };
}(jQuery, window, Math));

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+ function($){
    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert = function(el)
    {
        $(el).on('click', dismiss, this.close)
    }

    Alert.prototype.close = function(e)
    {
        var $this = $(this)
        var selector = $this.attr('data-target')

        if (!selector)
        {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector)

        if (e) e.preventDefault()

        if (!$parent.length)
        {
            $parent = $this.hasClass('alert') ? $this : $this.parent()
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement()
        {
            $parent.trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
            .one($.support.transition.end, removeElement)
            .emulateTransitionEnd(150) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    var old = $.fn.alert

    $.fn.alert = function(option)
    {
        return this.each(function()
        {
            var $this = $(this)
            var data = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function()
    {
        $.fn.alert = old
        return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { 'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.2.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+ function($){
    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function(element, options)
    {
        this.$element = $(element)
        this.options = $.extend(
        {}, Collapse.DEFAULTS, options)
        this.transitioning = null

        if (this.options.parent) this.$parent = $(this.options.parent)
        if (this.options.toggle) this.toggle()
    }

    Collapse.DEFAULTS = {
        toggle: true
    }

    Collapse.prototype.dimension = function()
    {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function()
    {
        if (this.transitioning || this.$element.hasClass('in')) return

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var actives = this.$parent && this.$parent.find('> .panel > .in')

        if (actives && actives.length)
        {
            var hasData = actives.data('bs.collapse')
            if (hasData && hasData.transitioning) return
            actives.collapse('hide')
            hasData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')[dimension](0)

        this.transitioning = 1

        var complete = function()
        {
            this.$element
                .removeClass('collapsing')
                .addClass('in')[dimension]('auto')
            this.transitioning = 0
            this.$element.trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one($.support.transition.end, $.proxy(complete, this))
            .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function()
    {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse')
            .removeClass('in')

        this.transitioning = 1

        var complete = function()
        {
            this.transitioning = 0
            this.$element
                .trigger('hidden.bs.collapse')
                .removeClass('collapsing')
                .addClass('collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element[dimension](0)
            .one($.support.transition.end, $.proxy(complete, this))
            .emulateTransitionEnd(350)
    }

    Collapse.prototype.toggle = function()
    {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    var old = $.fn.collapse

    $.fn.collapse = function(option)
    {
        return this.each(function()
        {
            var $this = $(this)
            var data = $this.data('bs.collapse')
            var options = $.extend(
            {}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function()
    {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function(e)
    {
        var $this = $(this),
            href
        var target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        var $target = $(target)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $this.data()
        var parent = $this.attr('data-parent')
        var $parent = parent && $(parent)

        if (!data || !data.transitioning)
        {
            if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
            $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
        }

        $target.collapse(option)
    })

}(window.jQuery);

/* ========================================================================
 * ZUI: device.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function(window, $)
{
    'use strict';
    var desktopLg = 1200,
        desktop = 992,
        tablet = 768,
        cssNames = {
            desktop: 'screen-desktop',
            desktopLg: 'screen-desktop-wide',
            tablet: 'screen-tablet',
            phone: 'screen-phone',
            isMobile: 'device-mobile',
            isDesktop: 'device-desktop'
        };

    var $window = $(window);

    var resetCssClass = function()
    {
        var width = $window.width();
        $('html').toggleClass(cssNames.desktop, width >= desktop && width < desktopLg)
            .toggleClass(cssNames.desktopLg, width >= desktopLg)
            .toggleClass(cssNames.tablet, width >= tablet && width < desktop)
            .toggleClass(cssNames.phone, width < tablet)
            .toggleClass(cssNames.isMobile, width < desktop)
            .toggleClass(cssNames.isDesktop, width >= desktop);
    };

    $window.resize(resetCssClass);
    resetCssClass();
}(window, jQuery));

/* ========================================================================
 * ZUI: browser.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($)
{
    'use strict';
    var browseHappyTip = {
        'zh_cn': '您的浏览器版本过低，无法体验所有功能，建议升级或者更换浏览器。 <a href="http://browsehappy.com/" target="_blank" class="alert-link">了解更多...</a>',
        'zh_tw': '您的瀏覽器版本過低，無法體驗所有功能，建議升級或者更换瀏覽器。<a href="http://browsehappy.com/" target="_blank" class="alert-link">了解更多...</a>',
        'en': 'Your browser is too old, it has been unable to experience the colorful internet. We strongly recommend that you upgrade a better one. <a href="http://browsehappy.com/" target="_blank" class="alert-link">Learn more...</a>'
    };

    // The browser modal class
    var Browser = function()
    {
        var isIE = this.isIE;
        var ie = isIE();
        if (ie)
        {
            for (var i = 10; i > 5; i--)
            {
                if (isIE(i))
                {
                    ie = i;
                    break;
                }
            }
        }

        this.ie = ie;

        this.cssHelper();
    };

    // Append CSS class to html tag
    Browser.prototype.cssHelper = function()
    {
        var ie = this.ie,
            $html = $('html');
        $html.toggleClass('ie', ie)
            .removeClass('ie-6 ie-7 ie-8 ie-9 ie-10');
        if (ie)
        {
            $html.addClass('ie-' + ie)
                .toggleClass('gt-ie-7 gte-ie-8 support-ie', ie >= 8)
                .toggleClass('lte-ie-7 lt-ie-8 outdated-ie', ie < 8)
                .toggleClass('gt-ie-8 gte-ie-9', ie >= 9)
                .toggleClass('lte-ie-8 lt-ie-9', ie < 9)
                .toggleClass('gt-ie-9 gte-ie-10', ie >= 10)
                .toggleClass('lte-ie-9 lt-ie-10', ie < 10);
        }
    };

    // Show browse happy tip
    Browser.prototype.tip = function()
    {
        if (this.ie && this.ie < 8)
        {
            var $browseHappy = $('#browseHappyTip');
            if (!$browseHappy.length)
            {
                $browseHappy = $('<div id="browseHappyTip" class="alert alert-dismissable alert-danger alert-block" style="position: relative; z-index: 99999"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><div class="container"><div class="content text-center"></div></div></div>');
                $browseHappy.prependTo('body');
            }

            $browseHappy.find('.content').html(this.browseHappyTip || browseHappyTip[$.clientLang() || 'zh_cn']);
        }
    };

    // Detect it is IE, can given a version
    Browser.prototype.isIE = function(version)
    {
        // var ie = /*@cc_on !@*/false;
        var b = document.createElement('b');
        b.innerHTML = '<!--[if IE ' + (version || '') + ']><i></i><![endif]-->';
        return b.getElementsByTagName('i').length === 1;
    };

    // Detect ie 10 with hack
    Browser.prototype.isIE10 = function()
    {
        return ( /*@cc_on!@*/ false);
    };

    $.browser = new Browser();

    $(function()
    {
        if (!$('body').hasClass('disabled-browser-tip'))
        {
            $.browser.tip();
        }
    });
}(jQuery));

/* ========================================================================
 * ZUI: date.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function()
{
    'use strict';

    /**
     * Ticks of a whole day
     * @type {number}
     */
    Date.ONEDAY_TICKS = 24 * 3600 * 1000;

    /**
     * Format date to a string
     *
     * @param  string   format
     * @return string
     */
    Date.prototype.format = function(format)
    {
        var date = {
            'M+': this.getMonth() + 1,
            'd+': this.getDate(),
            'h+': this.getHours(),
            'm+': this.getMinutes(),
            's+': this.getSeconds(),
            'q+': Math.floor((this.getMonth() + 3) / 3),
            'S+': this.getMilliseconds()
        };
        if (/(y+)/i.test(format))
        {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date)
        {
            if (new RegExp('(' + k + ')').test(format))
            {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
            }
        }
        return format;
    };

    // /**
    //  * Descript date with friendly way
    //  * @return {string}
    //  */
    // Date.prototype.friendlyStr = function()
    // {
    //     var date    = this,
    //         curDate = new Date(),
    //         year    = date.getFullYear(),
    //         month   = date.getMonth() + 10,
    //         day     = date.getDate(),
    //         hour    = date.getHours(),
    //         minute  = date.getMinutes(),
    //         curYear = curDate.getFullYear(),
    //         curHour = curDate.getHours(),
    //         timeStr;

    //     if(year < curYear)
    //     {
    //         timeStr = year +'年'+ month +'月'+ day +'日 '+ hour +':'+ minute;
    //     }
    //     else
    //     {
    //         var pastTime = curDate - date,
    //             pastH = pastTime/3600000;

    //         if(pastH > curHour)
    //         {
    //             timeStr = month +'月'+ day +'日 '+ hour +':'+ minute;
    //         }
    //         else if(pastH >= 1)
    //         {
    //             timeStr = '今天 ' + hour +':'+ minute +'分';
    //         }
    //         else
    //         {
    //               var pastM = curDate.getMinutes() - minute;
    //               if(pastM > 1)
    //               {
    //                   timeStr = pastM +'分钟前';
    //               }
    //               else
    //               {
    //                   timeStr = '刚刚';
    //               }
    //         }
    //     }
    //     return timeStr;
    // };

    /**
     * Add milliseconds to the date
     * @param {number} value
     */
    Date.prototype.addMilliseconds = function(value)
    {
        this.setTime(this.getTime() + value);
        return this;
    };

    /**
     * Add days to the date
     * @param {number} days
     */
    Date.prototype.addDays = function(days)
    {
        this.addMilliseconds(days * Date.ONEDAY_TICKS);
        return this;
    };

    /**
     * Clone a new date instane from the date
     * @return {Date}
     */
    Date.prototype.clone = function()
    {
        var date = new Date();
        date.setTime(this.getTime());
        return date;
    };

    /**
     * Judge the year is in a leap year
     * @param  {integer}  year
     * @return {Boolean}
     */
    Date.isLeapYear = function(year)
    {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    };

    /**
     * Get days number of the date
     * @param  {integer} year
     * @param  {integer} month
     * @return {integer}
     */
    Date.getDaysInMonth = function(year, month)
    {
        return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };

    /**
     * Judge the date is in a leap year
     * @return {Boolean}
     */
    Date.prototype.isLeapYear = function()
    {
        return Date.isLeapYear(this.getFullYear());
    };

    /**
     * Clear time part of the date
     * @return {date}
     */
    Date.prototype.clearTime = function()
    {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this;
    };

    /**
     * Get days of this month of the date
     * @return {integer}
     */
    Date.prototype.getDaysInMonth = function()
    {
        return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
    };

    /**
     * Add months to the date
     * @param {date} value
     */
    Date.prototype.addMonths = function(value)
    {
        var n = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + value);
        this.setDate(Math.min(n, this.getDaysInMonth()));
        return this;
    };

    /**
     * Get last week day of the date
     * @param  {integer} day
     * @return {date}
     */
    Date.prototype.getLastWeekday = function(day)
    {
        day = day || 1;

        var d = this.clone();
        while (d.getDay() != day)
        {
            d.addDays(-1);
        }
        d.clearTime();
        return d;
    };

    /**
     * Judge the date is same day as another date
     * @param  {date}  date
     * @return {Boolean}
     */
    Date.prototype.isSameDay = function(date)
    {
        return date.toDateString() === this.toDateString();
    };

    /**
     * Judge the date is in same week as another date
     * @param  {date}  date
     * @return {Boolean}
     */
    Date.prototype.isSameWeek = function(date)
    {
        var weekStart = this.getLastWeekday();
        var weekEnd = weekStart.clone().addDays(7);
        return date >= weekStart && date < weekEnd;
    };

    /**
     * Judge the date is in same year as another date
     * @param  {date}  date
     * @return {Boolean}
     */
    Date.prototype.isSameYear = function(date)
    {
        return this.getFullYear() === date.getFullYear();
    };
}());

/* ========================================================================
 * ZUI: string.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function()
{
    'use strict';

    String.prototype.format = function(args)
    {
        var result = this;
        if (arguments.length > 0)
        {
            var reg;
            if (arguments.length == 1 && typeof(args) == "object")
            {
                for (var key in args)
                {
                    if (args[key] !== undefined)
                    {
                        reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else
            {
                for (var i = 0; i < arguments.length; i++)
                {
                    if (arguments[i] !== undefined)
                    {
                        reg = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    };


    /**
     * Judge the string is a integer number
     *
     * @access public
     * @return bool
     */
    String.prototype.isNum = function(s)
    {
        if (s !== null)
        {
            var r, re;
            re = /\d*/i;
            r = s.match(re);
            return (r == s) ? true : false;
        }
        return false;
    };
})();

/*!
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery resize event
//
// *Version: 1.1, Last updated: 3/14/2010*
//
// Project Home - http://benalman.com/projects/jquery-resize-plugin/
// GitHub       - http://github.com/cowboy/jquery-resize/
// Source       - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.js
// (Minified)   - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.min.js (1.0kb)
//
// About: License
//
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
//
// About: Examples
//
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
//
// resize event - http://benalman.com/code/projects/jquery-resize/examples/resize/
//
// About: Support and Testing
//
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
//
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-resize/unit/
//
// About: Release History
//
// 1.1 - (3/14/2010) Fixed a minor bug that was causing the event to trigger
//       immediately after bind in some circumstances. Also changed $.fn.data
//       to $.data to improve performance.
// 1.0 - (2/10/2010) Initial release

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.

  // A jQuery object containing all non-window elements to which the resize
  // event is bound.
  var elems = $([]),

    // Extend $.resize if it already exists, otherwise create it.
    jq_resize = $.resize = $.extend( $.resize, {} ),

    timeout_id,

    // Reused strings.
    str_setTimeout = 'setTimeout',
    str_resize = 'resize',
    str_data = str_resize + '-special-event',
    str_delay = 'delay',
    str_throttle = 'throttleWindow';

  // Property: jQuery.resize.delay
  //
  // The numeric interval (in milliseconds) at which the resize event polling
  // loop executes. Defaults to 250.

  jq_resize[ str_delay ] = 250;

  // Property: jQuery.resize.throttleWindow
  //
  // Throttle the native window object resize event to fire no more than once
  // every <jQuery.resize.delay> milliseconds. Defaults to true.
  //
  // Because the window object has its own resize event, it doesn't need to be
  // provided by this plugin, and its execution can be left entirely up to the
  // browser. However, since certain browsers fire the resize event continuously
  // while others do not, enabling this will throttle the window resize event,
  // making event behavior consistent across all elements in all browsers.
  //
  // While setting this property to false will disable window object resize
  // event throttling, please note that this property must be changed before any
  // window object resize event callbacks are bound.

  jq_resize[ str_throttle ] = true;

  // Event: resize event
  //
  // Fired when an element's width or height changes. Because browsers only
  // provide this event for the window element, for other elements a polling
  // loop is initialized, running every <jQuery.resize.delay> milliseconds
  // to see if elements' dimensions have changed. You may bind with either
  // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
  //
  // Usage:
  //
  // > jQuery('selector').bind( 'resize', function(e) {
  // >   // element's width or height has changed!
  // >   ...
  // > });
  //
  // Additional Notes:
  //
  // * The polling loop is not created until at least one callback is actually
  //   bound to the 'resize' event, and this single polling loop is shared
  //   across all elements.
  //
  // Double firing issue in jQuery 1.3.2:
  //
  // While this plugin works in jQuery 1.3.2, if an element's event callbacks
  // are manually triggered via .trigger( 'resize' ) or .resize() those
  // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
  // events system. This is not an issue when using jQuery 1.4+.
  //
  // > // While this works in jQuery 1.4+
  // > $(elem).css({ width: new_w, height: new_h }).resize();
  // >
  // > // In jQuery 1.3.2, you need to do this:
  // > var elem = $(elem);
  // > elem.css({ width: new_w, height: new_h });
  // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
  // > elem.resize();

  $.event.special[ str_resize ] = {

    // Called only when the first 'resize' event callback is bound per element.
    setup: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will bind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

      var elem = $(this);

      // Add this element to the list of internal elements to monitor.
      elems = elems.add( elem );

      // Initialize data store on the element.
      $.data( this, str_data, { w: elem.width(), h: elem.height() } );

      // If this is the first element added, start the polling loop.
      if ( elems.length === 1 ) {
        loopy();
      }
    },

    // Called only when the last 'resize' event callback is unbound per element.
    teardown: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will unbind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

      var elem = $(this);

      // Remove this element from the list of internal elements to monitor.
      elems = elems.not( elem );

      // Remove any data stored on the element.
      elem.removeData( str_data );

      // If this is the last element removed, stop the polling loop.
      if ( !elems.length ) {
        clearTimeout( timeout_id );
      }
    },

    // Called every time a 'resize' event callback is bound per element (new in
    // jQuery 1.4).
    add: function( handleObj ) {
      // Since window has its own native 'resize' event, return false so that
      // jQuery doesn't modify the event object. Unless, of course, we're
      // throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

      var old_handler;

      // The new_handler function is executed every time the event is triggered.
      // This is used to update the internal element data store with the width
      // and height when the event is triggered manually, to avoid double-firing
      // of the event callback. See the "Double firing issue in jQuery 1.3.2"
      // comments above for more information.

      function new_handler( e, w, h ) {
        var elem = $(this),
          data = $.data( this, str_data ) || {};

        // If called from the polling loop, w and h will be passed in as
        // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
        // those values will need to be computed.
        data.w = w !== undefined ? w : elem.width();
        data.h = h !== undefined ? h : elem.height();

        old_handler.apply( this, arguments );
      };

      // This may seem a little complicated, but it normalizes the special event
      // .add method between jQuery 1.4/1.4.1 and 1.4.2+
      if ( $.isFunction( handleObj ) ) {
        // 1.4, 1.4.1
        old_handler = handleObj;
        return new_handler;
      } else {
        // 1.4.2+
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
    }

  };

  function loopy() {

    // Start the polling loop, asynchronously.
    timeout_id = window[ str_setTimeout ](function(){

      // Iterate over all elements to which the 'resize' event is bound.
      elems.each(function(){
        var elem = $(this),
          width = elem.width(),
          height = elem.height(),
          data = $.data( this, str_data );

        // If element size has changed since the last time, update the element
        // data store and trigger the 'resize' event.
        if ( width !== data.w || height !== data.h ) {
          elem.trigger( str_resize, [ data.w = width, data.h = height ] );
        }

      });

      // Loop.
      loopy();

    }, jq_resize[ str_delay ] );

  };

})(jQuery,this);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.3
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    if(!this.selector) this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * ZUI: storeb.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function(window, $)
{
    'use strict';

    var lsName = 'localStorage';
    var storage = window[lsName],
        old = window.store,
        pageName = 'page_' + window.location.pathname + window.location.search;

    /* The Store object */
    var Store = function()
    {
        this.slience = true;
        this.enable = (lsName in window) && window[lsName] && window[lsName].setItem;
        this.storage = storage;

        this.page = this.get(pageName,
        {});
    };

    /* Save page data */
    Store.prototype.pageSave = function()
    {
        if ($.isEmptyObject(this.page))
        {
            this.remove(pageName);
        }
        else
        {
            var forDeletes = [], i;
            for (i in this.page)
            {
                var val = this.page[i];
                if (val === null)
                    forDeletes.push(i);
            }
            for (i = forDeletes.length - 1; i >= 0; i--)
            {
                delete this.page[forDeletes[i]];
            }
            this.set(pageName, this.page);
        }
    };

    /* Remove page data item */
    Store.prototype.pageRemove = function(key)
    {
        if (typeof this.page[key] != 'undefined')
        {
            this.page[key] = null;
            this.pageSave();
        }
    };

    /* Clear page data */
    Store.prototype.pageClear = function()
    {
        this.page = {};
        this.pageSave();
    };

    /* Get page data */
    Store.prototype.pageGet = function(key, defaultValue)
    {
        var val = this.page[key];
        return (defaultValue !== undefined && (val === null || val === undefined)) ? defaultValue : val;
    };

    /* Set page data */
    Store.prototype.pageSet = function(objOrKey, val)
    {
        if ($.isPlainObject(objOrKey))
        {
            $.extend(true, this.page, objOrKey);
        }
        else
        {
            this.page[this.serialize(objOrKey)] = val;
        }
        this.pageSave();
    };

    /* Check enable status */
    Store.prototype.check = function()
    {
        if (!this.enable)
        {
            if (!this.slience) throw new Error('Browser not support localStorage or enable status been set true.');
        }
        return this.enable;
    };

    /* Get length */
    Store.prototype.length = function()
    {
        if (this.check())
        {
            return storage.getLength ? storage.getLength() : storage.length;
        }
        return 0;
    };

    /* Remove item with browser localstorage native method */
    Store.prototype.removeItem = function(key)
    {
        storage.removeItem(key);
        return this;
    };

    /* Remove item with browser localstorage native method, same as removeItem */
    Store.prototype.remove = function(key)
    {
        return this.removeItem(key);
    };

    /* Get item value with browser localstorage native method, and without deserialize */
    Store.prototype.getItem = function(key)
    {
        return storage.getItem(key);
    };

    /* Get item value and deserialize it, if value is null and defaultValue been given then return defaultValue */
    Store.prototype.get = function(key, defaultValue)
    {
        var val = this.deserialize(this.getItem(key));
        if(typeof val === 'undefined' || val === null) {
            if(typeof defaultValue !== 'undefined') {
                return defaultValue;
            }
        }
        return val;
    };

    /* Get item key by index and deserialize it */
    Store.prototype.key = function(index)
    {
        return storage.key(index);
    };

    /* Set item value with browser localstorage native method, and without serialize filter */
    Store.prototype.setItem = function(key, val)
    {
        storage.setItem(key, val);
        return this;
    };

    /* Set item value, serialize it if the given value is not an string */
    Store.prototype.set = function(key, val)
    {
        if (val === undefined) return this.remove(key);
        this.setItem(key, this.serialize(val));
        return this;
    };

    /* Clear all items with browser localstorage native method */
    Store.prototype.clear = function()
    {
        storage.clear();
        return this;
    };

    /* Iterate all items with callback */
    Store.prototype.forEach = function(callback)
    {
        for (var i = storage.length - 1; i >= 0; i--)
        {
            var key = storage.key(i);
            callback(key, this.get(key));
        }
        return this;
    };

    /* Get all items and set value in an object. */
    Store.prototype.getAll = function()
    {
        var all = {};
        this.forEach(function(key, val)
        {
            all[key] = val;
        });

        return all;
    };

    /* Serialize value with JSON.stringify */
    Store.prototype.serialize = function(value)
    {
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
    };

    /* Deserialize value, with JSON.parse if the given value is not a string */
    Store.prototype.deserialize = function(value)
    {
        if (typeof value !== 'string') return undefined;
        try
        {
            return JSON.parse(value);
        }
        catch (e)
        {
            return value || undefined;
        }
    };

    var store = new Store();

    $.store = store;
    window.store = store;

    window.store.noConflict = function()
    {
        window.store = old;
        return store;
    };
}(window, jQuery));

/* ========================================================================
 * ZUI: draggable.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($)
{
    'use strict';

    var Draggable = function(element, options)
    {
        this.$ = $(element);
        this.options = this.getOptions(options);

        this.init();
    };

    Draggable.DEFAULTS = {
        container: 'body',
        move: true
    };

    Draggable.prototype.getOptions = function(options)
    {
        options = $.extend(
        {}, Draggable.DEFAULTS, this.$.data(), options);
        return options;
    };

    Draggable.prototype.init = function()
    {
        this.handleMouseEvents();
    };

    Draggable.prototype.handleMouseEvents = function()
    {
        var $e = this.$,
            BEFORE = 'before',
            DRAG = 'drag',
            FINISH = 'finish',
            setting = this.options;

        $e.mousedown(function(event)
        {
            if (setting.hasOwnProperty(BEFORE) && $.isFunction(setting[BEFORE]))
            {
                var isSure = setting[BEFORE](
                {
                    event: event,
                    element: $e
                });
                if (isSure !== undefined && (!isSure)) return;
            }

            var $container = $(setting.container),
                pos = $e.offset();
            var cPos = $container.offset(),
                startPos = {
                    x: event.pageX,
                    y: event.pageY
                },
                startOffset = {
                    x: event.pageX - pos.left + cPos.left,
                    y: event.pageY - pos.top + cPos.top
                };
            var mousePos = $.extend(
            {}, startPos);
            var moved = false;

            $e.addClass('drag-ready');
            $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
            event.preventDefault();
            if (setting.stopPropagation)
            {
                event.stopPropagation();
            }

            function mouseMove(event)
            {
                moved = true;
                var mX = event.pageX,
                    mY = event.pageY;
                var dragPos = {
                    left: mX - startOffset.x,
                    top: mY - startOffset.y
                };

                $e.removeClass('drag-ready').addClass('dragging');
                if (setting.move)
                {
                    $e.css(dragPos);
                }

                if (setting.hasOwnProperty(DRAG) && $.isFunction(setting[DRAG]))
                {
                    setting[DRAG](
                    {
                        event: event,
                        element: $e,
                        startOffset: startOffset,
                        pos: dragPos,
                        offset:
                        {
                            x: mX - startPos.x,
                            y: mY - startPos.y
                        },
                        smallOffset:
                        {
                            x: mX - mousePos.x,
                            y: mY - mousePos.y
                        }
                    });
                }
                mousePos.x = mX;
                mousePos.y = mY;

                if (setting.stopPropagation)
                {
                    event.stopPropagation();
                }
            }

            function mouseUp(event)
            {
                $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
                if (!moved)
                {
                    $e.removeClass('drag-ready');
                    return;
                }
                var endPos = {
                    left: event.pageX - startOffset.x,
                    top: event.pageY - startOffset.y
                };
                $e.removeClass('drag-ready').removeClass('dragging');
                if (setting.move)
                {
                    $e.css(endPos);
                }

                if (setting.hasOwnProperty(FINISH) && $.isFunction(setting[FINISH]))
                {
                    setting[FINISH](
                    {
                        event: event,
                        element: $e,
                        pos: endPos,
                        offset:
                        {
                            x: event.pageX - startPos.x,
                            y: event.pageY - startPos.y
                        },
                        smallOffset:
                        {
                            x: event.pageX - mousePos.x,
                            y: event.pageY - mousePos.y
                        }
                    });
                }
                event.preventDefault();
                if (setting.stopPropagation)
                {
                    event.stopPropagation();
                }
            }
        });
    };

    $.fn.draggable = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data('zui.draggable');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('zui.draggable', (data = new Draggable(this, options)));

            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.draggable.Constructor = Draggable;
}(jQuery));

/* ========================================================================
 * ZUI: droppable.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($, document, Math)
{
    'use strict';

    var Droppable = function(element, options)
    {
        this.$ = $(element);
        this.options = this.getOptions(options);

        this.init();
    };

    Droppable.DEFAULTS = {
        container: 'body',
        flex: false,
        deviation: 5,
        sensorOffsetX: 0,
        sensorOffsetY: 0,
        nested: false
    };

    Droppable.prototype.getOptions = function(options)
    {
        options = $.extend(
        {}, Droppable.DEFAULTS, this.$.data(), options);
        return options;
    };

    Droppable.prototype.callEvent = function(name, params)
    {
        return $.callEvent(this.options[name], params, this);
    };

    Droppable.prototype.init = function()
    {
        this.handleMouseEvents();
    };

    Droppable.prototype.handleMouseEvents = function()
    {
        var $e = this.$,
            self = this,
            setting = this.options,
            BEFORE = 'before';

        this.$triggerTarget = (setting.trigger ? ($.isFunction(setting.trigger) ? setting.trigger($e) : $e.find(setting.trigger)).first() : $e);

        this.$triggerTarget.on('mousedown', function(event)
        {
            if (setting.hasOwnProperty(BEFORE) && $.isFunction(setting[BEFORE]))
            {
                var isSure = setting[BEFORE](
                {
                    event: event,
                    element: $e
                });
                if (isSure !== undefined && (!isSure)) return;
            }

            var $targets = $.isFunction(setting.target) ? setting.target($e) : $(setting.target),
                target = null,
                shadow = null,
                $container = $(setting.container).first(),
                isIn = false,
                isSelf = true,
                oldCssPosition,
                startOffset = $e.offset(),
                startMouseOffset = {
                    left: event.pageX,
                    top: event.pageY
                };
            var containerOffset = $container.offset();
            var clickOffset = {
                left: startMouseOffset.left - startOffset.left,
                top: startMouseOffset.top - startOffset.top
            };
            var lastMouseOffset = {
                left: startMouseOffset.left,
                top: startMouseOffset.top
            };

            $e.addClass('drag-from');
            $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
            event.preventDefault();

            function mouseMove(event)
            {
                var mouseOffset = {
                    left: event.pageX,
                    top: event.pageY
                };

                // ignore small move
                if (Math.abs(mouseOffset.left - startMouseOffset.left) < setting.deviation && Math.abs(mouseOffset.top - startMouseOffset.top) < setting.deviation) return;

                if (shadow === null) // create shadow
                {
                    var cssPosition = $container.css('position');
                    if (cssPosition != 'absolute' && cssPosition != 'relative' && cssPosition != 'fixed')
                    {
                        oldCssPosition = cssPosition;
                        $container.css('position', 'relative');
                    }

                    shadow = $e.clone().removeClass('drag-from').addClass('drag-shadow').css(
                    {
                        position: 'absolute',
                        width: $e.outerWidth(),
                        transition: 'none'
                    }).appendTo($container);
                    $e.addClass('dragging');

                    self.callEvent('start',
                    {
                        event: event,
                        element: $e
                    });
                }

                var offset = {
                    left: mouseOffset.left - clickOffset.left,
                    top: mouseOffset.top - clickOffset.top
                };
                var position = {
                    left: offset.left - containerOffset.left,
                    top: offset.top - containerOffset.top
                };
                shadow.css(position);
                lastMouseOffset.left = mouseOffset.left;
                lastMouseOffset.top = mouseOffset.top;

                var isNew = false;
                isIn = false;

                if (!setting.flex)
                {
                    $targets.removeClass('drop-to');
                }

                var newTarget = null;
                $targets.each(function()
                {
                    var t = $(this);
                    var tPos = t.offset();
                    var tW = t.outerWidth(),
                        tH = t.outerHeight(),
                        tX = tPos.left + setting.sensorOffsetX,
                        tY = tPos.top + setting.sensorOffsetY;

                    if (mouseOffset.left > tX && mouseOffset.top > tY && mouseOffset.left < (tX + tW) && mouseOffset.top < (tY + tH))
                    {
                        if (newTarget) newTarget.removeClass('drop-to');
                        newTarget = t;
                        if (!setting.nested) return false;
                    }
                });

                if (newTarget)
                {
                    isIn = true;
                    var id = newTarget.data('id');
                    if ($e.data('id') != id) isSelf = false;
                    if (target === null || (target.data('id') !== id && (!isSelf))) isNew = true;
                    target = newTarget;
                    if (setting.flex)
                    {
                        $targets.removeClass('drop-to');
                    }
                    target.addClass('drop-to');
                }

                if (!setting.flex)
                {
                    $e.toggleClass('drop-in', isIn);
                    shadow.toggleClass('drop-in', isIn);
                }
                else if (target !== null && target.length)
                {
                    isIn = true;
                }

                self.callEvent('drag',
                {
                    event: event,
                    isIn: isIn,
                    target: target,
                    element: $e,
                    isNew: isNew,
                    selfTarget: isSelf,
                    clickOffset: clickOffset,
                    offset: offset,
                    position:
                    {
                        left: offset.left - containerOffset.left,
                        top: offset.top - containerOffset.top
                    },
                    mouseOffset: mouseOffset
                });
                event.preventDefault();
            }

            function mouseUp(event)
            {
                if (oldCssPosition)
                {
                    $container.css('position', oldCssPosition);
                }

                if (shadow === null)
                {
                    $e.removeClass('drag-from');
                    $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
                    self.callEvent('always', {event: event, cancel: true});
                    return;
                }

                if (!isIn) target = null;
                var isSure = true,
                    mouseOffset = {
                        left: event.pageX,
                        top: event.pageY
                    };
                var offset = {
                    left: mouseOffset.left - clickOffset.left,
                    top: mouseOffset.top - clickOffset.top
                };
                var moveOffset = {
                    left: mouseOffset.left - lastMouseOffset.left,
                    top: mouseOffset.top - lastMouseOffset.top
                };
                lastMouseOffset.left = mouseOffset.left;
                lastMouseOffset.top = mouseOffset.top;
                var eventOptions = {
                    event: event,
                    isIn: isIn,
                    target: target,
                    element: $e,
                    isNew: (!isSelf) && target !== null,
                    selfTarget: isSelf,
                    offset: offset,
                    mouseOffset: mouseOffset,
                    position:
                    {
                        left: offset.left - containerOffset.left,
                        top: offset.top - containerOffset.top
                    },
                    lastMouseOffset: lastMouseOffset,
                    moveOffset: moveOffset
                };

                isSure = self.callEvent('beforeDrop', eventOptions);

                if (isSure && isIn)
                {
                    self.callEvent('drop', eventOptions);
                }

                $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
                $targets.removeClass('drop-to');
                $e.removeClass('dragging').removeClass('drag-from');
                shadow.remove();

                self.callEvent('finish', eventOptions);
                self.callEvent('always', eventOptions);

                event.preventDefault();
            }
        });

    };

    Droppable.prototype.reset = function()
    {
        this.$triggerTarget.off('mousedown');
        this.handleMouseEvents();
    };

    $.fn.droppable = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data('zui.droppable');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('zui.droppable', (data = new Droppable(this, options)));

            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.droppable.Constructor = Droppable;
}(jQuery, document, Math));

/* ========================================================================
 * ZUI: sortable.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


+function($, window, document, Math)
{
    'use strict';

    var Sortable = function(element, options)
    {
        this.$         = $(element);
        this.options   = this.getOptions(options);

        this.init();
    };

    Sortable.DEFAULTS = {list: 'li, div', dragCssClass: 'invisible'}; // default options

    Sortable.prototype.getOptions = function (options)
    {
        options = $.extend({}, Sortable.DEFAULTS, this.$.data(), options);
        return options;
    };

    Sortable.prototype.init = function()
    {
        this.bindEventToList(this.$.children(this.options.selector));
    };

    Sortable.prototype.reset = function()
    {
        var that = this, order = 0;
        var list = this.$.children(this.options.selector);
        list.each(function()
        {
            var $this = $(this);
            if($this.data('zui.droppable'))
            {
                $this.data('zui.droppable').options.target = list;
                $this.droppable('reset');
            }
            else
            {
                that.bindEventToList($this);
            }
            $(this).attr('data-order', ++order);
        });
    };

    Sortable.prototype.bindEventToList = function($list)
    {
        var self = this.$,
            options = this.options;

        markOrders($list);
        $list.droppable(
        {
            trigger: options.trigger,
            target: self.children(options.selector),
            container: self,
            always: options.always,
            flex: true,
            start: function(e)
            {
                if(options.dragCssClass) e.element.addClass(options.dragCssClass);
                $.callEvent(options['start']);
            },
            drag: function(e)
            {
                if(e.isIn)
                {
                    var $ele = e.element, $target = e.target;
                    var eleOrder = $ele.attr('data-order'), targetOrder = $target.attr('data-order');
                    if(eleOrder == targetOrder) return;
                    else if(eleOrder > targetOrder)
                    {
                        $target.before($ele);
                    }
                    else
                    {
                        $target.after($ele);
                    }
                    var list = self.children(options.selector);
                    markOrders(list);
                    $.callEvent(options['order'], {list: list, element: $ele});
                }
            },
            finish: function(e)
            {
                if(options.dragCssClass && e.element) e.element.removeClass(options.dragCssClass);
                $.callEvent(options['finish'], {list: self.children(options.selector), element: e.element});
            }
        });

        function markOrders(list)
        {
            var order = 0;
            list.each(function()
            {
                $(this).attr('data-order', ++order);
            });
        }
    };

    $.fn.sortable = function(option)
    {
        return this.each(function()
        {
            var $this   = $(this);
            var data    = $this.data('zui.sortable');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('zui.sortable', (data = new Sortable(this, options)));
            else if(typeof option == 'object') data.reset();

            if (typeof option == 'string') data[option]();
        })
    };

    $.fn.sortable.Constructor = Sortable;
}(jQuery,window,document,Math);

/* ========================================================================
 * Bootstrap: modal.js v3.2.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * Updates in ZUI：
 * 1. changed event namespace to *.zui.modal
 * 2. added position option to ajust poisition of modal
 * 3. added event 'escaping.zui.modal' with an param 'esc' to judge the esc
 *    key down
 * ======================================================================== */

+ function($){
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function(element, options)
    {
        this.options = options
        this.$body = $(document.body)
        this.$element = $(element)
        this.$backdrop =
            this.isShown = null
        this.scrollbarWidth = 0

        if (this.options.remote)
        {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function()
                {
                    this.$element.trigger('loaded.zui.modal')
                }, this))
        }
    }

    Modal.VERSION = '3.2.0'

    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true,
        position: 'fit' // 'center' or '40px' or '10%'
    }

    Modal.prototype.toggle = function(_relatedTarget, position)
    {
        return this.isShown ? this.hide() : this.show(_relatedTarget, position)
    }

    Modal.prototype.ajustPosition = function(position)
    {
        if (typeof position === 'undefined') position = this.options.position;
        if (typeof position === 'undefined') return;
        var $dialog = this.$element.find('.modal-dialog');
        var half = Math.max(0, ($(window).height() - $dialog.outerHeight()) / 2);
        var pos = position == 'fit' ? (half * 2 / 3) : (position == 'center' ? half : position);
        $dialog.css('margin-top', pos);
    }

    Modal.prototype.show = function(_relatedTarget, position)
    {
        var that = this
        var e = $.Event('show.zui.modal',
        {
            relatedTarget: _relatedTarget
        })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.checkScrollbar()
        this.$body.addClass('modal-open')

        this.setScrollbar()
        this.escape()

        this.$element.on('click.dismiss.zui.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.backdrop(function()
        {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length)
            {
                that.$element.appendTo(that.$body) // don't move modals dom position
            }

            that.$element
                .show()
                .scrollTop(0)

            if (transition)
            {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false)

            that.ajustPosition(position);

            that.enforceFocus()

            var e = $.Event('shown.zui.modal',
            {
                relatedTarget: _relatedTarget
            })

            transition ?
                that.$element.find('.modal-dialog') // wait for modal to slide in
            .one('bsTransitionEnd', function()
            {
                that.$element.trigger('focus').trigger(e)
            })
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    }

    Modal.prototype.hide = function(e)
    {
        if (e) e.preventDefault()

        e = $.Event('hide.zui.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.$body.removeClass('modal-open')

        this.resetScrollbar()
        this.escape()

        $(document).off('focusin.zui.modal')

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.zui.modal')

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
            .one('bsTransitionEnd', $.proxy(this.hideModal, this))
            .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            this.hideModal()
    }

    Modal.prototype.enforceFocus = function()
    {
        $(document)
            .off('focusin.zui.modal') // guard against infinite focus loop
        .on('focusin.zui.modal', $.proxy(function(e)
        {
            if (this.$element[0] !== e.target && !this.$element.has(e.target).length)
            {
                this.$element.trigger('focus')
            }
        }, this))
    }

    Modal.prototype.escape = function()
    {
        if (this.isShown && this.options.keyboard)
        {
            $(document).on('keydown.dismiss.zui.modal', $.proxy(function(e)
            {
                if (e.which == 27)
                {
                    var et = $.Event('escaping.zui.modal')
                    var result = this.$element.triggerHandler(et, 'esc')
                    if (result != undefined && (!result)) return
                    this.hide()
                }
            }, this))
        }
        else if (!this.isShown)
        {
            $(document).off('keydown.dismiss.zui.modal')
        }
    }

    Modal.prototype.hideModal = function()
    {
        var that = this
        this.$element.hide()
        this.backdrop(function()
        {
            that.$element.trigger('hidden.zui.modal')
        })
    }

    Modal.prototype.removeBackdrop = function()
    {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function(callback)
    {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop)
        {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .appendTo(this.$body)

            this.$element.on('mousedown.dismiss.zui.modal', $.proxy(function(e)
            {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                .one('bsTransitionEnd', callback)
                .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback()

        }
        else if (!this.isShown && this.$backdrop)
        {
            this.$backdrop.removeClass('in')

            var callbackRemove = function()
            {
                that.removeBackdrop()
                callback && callback()
            }
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                .one('bsTransitionEnd', callbackRemove)
                .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        }
        else if (callback)
        {
            callback()
        }
    }

    Modal.prototype.checkScrollbar = function()
    {
        if (document.body.clientWidth >= window.innerWidth) return
        this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
    }

    Modal.prototype.setScrollbar = function()
    {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
        if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }

    Modal.prototype.resetScrollbar = function()
    {
        this.$body.css('padding-right', '')
    }

    Modal.prototype.measureScrollbar = function()
    { // thx walsh
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        this.$body.append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        this.$body[0].removeChild(scrollDiv)
        return scrollbarWidth
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget, position)
    {
        return this.each(function()
        {
            var $this = $(this)
            var data = $this.data('zui.modal')
            var options = $.extend(
            {}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('zui.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget, position)
            else if (options.show) data.show(_relatedTarget, position)
        })
    }

    var old = $.fn.modal

    $.fn.modal = Plugin
    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function()
    {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.zui.modal.data-api', '[data-toggle="modal"]', function(e)
    {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = null
        try
        {
            // strip for ie7
            $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
        }
        catch (ex)
        {
            return
        }
        if (!$target.length) return;
        var option = $target.data('zui.modal') ? 'toggle' : $.extend(
        {
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target.one('show.zui.modal', function(showEvent)
        {
            // only register focus restorer if modal will actually get shown
            if (showEvent.isDefaultPrevented()) return
            $target.one('hidden.zui.modal', function()
            {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($target, option, this, $this.data('position'))
    })

}(jQuery);

/* ========================================================================
 * ZUI: modal.trigger.js v1.2.0
 * http://zui.sexy/docs/javascript.html#modals
 * Licensed under MIT
 * ======================================================================== */


(function($, window)
{
    'use strict';

    if (!$.fn.modal) throw new Error('Modal trigger requires modal.js');

    var NAME = 'zui.modaltrigger';

    // MODAL TRIGGER CLASS DEFINITION
    // ======================
    var ModalTrigger = function(options)
    {
        options = $.extend(
        {}, ModalTrigger.DEFAULTS, $.ModalTriggerDefaults, options);
        this.isShown = false;
        this.options = options;
        this.id = $.uuid();

        // todo: handle when: options.show = true
    };

    ModalTrigger.DEFAULTS = {
        type: 'custom',
        width: null, // number, css definition
        size: null, // 'md', 'sm', 'lg', 'fullscreen'
        height: 'auto',
        icon: null,
        name: 'triggerModal',
        fade: true,
        position: 'fit',
        showHeader: true,
        delay: 0,
        backdrop: true,
        keyboard: true
    };

    ModalTrigger.prototype.init = function(options)
    {
        var that = this;
        if (options.url)
        {
            if (!options.type || (options.type != 'ajax' && options.type != 'iframe'))
            {
                options.type = 'ajax';
            }
        }
        if (options.remote)
        {
            options.type = 'ajax';
            if (typeof options.remote === 'string') options.url = options.remote;
        }
        else if (options.iframe)
        {
            options.type = 'iframe';
            if (typeof options.iframe === 'string') options.url = options.iframe;
        }
        else if (options.custom)
        {
            options.type = 'custom';
            if (typeof options.custom === 'string')
            {
                var $doms;
                try
                {
                    $doms = $(options.custom);
                }
                catch (e)
                {}

                if ($doms && $doms.length)
                {
                    options.custom = $doms;
                }
                else if ($.isFunction(window[options.custom]))
                {
                    options.custom = window[options.custom];
                }
            }
        }

        var $modal = $('#' + options.name);
        if ($modal.length)
        {
            if (!that.isShown) $modal.off('.zui.modal');
            $modal.remove();
        }
        $modal = $('<div id="' + options.name + '" class="modal modal-trigger"><div class="icon-spinner icon-spin loader"></div><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button class="close" data-dismiss="modal">×</button><h4 class="modal-title"><i class="modal-icon"></i> <span class="modal-title-name"></span></h4></div><div class="modal-body"></div></div></div></div>').appendTo('body').data(NAME, that);

        var bindEvent = function(optonName, eventName)
        {
            var handleFunc = options[optonName];
            if ($.isFunction(handleFunc)) $modal.on(eventName + '.zui.modal', handleFunc);
        };
        bindEvent('onShow', 'show');
        bindEvent('shown', 'shown');
        bindEvent('onHide', 'hide');
        bindEvent('hidden', 'hidden');
        bindEvent('loaded', 'loaded');

        $modal.on('shown.zui.modal', function()
        {
            that.isShown = true;
        }).on('hidden.zui.modal', function()
        {
            that.isShown = false;
        });

        this.$modal = $modal;
        this.$dialog = $modal.find('.modal-dialog');
    };

    ModalTrigger.prototype.show = function(option)
    {
        var options = $.extend(
        {}, this.options, option);
        this.init(options);
        var that = this,
            $modal = this.$modal,
            $dialog = this.$dialog,
            custom = options.custom;
        var $body = $dialog.find('.modal-body').css('padding', ''),
            $header = $dialog.find('.modal-header'),
            $content = $dialog.find('.modal-content');

        $modal.toggleClass('fade', options.fade)
            .addClass(options.cssClass)
            .toggleClass('modal-md', options.size === 'md')
            .toggleClass('modal-sm', options.size === 'sm')
            .toggleClass('modal-lg', options.size === 'lg')
            .toggleClass('modal-fullscreen', options.size === 'fullscreen')
            .toggleClass('modal-loading', !this.isShown);
        $header.toggle(options.showHeader);
        $header.find('.modal-icon').attr('class', 'modal-icon icon-' + options.icon);
        $header.find('.modal-title-name').html(options.title || '');
        if (options.size && options.size === 'fullscreen')
        {
            options.width = '';
            options.height = '';
        }

        var readyToShow = function(delay)
        {
            if (typeof delay === 'undefined') delay = 300;
            setTimeout(function()
            {
                $dialog = $modal.find('.modal-dialog');
                if (options.width && options.width != 'auto')
                {
                    $dialog.css('width', options.width);
                }
                if (options.height && options.height != 'auto')
                {
                    $dialog.css('height', options.height);
                    if(options.type === 'iframe') $body.css('height', $dialog.height() - $header.outerHeight());
                }
                that.ajustPosition(options.position);
                $modal.removeClass('modal-loading');

                if (options.type != 'iframe')
                {
                    $dialog.off('resize.' + NAME).on('resize.' + NAME, function()
                    {
                        that.ajustPosition();
                    });
                }
            }, delay);
        };

        if (options.type === 'custom' && custom)
        {
            if ($.isFunction(custom))
            {
                var customContent = custom(
                {
                    modal: $modal,
                    options: options,
                    modalTrigger: that,
                    ready: readyToShow
                });
                if (typeof customContent === 'string')
                {
                    $body.html(customContent);
                    readyToShow();
                }
            }
            else if (custom instanceof $)
            {
                $body.html($('<div>').append(custom.clone()).html());
                readyToShow();
            }
            else
            {
                $body.html(custom);
                readyToShow();
            }
        }
        else if (options.url)
        {
            $modal.attr('ref', options.url);
            if (options.type === 'iframe')
            {
                $modal.addClass('modal-iframe');
                this.firstLoad = true;
                var iframeName = 'iframe-' + options.name;
                $header.detach();
                $body.detach();
                $content.empty().append($header).append($body);
                $body.css('padding', 0)
                    .html('<iframe id="' + iframeName + '" name="' + iframeName + '" src="' + options.url + '" frameborder="no" allowtransparency="true" scrolling="auto" style="width: 100%; height: 100%; left: 0px;"></iframe>');

                if (options.waittime > 0)
                {
                    that.waitTimeout = setTimeout(readyToShow, options.waittime);
                }

                var frame = document.getElementById(iframeName);
                frame.onload = frame.onreadystatechange = function()
                {
                    if (that.firstLoad) $modal.addClass('modal-loading');
                    if (this.readyState && this.readyState != 'complete') return;
                    that.firstLoad = false;

                    if (options.waittime > 0)
                    {
                        clearTimeout(that.waitTimeout);
                    }

                    try
                    {
                        $modal.attr('ref', frame.contentWindow.location.href);
                        var frame$ = window.frames[iframeName].$;
                        if (frame$ && options.height === 'auto' && options.size != 'fullscreen')
                        {
                            // todo: update iframe url to ref attribute
                            var $framebody = frame$('body').addClass('body-modal');
                            var ajustFrameSize = function()
                            {
                                $modal.removeClass('fade');
                                var height = $framebody.outerHeight();
                                $body.css('height', height);
                                if (options.fade) $modal.addClass('fade');
                                readyToShow();
                            };

                            $modal.callEvent('loaded.zui.modal',
                            {
                                modalType: 'iframe'
                            });

                            setTimeout(ajustFrameSize, 100);

                            $framebody.off('resize.' + NAME).on('resize.' + NAME, ajustFrameSize);
                        }

                        frame$.extend(
                        {
                            closeModal: window.closeModal
                        });
                    }
                    catch (e)
                    {
                        readyToShow();
                    }
                };
            }
            else
            {
                $.get(options.url, function(data)
                {
                    try
                    {
                        var $data = $(data);
                        if ($data.hasClass('modal-dialog'))
                        {
                            $dialog.replaceWith($data);
                        }
                        else if ($data.hasClass('modal-content'))
                        {
                            $dialog.find('.modal-content').replaceWith($data);
                        }
                        else
                        {
                            $body.wrapInner($data);
                        }
                    }
                    catch(e)
                    {
                        $modal.html(data);
                    }
                    $modal.callEvent('loaded.zui.modal',
                    {
                        modalType: 'ajax'
                    });
                    readyToShow();
                });
            }
        }

        $modal.modal(
        {
            show: 'show',
            backdrop: options.backdrop,
            keyboard: options.keyboard
        });
    };

    ModalTrigger.prototype.close = function(callback, redirect)
    {
        if(callback || redirect)
        {
            this.$modal.on('hidden.zui.modal', function()
            {
                if ($.isFunction(callback)) callback();

                if (typeof redirect === 'string')
                {
                    if (redirect === 'this') window.location.reload();
                    else window.location = redirect;
                }
            });
        }
        this.$modal.modal('hide');
    };

    ModalTrigger.prototype.toggle = function(options)
    {
        if (this.isShown) this.close();
        else this.show(options);
    };

    ModalTrigger.prototype.ajustPosition = function(position)
    {
        this.$modal.modal('ajustPosition', position || this.options.position);
    };

    window.ModalTrigger = ModalTrigger;
    window.modalTrigger = new ModalTrigger();

    $.fn.modalTrigger = function(option, settings)
    {
        return $(this).each(function()
        {
            var $this = $(this);
            var data = $this.data(NAME),
                options = $.extend(
                {
                    title: $this.attr('title') || $this.text(),
                    url: $this.attr('href'),
                    type: $this.hasClass('iframe') ? 'iframe' : ''
                }, $this.data(), $.isPlainObject(option) && option);
            if (!data) $this.data(NAME, (data = new ModalTrigger(options)));
            if (typeof option == 'string') data[option](settings);
            else if (options.show) data.show(settings);

            $this.on((options.trigger || 'click') + '.toggle.' + NAME, function(e)
            {
                data.toggle(options);
                if ($this.is('a')) e.preventDefault();
            });
        });
    };

    var old = $.fn.modal;
    $.fn.modal = function(option, settings)
    {
        return $(this).each(function()
        {
            var $this = $(this);
            if ($this.hasClass('modal')) old.call($this, option, settings);
            else $this.modalTrigger(option, settings);
        });
    };

    function getModal(modal)
    {
        var modalType = typeof(modal);
        if (modalType === 'undefined')
        {
            modal = $('.modal.modal-trigger');
        }
        else if (modalType === 'string')
        {
            modal = $(modal);
        }
        if (modal && (modal instanceof $)) return modal;
        return null;
    }

    // callback, redirect, modal
    window.closeModal = function(modal, callback, redirect)
    {
        if($.isFunction(modal))
        {
            var oldModal = redirect;
            redirect = callback;
            callback = modal;
            modal = oldModal;
        }
        modal = getModal(modal);
        if (modal && modal.length)
        {
            modal.each(function()
            {
                $(this).data(NAME).close(callback, redirect);
            });
        }
    };

    window.ajustModalPosition = function(position, modal)
    {
        modal = getModal(modal);
        if (modal && modal.length)
        {
            modal.modal('ajustPosition', position);
        }
    };

    $.extend(
    {
        closeModal: window.closeModal,
        ajustModalPosition: window.ajustModalPosition
    });

    $(document).on('click.' + NAME + '.data-api', '[data-toggle="modal"]', function(e)
    {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = null;
        try
        {
            $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
        }
        catch (ex)
        {}
        if (!$target || !$target.length)
        {
            if (!$this.data(NAME))
            {
                $this.modalTrigger(
                {
                    show: true
                });
            }
            else
            {
                $this.trigger('.toggle.' + NAME);
            }
        }
        if ($this.is('a'))
        {
            e.preventDefault();
        }
    });
}(window.jQuery, window));

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { 'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    if(this.options.tipId) $tip.attr('id', this.options.tipId)
    if(this.options.tipClass) $tip.addClass(this.options.tipClass)

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { 'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var target = this.getTarget()

    if(target)
    {
      if(target.find('.arrow').length < 1)
        $tip.addClass('no-arrow')
      $tip.html(target.html())
      return
    }

    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTarget() || this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.getTarget = function () {
    var $e = this.$element
    var o  = this.options

    var target = $e.attr('data-target')
      || (typeof o.target == 'function' ?
            o.target.call($e[0]) :
            o.target)
    return (target && true) ? ( target == '$next' ? $e.next('.popover') : $(target)) : false
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+ function($){
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle = '[data-toggle=dropdown]'
    var Dropdown = function(element)
    {
        var $el = $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.prototype.toggle = function(e)
    {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive)
        {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length)
            {
                // if mobile we we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
            }

            $parent.trigger(e = $.Event('show.bs.dropdown'))

            if (e.isDefaultPrevented()) return

            $parent
                .toggleClass('open')
                .trigger('shown.bs.dropdown')

            $this.focus()
        }

        return false
    }

    Dropdown.prototype.keydown = function(e)
    {
        if (!/(38|40|27)/.test(e.keyCode)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive || (isActive && e.keyCode == 27))
        {
            if (e.which == 27) $parent.find(toggle).focus()
            return $this.click()
        }

        var $items = $('[role=menu] li:not(.divider):visible a', $parent)

        if (!$items.length) return

        var index = $items.index($items.filter(':focus'))

        if (e.keyCode == 38 && index > 0) index-- // up
            if (e.keyCode == 40 && index < $items.length - 1) index++ // down
                if (!~index) index = 0

        $items.eq(index).focus()
    }

    function clearMenus()
    {
        $(backdrop).remove()
        $(toggle).each(function(e)
        {
            var $parent = getParent($(this))
            if (!$parent.hasClass('open')) return
            $parent.trigger(e = $.Event('hide.bs.dropdown'))
            if (e.isDefaultPrevented()) return
            $parent.removeClass('open').trigger('hidden.bs.dropdown')
        })
    }

    function getParent($this)
    {
        var selector = $this.attr('data-target')

        if (!selector)
        {
            selector = $this.attr('href')
            selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    var old = $.fn.dropdown

    $.fn.dropdown = function(option)
    {
        return this.each(function()
        {
            var $this = $(this)
            var data = $this.data('dropdown')

            if (!data) $this.data('dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function()
    {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function(e)
        {
            e.stopPropagation()
        })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]', Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================================
 * Updates in ZUI:
 * 1. support touch event for touchable devices
 * ======================================================================== */


+ function($){
    'use strict';

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function(element, options)
    {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused =
            this.sliding =
            this.interval =
            this.$active =
            this.$items = null

        this.options.pause == 'hover' && this.$element
            .on('mouseenter', $.proxy(this.pause, this))
            .on('mouseleave', $.proxy(this.cycle, this))
    }

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        touchable: true
    }

    Carousel.prototype.touchable = function()
    {
        if (!this.options.touchable) return;

        this.$element.on('touchstart touchmove touchend', touch);
        // this.$element.on('touchstart touchmove touchend', $.proxy(touch,this));

        // $('.carousel').on('touchstart touchmove touchend',  touch);

        var touchStartX, touchStartY;

        /* listen the touch event */
        function touch(event)
        {
            var event = event || window.event;
            if (event.originalEvent) event = event.originalEvent;
            var carousel = $(this);

            switch (event.type)
            {
                case "touchstart":
                    touchStartX = event.touches[0].pageX;
                    touchStartY = event.touches[0].pageY;
                    break;
                case "touchend":
                    var distanceX = event.changedTouches[0].pageX - touchStartX;
                    var distanceY = event.changedTouches[0].pageY - touchStartY;
                    if (Math.abs(distanceX) > Math.abs(distanceY))
                    {
                        handleCarousel(carousel, distanceX);
                        if (Math.abs(distanceX) > 10)
                        {
                            event.preventDefault();
                        }
                    }
                    else
                    {
                        var $w = $(window);
                        $('body,html').animate(
                        {
                            scrollTop: $w.scrollTop() - distanceY
                        }, 400)
                    }
                    break;
            }
        }

        function handleCarousel(carousel, distance)
        {
            if (distance > 10) carousel.find('.left.carousel-control').click();
            if (distance < -10) carousel.find('.right.carousel-control').click();
        }
    }

    Carousel.prototype.cycle = function(e)
    {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getActiveIndex = function()
    {
        this.$active = this.$element.find('.item.active')
        this.$items = this.$active.parent().children()

        return this.$items.index(this.$active)
    }

    Carousel.prototype.to = function(pos)
    {
        var that = this
        var activeIndex = this.getActiveIndex()

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding) return this.$element.one('slid', function()
        {
            that.to(pos)
        })
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

    Carousel.prototype.pause = function(e)
    {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition.end)
        {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function()
    {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function()
    {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function(type, next)
    {
        var $active = this.$element.find('.item.active')
        var $next = next || $active[type]()
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var fallback = type == 'next' ? 'first' : 'last'
        var that = this

        if (!$next.length)
        {
            if (!this.options.wrap) return
            $next = this.$element.find('.item')[fallback]()
        }

        this.sliding = true

        isCycling && this.pause()

        var e = $.Event('slide.bs.carousel',
        {
            relatedTarget: $next[0],
            direction: direction
        })

        if ($next.hasClass('active')) return

        if (this.$indicators.length)
        {
            this.$indicators.find('.active').removeClass('active')
            this.$element.one('slid', function()
            {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
                $nextIndicator && $nextIndicator.addClass('active')
            })
        }

        if ($.support.transition && this.$element.hasClass('slide'))
        {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one($.support.transition.end, function()
                {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function()
                    {
                        that.$element.trigger('slid')
                    }, 0)
                })
                .emulateTransitionEnd(600)
        }
        else
        {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger('slid')
        }

        isCycling && this.cycle()

        return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    var old = $.fn.carousel

    $.fn.carousel = function(option)
    {
        return this.each(function()
        {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = $.extend(
            {}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide

            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()

            if (options.touchable) data.touchable()
        })
    }

    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function()
    {
        $.fn.carousel = old
        return this
    }


    // CAROUSEL DATA-API
    // =================

    $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function(e)
    {
        var $this = $(this),
            href
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        var options = $.extend(
        {}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        $target.carousel(options)

        if (slideIndex = $this.attr('data-slide-to'))
        {
            $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
    })

    $(window).on('load', function()
    {
        $('[data-ride="carousel"]').each(function()
        {
            var $carousel = $(this)
            $carousel.carousel($carousel.data())
        })
    })

}(window.jQuery);

/* ========================================================================
 * image.ready.js
 * http://www.planeart.cn/?p=1121
 * ========================================================================
 * @version 2011.05.27
 * @author  TangBin
 * ======================================================================== */


(function()
{
    'use strict';

    /**
     * Image ready
     * @param {String}  image url
     * @param {Function}  callback on image ready
     * @param {Function}  callback on image load
     * @param {Function}  callback on error
     * @example imgReady('image.png', function () {
        alert('size ready: width=' + this.width + '; height=' + this.height);
      });
     */
    window.imgReady = (function()
    {
        var list = [],
            intervalId = null,

            // 用来执行队列
            tick = function()
            {
                var i = 0;
                for (; i < list.length; i++)
                {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                }
                !list.length && stop();
            },

            // 停止所有定时器队列
            stop = function()
            {
                clearInterval(intervalId);
                intervalId = null;
            };

        return function(url, ready, load, error)
        {
            var onready, width, height, newWidth, newHeight,
                img = new Image();

            img.src = url;

            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete)
            {
                ready.call(img);
                load && load.call(img);
                return;
            }

            width = img.width;
            height = img.height;

            // 加载错误后的事件
            img.onerror = function()
            {
                error && error.call(img);
                onready.end = true;
                img = img.onload = img.onerror = null;
            };

            // 图片尺寸就绪
            onready = function()
            {
                newWidth = img.width;
                newHeight = img.height;
                if (newWidth !== width || newHeight !== height ||
                    // 如果图片已经在其他地方加载可使用面积检测
                    newWidth * newHeight > 1024
                )
                {
                    ready.call(img);
                    onready.end = true;
                }
            };
            onready();

            // 完全加载完毕的事件
            img.onload = function()
            {
                // onload在定时器时间差范围内可能比onready快
                // 这里进行检查并保证onready优先执行
                !onready.end && onready();

                load && load.call(img);

                // IE gif动画会循环执行onload，置空onload即可
                img = img.onload = img.onerror = null;
            };

            // 加入队列中定期执行
            if (!onready.end)
            {
                list.push(onready);
                // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                if (intervalId === null) intervalId = setInterval(tick, 40);
            }
        };
    })();
}());

/* ========================================================================
 * ZUI: lightbox.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($, window, Math)
{
    'use strict';

    if (!$.fn.modalTrigger) throw new Error('modal & modalTrigger requires for lightbox');
    if (!window.imgReady) throw new Error('imgReady requires for lightbox');

    var Lightbox = function(element, options)
    {
        this.$ = $(element);
        this.options = this.getOptions(options);

        this.init();
    };

    Lightbox.DEFAULTS = {
        modalTeamplate: '<div class="icon-spinner icon-spin loader"></div><div class="modal-dialog"><button class="close" data-dismiss="modal" aria-hidden="true"><i class="icon-remove"></i></button><button class="controller prev"><i class="icon icon-chevron-left"></i></button><button class="controller next"><i class="icon icon-chevron-right"></i></button><img class="lightbox-img" src="{image}" alt="" data-dismiss="modal" /><div class="caption"><div class="content">{caption}<div></div></div>'
    }; // default options

    Lightbox.prototype.getOptions = function(options)
    {
        var IMAGE = 'image';
        options = $.extend(
        {}, Lightbox.DEFAULTS, this.$.data(), options);
        if (!options[IMAGE])
        {
            options[IMAGE] = this.$.attr('src') || this.$.attr('href') || this.$.find('img').attr('src');
            this.$.data(IMAGE, options[IMAGE]);
        }
        return options;
    };

    Lightbox.prototype.init = function()
    {
        this.bindEvents();
    };

    Lightbox.prototype.initGroups = function()
    {
        var groups = this.$.data('groups');
        if (!groups)
        {
            groups = $('[data-toggle="lightbox"][data-group="' + this.options.group + '"], [data-lightbox-group="' + this.options.group + '"]');
            this.$.data('groups', groups);
            groups.each(function(index)
            {
                $(this).attr('data-group-index', index);
            });
        }
        this.groups = groups;
        this.groupIndex = parseInt(this.$.data('group-index'));
    };

    Lightbox.prototype.bindEvents = function()
    {
        var $e = this.$,
            that = this;
        var options = this.options;
        if (!options.image) return false;
        $e.modalTrigger(
        {
            type: 'custom',
            name: 'lightboxModal',
            position: 'center',
            custom: function(e)
            {
                that.initGroups();
                var modal = e.modal,
                    groups = that.groups,
                    groupIndex = that.groupIndex;

                modal.addClass('modal-lightbox')
                    .html(options.modalTeamplate.format(options))
                    .toggleClass('lightbox-with-caption', typeof options.caption == 'string')
                    .removeClass('lightbox-full')
                    .data('group-index', groupIndex);
                var dialog = modal.find('.modal-dialog'),
                    winWidth = $(window).width();
                window.imgReady(options.image, function()
                {
                    dialog.css(
                    {
                        width: Math.min(winWidth, this.width)
                    });
                    if (winWidth < (this.width + 30)) modal.addClass('lightbox-full');
                    e.ready();
                });

                modal.find('.prev').toggleClass('show', groups.filter('[data-group-index="' + (groupIndex - 1) + '"]').length > 0);
                modal.find('.next').toggleClass('show', groups.filter('[data-group-index="' + (groupIndex + 1) + '"]').length > 0);

                modal.find('.controller').click(function()
                {
                    var $this = $(this);
                    var id = modal.data('group-index') + ($this.hasClass('prev') ? -1 : 1);
                    var $e = groups.filter('[data-group-index="' + id + '"]');
                    if ($e.length)
                    {
                        var image = $e.data('image'),
                            caption = $e.data('caption');
                        modal.addClass('modal-loading')
                            .data('group-index', id)
                            .toggleClass('lightbox-with-caption', typeof caption == 'string')
                            .removeClass('lightbox-full');
                        modal.find('.lightbox-img').attr('src', image);
                        winWidth = $(window).width();
                        window.imgReady(image, function()
                        {
                            dialog.css(
                            {
                                width: Math.min(winWidth, this.width)
                            });
                            if (winWidth < (this.width + 30)) modal.addClass('lightbox-full');
                            e.ready();
                        });
                    }
                    modal.find('.prev').toggleClass('show', groups.filter('[data-group-index="' + (id - 1) + '"]').length > 0);
                    modal.find('.next').toggleClass('show', groups.filter('[data-group-index="' + (id + 1) + '"]').length > 0);
                    return false;
                });
            }
        });
    };

    $.fn.lightbox = function(option)
    {
        var defaultGroup = 'group' + (new Date()).getTime();
        return this.each(function()
        {
            var $this = $(this);

            var options = typeof option == 'object' && option;
            if (typeof options == 'object' && options.group)
            {
                $this.attr('data-lightbox-group', options.group);
            }
            else if ($this.data('group'))
            {
                $this.attr('data-lightbox-group', $this.data('group'));
            }
            else
            {
                $this.attr('data-lightbox-group', defaultGroup);
            }
            $this.data('group', $this.data('lightbox-group'));

            var data = $this.data('zui.lightbox');
            if (!data) $this.data('zui.lightbox', (data = new Lightbox(this, options)));

            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.lightbox.Constructor = Lightbox;

    $(function()
    {
        $('[data-toggle="lightbox"]').lightbox();
    });
}(jQuery, window, Math));

/* ========================================================================
 * ZUI: messager.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($, window)
{
    'use strict';

    var id = 0;
    var template = '<div class="messager messager-{type} {placement}" id="messager{id}" style="display:none"><div class="messager-content"></div><div class="messager-actions"><button type="button" class="close action">&times;</button></div></div>';
    var defaultOptions =
    {
        type: 'default',
        placement: 'top',
        time: 4000,
        parent: 'body',
        // clear: false,
        icon: null,
        close: true,
        fade: true,
        scale: true
    };
    var lastMessager;

    var Messager = function(message, options)
    {
        var that = this;
        that.id = id++;
        options = that.options = $.extend({}, defaultOptions, options);
        that.message = (options.icon ? '<i class="icon-' + options.icon + ' icon"></i> ' : '') + message;

        that.$ = $(template.format(options)).toggleClass('fade', options.fade).toggleClass('scale', options.scale).attr('id', 'messager-' + that.id);
        if(!options.close)
        {
            that.$.find('.close').remove();
        }
        else
        {
            that.$.on('click', '.close', function()
            {
                that.hide();
            });
        }

        that.$.find('.messager-content').html(that.message);


        that.$.data('zui.messager', that);
    };

    Messager.prototype.show = function(message)
    {
        var that = this, options = this.options;

        if(lastMessager)
        {
            if(lastMessager.id == that.id)
            {
                that.$.removeClass('in');
            }
            else if(lastMessager.isShow)
            {
                lastMessager.hide();
            }
        }

        if(that.hiding)
        {
            clearTimeout(that.hiding);
            that.hiding = null;
        }

        if(message)
        {
            that.message = (options.icon ? '<i class="icon-' + options.icon + ' icon"></i> ' : '') + message;
            that.$.find('.messager-content').html(that.message);
        }

        that.$.appendTo(options.parent).show();

        if (options.placement === 'top' || options.placement === 'bottom' || options.placement === 'center')
        {
            that.$.css('left', ($(window).width() - that.$.width() - 50) / 2);
        }

        if (options.placement === 'left' || options.placement === 'right' || options.placement === 'center')
        {
            that.$.css('top', ($(window).height() - that.$.height() - 50) / 2);
        }

        that.$.addClass('in');

        if(options.time)
        {
            that.hiding = setTimeout(function(){that.hide();}, options.time);
        }

        that.isShow = true;
        lastMessager = that;
    };

    Messager.prototype.hide = function()
    {
        var that = this;
        if(that.$.hasClass('in'))
        {
            that.$.removeClass('in');
            setTimeout(function(){that.$.remove();}, 200);
        }

        that.isShow = false;
    };

    $.Messager = Messager;
    var noConflictMessager = window.Messager;
    window.Messager = $.Messager;
    window.Messager.noConflict = function()
    {
        window.Messager = noConflictMessager;
    };

    $.showMessage = function(message, options)
    {
        if(typeof options === 'string')
        {
            options = {type: options};
        }
        var msg = new Messager(message, options);
        msg.show();
        return msg;
    };

    var getOptions = function(options)
    {
        return (typeof options === 'string') ? {placement: options} : options;
    };

    $.messager =
    {
        show: $.showMessage,
        primary: function(message, options)
        {
            return $.showMessage(message, $.extend({type: 'primary'}, getOptions(options)));
        },
        success: function(message, options)
        {
            return $.showMessage(message, $.extend({type: 'success', icon: 'ok-sign'}, getOptions(options)));
        },
        info: function(message, options)
        {
            return $.showMessage(message, $.extend({type: 'info', icon: 'info-sign'}, getOptions(options)));
        },
        warning: function(message, options)
        {
            return $.showMessage(message, $.extend({type: 'warning', icon: 'warning-sign'}, getOptions(options)));
        },
        danger: function(message, options)
        {
            return $.showMessage(message, $.extend({type: 'danger', icon: 'exclamation-sign'}, getOptions(options)));
        },
        important: function(message, options)
        {
            return $.showMessage(message, $.extend({type: 'important'}, getOptions(options)));
        },
        special: function(message, options)
        {
            return $.showMessage(message, $.extend({type: 'special'}, getOptions(options)));
        }
    };

    var noConflict = window.messager;
    window.messager = $.messager;
    window.messager.noConflict = function()
    {
        window.messager = noConflict;
    };
}(jQuery, window));

/* ========================================================================
 * ZUI: menu.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($)
{
    'use strict';

    var Menu = function(element, options)
    {
        this.$ = $(element);
        this.options = this.getOptions(options);

        this.init();
    };

    Menu.DEFAULTS = {
        auto: false,
        foldicon: 'icon-chevron-right'
    };

    Menu.prototype.getOptions = function(options)
    {
        options = $.extend(
        {}, Menu.DEFAULTS, this.$.data(), options);
        return options;
    };

    Menu.prototype.init = function()
    {
        var children = this.$.children('.nav');
        children.find('.nav').closest('li').addClass('nav-parent');
        children.find('.nav > li.active').closest('li').addClass('active');
        children.find('.nav-parent > a').append('<i class="' + this.options.foldicon + ' nav-parent-fold-icon"></i>');

        this.handleFold();
    };

    Menu.prototype.handleFold = function()
    {
        var auto = this.options.auto;
        var $menu = this.$;

        this.$.find('.nav-parent > a').click(function(event)
        {
            if (auto)
            {
                $menu.find('.nav-parent.show').find('.nav').slideUp(function()
                {
                    $(this).closest('.nav-parent').removeClass('show');
                });
                $menu.find('.icon-rotate-90').removeClass('icon-rotate-90');
            }

            var li = $(this).closest('.nav-parent');
            if (li.hasClass('show'))
            {
                li.find('.icon-rotate-90').removeClass('icon-rotate-90');
                li.find('.nav').slideUp(function()
                {
                    $(this).closest('.nav-parent').removeClass('show');
                });
            }
            else
            {
                li.find('.nav-parent-fold-icon').addClass('icon-rotate-90');
                li.find('.nav').slideDown(function()
                {
                    $(this).closest('.nav-parent').addClass('show');
                });
            }

            event.preventDefault();
            return false;
        });
    };

    $.fn.menu = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data('zui.menu');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('zui.menu', (data = new Menu(this, options)));

            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.menu.Constructor = Menu;

    $(function()
    {
        $('[data-toggle="menu"]').menu();
    });
}(jQuery));

/* ========================================================================
 * bootbox.js [master branch]
 * http://bootboxjs.com/license.txt
 * ========================================================================
 * Updates in ZUI:
 * 1. Determine client language and apply setting automatically.
 * 2. Changed button position.
 * ======================================================================== */


// @see https://github.com/makeusabrew/bootbox/issues/180
// @see https://github.com/makeusabrew/bootbox/issues/186
(function(root, factory){

    'use strict';
    if (typeof define === "function" && define.amd)
    {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    }
    else if (typeof exports === "object")
    {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require("jquery"));
    }
    else
    {
        // Browser globals (root is window)
        root.bootbox = factory(root.jQuery);
    }

}(this, function init($, undefined)
{

    'use strict';

    // the base DOM structure needed to create a modal
    var templates = {
        dialog: "<div class='bootbox modal' tabindex='-1' role='dialog'>" +
            "<div class='modal-dialog'>" +
            "<div class='modal-content'>" +
            "<div class='modal-body'><div class='bootbox-body'></div></div>" +
            "</div>" +
            "</div>" +
            "</div>",
        header: "<div class='modal-header'>" +
            "<h4 class='modal-title'></h4>" +
            "</div>",
        footer: "<div class='modal-footer'></div>",
        closeButton: "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
        form: "<form class='bootbox-form'></form>",
        inputs:
        {
            text: "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",
            textarea: "<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",
            email: "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",
            select: "<select class='bootbox-input bootbox-input-select form-control'></select>",
            checkbox: "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",
            date: "<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",
            time: "<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",
            number: "<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",
            password: "<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />"
        }
    };

    var defaults = {
        // default language
        locale: judgeClientLang(),
        // show backdrop or not
        backdrop: true,
        // animate the modal in/out
        animate: true,
        // additional class string applied to the top level dialog
        className: null,
        // whether or not to include a close button
        closeButton: true,
        // show the dialog immediately by default
        show: true,
        // dialog container
        container: "body"
    };

    // our public object; augmented after our private API
    var exports = {};

    function judgeClientLang()
    {
        var lang;
        if (typeof(config) != 'undefined' && config.clientLang)
        {
            lang = config.clientLang;
        }
        else
        {
            var hl = $('html').attr('lang');
            lang = hl ? hl : 'en';
        }
        return lang.replace('-', '_').toLowerCase();
    }

    /**
     * @private
     */
    function _t(key)
    {
        var locale = locales[defaults.locale];
        return locale ? locale[key] : locales.en[key];
    }

    function processCallback(e, dialog, callback)
    {
        e.stopPropagation();
        e.preventDefault();

        // by default we assume a callback will get rid of the dialog,
        // although it is given the opportunity to override this

        // so, if the callback can be invoked and it *explicitly returns false*
        // then we'll set a flag to keep the dialog active...
        var preserveDialog = $.isFunction(callback) && callback(e) === false;

        // ... otherwise we'll bin it
        if (!preserveDialog)
        {
            dialog.modal("hide");
        }
    }

    function getKeyLength(obj)
    {
        // @TODO defer to Object.keys(x).length if available?
        var k, t = 0;
        for (k in obj)
        {
            t++;
        }
        return t;
    }

    function each(collection, iterator)
    {
        var index = 0;
        $.each(collection, function(key, value)
        {
            iterator(key, value, index++);
        });
    }

    function sanitize(options)
    {
        var buttons;
        var total;

        if (typeof options !== "object")
        {
            throw new Error("Please supply an object of options");
        }

        if (!options.message)
        {
            throw new Error("Please specify a message");
        }

        // make sure any supplied options take precedence over defaults
        options = $.extend(
        {}, defaults, options);

        if (!options.buttons)
        {
            options.buttons = {};
        }

        // we only support Bootstrap's "static" and false backdrop args
        // supporting true would mean you could dismiss the dialog without
        // explicitly interacting with it
        options.backdrop = options.backdrop ? "static" : false;

        buttons = options.buttons;

        total = getKeyLength(buttons);

        each(buttons, function(key, button, index)
        {

            if ($.isFunction(button))
            {
                // short form, assume value is our callback. Since button
                // isn't an object it isn't a reference either so re-assign it
                button = buttons[key] = {
                    callback: button
                };
            }

            // before any further checks make sure by now button is the correct type
            if ($.type(button) !== "object")
            {
                throw new Error("button with key " + key + " must be an object");
            }

            if (!button.label)
            {
                // the lack of an explicit label means we'll assume the key is good enough
                button.label = key;
            }

            if (!button.className)
            {
                if (total == 1 || (total >= 2 && key === 'confirm'))
                {
                    // always add a primary to the main option in a two-button dialog
                    button.className = "btn-primary";
                }
                else
                {
                    button.className = "btn-default";
                }
            }
        });

        return options;
    }

    /**
     * map a flexible set of arguments into a single returned object
     * if args.length is already one just return it, otherwise
     * use the properties argument to map the unnamed args to
     * object properties
     * so in the latter case:
     * mapArguments(["foo", $.noop], ["message", "callback"])
     * -> { message: "foo", callback: $.noop }
     */
    function mapArguments(args, properties)
    {
        var argn = args.length;
        var options = {};

        if (argn < 1 || argn > 2)
        {
            throw new Error("Invalid argument length");
        }

        if (argn === 2 || typeof args[0] === "string")
        {
            options[properties[0]] = args[0];
            options[properties[1]] = args[1];
        }
        else
        {
            options = args[0];
        }

        return options;
    }

    /**
     * merge a set of default dialog options with user supplied arguments
     */
    function mergeArguments(defaults, args, properties)
    {
        return $.extend(
            // deep merge
            true,
            // ensure the target is an empty, unreferenced object
            {},
            // the base options object for this type of dialog (often just buttons)
            defaults,
            // args could be an object or array; if it's an array properties will
            // map it to a proper options object
            mapArguments(
                args,
                properties
            )
        );
    }

    /**
     * this entry-level method makes heavy use of composition to take a simple
     * range of inputs and return valid options suitable for passing to bootbox.dialog
     */
    function mergeDialogOptions(className, labels, properties, args)
    {
        //  build up a base set of dialog properties
        var baseOptions = {
            className: "bootbox-" + className,
            buttons: createLabels.apply(null, labels)
        };

        // ensure the buttons properties generated, *after* merging
        // with user args are still valid against the supplied labels
        return validateButtons(
            // merge the generated base properties with user supplied arguments
            mergeArguments(
                baseOptions,
                args,
                // if args.length > 1, properties specify how each arg maps to an object key
                properties
            ),
            labels
        );
    }

    /**
     * from a given list of arguments return a suitable object of button labels
     * all this does is normalise the given labels and translate them where possible
     * e.g. "ok", "confirm" -> { ok: "OK, cancel: "Annuleren" }
     */
    function createLabels()
    {
        var buttons = {};

        for (var i = 0, j = arguments.length; i < j; i++)
        {
            var argument = arguments[i];
            var key = argument.toLowerCase();
            var value = argument.toUpperCase();

            buttons[key] = {
                label: _t(value)
            };
        }

        return buttons;
    }

    function validateButtons(options, buttons)
    {
        var allowedButtons = {};
        each(buttons, function(key, value)
        {
            allowedButtons[value] = true;
        });

        each(options.buttons, function(key)
        {
            if (allowedButtons[key] === undefined)
            {
                throw new Error("button key " + key + " is not allowed (options are " + buttons.join("\n") + ")");
            }
        });

        return options;
    }

    exports.alert = function()
    {
        var options;

        options = mergeDialogOptions("alert", ["ok"], ["message", "callback"], arguments);

        if (options.callback && !$.isFunction(options.callback))
        {
            throw new Error("alert requires callback property to be a function when provided");
        }

        /**
         * overrides
         */
        options.buttons.ok.callback = options.onEscape = function()
        {
            if ($.isFunction(options.callback))
            {
                return options.callback();
            }
            return true;
        };

        return exports.dialog(options);
    };

    exports.confirm = function()
    {
        var options;

        options = mergeDialogOptions("confirm", ["confirm", "cancel"], ["message", "callback"], arguments);

        /**
         * overrides; undo anything the user tried to set they shouldn't have
         */
        options.buttons.cancel.callback = options.onEscape = function()
        {
            return options.callback(false);
        };

        options.buttons.confirm.callback = function()
        {
            return options.callback(true);
        };

        // confirm specific validation
        if (!$.isFunction(options.callback))
        {
            throw new Error("confirm requires a callback");
        }

        return exports.dialog(options);
    };

    exports.prompt = function()
    {
        var options;
        var defaults;
        var dialog;
        var form;
        var input;
        var shouldShow;
        var inputOptions;

        // we have to create our form first otherwise
        // its value is undefined when gearing up our options
        // @TODO this could be solved by allowing message to
        // be a function instead...
        form = $(templates.form);

        // prompt defaults are more complex than others in that
        // users can override more defaults
        // @TODO I don't like that prompt has to do a lot of heavy
        // lifting which mergeDialogOptions can *almost* support already
        // just because of 'value' and 'inputType' - can we refactor?
        defaults = {
            className: "bootbox-prompt",
            buttons: createLabels("confirm", "cancel"),
            value: "",
            inputType: "text"
        };

        options = validateButtons(
            mergeArguments(defaults, arguments, ["title", "callback"]), ["cancel", "confirm"]
        );

        // capture the user's show value; we always set this to false before
        // spawning the dialog to give us a chance to attach some handlers to
        // it, but we need to make sure we respect a preference not to show it
        shouldShow = (options.show === undefined) ? true : options.show;

        // check if the browser supports the option.inputType
        var html5inputs = ["date", "time", "number"];
        var i = document.createElement("input");
        i.setAttribute("type", options.inputType);
        if (html5inputs[options.inputType])
        {
            options.inputType = i.type;
        }

        /**
         * overrides; undo anything the user tried to set they shouldn't have
         */
        options.message = form;

        options.buttons.cancel.callback = options.onEscape = function()
        {
            return options.callback(null);
        };

        options.buttons.confirm.callback = function()
        {
            var value;

            switch (options.inputType)
            {
                case "text":
                case "textarea":
                case "email":
                case "select":
                case "date":
                case "time":
                case "number":
                case "password":
                    value = input.val();
                    break;

                case "checkbox":
                    var checkedItems = input.find("input:checked");

                    // we assume that checkboxes are always multiple,
                    // hence we default to an empty array
                    value = [];

                    each(checkedItems, function(_, item)
                    {
                        value.push($(item).val());
                    });
                    break;
            }

            return options.callback(value);
        };

        options.show = false;

        // prompt specific validation
        if (!options.title)
        {
            throw new Error("prompt requires a title");
        }

        if (!$.isFunction(options.callback))
        {
            throw new Error("prompt requires a callback");
        }

        if (!templates.inputs[options.inputType])
        {
            throw new Error("invalid prompt type");
        }

        // create the input based on the supplied type
        input = $(templates.inputs[options.inputType]);

        switch (options.inputType)
        {
            case "text":
            case "textarea":
            case "email":
            case "date":
            case "time":
            case "number":
            case "password":
                input.val(options.value);
                break;

            case "select":
                var groups = {};
                inputOptions = options.inputOptions || [];

                if (!inputOptions.length)
                {
                    throw new Error("prompt with select requires options");
                }

                each(inputOptions, function(_, option)
                {

                    // assume the element to attach to is the input...
                    var elem = input;

                    if (option.value === undefined || option.text === undefined)
                    {
                        throw new Error("given options in wrong format");
                    }


                    // ... but override that element if this option sits in a group

                    if (option.group)
                    {
                        // initialise group if necessary
                        if (!groups[option.group])
                        {
                            groups[option.group] = $("<optgroup/>").attr("label", option.group);
                        }

                        elem = groups[option.group];
                    }

                    elem.append("<option value='" + option.value + "'>" + option.text + "</option>");
                });

                each(groups, function(_, group)
                {
                    input.append(group);
                });

                // safe to set a select's value as per a normal input
                input.val(options.value);
                break;

            case "checkbox":
                var values = $.isArray(options.value) ? options.value : [options.value];
                inputOptions = options.inputOptions || [];

                if (!inputOptions.length)
                {
                    throw new Error("prompt with checkbox requires options");
                }

                if (!inputOptions[0].value || !inputOptions[0].text)
                {
                    throw new Error("given options in wrong format");
                }

                // checkboxes have to nest within a containing element, so
                // they break the rules a bit and we end up re-assigning
                // our 'input' element to this container instead
                input = $("<div/>");

                each(inputOptions, function(_, option)
                {
                    var checkbox = $(templates.inputs[options.inputType]);

                    checkbox.find("input").attr("value", option.value);
                    checkbox.find("label").append(option.text);

                    // we've ensured values is an array so we can always iterate over it
                    each(values, function(_, value)
                    {
                        if (value === option.value)
                        {
                            checkbox.find("input").prop("checked", true);
                        }
                    });

                    input.append(checkbox);
                });
                break;
        }

        if (options.placeholder)
        {
            input.attr("placeholder", options.placeholder);
        }

        if (options.pattern)
        {
            input.attr("pattern", options.pattern);
        }

        // now place it in our form
        form.append(input);

        form.on("submit", function(e)
        {
            e.preventDefault();
            // Fix for SammyJS (or similar JS routing library) hijacking the form post.
            e.stopPropagation();
            // @TODO can we actually click *the* button object instead?
            // e.g. buttons.confirm.click() or similar
            dialog.find(".btn-primary").click();
        });

        dialog = exports.dialog(options);

        // clear the existing handler focusing the submit button...
        dialog.off("shown.bs.modal");

        // ...and replace it with one focusing our input, if possible
        dialog.on("shown.bs.modal", function()
        {
            input.focus();
        });

        if (shouldShow === true)
        {
            dialog.modal("show");
        }

        return dialog;
    };

    exports.dialog = function(options)
    {
        options = sanitize(options);

        var dialog = $(templates.dialog);
        var innerDialog = dialog.find(".modal-dialog");
        var body = dialog.find(".modal-body");
        var buttons = options.buttons;
        var buttonStr = "";
        var callbacks = {
            onEscape: options.onEscape
        };

        each(buttons, function(key, button)
        {

            // @TODO I don't like this string appending to itself; bit dirty. Needs reworking
            // can we just build up button elements instead? slower but neater. Then button
            // can just become a template too
            buttonStr += "<button data-bb-handler='" + key + "' type='button' class='btn " + button.className + "'>" + button.label + "</button>";
            callbacks[key] = button.callback;
        });

        body.find(".bootbox-body").html(options.message);

        if (options.animate === true)
        {
            dialog.addClass("fade");
        }

        if (options.className)
        {
            dialog.addClass(options.className);
        }

        if (options.size === "large")
        {
            innerDialog.addClass("modal-lg");
        }

        if (options.size === "small")
        {
            innerDialog.addClass("modal-sm");
        }

        if (options.title)
        {
            body.before(templates.header);
        }

        if (options.closeButton)
        {
            var closeButton = $(templates.closeButton);

            if (options.title)
            {
                dialog.find(".modal-header").prepend(closeButton);
            }
            else
            {
                closeButton.css("margin-top", "-10px").prependTo(body);
            }
        }

        if (options.title)
        {
            dialog.find(".modal-title").html(options.title);
        }

        if (buttonStr.length)
        {
            body.after(templates.footer);
            dialog.find(".modal-footer").html(buttonStr);
        }


        /**
         * Bootstrap event listeners; used handle extra
         * setup & teardown required after the underlying
         * modal has performed certain actions
         */

        dialog.on("hidden.bs.modal", function(e)
        {
            // ensure we don't accidentally intercept hidden events triggered
            // by children of the current dialog. We shouldn't anymore now BS
            // namespaces its events; but still worth doing
            if (e.target === this)
            {
                dialog.remove();
            }
        });

        /*
    dialog.on("show.bs.modal", function() {
      // sadly this doesn't work; show is called *just* before
      // the backdrop is added so we'd need a setTimeout hack or
      // otherwise... leaving in as would be nice
      if (options.backdrop) {
        dialog.next(".modal-backdrop").addClass("bootbox-backdrop");
      }
    });
    */

        dialog.on("shown.bs.modal", function()
        {
            dialog.find(".btn-primary:first").focus();
        });

        /**
         * Bootbox event listeners; experimental and may not last
         * just an attempt to decouple some behaviours from their
         * respective triggers
         */

        dialog.on("escape.close.bb", function(e)
        {
            if (callbacks.onEscape)
            {
                processCallback(e, dialog, callbacks.onEscape);
            }
        });

        /**
         * Standard jQuery event listeners; used to handle user
         * interaction with our dialog
         */

        dialog.on("click", ".modal-footer button", function(e)
        {
            var callbackKey = $(this).data("bb-handler");

            processCallback(e, dialog, callbacks[callbackKey]);

        });

        dialog.on("click", ".bootbox-close-button", function(e)
        {
            // onEscape might be falsy but that's fine; the fact is
            // if the user has managed to click the close button we
            // have to close the dialog, callback or not
            processCallback(e, dialog, callbacks.onEscape);
        });

        dialog.on("keyup", function(e)
        {
            if (e.which === 27)
            {
                dialog.trigger("escape.close.bb");
            }
        });

        // the remainder of this method simply deals with adding our
        // dialogent to the DOM, augmenting it with Bootstrap's modal
        // functionality and then giving the resulting object back
        // to our caller

        $(options.container).append(dialog);

        dialog.modal(
        {
            backdrop: options.backdrop,
            keyboard: false,
            show: false
        });

        if (options.show)
        {
            dialog.modal("show");
        }

        // @TODO should we return the raw element here or should
        // we wrap it in an object on which we can expose some neater
        // methods, e.g. var d = bootbox.alert(); d.hide(); instead
        // of d.modal("hide");

        /*
    function BBDialog(elem) {
      this.elem = elem;
    }

    BBDialog.prototype = {
      hide: function() {
        return this.elem.modal("hide");
      },
      show: function() {
        return this.elem.modal("show");
      }
    };
    */

        return dialog;

    };

    exports.setDefaults = function()
    {
        var values = {};

        if (arguments.length === 2)
        {
            // allow passing of single key/value...
            values[arguments[0]] = arguments[1];
        }
        else
        {
            // ... and as an object too
            values = arguments[0];
        }

        $.extend(defaults, values);
    };

    exports.hideAll = function()
    {
        $(".bootbox").modal("hide");
    };


    /**
     * standard locales. Please add more according to ISO 639-1 standard. Multiple language variants are
     * unlikely to be required. If this gets too large it can be split out into separate JS files.
     */
    var locales = {
        en:
        {
            OK: "OK",
            CANCEL: "Cancel",
            CONFIRM: "OK"
        },
        zh_cn:
        {
            OK: "确认",
            CANCEL: "取消",
            CONFIRM: "确认"
        },
        zh_tw:
        {
            OK: "確認",
            CANCEL: "取消",
            CONFIRM: "確認"
        }
    };

    exports.init = function(_$)
    {
        return init(_$ || $);
    };

    return exports;
}));

/* ========================================================================
 * ZUI: dashboard.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($, Math)
{
    'use strict';

    var Dashboard = function(element, options)
    {
        this.$ = $(element);
        this.options = this.getOptions(options);
        this.draggable = this.$.hasClass('dashboard-draggable') || this.options.draggable;

        this.init();
    };

    Dashboard.DEFAULTS = {
        height: 360,
        shadowType: 'circle',
        sensitive: false,
        circleShadowSize: 100
    };

    Dashboard.prototype.getOptions = function(options)
    {
        options = $.extend(
        {}, Dashboard.DEFAULTS, this.$.data(), options);
        return options;
    };

    Dashboard.prototype.handleRemoveEvent = function()
    {
        var afterPanelRemoved = this.options.afterPanelRemoved;
        var tip = this.options.panelRemovingTip;
        this.$.on('click', '.remove-panel', function()
        {
            var panel = $(this).closest('.panel');
            var name = panel.data('name') || panel.find('.panel-heading').text().replace('\n', '').replace(/(^\s*)|(\s*$)/g, '');
            var index = panel.attr('data-id');

            if (tip === undefined || confirm(tip.format(name)))
            {
                panel.parent().remove();
                if (afterPanelRemoved && $.isFunction(afterPanelRemoved))
                {
                    afterPanelRemoved(index);
                }
            }
        });
    };

    Dashboard.prototype.handleRefreshEvent = function()
    {
        this.$.on('click', '.refresh-panel', function()
        {
            var panel = $(this).closest('.panel');
            refreshPanel(panel);
        });
    };

    Dashboard.prototype.handleDraggable = function()
    {
        var dashboard = this.$;
        var options = this.options;
        var circleShadow = options.shadowType === 'circle';
        var circleSize = options.circleShadowSize;
        var halfCircleSize = circleSize/2;
        var afterOrdered = options.afterOrdered;

        this.$.addClass('dashboard-draggable');

        this.$.find('.panel-actions').mousedown(function(event)
        {
            event.preventDefault();
            event.stopPropagation();
        });

        var pColClass;
        this.$.find('.panel-heading').mousedown(function(event)
        {
            // console.log('--------------------------------');
            var panel = $(this).closest('.panel');
            var pCol = panel.parent();
            var row = panel.closest('.row');
            var dPanel = panel.clone().addClass('panel-dragging-shadow');
            var pos = panel.offset();
            var dPos = dashboard.offset();
            var dColShadow = row.find('.dragging-col-holder');
            var sWidth = panel.width(), sHeight = panel.height(), sX1, sY1, sX2, sY2, moveFn, dropCol, dropBefore, nextDropCol;
            if (!dColShadow.length)
            {
                dColShadow = $('<div class="dragging-col-holder"><div class="panel"></div></div>').removeClass('dragging-col').appendTo(row);
            }

            if(pColClass) dColShadow.removeClass(pColClass);
            dColShadow.addClass(pColClass = pCol.attr('class'));

            dColShadow.insertBefore(pCol).find('.panel').replaceWith(panel.clone().addClass('panel-dragging panel-dragging-holder'));

            dashboard.addClass('dashboard-dragging');
            panel.addClass('panel-dragging').parent().addClass('dragging-col');

            dPanel.css(
            {
                left   : pos.left - dPos.left,
                top    : pos.top - dPos.top,
                width  : sWidth,
                height : sHeight
            }).appendTo(dashboard).data('mouseOffset',
            {
                x: event.pageX - pos.left + dPos.left,
                y: event.pageY - pos.top + dPos.top
            });

            if(circleShadow)
            {
                dPanel.addClass('circle');
                setTimeout(function()
                {
                    dPanel.css(
                    {
                        left   : event.pageX - dPos.left - halfCircleSize,
                        top    : event.pageY - dPos.top - halfCircleSize,
                        width  : circleSize,
                        height : circleSize
                    }).data('mouseOffset',
                    {
                        x: dPos.left + halfCircleSize,
                        y: dPos.top + halfCircleSize
                    });
                }, 100);
            }

            $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
            event.preventDefault();

            function mouseMove(event)
            {
                // console.log('......................');
                var offset = dPanel.data('mouseOffset');
                sX1 = event.pageX - offset.x;
                sY1 = event.pageY - offset.y;
                sX2 = sX1 + sWidth;
                sY2 = sY1 + sHeight;
                dPanel.css(
                {
                    left: sX1,
                    top: sY1
                });

                row.find('.dragging-in').removeClass('dragging-in');
                dropBefore = false;
                dropCol = null;
                var area = 0, thisArea;
                row.children(':not(.dragging-col)').each(function()
                {
                    var col = $(this);
                    if(col.hasClass('dragging-col-holder'))
                    {
                        dropBefore = (!options.sensitive) || (area < 100);
                        return true;
                    }
                    var p = col.children('.panel');
                    var pP = p.offset(),
                        pW = p.width(),
                        pH = p.height();
                    var pX = pP.left,
                        pY = pP.top;

                    if(options.sensitive)
                    {
                        pX -= dPos.left;
                        pY -= dPos.top;
                        thisArea = getIntersectArea(sX1, sY1, sX2, sY2, pX, pY, pX + pW, pY + pH);
                        if(thisArea > 100 && thisArea > area && thisArea > Math.min(getRectArea(sX1, sY1, sX2, sY2), getRectArea(pX, pY, pX + pW, pY + pH))/3)
                        {
                            area = thisArea;
                            dropCol = col;
                        }
                        // if(thisArea)
                        // {
                        //     console.log('panel ' + col.data('id'), '({0}, {1}, {2}, {3}), ({4}, {5}, {6}, {7})'.format(sX1, sY1, sX2, sY2, pX, pY, pX + pW, pY + pH));
                        // }
                    }
                    else
                    {
                        var mX = event.pageX,
                            mY = event.pageY;

                        if (mX > pX && mY > pY && mX < (pX + pW) && mY < (pY + pH))
                        {
                            // var dCol = row.find('.dragging-col');
                            dropCol = col;
                            return false;
                        }
                    }
                });

                if(dropCol)
                {
                    if(moveFn) clearTimeout(moveFn);
                    nextDropCol= dropCol;
                    moveFn = setTimeout(movePanel, 50);
                }
                event.preventDefault();
            }

            function movePanel()
            {
                if(nextDropCol)
                {
                    nextDropCol.addClass('dragging-in');
                    if (dropBefore) dColShadow.insertAfter(nextDropCol);
                    else dColShadow.insertBefore(nextDropCol);
                    dashboard.addClass('dashboard-holding');
                    moveFn = null;
                    nextDropCol = null;
                }
            }

            function mouseUp(event)
            {
                if(moveFn) clearTimeout(moveFn);

                var oldOrder = panel.data('order');
                panel.parent().insertAfter(dColShadow);
                var newOrder = 0;
                var newOrders = {};

                row.children(':not(.dragging-col-holder)').each(function()
                {
                    var p = $(this).children('.panel');
                    p.data('order', ++newOrder);
                    newOrders[p.attr('id')] = newOrder;
                    p.parent().attr('data-order', newOrder);
                });

                if (oldOrder != newOrders[panel.attr('id')])
                {
                    row.data('orders', newOrders);

                    if (afterOrdered && $.isFunction(afterOrdered))
                    {
                        afterOrdered(newOrders);
                    }
                }

                dPanel.remove();

                dashboard.removeClass('dashboard-holding');
                dashboard.find('.dragging-col').removeClass('dragging-col');
                dashboard.find('.panel-dragging').removeClass('panel-dragging');
                row.find('.dragging-in').removeClass('dragging-in');
                dashboard.removeClass('dashboard-dragging');
                $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
                event.preventDefault();
            }
        });
    };

    Dashboard.prototype.handlePanelPadding = function()
    {
        this.$.find('.panel-body > table, .panel-body > .list-group').closest('.panel-body').addClass('no-padding');
    };

    Dashboard.prototype.handlePanelHeight = function()
    {
        var dHeight = this.options.height;

        this.$.find('.row').each(function()
        {
            var row = $(this);
            var panels = row.find('.panel');
            var height = row.data('height') || dHeight;

            if (typeof height != 'number')
            {
                height = 0;
                panels.each(function()
                {
                    height = Math.max(height, $(this).innerHeight());
                });
            }

            panels.each(function()
            {
                var $this = $(this);
                $this.find('.panel-body').css('height', height - $this.find('.panel-heading').outerHeight() - 2);
            });
        });
    };

    function refreshPanel(panel)
    {
        var url = panel.data('url');
        if (!url) return;
        panel.addClass('panel-loading').find('.panel-heading .icon-refresh,.panel-heading .icon-repeat').addClass('icon-spin');
        $.ajax(
        {
            url: url,
            dataType: 'html'
        }).done(function(data)
        {
            panel.find('.panel-body').html(data);
        }).fail(function()
        {
            panel.addClass('panel-error');
        }).always(function()
        {
            panel.removeClass('panel-loading');
            panel.find('.panel-heading .icon-refresh,.panel-heading .icon-repeat').removeClass('icon-spin');
        });
    }

    function getRectArea(x1, y1, x2, y2)
    {
        return Math.abs((x2 - x1) * (y2- y1));
    }

    function isPointInner(x, y, x1, y1, x2, y2)
    {
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }

    function getIntersectArea(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2)
    {
        var x1 = Math.max(ax1, bx1),
            y1 = Math.max(ay1, by1),
            x2 = Math.min(ax2, bx2),
            y2 = Math.min(ay2, by2);
        if(isPointInner(x1, y1, ax1, ay1, ax2, ay2) && isPointInner(x2, y2, ax1, ay1, ax2, ay2) && isPointInner(x1, y1, bx1, by1, bx2, by2) && isPointInner(x2, y2, bx1, by1, bx2, by2))
        {
            return getRectArea(x1, y1, x2, y2);
        }
        return 0;
    }

    Dashboard.prototype.init = function()
    {
        this.handlePanelHeight();
        this.handlePanelPadding();
        this.handleRemoveEvent();
        this.handleRefreshEvent();

        if (this.draggable) this.handleDraggable();

        var orderSeed = 0;
        this.$.find('.panel').each(function()
        {
            var $this = $(this);
            $this.data('order', ++orderSeed);
            if (!$this.attr('id'))
            {
                $this.attr('id', 'panel' + orderSeed);
            }
            if (!$this.attr('data-id'))
            {
                $this.attr('data-id', orderSeed);
            }

            refreshPanel($this);
        });
    };

    $.fn.dashboard = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data('zui.dashboard');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('zui.dashboard', (data = new Dashboard(this, options)));

            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.dashboard.Constructor = Dashboard;
}(jQuery, Math));

/* ========================================================================
 * ZUI: boards.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($)
{
    'use strict';

    if (!$.fn.droppable) throw new Error('droppable requires for boards');

    var Boards = function(element, options)
    {
        this.$ = $(element);
        this.options = this.getOptions(options);

        this.getLang();
        this.init();
    };

    Boards.DEFAULTS = {
        lang: 'zh-cn',
        langs:
        {
            'zh-cn':
            {
                appendToTheEnd: '移动到末尾'
            },
            'zh-tw':
            {
                appendToTheEnd: '移动到末尾'
            },
            'en':
            {
                appendToTheEnd: 'Move to the end.'
            }
        }
    }; // default options

    Boards.prototype.getOptions = function(options)
    {
        options = $.extend(
        {}, Boards.DEFAULTS, this.$.data(), options);
        return options;
    };

    Boards.prototype.getLang = function()
    {
        var config = window.config;
        if (!this.options.lang)
        {
            if (typeof(config) != 'undefined' && config.clientLang)
            {
                this.options.lang = config.clientLang;
            }
            else
            {
                var hl = $('html').attr('lang');
                this.options.lang = hl ? hl : 'en';
            }
            this.options.lang = this.options.lang.replace(/-/, '_').toLowerCase();
        }
        this.lang = this.options.langs[this.options.lang] || this.options.langs[Boards.DEFAULTS.lang];
    };

    Boards.prototype.init = function()
    {
        var idSeed = 1;
        var lang = this.lang;
        this.$.find('.board-item:not(".disable-drop"), .board:not(".disable-drop")').each(function()
        {
            var $this = $(this);
            if ($this.attr('id'))
            {
                $this.attr('data-id', $this.attr('id'));
            }
            else if (!$this.attr('data-id'))
            {
                $this.attr('data-id', 'board' + (idSeed++));
            }

            if ($this.hasClass('board'))
            {
                $this.find('.board-list').append('<div class="board-item board-item-empty"><i class="icon-plus"></i> {appendToTheEnd}</div>'.format(lang))
                    .append('<div class="board-item board-item-shadow"></div>'.format(lang));
            }
        });

        this.bind();
    };

    Boards.prototype.bind = function(items)
    {
        var $boards = this.$,
            setting = this.options;
        if (typeof(items) == 'undefined')
        {
            items = $boards.find('.board-item:not(".disable-drop, .board-item-shadow")');
        }

        items.droppable(
        {
            target: '.board-item:not(".disable-drop, .board-item-shadow")',
            flex: true,
            start: function(e)
            {
                $boards.addClass('dragging').find('.board-item-shadow').height(e.element.outerHeight());
            },
            drag: function(e)
            {
                $boards.find('.board.drop-in-empty').removeClass('drop-in-empty');
                if (e.isIn)
                {
                    var board = e.target.closest('.board').addClass('drop-in');
                    var shadow = board.find('.board-item-shadow');
                    var target = e.target;

                    $boards.addClass('drop-in').find('.board.drop-in').not(board).removeClass('drop-in');

                    shadow.insertBefore(target);

                    board.toggleClass('drop-in-empty', target.hasClass('board-item-empty'));
                }
            },
            drop: function(e)
            {
                if (e.isNew)
                {
                    var DROP = 'drop';
                    var result;
                    if (setting.hasOwnProperty(DROP) && $.isFunction(setting[DROP]))
                    {
                        result = setting[DROP](e);
                    }
                    if(result !== false) e.element.insertBefore(e.target);
                }
            },
            finish: function()
            {
                $boards.removeClass('dragging').removeClass('drop-in').find('.board.drop-in').removeClass('drop-in');
            }
        });
    };

    $.fn.boards = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data('zui.boards');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('zui.boards', (data = new Boards(this, options)));

            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.boards.Constructor = Boards;

    $(function()
    {
        $('[data-toggle="boards"]').boards();
    });
}(jQuery));

/* ========================================================================
 * ZUI: datatable.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($)
{
    'use strict';

    var name = 'zui.datatable';

    var DataTable = function(element, options)
    {
        this.name = name;
        this.$ = $(element);
        this.isTable = (this.$[0].tagName === 'TABLE');
        this.firstShow = true;
        if (this.isTable)
        {
            this.$table = this.$;
            this.id = 'datatable-' + (this.$.attr('id') || $.uuid());
        }
        else
        {
            this.$datatable = this.$.addClass('datatable');
            if (this.$.attr('id'))
            {
                this.id = this.$.attr('id');
            }
            else
            {
                this.id = 'datatable-' + $.uuid();
                this.$.attr('id', this.id);
            }
        }
        this.getOptions(options);
        this.load();

        this.callEvent('ready');
    };

    // default options
    DataTable.DEFAULTS = {
        // Check options
        checkable: false, // added check icon to the head of rows
        checkByClickRow: true, // change check status by click anywhere on a row
        checkedClass: 'active', // apply CSS class to an checked row
        checkboxName: null,

        // Sort options
        sortable: false, // enable sorter

        // storage
        storage: true, // enable storage

        // fixed header of columns
        fixedHeader: true,      // fixed header
        fixedHeaderOffset: 0,   // set top offset of header when fixed
        fixedLeftWidth: '30%',  // set left width after first render
        fixedRightWidth: '30%', // set right width after first render
        flexHeadDrag: true,     // scroll flexarea by drag header
        scrollPos: 'in',        // scroll bar position: 'out' | 'in'

        // hover effection
        rowHover: true, // apply hover effection to row
        colHover: true, // apply hover effection to head
        hoverClass: 'hover',
        colHoverClass: 'col-hover',

        // Merge rows
        mergeRows: false, // Merge rows

        // custom columns size
        // customizable: false, // enable customizable
        minColWidth: 20, // min width of columns
        minFixedLeftWidth: 200, // min left width
        minFixedRightWidth: 200, // min right width
        minFlexAreaWidth: 200 // min flexarea width
    };

    // Get options
    DataTable.prototype.getOptions = function(options)
    {
        var $e = this.$;
        options = $.extend(
            {}, DataTable.DEFAULTS, this.$.data(), options);

        options.tableClass = options.tableClass || '';
        options.tableClass = ' ' + options.tableClass + ' table-datatable';

        $.each(['bordered', 'condensed', 'striped', 'condensed', 'fixed'], function(idx, cls)
        {
            cls = 'table-' + cls;
            if($e.hasClass(cls)) options.tableClass += ' ' + cls;
        });

        if ($e.hasClass('table-hover') || options.rowHover)
        {
            options.tableClass += ' table-hover';
        }

        this.options = options;
    };

    // Load data form options or table dom
    DataTable.prototype.load = function(data)
    {
        var options = this.options,
            cols;

        if($.isPlainObject(data))
        {
            this.data = data;
        }
        else if(typeof data === 'string')
        {
            var $table = $(data);
            if($table.length)
            {
                this.$table = $table.first();
                this.$table.data(name, this);
                this.isTable = true;
            }
            data = null;
        }
        else
        {
            data = options.data;
        }

        if (!data)
        {
            if (this.isTable)
            {
                data = {
                    cols: [],
                    rows: []
                };
                cols = data.cols;
                var rows = data.rows, i,
                    $th, $tr, $td, row, $t = this.$table, colSpan;

                $t.find('thead > tr:first').children('th').each(function()
                {
                    $th = $(this);
                    cols.push($.extend(
                    {
                        text: $th.html(),
                        flex: false || $th.hasClass('flex-col'),
                        width: 'auto',
                        cssClass: $th.attr('class'),
                        css: $th.attr('style'),
                        type: 'string',
                        ignore: $th.hasClass('ignore'),
                        sort: !$th.hasClass('sort-disabled'),
                        mergeRows: $th.attr('merge-rows')
                    }, $th.data()));
                });

                $t.find('tbody > tr').each(function()
                {
                    $tr = $(this);
                    row = $.extend(
                    {
                        data: [],
                        checked: false,
                        cssClass: $tr.attr('class'),
                        css: $tr.attr('style'),
                        id: $tr.attr('id')
                    }, $tr.data());

                    $tr.children('td').each(function()
                    {
                        $td = $(this);
                        colSpan = $td.attr('colspan') || 1;
                        row.data.push($.extend(
                        {
                            cssClass: $td.attr('class'),
                            css: $td.attr('style'),
                            text: $td.html(),
                            colSpan: colSpan
                        }, $td.data()));

                        if(colSpan > 1)
                        {
                            for(i = 1; i < colSpan; i++)
                            {
                                row.data.push({empty: true});
                            }
                        }
                    });

                    rows.push(row);
                });

                var $tfoot = $t.find('tfoot');
                if ($tfoot.length)
                {
                    data.footer = $('<table class="table' + options.tableClass + '"></table>').append($tfoot);
                }
            }
            else
            {
                throw new Error('No data avaliable!');
            }
        }

        data.flexStart = -1;
        data.flexEnd = -1;

        cols = data.cols;
        data.colsLength = cols.length;
        for (var i = 0; i < data.colsLength; ++i)
        {
            var col = cols[i];
            if (col.flex)
            {
                if (data.flexStart < 0)
                {
                    data.flexStart = i;
                }

                data.flexEnd = i;
            }
        }

        if (data.flexStart === 0 && data.flexEnd === data.colsLength)
        {
            data.flexStart = -1;
            data.flexEnd = -1;
        }

        data.flexArea = data.flexStart >= 0;
        data.fixedRight = data.flexEnd >= 0 && data.flexEnd < (data.colsLength - 1);
        data.fixedLeft = data.flexStart > 0;
        if (data.flexStart < 0 && data.flexEnd < 0)
        {
            data.fixedLeft = true;
            data.flexStart = data.colsLength;
            data.flexEnd = data.colsLength;
        }

        this.data = data;

        this.callEvent('afterLoad',
        {
            data: data
        });

        this.render();
    };

    // Render datatable
    DataTable.prototype.render = function()
    {
        var that = this;
        var $datatable = that.$datatable || (that.isTable ? $('<div class="datatable" id="' + that.id + '"/>') : that.$datatable),
            options = that.options,
            data = that.data,
            cols = that.data.cols,
            rows = that.data.rows;
        var checkable = options.checkable,
            $left,
            i,
            $right,
            $flex,
            dataRowSpan = '<div class="datatable-rows-span datatable-span"><div class="datatable-wrapper"><table class="table"></table></div></div>',
            dataHeadSpan = '<div class="datatable-head-span datatable-span"><div class="datatable-wrapper"><table class="table"><thead></thead></table></div></div>';

        $datatable.children('.datatable-head, .datatable-rows, .scroll-wrapper').remove();

        // Set css class to datatable by options
        $datatable.toggleClass('sortable', options.sortable);
        // $datatable.toggleClass('customizable', options.customizable);

        // Head
        var $head = $('<div class="datatable-head"/>'),
            $tr,
            $th,
            col;
        $left = $('<tr/>');
        $right = $('<tr/>');
        $flex = $('<tr/>');
        for (i = 0; i < cols.length; i++)
        {
            col = cols[i];
            $tr = i < data.flexStart ? $left : ((i >= data.flexStart && i <= data.flexEnd) ? $flex : $right);
            if(i === 0 && checkable)
            {
                $tr.append('<th data-index="check" class="check-all check-btn"><i class="icon-check-empty"></i></th>');
            }
            if(col.ignore) continue;

            $th = $('<th/>');

            // set sort class
            $th.toggleClass('sort-down', col.sort === 'down')
               .toggleClass('sort-up', col.sort === 'up')
               .toggleClass('sort-disabled', col.sort === false);

            $th.addClass(col.cssClass)
               .addClass(col.colClass)
               .html(col.text)
               .attr(
                {
                    'data-index' : i,
                    'data-type'  : col.type,
                    style        : col.css
                });


            $tr.append($th);
        }

        var $headSpan;
        if(data.fixedLeft)
        {
            $headSpan = $(dataHeadSpan);
            $headSpan.addClass('fixed-left')
                     // .find('.datatable-wrapper')
                     // .append('<div class="size-handle size-handle-head size-handle-left"></div>')
                     .find('table')
                     .addClass(options.tableClass)
                     .find('thead').append($left);
            $head.append($headSpan);
        }
        if (data.flexArea)
        {
            $headSpan = $(dataHeadSpan);
            $headSpan.addClass('flexarea')
                     .find('.datatable-wrapper')
                     .append('<div class="scrolled-shadow scrolled-in-shadow"></div><div class="scrolled-shadow scrolled-out-shadow"></div>')
                     .find('table')
                     .addClass(options.tableClass)
                     .find('thead').append($flex);
            $head.append($headSpan);
        }
        if (data.fixedRight)
        {
            $headSpan = $(dataHeadSpan);
            $headSpan.addClass('fixed-right')
                     // .find('.datatable-wrapper')
                     // .append('<div class="size-handle size-handle-head size-handle-right"></div>')
                     .find('table')
                     .addClass(options.tableClass)
                     .find('thead').append($right);
            $head.append($headSpan);
        }
        $datatable.append($head);

        // Rows
        var $rows = $('<div class="datatable-rows">');
        var $leftRow,
            $flexRow,
            $rightRow,
            // $tr,
            $td,
            $cTd,
            row,
            rowLen = rows.length,
            rowCol,
            rowColLen;
        $left = $('<tbody/>');
        $right = $('<tbody/>');
        $flex = $('<tbody/>');

        for (var r = 0; r < rowLen; ++r)
        {
            row = rows[r];

            // format row
            if(typeof row.id === 'undefined')
            {
                row.id = r;
            }
            row.index = r;

            $leftRow = $('<tr/>');
            $leftRow.addClass(row.cssClass)
                   .toggleClass(options.checkedClass, row.checked)
                   .attr(
                    {
                        'data-index' : r,
                        'data-id'    : row.id
                    });
            $flexRow = $leftRow.clone();
            $rightRow = $leftRow.clone();

            rowColLen = row.data.length;
            for (i = 0; i < rowColLen; ++i)
            {
                rowCol = row.data[i];
                if(i > 0 && rowCol.empty)
                {
                    continue;
                }

                $tr = i < data.flexStart ? $leftRow : ((i >= data.flexStart && i <= data.flexEnd) ? $flexRow : $rightRow);
                if(i === 0 && checkable)
                {
                    $cTd = $('<td data-index="check" class="check-row check-btn"><i class="icon-check-empty"></i></td>');
                    if(options.checkboxName)
                    {
                        $cTd.append('<input class="hide" type="checkbox" name="' + options.checkboxName + '" value="' + row.id + '">');
                    }
                    $tr.append($cTd);
                }

                if(cols[i].ignore) continue;

                // format row column
                if (!$.isPlainObject(rowCol))
                {
                    rowCol =
                    {
                        text: rowCol,
                        row: r,
                        index: i
                    };
                }
                else
                {
                    rowCol.row = r;
                    rowCol.index = i;
                }
                row.data[i] = rowCol;

                $td = $('<td/>');

                $td.html(rowCol.text)
                   .addClass(rowCol.cssClass)
                   .addClass(cols[i].colClass)
                   .attr('colspan', rowCol.colSpan)
                   .attr(
                    {
                        'data-row'   : r,
                        'data-index' : i,
                        'data-flex'  : false,
                        'data-type'  : cols[i].type,
                        style        : rowCol.css
                    });


                $tr.append($td);
            }

            $left.append($leftRow);
            $flex.append($flexRow);
            $right.append($rightRow);
        }

        var $rowSpan;
        if (data.fixedLeft)
        {
            $rowSpan = $(dataRowSpan);
            $rowSpan.addClass('fixed-left')
                    .find('table')
                    .addClass(options.tableClass)
                    .append($left);
            $rows.append($rowSpan);
        }
        if (data.flexArea)
        {
            $rowSpan = $(dataRowSpan);
            $rowSpan.addClass('flexarea')
                    .find('.datatable-wrapper')
                    .append('<div class="scrolled-shadow scrolled-in-shadow"></div><div class="scrolled-shadow scrolled-out-shadow"></div>')
                    .find('table')
                    .addClass(options.tableClass)
                    .append($flex);
            $rows.append($rowSpan);
        }
        if (data.fixedRight)
        {
            $rowSpan = $(dataRowSpan);
            $rowSpan.addClass('fixed-right')
                    .find('table')
                    .addClass(options.tableClass)
                    .append($right);
            $rows.append($rowSpan);
        }
        $datatable.append($rows);

        if(data.flexArea)
        {
            $datatable.append('<div class="scroll-wrapper"><div class="scroll-slide scroll-pos-' + options.scrollPos + '"><div class="bar"></div></div></div>');
        }

        var $oldFooter = $datatable.children('.datatable-footer').detach();
        if (data.footer)
        {
            $datatable.append($('<div class="datatable-footer"/>').append(data.footer));
            data.footer = null;
        }
        else if($oldFooter.length)
        {
            $datatable.append($oldFooter);
        }

        that.$datatable = $datatable.data(name, that);
        if (that.isTable && that.firstShow)
        {
            that.$table.attr('data-datatable-id', this.id).hide().after($datatable);
            that.firstShow = false;
        }

        that.bindEvents();
        that.refreshSize();

        that.callEvent('render');
    };

    // Bind global events
    DataTable.prototype.bindEvents = function()
    {
        var that       = this,
            data       = this.data,
            options    = this.options,
            store      = window.store,
            $datatable = this.$datatable;

        var $dataSpans = that.$dataSpans = $datatable.children('.datatable-head, .datatable-rows').find('.datatable-span');
        var $rowsSpans = that.$rowsSpans = $datatable.children('.datatable-rows').children('.datatable-rows-span');
        var $headSpans = that.$headSpans = $datatable.children('.datatable-head').children('.datatable-head-span');
        var $cells     = that.$cells     = $dataSpans.find('td, th');
        var $dataCells = that.$dataCells = $cells.filter('td');
        that.$headCells = $cells.filter('th');
        var $rows      = that.$rows      = that.$rowsSpans.find('.table > tbody > tr');

        // handle row hover events
        if(options.rowHover)
        {
            var hoverClass = options.hoverClass;
            $rowsSpans.on('mouseenter', 'td', function()
            {
                $dataCells.filter('.' + hoverClass).removeClass(hoverClass);
                $rows.filter('.' + hoverClass).removeClass(hoverClass);

                $rows.filter('[data-index="' + $(this).addClass(hoverClass).closest('tr').data('index') + '"]').addClass(hoverClass);
            }).on('mouseleave', 'td', function()
            {
                $dataCells.filter('.' + hoverClass).removeClass(hoverClass);
                $rows.filter('.' + hoverClass).removeClass(hoverClass);
            });
        }

        // handle col hover events
        if (options.colHover)
        {
            var colHoverClass = options.colHoverClass;
            $headSpans.on('mouseenter', 'th', function()
            {
                $cells.filter('.' + colHoverClass).removeClass(colHoverClass);
                $cells.filter('[data-index="' + $(this).data('index') + '"]').addClass(colHoverClass);
            }).on('mouseleave', 'th', function()
            {
                $cells.filter('.' + colHoverClass).removeClass(colHoverClass);
            });
        }

        // handle srcoll for flex area
        if(data.flexArea)
        {
            var $scrollbar = $datatable.find('.scroll-slide'),
                // $flexArea = $datatable.find('.datatable-span.flexarea .table'),
                $flexArea = $datatable.find('.datatable-span.flexarea'),
                $fixedLeft = $datatable.find('.datatable-span.fixed-left'),
                // $flexTable = $datatable.find('.datatable-rows-span.flexarea .table');
                $flexTable = $datatable.find('.datatable-span.flexarea .table');
            var $bar = $scrollbar.children('.bar'),
                flexWidth,
                scrollWidth,
                tableWidth,
                lastBarLeft,
                barLeft,
                scrollOffsetStoreName = that.id + '_' + 'scrollOffset',
                firtScroll,
                left;

            that.width = $datatable.width();
            $datatable.resize(function()
            {
                that.width = $datatable.width();
            });

            var srollTable = function(offset, silence)
            {
                barLeft = Math.max(0, Math.min(flexWidth - scrollWidth, offset));
                if (!silence)
                {
                    $datatable.addClass('scrolling');
                }
                $bar.css('left', barLeft);
                left = 0 - Math.floor((tableWidth - flexWidth) * barLeft / (flexWidth - scrollWidth));
                $flexTable.css('left', left);
                lastBarLeft = barLeft;

                $datatable.toggleClass('scrolled-in', barLeft > 2)
                    .toggleClass('scrolled-out', barLeft < flexWidth - scrollWidth - 2);

                if(options.storage) store.pageSet(scrollOffsetStoreName, barLeft);
            };
            var resizeScrollbar = function()
            {
                flexWidth = $flexArea.width();
                $scrollbar.width(flexWidth).css('left', $fixedLeft.width());
                tableWidth = $flexTable.width();
                scrollWidth = Math.floor((flexWidth * flexWidth) / tableWidth);
                $bar.css('width', scrollWidth);
                $flexTable.css('min-width', flexWidth);
                $datatable.toggleClass('show-scroll-slide', tableWidth > flexWidth);

                if (!firtScroll && flexWidth !== scrollWidth)
                {
                    firtScroll = true;
                    srollTable(store.pageGet(scrollOffsetStoreName, 0), true); // todo: unused?
                }

                if ($datatable.hasClass('size-changing'))
                {
                    srollTable(barLeft, true);
                }
            };
            // $scrollbar.resize(resizeScrollbar); // todo: unuseful?
            $flexArea.resize(resizeScrollbar);
            if(options.storage) resizeScrollbar();

            var dragOptions = {
                move: false,
                stopPropagation: true,
                drag: function(e)
                {
                    srollTable($bar.position().left + e.smallOffset.x * (e.element.hasClass('bar') ? 1 : -1));
                },
                finish: function()
                {
                    $datatable.removeClass('scrolling');
                }
            };

            $bar.draggable(dragOptions);
            if (options.flexHeadDrag)
            {
                $datatable.find('.datatable-head-span.flexarea').draggable(dragOptions);
            }

            $scrollbar.mousedown(function(event)
            {
                var x = event.pageX - $scrollbar.offset().left;
                srollTable(x - (scrollWidth / 2));
            });
        }

        //  handle row check events
        if (options.checkable)
        {
            var checkedStatusStoreName = that.id + '_checkedStatus',
                checkedClass = options.checkedClass,
                rowId;
            var syncChecks = function()
            {
                var $checkRows = $rowsSpans.first().find('.table > tbody > tr');
                var $checkedRows = $checkRows.filter('.' + checkedClass);
                $checkRows.find('.check-row input:checkbox').prop('checked', false);
                var checkedStatus = {
                    checkedAll: $checkRows.length === $checkedRows.length && $checkedRows.length > 0,
                    checks: $checkedRows.map(function()
                    {
                        rowId = $(this).data('id');
                        if(options.checkboxName)
                        {
                            $(this).find('.check-row input:checkbox').prop('checked', true);
                        }
                        return rowId;
                    }).toArray()
                };
                $.each(data.rows, function(index, value)
                {
                    value.checked = ($.inArray(value.id, checkedStatus.checks) > -1);
                });
                $headSpans.find('.check-all').toggleClass('checked', checkedStatus.checkedAll);

                if(options.storage) store.pageSet(checkedStatusStoreName, checkedStatus);

                that.callEvent('checksChanged',
                {
                    checks: checkedStatus
                });
            };

            this.$rowsSpans.on('click', options.checkByClickRow ? 'tr' : '.check-row', function()
            {
                $rows.filter('[data-index="' + $(this).closest('tr').data('index') + '"]').toggleClass(checkedClass);
                syncChecks();
            });

            var checkAllEventName = 'click.zui.datatable.check-all';
            this.$datatable.off(checkAllEventName).on(checkAllEventName, '.check-all', function()
            {
                $rows.toggleClass(checkedClass, $(this).toggleClass('checked').hasClass('checked'));
                syncChecks();
            }).on('click', '.check-none', function()
            {
                $rows.toggleClass(checkedClass, false);
                syncChecks();
            }).on('click', '.check-inverse', function()
            {
                $rows.toggleClass(checkedClass);
                syncChecks();
            });

            if(options.storage)
            {
                var checkedStatus = store.pageGet(checkedStatusStoreName);
                if (checkedStatus)
                {
                    $headSpans.find('.check-all').toggleClass('checked', checkedStatus.checkedAll);
                    if (checkedStatus.checkedAll)
                    {
                        $rows.addClass(checkedClass);
                    }
                    else
                    {
                        $rows.removeClass(checkedClass);
                        $.each(checkedStatus.checks, function(index, ele)
                        {
                            $rows.filter('[data-id="' + ele + '"]').addClass(checkedClass);
                        });
                    }
                    if (checkedStatus.checks.length)
                    {
                        syncChecks();
                    }
                }
            }
        }

        // fixed header
        if(options.fixedHeader)
        {
            var offsetTop,
                height,
                scrollTop,
                $dataTableHead = $datatable.children('.datatable-head'),
                navbarHeight = options.fixedHeaderOffset || $('.navbar.navbar-fixed-top').height() || 0;
            var handleScroll = function()
            {
                offsetTop = $datatable.offset().top;
                scrollTop = $(window).scrollTop();
                height = $datatable.height();
                $datatable.toggleClass('head-fixed', (scrollTop + navbarHeight) > offsetTop && (scrollTop + navbarHeight) < (offsetTop + height));
                if($datatable.hasClass('head-fixed'))
                {
                    $dataTableHead.css(
                    {
                        width: $datatable.width(),
                        top: navbarHeight
                    });
                }
                else
                {
                    $dataTableHead.attr('style', '');
                }
            };

            $(window).scroll(handleScroll);
            handleScroll();
        }

        // handle sort
        if (options.sortable)
        {
            $headSpans.on('click', 'th:not(.sort-disabled, .check-btn)', function()
            {
                if ($datatable.hasClass('size-changing')) return;
                that.sortTable($(this));
            });

            if(options.storage) that.sortTable();
        }
        else if (options.mergeRows)
        {
            this.mergeRows();
        }
    };

    DataTable.prototype.mergeRows = function()
    {
        var $cells = this.$rowsSpans.find('.table > tbody > tr > td');
        var cols = this.data.cols;
        for(var i = 0; i < cols.length; i++)
        {
            var col = cols[i];
            if(col.mergeRows)
            {
                var $cs = $cells.filter('[data-index="' + i + '"]');
                if($cs.length > 1)
                {
                    var $lastCell, rowspan;
                    $cs.each(function()
                    {
                        var $cell = $(this);
                        if($lastCell)
                        {
                            if($cell.html() === $lastCell.html())
                            {
                                rowspan = $lastCell.attr('rowspan') || 1;
                                if(typeof rowspan !== 'number')
                                {
                                    rowspan = parseInt(rowspan);
                                    if(isNaN(rowspan)) rowspan = 1;
                                }

                                $lastCell.attr('rowspan', rowspan + 1).css('vertical-align', 'middle');
                                $cell.remove();
                            }
                            else
                            {
                                $lastCell = $cell;
                            }
                        }
                        else
                        {
                            $lastCell = $cell;
                        }
                    });
                }
            }
        }
    };

    // Sort table
    DataTable.prototype.sortTable = function($th)
    {
        var store = window.store,
            options = this.options;
        var sorterStoreName = this.id + '_datatableSorter';
        var sorter = options.storage ? store.pageGet(sorterStoreName) : null;

        if (!$th)
        {
            if (sorter)
            {
                $th = this.$headCells.filter('[data-index="' + sorter.index + '"]').addClass('sort-' + sorter.type);
            }
            else
            {
                $th = this.$headCells.filter('.sort-up, .sort-down').first();
            }
        }

        if (!$th.length)
        {
            return;
        }


        var data = this.data;
        var cols = data.cols,
            rows = data.rows,
            $headCells = this.$headCells,
            sortUp,
            type,
            index;

        sortUp = !$th.hasClass('sort-up');
        $headCells.removeClass('sort-up sort-down');
        $th.addClass(sortUp ? 'sort-up' : 'sort-down');

        index = $th.data('index');
        sortUp = $th.hasClass('sort-up');

        $.each(cols, function(idx, col)
        {
            if (idx != index && (col.sort === 'up' || col.sort === 'down'))
            {
                col.sort = true;
            }
            else if (idx == index)
            {
                col.sort = sortUp ? 'up' : 'down';
                type = col.type;
            }
        });

        var valA, valB, result, $dataRows = this.$dataCells.filter('[data-index="' + index + '"]');
        rows.sort(function(cellA, cellB)
        {
            cellA = cellA.data[index];
            cellB = cellB.data[index];
            valA = $dataRows.filter('[data-row="' + cellA.row + '"]').text();
            valB = $dataRows.filter('[data-row="' + cellB.row + '"]').text();
            if (type === 'number')
            {
                valA = parseFloat(valA);
                valB = parseFloat(valB);
            }
            else if (type === 'date')
            {
                valA = Date.parse(valA);
                valB = Date.parse(valB);
            }
            else
            {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }
            result = valA > valB ? 1 : (valA < valB ? -1 : 0);
            if (sortUp)
            {
                result = result * (-1);
            }
            return result;
        });

        var $rows = this.$rows,
            lastRows = [],
            $row, $lastRow, $r;
        $.each(rows, function(idx, row)
        {
            $row = $rows.filter('[data-index="' + row.index + '"]');
            $row.each(function(rIdx)
            {
                $r = $(this);
                $lastRow = lastRows[rIdx];
                if ($lastRow)
                {
                    $lastRow.after($r);
                }
                else
                {
                    $r.parent().prepend($r);
                }
                lastRows[rIdx] = $r;
            });
        });

        sorter = {
            index: index,
            type: sortUp ? 'up' : 'down'
        };

        // save sort with local storage
        if(options.storage) store.pageSet(sorterStoreName, sorter);

        this.callEvent('sort',
        {
            sorter: sorter
        });
    };

    // Refresh size
    DataTable.prototype.refreshSize = function()
    {
        var $datatable = this.$datatable,
            options = this.options,
            rows = this.data.rows,
            cols = this.data.cols,
            i;

        $datatable.find('.datatable-span.fixed-left').css('width', options.fixedLeftWidth);
        $datatable.find('.datatable-span.fixed-right').css('width', options.fixedRightWidth);

        var findMaxHeight = function($cells)
            {
                var mx = 0, $cell, rowSpan;
                $cells.css('height', 'auto');
                $cells.each(function()
                {
                    $cell = $(this);
                    rowSpan = $cell.attr('rowspan');
                    if(!rowSpan || rowSpan == 1) mx = Math.max(mx, $cell.outerHeight());
                });
                return mx;
            },
            $dataCells = this.$dataCells,
            $cells = this.$cells,
            $headCells = this.$headCells;

        // set width of data cells
        for (i = 0; i < cols.length; ++i)
        {
            $cells.filter('[data-index="' + i + '"]').css('width', cols[i].width);
        }

        // set height of head cells
        var headMaxHeight = findMaxHeight($headCells);
        $headCells.css('min-height', headMaxHeight).css('height', headMaxHeight);

        // set height of data cells
        var $rowCells;
        for (i = 0; i < rows.length; ++i)
        {
            $rowCells = $dataCells.filter('[data-row="' + i + '"]');
            var rowMaxHeight = findMaxHeight($rowCells);
            $rowCells.css('min-height', rowMaxHeight).css('height', rowMaxHeight);
        }
    };

    // Call event
    DataTable.prototype.callEvent = function(name, params)
    {
        var result = this.$.callEvent(name + '.' + this.name, params, this).result;
        return !(result !== undefined && (!result));
    };

    $.fn.datatable = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data(name);
            var options = typeof option == 'object' && option;

            if (!data) $this.data(name, (data = new DataTable(this, options)));

            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.datatable.Constructor = DataTable;
}(jQuery));

/* ========================================================================
 * ZUI: calendar.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */

(function($, window)
{
    'use strict';
    var name = 'zui.calendar';
    var NUMBER_TYPE_NAME = 'number';
    var STRING_TYPE_NAME = 'string';
    var UNDEFINED_TYPE_NAME = 'undefined';

    var getNearbyLastWeekDay = function(date, lastWeek)
        {
            lastWeek = lastWeek || 1;

            var d = date.clone();
            while (d.getDay() != lastWeek)
            {
                d.addDays(-1);
            }
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d;
        },

        getFirstDayOfMonth = function(date)
        {
            var d = date.clone();
            d.setDate(1);
            return d;
        };

        // getLastDayOfMonth = function(date)
        // {
        //     var d = date.clone();
        //     var month = d.getMonth();
        //     d.setDate(28);

        //     while (d.getMonth() == month)
        //     {
        //         d.addDays(1);
        //     }

        //     d.addDays(-1);

        //     return d;
        // };

    var Calendar = function(element, options)
    {
        this.name = name;
        this.$ = $(element);
        this.id = this.$.attr('id') || (name + $.uuid());
        this.$.attr('id', this.id);
        this.storeName = name + '.' + this.id;

        this.getOptions(options);
        this.getLang();

        this.data = this.options.data;
        this.calendars = $.isPlainObject(this.data.calendars) ? this.data.calendars :
        {};
        this.events = this.data.events;
        this.sortEvents();

        this.storeData = window.store.pageGet(this.storeName,
        {
            date: 'today',
            view: 'month'
        });

        this.date = this.options.startDate || 'today';
        this.view = this.options.startView || 'month';

        this.date = 'today';

        this.$.toggleClass('limit-event-title', options.limitEventTitle);

        if (this.options.withHeader)
        {
            var $header = this.$.children('.calender-header');
            if (!$header.length)
            {
                $header = $('<header><div class="btn-toolbar"><div class="btn-group"><button type="button" class="btn btn-today">{today}</button></div><div class="btn-group"><button type="button" class="btn btn-prev"><i class="icon-chevron-left"></i></button><button type="button" class="btn btn-next"><i class="icon-chevron-right"></i></button></div><div class="btn-group"><span class="calendar-caption"></span></div></div></header>'.format(this.lang));
                this.$.append($header);
            }
            this.$caption = $header.find('.calendar-caption');
            this.$todayBtn = $header.find('.btn-today');
            this.$header = $header;
        }

        var $views = this.$.children('.calendar-views');
        if (!$views.length)
        {
            $views = $('<div class="calendar-views"></div>');
            this.$.append($views);
        }
        this.$views = $views;
        this.$monthView = $views.children('.calendar-view.month');

        this.display();

        this.bindEvents();
    };

    // default options
    Calendar.DEFAULTS = {
        langs:
        {
            zh_cn:
            {
                weekNames: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                today: '今天',
                year: '{0}年',
                month: '{0}月',
                yearMonth: '{0}年{1}月'
            },
            zh_tw:
            {
                weekNames: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                today: '今天',
                year: '{0}年',
                month: '{0}月',
                yearMonth: '{0}年{1}月'
            },
            en:
            {
                weekNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                today: 'Today',
                year: '{0}',
                month: '{0}',
                yearMonth: '{2}, {0}'
            }
        },
        data:
        {
            calendars:
            {
                defaultCal:
                {
                    color: '#229F24'
                }
            },
            events: []
        },
        // startView: "month",  // default view when load complete
        // startDate: 'today',  // default date when load complete
        limitEventTitle: true,
        storage: true,
        withHeader: true,
        dragThenDrop: true // drag an event and drop at another day
    };

    // Sort events by start datetime
    Calendar.prototype.sortEvents = function()
    {
        var events = this.events;
        if (!$.isArray(events))
        {
            events = [];
        }

        var startType, endType;
        $.each(events, function(index, e)
        {
            startType = typeof e.start;
            endType = typeof e.end;
            if (startType === NUMBER_TYPE_NAME || startType === STRING_TYPE_NAME)
            {
                e.start = new Date(e.start);
            }
            if (endType === NUMBER_TYPE_NAME || endType === STRING_TYPE_NAME)
            {
                e.end = new Date(e.end);
            }

            if (typeof e.id === UNDEFINED_TYPE_NAME)
            {
                e.id = $.uuid();
            }
        });

        events.sort(function(a, b)
        {
            return a.start > b.start ? 1 : (a.start < b.start ? (-1) : 0);
        });

        // this.events = events;
    };

    Calendar.prototype.bindEvents = function()
    {
        var $e = this.$,
            self = this;

        $e.on('click', '.btn-today', function()
        {
            self.date = new Date();
            self.display();
            self.callEvent('clickTodayBtn');
        }).on('click', '.btn-next', function()
        {
            if (self.view === 'month')
            {
                self.date.addMonths(1);
            }
            self.display();
            self.callEvent('clickNextBtn');
        }).on('click', '.btn-prev', function()
        {
            if (self.view === 'month')
            {
                self.date.addMonths(-1);
            }
            self.display();
            self.callEvent('clickPrevBtn');
        }).on('click', '.event', function(event)
        {
            self.callEvent('clickEvent',
            {
                event: $(this).data('event'),
                events: self.events
            });
            event.stopPropagation();
        }).on('click', '.cell-day', function()
        {
            self.callEvent('clickCell',
            {
                view: self.view,
                date: new Date($(this).children('.day').attr('data-date')),
                events: self.events
            });
        });
    };

    Calendar.prototype.addCalendars = function(calendars)
    {
        var that = this;
        if ($.isPlainObject(calendars))
        {
            calendars = [calendars];
        }
        $.each(calendars, function(index, value)
        {
            if (that.callEvent('beforeAddCalendars',
            {
                newCalendar: value,
                data: that.data
            }))
            {
                that.calendars[value.name](value);
            }
        });

        that.display();
        that.callEvent('addCalendars',
        {
            newCalendars: calendars,
            data: that.data
        });
    };

    Calendar.prototype.addEvents = function(events)
    {
        var that = this;
        if ($.isPlainObject(events))
        {
            events = [events];
        }
        $.each(events, function(index, value)
        {
            if (that.callEvent('beforeAddEvent',
            {
                newEvent: value,
                data: that.data
            }))
            {
                that.events.push(value);
            }
        });

        that.sortEvents();
        that.display();
        that.callEvent('addEvents',
        {
            newEvents: events,
            data: that.data
        });
    };

    Calendar.prototype.getEvent = function(id)
    {
        var events = this.events;
        for (var i = 0; i < events.length; i++)
        {
            if (events[i].id == id)
            {
                return events[i];
            }
        }
        return null;
    };

    Calendar.prototype.updateEvents = function(events)
    {
        var eventsParams = {
            data: this.data,
            changes: []
        }, that = this;

        if ($.isPlainObject(events))
        {
            events = [events];
        }
        var event, chgs, eventParam;
        $.each(events, function(index, changes)
        {
            event = changes.event;
            chgs = changes.changes;
            eventParam = {
                event: event,
                changes: []
            };
            if (typeof event === STRING_TYPE_NAME)
            {
                event = that.getEvent(event);
            }
            if (event)
            {
                if ($.isPlainObject(chgs))
                {
                    chgs = [chgs];
                }
                $.each(function(idx, chge)
                {
                    if (that.callEvent('beforeChange',
                    {
                        event: event,
                        change: chge.change,
                        to: chge.to,
                        from: event[chge.change]
                    }))
                    {
                        eventParam.changes.push($.entend(true,
                        {}, chge,
                        {
                            from: event[chge.change]
                        }));
                        event[chge.change] = chge.to;
                    }
                });
            }
            eventsParams.changes.push(eventParam);
        });

        that.sortEvents();
        that.display();
        that.callEvent('change', eventsParams);
    };

    Calendar.prototype.removeEvents = function(events)
    {
        if (!$.isArray(events))
        {
            events = [events];
        }
        var id, event, idx, evts = this.events, that = this,
            removedEvents = [];
        $.each(events, function(index, value)
        {
            id = $.isPlainObject(value) ? value.id : value;
            idx = -1;
            for (var i = 0; i < evts.length; i++)
            {
                if (evts[i].id == id)
                {
                    idx = i;
                    event = evts[i];
                    break;
                }
            }

            if (idx >= 0 && that.callEvent('beforeRemoveEvent',
            {
                event: event,
                eventId: id,
                data: that.data
            }))
            {
                evts.splice(idx, 1);
                removedEvents.push(event);
            }
        });

        that.sortEvents();
        that.display();
        that.callEvent('removeEvents',
        {
            removedEvents: removedEvents,
            data: that.data
        });
    };

    Calendar.prototype.getOptions = function(options)
    {
        this.options = $.extend(
        {}, Calendar.DEFAULTS, this.$.data(), options);
    };

    Calendar.prototype.getLang = function()
    {
        this.lang = this.options.langs[this.options.lang || $.clientLang()];
    };

    Calendar.prototype.display = function(view, date)
    {
        var that = this;
        var viewType = typeof view;
        var dateType = typeof date;

        if (viewType === UNDEFINED_TYPE_NAME)
        {
            view = that.view;
        }
        else
        {
            that.view = view;
        }

        if (dateType === UNDEFINED_TYPE_NAME)
        {
            date = that.date;
        }
        else
        {
            that.date = date;
        }

        if (date === 'today')
        {
            date = new Date();
            that.date = date;
        }

        if (typeof date === STRING_TYPE_NAME)
        {
            date = new Date(date);
            that.date = date;
        }

        if (that.options.storage)
        {
            window.store.pageSet(that.storeName,
            {
                date: date,
                view: view
            });
        }

        var eventPramas = {
            view: view,
            date: date
        };
        if (that.callEvent('beforeDisplay', eventPramas))
        {
            switch (view)
            {
                case 'month':
                    that.displayMonth(date);
                    break;
            }

            that.callEvent('display', eventPramas);
        }
    };

    Calendar.prototype.displayMonth = function(date)
    {
        var that = this;
        date = date || that.date;
        var options = that.options,
            self = that,
            lang = that.lang,
            i,
            $views = that.$views,
            $e = that.$;

        var $view = self.$monthView;
        if (!$view.length)
        {
            $view = $('<div class="calendar-view month"><table class="table table-bordered"><thead><tr class="week-head"></tr></thead><tbody class="month-days"></tbody></table></div>');

            var $weekHead = $view.find('.week-head'),
                $monthDays = $view.find('.month-days'),
                $tr;

            for (i = 0; i < 7; i++)
            {
                $weekHead.append('<th>' + lang.weekNames[i] + '</th>');
            }

            for (i = 0; i < 6; i++)
            {
                $tr = $('<tr class="week-days"></tr>');
                for (var j = 0; j < 7; j++)
                {
                    $tr.append('<td class="cell-day"><div class="day"><div class="heading"><span class="month"></span> <span class="number"></span></div><div class="content"><div class="events"></div></div></div></td>');
                }
                $monthDays.append($tr);
            }

            $views.append($view);
            self.$monthView = $view;
        }

        var $weeks = $view.find('.week-days'),
            $days = $view.find('.day'),
            firstDayOfMonth = getFirstDayOfMonth(date),
            // lastDayOfMonth = getLastDayOfMonth(date),
            $week,
            $day,
            $cell,
            year,
            day,
            month,
            today = new Date();
        var firstDay = getNearbyLastWeekDay(firstDayOfMonth),
            thisYear = date.getFullYear(),
            thisMonth = date.getMonth(),
            // thisDay = date.getDate(),
            todayMonth = today.getMonth(),
            todayYear = today.getFullYear(),
            todayDate = today.getDate();
        var lastDay = firstDay.clone().addDays(6 * 7).addMilliseconds(-1),
            printDate = firstDay.clone().addDays(1).addMilliseconds(-1);

        $weeks.each(function(weekIdx)
        {
            $week = $(this);
            $week.find('.day').each(function(dayIndex)
            {
                $day = $(this);
                $cell = $day.closest('.cell-day');
                year = printDate.getFullYear();
                day = printDate.getDate();
                month = printDate.getMonth();
                $day.attr('data-date', printDate.toDateString());
                $day.find('.heading > .number').text(day);

                $day.find('.heading > .month')
                    .toggle((weekIdx === 0 && dayIndex === 0) || day === 1)
                    .text(((month === 0 && day === 1) ? (lang.year.format(year) + ' ') : '') + lang.monthNames[month]);
                $cell.toggleClass('current-month', month === thisMonth);
                $cell.toggleClass('current', (day === todayDate && month === todayMonth && year === todayYear));
                $cell.toggleClass('past', printDate < today);
                $cell.toggleClass('future', printDate > today);
                $day.find('.events').empty();

                printDate.addDays(1);
            });
        });

        if (options.withHeader)
        {
            that.$caption.text(lang.yearMonth.format(thisYear, thisMonth + 1, lang.monthNames[thisMonth]));
            that.$todayBtn.toggleClass('disabled', thisMonth === todayMonth);
        }

        var $event,
            cal,
            // events = this.events,
            calendars = that.calendars;
        $.each(that.events, function(index, e)
        {
            if (e.start >= firstDay && e.start <= lastDay)
            {
                $day = $days.filter('[data-date="' + e.start.toDateString() + '"]');
                if ($day.length)
                {
                    $event = $('<div data-id="' + e.id + '" class="event" title="' + e.desc + '"><span class="time">' + e.start.format('hh:mm') + '</span> <span class="title">' + e.title + '</span></div>');
                    $event.find('.time').toggle(!e.allDay);
                    $event.data('event', e);

                    if (e.calendar)
                    {
                        cal = calendars[e.calendar];
                        if (cal)
                        {
                            $event.data('calendar', cal).css('background-color', cal.color);
                        }
                    }

                    $day.find('.events').append($event);
                }
            }
        });

        if (options.dragThenDrop)
        {
            $view.find('.event').droppable(
            {
                target: $days,
                container: $view,
                flex: true,
                start: function()
                {
                    $e.addClass('event-dragging');
                },
                drop: function(e)
                {
                    var et = e.element.data('event'),
                        newDate = e.target.attr('data-date');
                    var startDate = et.start.clone();
                    if (startDate.toDateString() != newDate)
                    {
                        newDate = new Date(newDate);
                        newDate.setHours(startDate.getHours());
                        newDate.setMinutes(startDate.getMinutes());
                        newDate.setSeconds(startDate.getSeconds());

                        if (self.callEvent('beforeChange',
                        {
                            event: et,
                            change: 'start',
                            to: newDate
                        }))
                        {
                            var oldEnd = et.end.clone();

                            et.end.addMilliseconds(et.end.getTime() - startDate.getTime());
                            et.start = newDate;

                            e.target.find('.events').append(e.element);

                            self.callEvent('change',
                            {
                                data: self.data,
                                changes: [
                                {
                                    event: et,
                                    changes: [
                                    {
                                        change: 'start',
                                        from: startDate,
                                        to: et.start
                                    },
                                    {
                                        change: 'end',
                                        from: oldEnd,
                                        to: et.end
                                    }]
                                }]
                            });
                        }
                    }
                },
                finish: function()
                {
                    $e.removeClass('event-dragging');
                }
            });
        }
    };

    Calendar.prototype.callEvent = function(name, params)
    {
        var result = this.$.callEvent(name + '.' + this.name, params, this);
        return !(result.result !== undefined && (!result.result));
    };

    $.fn.calendar = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data(name);
            var options = typeof option == 'object' && option;

            if (!data) $this.data(name, (data = new Calendar(this, options)));

            if (typeof option == STRING_TYPE_NAME) data[option]();
        });
    };

    $.fn.calendar.Constructor = Calendar;
}(jQuery, window));

/* ========================================================================
 * jQuery Hotkeys Plugin
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 * ========================================================================
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * ======================================================================== */


(function(jQuery){

    jQuery.hotkeys = {
        version: "0.8",

        specialKeys:
        {
            8: "backspace",
            9: "tab",
            13: "return",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            191: "/",
            224: "meta"
        },

        shiftNums:
        {
            "`": "~",
            "1": "!",
            "2": "@",
            "3": "#",
            "4": "$",
            "5": "%",
            "6": "^",
            "7": "&",
            "8": "*",
            "9": "(",
            "0": ")",
            "-": "_",
            "=": "+",
            ";": ": ",
            "'": "\"",
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|"
        }
    };

    function keyHandler(handleObj)
    {
        // Only care when a possible input has been specified
        if (typeof handleObj.data !== "string")
        {
            return;
        }

        var origHandler = handleObj.handler,
            keys = handleObj.data.toLowerCase().split(" ");

        handleObj.handler = function(event)
        {
            // Don't fire in text-accepting inputs that we didn't directly bind to
            if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) ||
                event.target.type === "text"))
            {
                return;
            }

            // Keypress represents characters, not special keys
            var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
                character = String.fromCharCode(event.which).toLowerCase(),
                key, modif = "",
                possible = {};

            // check combinations (alt|ctrl|shift+anything)
            if (event.altKey && special !== "alt")
            {
                modif += "alt+";
            }

            if (event.ctrlKey && special !== "ctrl")
            {
                modif += "ctrl+";
            }

            // TODO: Need to make sure this works consistently across platforms
            if (event.metaKey && !event.ctrlKey && special !== "meta")
            {
                modif += "meta+";
            }

            if (event.shiftKey && special !== "shift")
            {
                modif += "shift+";
            }

            if (special)
            {
                possible[modif + special] = true;

            }
            else
            {
                possible[modif + character] = true;
                possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

                // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
                if (modif === "shift+")
                {
                    possible[jQuery.hotkeys.shiftNums[character]] = true;
                }
            }

            for (var i = 0, l = keys.length; i < l; i++)
            {
                if (possible[keys[i]])
                {
                    return origHandler.apply(this, arguments);
                }
            }
        };
    }

    jQuery.each(["keydown", "keyup", "keypress"], function()
    {
        jQuery.event.special[this] = {
            add: keyHandler
        };
    });

})(jQuery);

/* ========================================================================
 * ZUI: auto-trigger.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($)
{
    'use strict';

    var AutoTrigger = function(element, options)
    {
        this.$ = $(element);
        this.options = this.getOptions(options);

        this.init();
    };

    AutoTrigger.DEFAULTS = {
        trigger: 'toggle',
        selector: null,
        animate: 'slide',
        easing: 'linear',
        animateSpeed: 'fast',
        events: 'click',
        preventDefault: true,
        cancelBubble: true,
        target: null
        //,before:
        //,after:
    }; // default options

    AutoTrigger.prototype.getOptions = function(options)
    {
        options = $.extend(
        {}, AutoTrigger.DEFAULTS, this.$.data(), options);
        return options;
    };

    AutoTrigger.prototype.init = function()
    {
        this.bindEvents();
    };

    AutoTrigger.prototype.bindEvents = function()
    {
        var options = this.options,
            i;
        this.bindTrigger(options);

        if ($.isArray(options.triggers))
        {
            for (i in options.triggers)
            {
                this.bindTrigger($.extend(
                {}, options, options.triggers[i]));
            }
        }
        else if (typeof options.triggers === 'string')
        {
            /* events,trigger,target,data */
            var triggers = options.triggers.split('|');
            for (i in triggers)
            {
                var ops = triggers[i].split(',', 4);
                if (ops.length < 2) continue;
                var option = {};
                if (ops[0]) option.events = ops[0];
                if (ops[1]) option.trigger = ops[1];
                if (ops[2]) option.target = ops[2];
                if (ops[3]) option.data = ops[3];

                this.bindTrigger($.extend(
                {}, options, option));
            }
        }
    };

    AutoTrigger.prototype.bindTrigger = function(options)
    {
        var that = this;
        that.$.on(options.events, options.selector, function(event)
        {
            var target = (!options.target) || options.target == 'self' ? that.$ : $(options.target);
            var data = {
                event: event,
                element: this,
                target: target,
                options: options
            };
            if (!$.callEvent(options.before, data, that)) return;

            if ($.isFunction(options.trigger))
            {
                $.callEvent(options.trigger, data, that);
            }
            else
            {
                var type = options.trigger;
                if (type === 'toggle')
                {
                    type = target.hasClass('hide') ? 'show' : 'hide';
                }
                var params;
                switch (type)
                {
                    case 'toggle':
                        target.toggle();
                        break;
                    case 'show':
                        params = {
                            duration: options.animateSpeed,
                            easing: options.easing
                        };

                        target.removeClass('hide');
                        if (options.animate === 'slide')
                        {
                            target.slideDown(params);
                        }
                        else if (options.animate === 'fade')
                        {
                            target.fadeIn(params);
                        }
                        else
                        {
                            target.show(params);
                        }
                        break;
                    case 'hide':
                        params = {
                            duration: options.animateSpeed,
                            easing: options.easing,
                            complete: function()
                            {
                                target.addClass('hide');
                            }
                        };
                        if (options.animate === 'slide')
                        {
                            target.slideUp(params);
                        }
                        else if (options.animate === 'fade')
                        {
                            target.fadeOut(params);
                        }
                        else
                        {
                            target.hide(params);
                        }
                        break;
                    case 'addClass':
                    case 'removeClass':
                    case 'toggleClass':
                        target[type](options.data);
                        break;
                }
            }

            $.callEvent(options.after, data, that);

            if (options.preventDefault) event.preventDefault();
            if (options.cancelBubble) event.stopPropagation();
        });
    };

    $.fn.autoTrigger = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data('zui.autoTrigger');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('zui.autoTrigger', (data = new AutoTrigger(this, options)));

            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.autoTrigger.Constructor = AutoTrigger;

    $(function()
    {
        $('[data-toggle="autoTrigger"]').autoTrigger();
        $('[data-toggle="toggle"]').autoTrigger();
        $('[data-toggle="show"]').autoTrigger(
        {
            trigger: 'show'
        });
        $('[data-toggle="hide"]').autoTrigger(
        {
            trigger: 'hide'
        });
        $('[data-toggle="addClass"]').autoTrigger(
        {
            trigger: 'addClass'
        });
        $('[data-toggle="removeClass"]').autoTrigger(
        {
            trigger: 'removeClass'
        });
        $('[data-toggle="toggleClass"]').autoTrigger(
        {
            trigger: 'toggleClass'
        });
    });
}(jQuery));

/*!
Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.1.0
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

(function(){
    var $, AbstractChosen, Chosen, SelectParser, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent)
        {
            for (var key in parent)
            {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor()
            {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    SelectParser = (function()
    {
        function SelectParser()
        {
            this.options_index = 0;
            this.parsed = [];
        }

        SelectParser.prototype.add_node = function(child)
        {
            if (child.nodeName.toUpperCase() === "OPTGROUP")
            {
                return this.add_group(child);
            }
            else
            {
                return this.add_option(child);
            }
        };

        SelectParser.prototype.add_group = function(group)
        {
            var group_position, option, _i, _len, _ref, _results;
            group_position = this.parsed.length;
            this.parsed.push(
            {
                array_index: group_position,
                group: true,
                label: this.escapeExpression(group.label),
                children: 0,
                disabled: group.disabled,
                title: group.title,
                search_keys: ($.trim(group.getAttribute('data-keys') || '')).replace(/,/, ' ')
            });
            _ref = group.childNodes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++)
            {
                option = _ref[_i];
                _results.push(this.add_option(option, group_position, group.disabled));
            }
            return _results;
        };

        SelectParser.prototype.add_option = function(option, group_position, group_disabled)
        {
            if (option.nodeName.toUpperCase() === "OPTION")
            {
                if (option.text !== "")
                {
                    if (group_position != null)
                    {
                        this.parsed[group_position].children += 1;
                    }
                    this.parsed.push(
                    {
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        value: option.value,
                        text: option.text,
                        title: option.title,
                        html: option.innerHTML,
                        selected: option.selected,
                        disabled: group_disabled === true ? group_disabled : option.disabled,
                        group_array_index: group_position,
                        classes: option.className,
                        style: option.style.cssText,
                        search_keys: ($.trim(option.getAttribute('data-keys') || '')).replace(/,/, ' ')
                    });
                }
                else
                {
                    this.parsed.push(
                    {
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        empty: true
                    });
                }
                return this.options_index += 1;
            }
        };

        SelectParser.prototype.escapeExpression = function(text)
        {
            var map, unsafe_chars;
            if ((text == null) || text === false)
            {
                return "";
            }
            if (!/[\&\<\>\"\'\`]/.test(text))
            {
                return text;
            }
            map = {
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            };
            unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
            return text.replace(unsafe_chars, function(chr)
            {
                return map[chr] || "&amp;";
            });
        };

        return SelectParser;

    })();

    SelectParser.select_to_array = function(select)
    {
        var child, parser, _i, _len, _ref;
        parser = new SelectParser();
        _ref = select.childNodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++)
        {
            child = _ref[_i];
            parser.add_node(child);
        }
        return parser.parsed;
    };

    AbstractChosen = (function()
    {
        function AbstractChosen(form_field, options)
        {
            this.form_field = form_field;
            this.options = options != null ? options :
            {};
            if (!AbstractChosen.browser_is_supported())
            {
                return;
            }
            this.is_multiple = this.form_field.multiple;
            this.set_default_text();
            this.set_default_values();
            this.setup();
            this.set_up_html();
            this.register_observers();
        }

        AbstractChosen.prototype.set_default_values = function()
        {
            var _this = this;
            this.click_test_action = function(evt)
            {
                return _this.test_active_click(evt);
            };
            this.activate_action = function(evt)
            {
                return _this.activate_field(evt);
            };
            this.active_field = false;
            this.mouse_on_container = false;
            this.results_showing = false;
            this.result_highlighted = null;
            this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
            this.disable_search_threshold = this.options.disable_search_threshold || 0;
            this.disable_search = this.options.disable_search || false;
            this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
            this.group_search = this.options.group_search != null ? this.options.group_search : true;
            this.search_contains = this.options.search_contains || false;
            this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
            this.max_selected_options = this.options.max_selected_options || Infinity;
            this.inherit_select_classes = this.options.inherit_select_classes || false;
            this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
            return this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
        };

        AbstractChosen.prototype.set_default_text = function()
        {
            if (this.form_field.getAttribute("data-placeholder"))
            {
                this.default_text = this.form_field.getAttribute("data-placeholder");
            }
            else if (this.is_multiple)
            {
                this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
            }
            else
            {
                this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
            }
            return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
        };

        AbstractChosen.prototype.mouse_enter = function()
        {
            return this.mouse_on_container = true;
        };

        AbstractChosen.prototype.mouse_leave = function()
        {
            return this.mouse_on_container = false;
        };

        AbstractChosen.prototype.input_focus = function(evt)
        {
            var _this = this;
            if (this.is_multiple)
            {
                if (!this.active_field)
                {
                    return setTimeout((function()
                    {
                        return _this.container_mousedown();
                    }), 50);
                }
            }
            else
            {
                if (!this.active_field)
                {
                    return this.activate_field();
                }
            }
        };

        AbstractChosen.prototype.input_blur = function(evt)
        {
            var _this = this;
            if (!this.mouse_on_container)
            {
                this.active_field = false;
                return setTimeout((function()
                {
                    return _this.blur_test();
                }), 100);
            }
        };

        AbstractChosen.prototype.results_option_build = function(options)
        {
            var content, data, _i, _len, _ref;
            content = '';
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++)
            {
                data = _ref[_i];
                if (data.group)
                {
                    content += this.result_add_group(data);
                }
                else
                {
                    content += this.result_add_option(data);
                }
                if (options != null ? options.first : void 0)
                {
                    if (data.selected && this.is_multiple)
                    {
                        this.choice_build(data);
                    }
                    else if (data.selected && !this.is_multiple)
                    {
                        this.single_set_selected_text(data.text);
                    }
                }
            }
            return content;
        };

        AbstractChosen.prototype.result_add_option = function(option)
        {
            var classes, option_el;
            if (!option.search_match)
            {
                return '';
            }
            if (!this.include_option_in_results(option))
            {
                return '';
            }
            classes = [];
            if (!option.disabled && !(option.selected && this.is_multiple))
            {
                classes.push("active-result");
            }
            if (option.disabled && !(option.selected && this.is_multiple))
            {
                classes.push("disabled-result");
            }
            if (option.selected)
            {
                classes.push("result-selected");
            }
            if (option.group_array_index != null)
            {
                classes.push("group-option");
            }
            if (option.classes !== "")
            {
                classes.push(option.classes);
            }
            option_el = document.createElement("li");
            option_el.className = classes.join(" ");
            option_el.style.cssText = option.style;
            option_el.title = option.title;
            option_el.setAttribute("data-option-array-index", option.array_index);
            option_el.innerHTML = option.search_text;
            return this.outerHTML(option_el);
        };

        AbstractChosen.prototype.result_add_group = function(group)
        {
            var group_el;
            if (!(group.search_match || group.group_match))
            {
                return '';
            }
            if (!(group.active_options > 0))
            {
                return '';
            }
            group_el = document.createElement("li");
            group_el.className = "group-result";
            group_el.title = group.title;
            group_el.innerHTML = group.search_text;
            return this.outerHTML(group_el);
        };

        AbstractChosen.prototype.results_update_field = function()
        {
            this.set_default_text();
            if (!this.is_multiple)
            {
                this.results_reset_cleanup();
            }
            this.result_clear_highlight();
            this.results_build();
            if (this.results_showing)
            {
                return this.winnow_results();
            }
        };

        AbstractChosen.prototype.reset_single_select_options = function()
        {
            var result, _i, _len, _ref, _results;
            _ref = this.results_data;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++)
            {
                result = _ref[_i];
                if (result.selected)
                {
                    _results.push(result.selected = false);
                }
                else
                {
                    _results.push(void 0);
                }
            }
            return _results;
        };

        AbstractChosen.prototype.results_toggle = function()
        {
            if (this.results_showing)
            {
                return this.results_hide();
            }
            else
            {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.results_search = function(evt)
        {
            if (this.results_showing)
            {
                return this.winnow_results();
            }
            else
            {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.winnow_results = function()
        {
            var escapedSearchText, option, regex, regexAnchor, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
            this.no_results_clear();
            results = 0;
            searchText = this.get_search_text();
            escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            regexAnchor = this.search_contains ? "" : "^";
            regex = new RegExp(regexAnchor + escapedSearchText, 'i');
            zregex = new RegExp(escapedSearchText, 'i');
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++)
            {
                option = _ref[_i];
                option.search_match = false;
                results_group = null;
                if (this.include_option_in_results(option))
                {
                    if (option.group)
                    {
                        option.group_match = false;
                        option.active_options = 0;
                    }
                    if ((option.group_array_index != null) && this.results_data[option.group_array_index])
                    {
                        results_group = this.results_data[option.group_array_index];
                        if (results_group.active_options === 0 && results_group.search_match)
                        {
                            results += 1;
                        }
                        results_group.active_options += 1;
                    }
                    if (!(option.group && !this.group_search))
                    {
                        option.search_text = option.group ? option.label : option.html;
                        option.search_keys_match = this.search_string_match(option.search_keys, regex);
                        option.search_text_match = this.search_string_match(option.search_text, regex);
                        option.search_match = option.search_text_match || option.search_keys_match;
                        if (option.search_match && !option.group)
                        {
                            results += 1;
                        }
                        if (option.search_match)
                        {
                            if (option.search_text_match && option.search_text.length)
                            {
                                startpos = option.search_text.search(zregex);
                                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
                            }
                            else if (option.search_keys_match && option.search_keys.length)
                            {
                                startpos = option.search_keys.search(zregex);
                                text = option.search_keys.substr(0, startpos + searchText.length) + '</em>' + option.search_keys.substr(startpos + searchText.length);
                                option.search_text += '&nbsp; <small style="opacity: 0.7">' + text.substr(0, startpos) + '<em>' + text.substr(startpos) + '</small>';
                            }
                            if (results_group != null)
                            {
                                results_group.group_match = true;
                            }
                        }
                        else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match)
                        {
                            option.search_match = true;
                        }
                    }
                }
            }
            this.result_clear_highlight();
            if (results < 1 && searchText.length)
            {
                this.update_results_content("");
                return this.no_results(searchText);
            }
            else
            {
                this.update_results_content(this.results_option_build());
                return this.winnow_results_set_highlight();
            }
        };

        AbstractChosen.prototype.search_string_match = function(search_string, regex)
        {
            var part, parts, _i, _len;
            if (regex.test(search_string))
            {
                return true;
            }
            else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0))
            {
                parts = search_string.replace(/\[|\]/g, "").split(" ");
                if (parts.length)
                {
                    for (_i = 0, _len = parts.length; _i < _len; _i++)
                    {
                        part = parts[_i];
                        if (regex.test(part))
                        {
                            return true;
                        }
                    }
                }
            }
        };

        AbstractChosen.prototype.choices_count = function()
        {
            var option, _i, _len, _ref;
            if (this.selected_option_count != null)
            {
                return this.selected_option_count;
            }
            this.selected_option_count = 0;
            _ref = this.form_field.options;
            for (_i = 0, _len = _ref.length; _i < _len; _i++)
            {
                option = _ref[_i];
                if (option.selected && option.value != '')
                {
                    this.selected_option_count += 1;
                }
            }
            return this.selected_option_count;
        };

        AbstractChosen.prototype.choices_click = function(evt)
        {
            evt.preventDefault();
            if (!(this.results_showing || this.is_disabled))
            {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.keyup_checker = function(evt)
        {
            var stroke, _ref;
            stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
            this.search_field_scale();
            switch (stroke)
            {
                case 8:
                    if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0)
                    {
                        return this.keydown_backstroke();
                    }
                    else if (!this.pending_backstroke)
                    {
                        this.result_clear_highlight();
                        return this.results_search();
                    }
                    break;
                case 13:
                    evt.preventDefault();
                    if (this.results_showing)
                    {
                        return this.result_select(evt);
                    }
                    break;
                case 27:
                    if (this.results_showing)
                    {
                        this.results_hide();
                    }
                    return true;
                case 9:
                case 38:
                case 40:
                case 16:
                case 91:
                case 17:
                    break;
                default:
                    return this.results_search();
            }
        };

        AbstractChosen.prototype.clipboard_event_checker = function(evt)
        {
            var _this = this;
            return setTimeout((function()
            {
                return _this.results_search();
            }), 50);
        };

        AbstractChosen.prototype.container_width = function()
        {
            if (this.options.width != null)
            {
                return this.options.width;
            }
            else
            {
                return "" + this.form_field.offsetWidth + "px";
            }
        };

        AbstractChosen.prototype.include_option_in_results = function(option)
        {
            if (this.is_multiple && (!this.display_selected_options && option.selected))
            {
                return false;
            }
            if (!this.display_disabled_options && option.disabled)
            {
                return false;
            }
            if (option.empty)
            {
                return false;
            }
            return true;
        };

        AbstractChosen.prototype.search_results_touchstart = function(evt)
        {
            this.touch_started = true;
            return this.search_results_mouseover(evt);
        };

        AbstractChosen.prototype.search_results_touchmove = function(evt)
        {
            this.touch_started = false;
            return this.search_results_mouseout(evt);
        };

        AbstractChosen.prototype.search_results_touchend = function(evt)
        {
            if (this.touch_started)
            {
                return this.search_results_mouseup(evt);
            }
        };

        AbstractChosen.prototype.outerHTML = function(element)
        {
            var tmp;
            if (element.outerHTML)
            {
                return element.outerHTML;
            }
            tmp = document.createElement("div");
            tmp.appendChild(element);
            return tmp.innerHTML;
        };

        AbstractChosen.browser_is_supported = function()
        {
            if (window.navigator.appName === "Microsoft Internet Explorer")
            {
                return document.documentMode >= 8;
            }
            if (/iP(od|hone)/i.test(window.navigator.userAgent))
            {
                return false;
            }
            if (/Android/i.test(window.navigator.userAgent))
            {
                if (/Mobile/i.test(window.navigator.userAgent))
                {
                    return false;
                }
            }
            return true;
        };

        AbstractChosen.default_multiple_text = "";

        AbstractChosen.default_single_text = "";

        AbstractChosen.default_no_result_text = "No results match";

        return AbstractChosen;

    })();

    $ = jQuery;

    $.fn.extend(
    {
        chosen: function(options)
        {
            if (!AbstractChosen.browser_is_supported())
            {
                return this;
            }
            return this.each(function(input_field)
            {
                var $this, chosen;
                $this = $(this);
                chosen = $this.data('chosen');
                if (options === 'destroy' && chosen)
                {
                    chosen.destroy();
                }
                else if (!chosen)
                {
                    $this.data('chosen', new Chosen(this, options));
                }
            });
        }
    });

    Chosen = (function(_super)
    {
        __extends(Chosen, _super);

        function Chosen()
        {
            _ref = Chosen.__super__.constructor.apply(this, arguments);
            return _ref;
        }

        Chosen.prototype.setup = function()
        {
            this.form_field_jq = $(this.form_field);
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
        };

        Chosen.prototype.set_up_html = function()
        {
            var container_classes, container_props;
            container_classes = ["chosen-container"];
            container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
            if (this.inherit_select_classes && this.form_field.className)
            {
                container_classes.push(this.form_field.className);
            }
            if (this.is_rtl)
            {
                container_classes.push("chosen-rtl");
            }
            var strClass = this.form_field.getAttribute('data-css-class');
            if(strClass)
            {
                container_classes.push(strClass);
            }

            container_props = {
                'class': container_classes.join(' '),
                'style': "width: " + (this.container_width()) + ";",
                'title': this.form_field.title
            };
            if (this.form_field.id.length)
            {
                container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
            }
            this.container = $("<div />", container_props);
            if (this.is_multiple)
            {
                this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
            }
            else
            {
                this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
            }
            this.form_field_jq.hide().after(this.container);
            this.dropdown = this.container.find('div.chosen-drop').first();
            this.search_field = this.container.find('input').first();
            this.search_results = this.container.find('ul.chosen-results').first();
            this.search_field_scale();
            this.search_no_results = this.container.find('li.no-results').first();
            if (this.is_multiple)
            {
                this.search_choices = this.container.find('ul.chosen-choices').first();
                this.search_container = this.container.find('li.search-field').first();
            }
            else
            {
                this.search_container = this.container.find('div.chosen-search').first();
                this.selected_item = this.container.find('.chosen-single').first();
            }
            if(this.options.drop_width)
            {
                this.dropdown.css('width', this.options.drop_width).addClass('chosen-drop-size-limited');
            }
            this.results_build();
            this.set_tab_index();
            this.set_label_behavior();
            return this.form_field_jq.trigger("chosen:ready",
            {
                chosen: this
            });
        };

        Chosen.prototype.register_observers = function()
        {
            var _this = this;
            this.container.bind('mousedown.chosen', function(evt)
            {
                _this.container_mousedown(evt);
            });
            this.container.bind('mouseup.chosen', function(evt)
            {
                _this.container_mouseup(evt);
            });
            this.container.bind('mouseenter.chosen', function(evt)
            {
                _this.mouse_enter(evt);
            });
            this.container.bind('mouseleave.chosen', function(evt)
            {
                _this.mouse_leave(evt);
            });
            this.search_results.bind('mouseup.chosen', function(evt)
            {
                _this.search_results_mouseup(evt);
            });
            this.search_results.bind('mouseover.chosen', function(evt)
            {
                _this.search_results_mouseover(evt);
            });
            this.search_results.bind('mouseout.chosen', function(evt)
            {
                _this.search_results_mouseout(evt);
            });
            this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt)
            {
                _this.search_results_mousewheel(evt);
            });
            this.search_results.bind('touchstart.chosen', function(evt)
            {
                _this.search_results_touchstart(evt);
            });
            this.search_results.bind('touchmove.chosen', function(evt)
            {
                _this.search_results_touchmove(evt);
            });
            this.search_results.bind('touchend.chosen', function(evt)
            {
                _this.search_results_touchend(evt);
            });
            this.form_field_jq.bind("chosen:updated.chosen", function(evt)
            {
                _this.results_update_field(evt);
            });
            this.form_field_jq.bind("chosen:activate.chosen", function(evt)
            {
                _this.activate_field(evt);
            });
            this.form_field_jq.bind("chosen:open.chosen", function(evt)
            {
                _this.container_mousedown(evt);
            });
            this.form_field_jq.bind("chosen:close.chosen", function(evt)
            {
                _this.input_blur(evt);
            });
            this.search_field.bind('blur.chosen', function(evt)
            {
                _this.input_blur(evt);
            });
            this.search_field.bind('keyup.chosen', function(evt)
            {
                _this.keyup_checker(evt);
            });
            this.search_field.bind('keydown.chosen', function(evt)
            {
                _this.keydown_checker(evt);
            });
            this.search_field.bind('focus.chosen', function(evt)
            {
                _this.input_focus(evt);
            });
            this.search_field.bind('cut.chosen', function(evt)
            {
                _this.clipboard_event_checker(evt);
            });
            this.search_field.bind('paste.chosen', function(evt)
            {
                _this.clipboard_event_checker(evt);
            });
            if (this.is_multiple)
            {
                return this.search_choices.bind('click.chosen', function(evt)
                {
                    _this.choices_click(evt);
                });
            }
            else
            {
                return this.container.bind('click.chosen', function(evt)
                {
                    evt.preventDefault();
                });
            }
        };

        Chosen.prototype.destroy = function()
        {
            $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            if (this.search_field[0].tabIndex)
            {
                this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
            }
            this.container.remove();
            this.form_field_jq.removeData('chosen');
            return this.form_field_jq.show();
        };

        Chosen.prototype.search_field_disabled = function()
        {
            this.is_disabled = this.form_field_jq[0].disabled;
            if (this.is_disabled)
            {
                this.container.addClass('chosen-disabled');
                this.search_field[0].disabled = true;
                if (!this.is_multiple)
                {
                    this.selected_item.unbind("focus.chosen", this.activate_action);
                }
                return this.close_field();
            }
            else
            {
                this.container.removeClass('chosen-disabled');
                this.search_field[0].disabled = false;
                if (!this.is_multiple)
                {
                    return this.selected_item.bind("focus.chosen", this.activate_action);
                }
            }
        };

        Chosen.prototype.container_mousedown = function(evt)
        {
            if (!this.is_disabled)
            {
                if (evt && evt.type === "mousedown" && !this.results_showing)
                {
                    evt.preventDefault();
                }
                if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close")))
                {
                    if (!this.active_field)
                    {
                        if (this.is_multiple)
                        {
                            this.search_field.val("");
                        }
                        $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
                        this.results_show();
                    }
                    else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length))
                    {
                        evt.preventDefault();
                        this.results_toggle();
                    }
                    return this.activate_field();
                }
            }
        };

        Chosen.prototype.container_mouseup = function(evt)
        {
            if (evt.target.nodeName === "ABBR" && !this.is_disabled)
            {
                return this.results_reset(evt);
            }
        };

        Chosen.prototype.search_results_mousewheel = function(evt)
        {
            var delta;
            if (evt.originalEvent)
            {
                delta = -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
            }
            if (delta != null)
            {
                evt.preventDefault();
                if (evt.type === 'DOMMouseScroll')
                {
                    delta = delta * 40;
                }
                return this.search_results.scrollTop(delta + this.search_results.scrollTop());
            }
        };

        Chosen.prototype.blur_test = function(evt)
        {
            if (!this.active_field && this.container.hasClass("chosen-container-active"))
            {
                return this.close_field();
            }
        };

        Chosen.prototype.close_field = function()
        {
            $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            this.active_field = false;
            this.results_hide();
            this.container.removeClass("chosen-container-active");
            this.clear_backstroke();
            this.show_search_field_default();
            return this.search_field_scale();
        };

        Chosen.prototype.activate_field = function()
        {
            this.container.addClass("chosen-container-active");
            this.active_field = true;
            this.search_field.val(this.search_field.val());
            return this.search_field.focus();
        };

        Chosen.prototype.test_active_click = function(evt)
        {
            var active_container;
            active_container = $(evt.target).closest('.chosen-container');
            if (active_container.length && this.container[0] === active_container[0])
            {
                return this.active_field = true;
            }
            else
            {
                return this.close_field();
            }
        };

        Chosen.prototype.results_build = function()
        {
            this.parsing = true;
            this.selected_option_count = null;
            this.results_data = SelectParser.select_to_array(this.form_field);
            if (this.is_multiple)
            {
                this.search_choices.find("li.search-choice").remove();
            }
            else if (!this.is_multiple)
            {
                this.single_set_selected_text();
                if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold)
                {
                    this.search_field[0].readOnly = true;
                    this.container.addClass("chosen-container-single-nosearch");
                }
                else
                {
                    this.search_field[0].readOnly = false;
                    this.container.removeClass("chosen-container-single-nosearch");
                }
            }
            this.update_results_content(this.results_option_build(
            {
                first: true
            }));
            this.search_field_disabled();
            this.show_search_field_default();
            this.search_field_scale();
            return this.parsing = false;
        };

        Chosen.prototype.result_do_highlight = function(el)
        {
            var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
            if (el.length)
            {
                this.result_clear_highlight();
                this.result_highlight = el;
                this.result_highlight.addClass("highlighted");
                maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
                visible_top = this.search_results.scrollTop();
                visible_bottom = maxHeight + visible_top;
                high_top = this.result_highlight.position().top + this.search_results.scrollTop();
                high_bottom = high_top + this.result_highlight.outerHeight();
                if (high_bottom >= visible_bottom)
                {
                    return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                }
                else if (high_top < visible_top)
                {
                    return this.search_results.scrollTop(high_top);
                }
            }
        };

        Chosen.prototype.result_clear_highlight = function()
        {
            if (this.result_highlight)
            {
                this.result_highlight.removeClass("highlighted");
            }
            return this.result_highlight = null;
        };

        Chosen.prototype.results_show = function()
        {
            if (this.is_multiple && this.max_selected_options <= this.choices_count())
            {
                this.form_field_jq.trigger("chosen:maxselected",
                {
                    chosen: this
                });
                return false;
            }
            this.container.addClass("chosen-with-drop");
            this.results_showing = true;
            this.search_field.focus();
            this.search_field.val(this.search_field.val());
            this.winnow_results();
            return this.form_field_jq.trigger("chosen:showing_dropdown",
            {
                chosen: this
            });
        };

        Chosen.prototype.update_results_content = function(content)
        {
            return this.search_results.html(content);
        };

        Chosen.prototype.results_hide = function()
        {
            if (this.results_showing)
            {
                this.result_clear_highlight();
                this.container.removeClass("chosen-with-drop");
                this.form_field_jq.trigger("chosen:hiding_dropdown",
                {
                    chosen: this
                });
            }
            return this.results_showing = false;
        };

        Chosen.prototype.set_tab_index = function(el)
        {
            var ti;
            if (this.form_field.tabIndex)
            {
                ti = this.form_field.tabIndex;
                this.form_field.tabIndex = -1;
                return this.search_field[0].tabIndex = ti;
            }
        };

        Chosen.prototype.set_label_behavior = function()
        {
            var _this = this;
            this.form_field_label = this.form_field_jq.parents("label");
            if (!this.form_field_label.length && this.form_field.id.length)
            {
                this.form_field_label = $("label[for='" + this.form_field.id + "']");
            }
            if (this.form_field_label.length > 0)
            {
                return this.form_field_label.bind('click.chosen', function(evt)
                {
                    if (_this.is_multiple)
                    {
                        return _this.container_mousedown(evt);
                    }
                    else
                    {
                        return _this.activate_field();
                    }
                });
            }
        };

        Chosen.prototype.show_search_field_default = function()
        {
            if (this.is_multiple && this.choices_count() < 1 && !this.active_field)
            {
                this.search_field.val(this.default_text);
                return this.search_field.addClass("default");
            }
            else
            {
                this.search_field.val("");
                return this.search_field.removeClass("default");
            }
        };

        Chosen.prototype.search_results_mouseup = function(evt)
        {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target.length)
            {
                this.result_highlight = target;
                this.result_select(evt);
                return this.search_field.focus();
            }
        };

        Chosen.prototype.search_results_mouseover = function(evt)
        {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target)
            {
                return this.result_do_highlight(target);
            }
        };

        Chosen.prototype.search_results_mouseout = function(evt)
        {
            if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first()))
            {
                return this.result_clear_highlight();
            }
        };

        Chosen.prototype.choice_build = function(item)
        {
            var choice, close_link,
                _this = this;
            choice = $('<li />',
            {
                "class": "search-choice"
            }).html("<span>" + item.html + "</span>");
            if (item.disabled)
            {
                choice.addClass('search-choice-disabled');
            }
            else
            {
                close_link = $('<a />',
                {
                    "class": 'search-choice-close',
                    'data-option-array-index': item.array_index
                });
                close_link.bind('click.chosen', function(evt)
                {
                    return _this.choice_destroy_link_click(evt);
                });
                choice.append(close_link);
            }
            return this.search_container.before(choice);
        };

        Chosen.prototype.choice_destroy_link_click = function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
            if (!this.is_disabled)
            {
                return this.choice_destroy($(evt.target));
            }
        };

        Chosen.prototype.choice_destroy = function(link)
        {
            if (this.result_deselect(link[0].getAttribute("data-option-array-index")))
            {
                this.show_search_field_default();
                if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1)
                {
                    this.results_hide();
                }
                link.parents('li').first().remove();
                return this.search_field_scale();
            }
        };

        Chosen.prototype.results_reset = function()
        {
            this.reset_single_select_options();
            this.form_field.options[0].selected = true;
            this.single_set_selected_text();
            this.show_search_field_default();
            this.results_reset_cleanup();
            this.form_field_jq.trigger("change");
            if (this.active_field)
            {
                return this.results_hide();
            }
        };

        Chosen.prototype.results_reset_cleanup = function()
        {
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.selected_item.find("abbr").remove();
        };

        Chosen.prototype.result_select = function(evt)
        {
            var high, item;
            if (this.result_highlight)
            {
                high = this.result_highlight;
                this.result_clear_highlight();
                if (this.is_multiple && this.max_selected_options <= this.choices_count())
                {
                    this.form_field_jq.trigger("chosen:maxselected",
                    {
                        chosen: this
                    });
                    return false;
                }
                if (this.is_multiple)
                {
                    high.removeClass("active-result");
                }
                else
                {
                    this.reset_single_select_options();
                }
                item = this.results_data[high[0].getAttribute("data-option-array-index")];
                item.selected = true;
                this.form_field.options[item.options_index].selected = true;
                this.selected_option_count = null;
                if (this.is_multiple)
                {
                    this.choice_build(item);
                }
                else
                {
                    this.single_set_selected_text(item.text);
                }
                if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple))
                {
                    this.results_hide();
                }
                this.search_field.val("");
                if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex)
                {
                    this.form_field_jq.trigger("change",
                    {
                        'selected': this.form_field.options[item.options_index].value
                    });
                }
                this.current_selectedIndex = this.form_field.selectedIndex;
                return this.search_field_scale();
            }
        };

        Chosen.prototype.single_set_selected_text = function(text)
        {
            if (text == null)
            {
                text = this.default_text;
            }
            if (text === this.default_text)
            {
                this.selected_item.addClass("chosen-default");
            }
            else
            {
                this.single_deselect_control_build();
                this.selected_item.removeClass("chosen-default");
            }
            return this.selected_item.find("span").text(text);
        };

        Chosen.prototype.result_deselect = function(pos)
        {
            var result_data;
            result_data = this.results_data[pos];
            if (!this.form_field.options[result_data.options_index].disabled)
            {
                result_data.selected = false;
                this.form_field.options[result_data.options_index].selected = false;
                this.selected_option_count = null;
                this.result_clear_highlight();
                if (this.results_showing)
                {
                    this.winnow_results();
                }
                this.form_field_jq.trigger("change",
                {
                    deselected: this.form_field.options[result_data.options_index].value
                });
                this.search_field_scale();
                return true;
            }
            else
            {
                return false;
            }
        };

        Chosen.prototype.single_deselect_control_build = function()
        {
            if (!this.allow_single_deselect)
            {
                return;
            }
            if (!this.selected_item.find("abbr").length)
            {
                this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
            }
            return this.selected_item.addClass("chosen-single-with-deselect");
        };

        Chosen.prototype.get_search_text = function()
        {
            if (this.search_field.val() === this.default_text)
            {
                return "";
            }
            else
            {
                return $('<div/>').text($.trim(this.search_field.val())).html();
            }
        };

        Chosen.prototype.winnow_results_set_highlight = function()
        {
            var do_high, selected_results;
            selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
            do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
            if (do_high != null)
            {
                return this.result_do_highlight(do_high);
            }
        };

        Chosen.prototype.no_results = function(terms)
        {
            var no_results_html;
            no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
            no_results_html.find("span").first().html(terms);
            this.search_results.append(no_results_html);
            return this.form_field_jq.trigger("chosen:no_results",
            {
                chosen: this
            });
        };

        Chosen.prototype.no_results_clear = function()
        {
            return this.search_results.find(".no-results").remove();
        };

        Chosen.prototype.keydown_arrow = function()
        {
            var next_sib;
            if (this.results_showing && this.result_highlight)
            {
                next_sib = this.result_highlight.nextAll("li.active-result").first();
                if (next_sib)
                {
                    return this.result_do_highlight(next_sib);
                }
            }
            else
            {
                return this.results_show();
            }
        };

        Chosen.prototype.keyup_arrow = function()
        {
            var prev_sibs;
            if (!this.results_showing && !this.is_multiple)
            {
                return this.results_show();
            }
            else if (this.result_highlight)
            {
                prev_sibs = this.result_highlight.prevAll("li.active-result");
                if (prev_sibs.length)
                {
                    return this.result_do_highlight(prev_sibs.first());
                }
                else
                {
                    if (this.choices_count() > 0)
                    {
                        this.results_hide();
                    }
                    return this.result_clear_highlight();
                }
            }
        };

        Chosen.prototype.keydown_backstroke = function()
        {
            var next_available_destroy;
            if (this.pending_backstroke)
            {
                this.choice_destroy(this.pending_backstroke.find("a").first());
                return this.clear_backstroke();
            }
            else
            {
                next_available_destroy = this.search_container.siblings("li.search-choice").last();
                if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled"))
                {
                    this.pending_backstroke = next_available_destroy;
                    if (this.single_backstroke_delete)
                    {
                        return this.keydown_backstroke();
                    }
                    else
                    {
                        return this.pending_backstroke.addClass("search-choice-focus");
                    }
                }
            }
        };

        Chosen.prototype.clear_backstroke = function()
        {
            if (this.pending_backstroke)
            {
                this.pending_backstroke.removeClass("search-choice-focus");
            }
            return this.pending_backstroke = null;
        };

        Chosen.prototype.keydown_checker = function(evt)
        {
            var stroke, _ref1;
            stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
            this.search_field_scale();
            if (stroke !== 8 && this.pending_backstroke)
            {
                this.clear_backstroke();
            }
            switch (stroke)
            {
                case 8:
                    this.backstroke_length = this.search_field.val().length;
                    break;
                case 9:
                    if (this.results_showing && !this.is_multiple)
                    {
                        this.result_select(evt);
                    }
                    this.mouse_on_container = false;
                    break;
                case 13:
                    evt.preventDefault();
                    break;
                case 38:
                    evt.preventDefault();
                    this.keyup_arrow();
                    break;
                case 40:
                    evt.preventDefault();
                    this.keydown_arrow();
                    break;
            }
        };

        Chosen.prototype.search_field_scale = function()
        {
            var div, f_width, h, style, style_block, styles, w, _i, _len;
            if (this.is_multiple)
            {
                h = 0;
                w = 0;
                style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
                styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
                for (_i = 0, _len = styles.length; _i < _len; _i++)
                {
                    style = styles[_i];
                    style_block += style + ":" + this.search_field.css(style) + ";";
                }
                div = $('<div />',
                {
                    'style': style_block
                });
                div.text(this.search_field.val());
                $('body').append(div);
                w = div.width() + 25;
                div.remove();
                f_width = this.container.outerWidth();
                if (w > f_width - 10)
                {
                    w = f_width - 10;
                }
                return this.search_field.css(
                {
                    'width': w + 'px'
                });
            }
        };

        return Chosen;

    })(AbstractChosen);

}).call(this);

/* ========================================================================
 * ZUI: chosen.icons.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


+ function($)
{
    'use strict';

    var ChosenIcons = function(element, options)
    {
        this.$ = $(element);
        this.options = this.getOptions(options);
        this.lang = ChosenIcons.LANGS[this.options.lang];
        this.id = 'chosen-icons-' + parseInt(Math.random() * 10000000000 + 1);

        this.init();
    };

    ChosenIcons.DEFAULTS = {
        canEmpty: true,
        lang: 'zh-cn',
        commonIcons: ['heart', 'user', 'group', 'list-ul', 'th', 'th-large', 'star', 'star-empty', 'search', 'envelope', 'dashboard', 'sitemap', 'umbrella', 'lightbulb', 'envelope-alt', 'cog', 'ok', 'remove', 'home', 'time', 'flag', 'flag-alt', 'flag-checkered', 'qrcode', 'tag', 'tags', 'book', 'bookmark', 'bookmark-empty', 'print', 'camera', 'picture', 'globe', 'map-marker', 'edit', 'edit-sign', 'play', 'stop', 'plus-sign', 'minus-sign', 'remove-sign', 'ok-sign', 'check-sign', 'question-sign', 'info-sign', 'exclamation-sign', 'plus', 'plus-sign', 'minus', 'minus-sign', 'asterisk', 'calendar', 'calendar-empty', 'comment', 'comment-alt', 'comments', 'comments-alt', 'folder-close', 'folder-open', 'folder-close-alt', 'folder-open-alt', 'thumbs-up', 'thumbs-down', 'pushpin', 'building', 'phone', 'rss', 'rss-sign', 'bullhorn', 'bell', 'bell-alt', 'certificate', 'wrench', 'tasks', 'cloud', 'beaker', 'magic', 'smile', 'frown', 'meh', 'code', 'location-arrow'],
        webIcons: ['share', 'pencil', 'trash', 'file-alt', 'file', 'file-text', 'download-alt', 'upload-alt', 'inbox', 'repeat', 'refresh', 'lock', 'check', 'check-empty', 'eye-open', 'eye-close', 'key', 'signin', 'signout', 'external-link', 'external-link-sign', 'link', 'reorder', 'quote-left', 'quote-right', 'spinner', 'reply', 'question', 'info', 'archive', 'collapse', 'collapse-top'],
        editorIcons: ['table', 'copy', 'save', 'list-ol', 'paste', 'keyboard', 'paper-clip', 'crop', 'unlink', 'sort-by-alphabet', 'sort-by-alphabet-alt', 'sort-by-attributes', 'sort-by-attributes-alt', 'sort-by-order', 'sort-by-order-alt'],
        directionalIcons: ['chevron-left', 'chevron-right', 'chevron-down', 'chevron-up', 'arrow-left', 'arrow-right', 'arrow-down', 'arrow-up', 'hand-right', 'hand-left', 'hand-up', 'hand-down', 'circle-arrow-left', 'circle-arrow-right', 'circle-arrow-up', 'circle-arrow-down', 'double-angle-left', 'double-angle-right', 'double-angle-down', 'double-angle-up', 'angle-left', 'angle-right', 'angle-down', 'angle-up', 'long-arrow-left', 'long-arrow-right', 'long-arrow-down', 'long-arrow-up', 'caret-left', 'caret-right', 'caret-down', 'caret-up'],
        otherIcons: ['desktop', 'laptop', 'tablet', 'mobile', 'building', 'firefox', 'ie', 'opera', 'qq', 'lemon', 'sign-blank', 'circle', 'circle-blank', 'terminal', 'html5', 'android', 'apple', 'windows', 'weibo', 'renren', 'bug', 'moon', 'sun']
    };

    ChosenIcons.LANGS = {};
    ChosenIcons.LANGS['zh-cn'] = {
        emptyIcon: '[没有图标]',
        commonIcons: '常用图标',
        webIcons: 'Web 图标',
        editorIcons: '编辑器图标',
        directionalIcons: '箭头总汇',
        otherIcons: '其他图标',
    };
    ChosenIcons.LANGS['en'] = {
        emptyIcon: '[No Icon]',
        commonIcons: 'Common Icons',
        webIcons: 'Web Icons',
        editorIcons: 'Editor Icons',
        directionalIcons: 'Directional Icons',
        otherIcons: 'Other Icons'
    };
    ChosenIcons.LANGS['zh-tw'] = {
        emptyIcon: '[沒有圖標]',
        commonIcons: '常用圖標',
        webIcons: 'Web 圖標',
        editorIcons: '編輯器圖標',
        directionalIcons: '箭頭總匯',
        otherIcons: '其他圖標'
    };

    ChosenIcons.prototype.getOptions = function(options)
    {
        options = $.extend(
        {}, ChosenIcons.DEFAULTS, this.$.data(), options);
        return options;
    };

    ChosenIcons.prototype.init = function()
    {
        var $this = this.$.addClass('chosen-icons').addClass(this.id);

        $this.empty();

        if (this.options.canEmpty)
        {
            $this.append(this.getOptionHtml());
        }

        var lang = this.lang;

        $this.append(this.getgroupHtml('commonIcons'));
        $this.append(this.getgroupHtml('webIcons'));
        $this.append(this.getgroupHtml('editorIcons'));
        $this.append(this.getgroupHtml('directionalIcons'));
        $this.append(this.getgroupHtml('otherIcons'));

        $this.chosen(
        {
            placeholder_text: ' ',
            disable_search: true,
            width: '100%',
            inherit_select_classes: true
        });

        var chosenSelector = '.chosen-container.' + this.id;

        $this.on('chosen:showing_dropdown', function()
        {
            $(chosenSelector + ' .chosen-results .group-option').each(function()
            {
                var $this = $(this).addClass('icon');
                var text = $(this).text();
                $this.html('<i class="icon-' + text + '" title="' + text + '"></i>');
            });
        }).change(function()
        {
            var span = $(chosenSelector + ' .chosen-single > span');
            var text = $(this).val();

            if (text && text.length > 0)
                span.html('<i class="' + text + '"></i> &nbsp; <span class="text-muted">' + text.substr(5).replace(/-/g, ' ') + '</span>');
            else span.html('<span class="text-muted">' + lang.emptyIcon + '</span>')

        });

        var val = $this.data('value');
        if (val)
        {
            $this.val(val).change();
        }

    }

    ChosenIcons.prototype.getgroupHtml = function(name)
    {
        var icons = this.options[name];
        var html = '<optgroup label="' + this.lang[name] + '">';

        for (var i in icons)
        {
            html += this.getOptionHtml(icons[i]);
        }

        return html + '</optgroup>';
    }

    ChosenIcons.prototype.getOptionHtml = function(value)
    {
        name = value;
        if (value && value.length > 0)
        {
            value = 'icon-' + value;
        }
        else
        {
            value = '';
            name = this.lang.emptyIcon;
        }
        return '<option value="' + value + '">' + name + '</option>';
    }

    $.fn.chosenIcons = function(option)
    {
        return this.each(function()
        {
            var $this = $(this);
            var data = $this.data('zui.chosenIcons');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('zui.chosenIcons', (data = new ChosenIcons(this, options)));

            if (typeof option == 'string') data[option]();
        })
    };

    $.fn.chosenIcons.Constructor = ChosenIcons;
}(jQuery);
