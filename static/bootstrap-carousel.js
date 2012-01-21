/* ==========================================================
 * bootstrap-carousel.js v2.0.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
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
 * ========================================================== */!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.carousel.defaults,c),this.options.slide&&this.slide(this.options.slide)};b.prototype={cycle:function(){return this.interval=setInterval(a.proxy(this.next,this),this.options.interval),this},pause:function(){return clearInterval(this.interval),this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(b){var c=this.$element.find(".active"),d=c[b](),e=this.interval,f=b=="next"?"left":"right",g=b=="next"?"first":"last",h=this;return this.sliding=!0,e&&this.pause(),d=d.length?d:this.$element.find(".item")[g](),!a.support.transition&&this.$element.hasClass("slide")?(this.$element.trigger("slide"),c.removeClass("active"),d.addClass("active"),this.$element.trigger("slid"),this.sliding=!1):(d.addClass(b),d[0].offsetWidth,c.addClass(f),d.addClass(f),this.$element.trigger("slide"),this.$element.one(a.support.transition.end,function(){d.removeClass([b,f].join(" ")).addClass("active"),c.removeClass(["active",f].join(" ")),h.$element.trigger("slid"),h.sliding=!1})),e&&this.cycle(),this}},a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("carousel"),f=typeof c=="object"&&c;e||d.data("carousel",e=new b(this,f)),typeof c=="string"||(c=f.slide)?e[c]():e.cycle()})},a.fn.carousel.defaults={interval:5e3},a.fn.carousel.Constructor=b,a(function(){a("body").on("click.carousel.data-api","[data-slide]",function(b){var c=a(this),d=a(c.attr("data-target")||c.attr("href")),e=!d.data("modal")&&a.extend({},d.data(),c.data());d.carousel(e)})})}(window.jQuery);