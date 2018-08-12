/*
 * TouchScroll - using dom overflow:scroll
 * by kmturley
 * https://github.com/kmturley/touch-scroll
 */

/*globals window, document */


export class TouchScroll {
  axis = 'x';
  drag = false;
  zoom = 1;
  time = 0.04;
  isIE = window.navigator.userAgent.toLowerCase().indexOf('msie') > -1;
  isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  options = null;
  el = null;
  elzoom = null;
  body = null;
  prev = null;
  next = null;
  diffx = null;
  diffy = null;
  startx = null;
  starty = null;

  /**
   * @method init
   */
  init(options) {
    const me = this;
    this.options = options;

    // find target element or fall back to body
    if (options && options.id) {
      this.el = document.getElementById(options.id);
    }
    if (!this.el) {
      if (this.isIE || this.isFirefox) {
        this.el = document.documentElement;
      } else {
        this.el = document.body;
      }
    }

    // if draggable option is enabled add events
    if (options.draggable === true) {
      if (this.isIE) {
        document.ondragstart = function () { return false; };
      }
      if (this.isIE || this.isFirefox) {
        this.body = document.documentElement;
      } else {
        this.body = document.body;
      }
      this.addEvent('mousedown', this.el, function (e) { me.onMouseDown(e); });
      this.addEvent('mousemove', this.el, function (e) { me.onMouseMove(e); });
      this.addEvent('mouseup', this.body, function (e) { me.onMouseUp(e); });
    }

    // if zoom option exists add mouse wheel functionality to element
    if (options && options.zoom) {
      this.elzoom = document.getElementById(options.zoom);
      if (this.isFirefox) {
        this.addEvent('DOMMouseScroll', this.el, function (e) { me.onMouseWheel(e); });
      } else {
        this.addEvent('mousewheel', this.el, function (e) { me.onMouseWheel(e); });
      }
    }

    // if scroll options exist add events
    if (options && options.prev) {
      this.prev = document.getElementById(options.prev);
      this.addEvent('mousedown', this.prev, function (e) {
        me.onMouseDown(e);
      });
      this.addEvent('mouseup', this.prev, function (e) {
        me.diffx = options.distance ? (-options.distance / 11) : -11;
        me.onMouseUp(e);
      });
    }
    if (options && options.next) {
      this.next = document.getElementById(options.next);
      this.addEvent('mousedown', this.next, function (e) {
        me.onMouseDown(e);
      });
      this.addEvent('mouseup', this.next, function (e) {
        me.diffx = options.distance ? (options.distance / 11) : 11;
        me.onMouseUp(e);
      });
    }
  }

  /**
   * @method addEvent
   */
  addEvent(name, el, func) {
    if (el.addEventListener) {
      el.addEventListener(name, func, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + name, func);
    } else {
      el[name] = func;
    }
  }

  /**
   * @method cancelEvent
   */
  cancelEvent(e) {
    if (!e) { e = window.event; }
    if (e.target && e.target.nodeName === 'IMG') {
      e.preventDefault();
    } else if (e.srcElement && e.srcElement.nodeName === 'IMG') {
      e.returnValue = false;
    }
  }

  /**
   * @method onMouseDown
   */
  onMouseDown(e) {
    if (this.drag === false || this.options.wait === false) {
      this.drag = true;
      this.cancelEvent(e);
      this.startx = e.clientX + this.el.scrollLeft;
      this.starty = e.clientY + this.el.scrollTop;
      this.diffx = 0;
      this.diffy = 0;
    }
  }

  /**
   * @method onMouseMove
   */
  onMouseMove(e) {
    if (this.drag === true) {
      this.cancelEvent(e);
      this.diffx = (this.startx - (e.clientX + this.el.scrollLeft));
      this.diffy = (this.starty - (e.clientY + this.el.scrollTop));
      this.el.scrollLeft += this.diffx;
      this.el.scrollTop += this.diffy;
    }
  }

  /**
   * @method onMouseMove
   */
  onMouseUp(e) {
    if (this.drag === true) {
      if (!this.options.wait) {
        this.drag = null;
      }
      this.cancelEvent(e);
      const me = this;
      let start = 1,
        animateId = null;
      const animate = function() {
          const step = Math.sin(start);
          if (step <= 0) {
            me.diffx = 0;
            me.diffy = 0;
            window.cancelAnimationFrame(animateId);
            me.drag = false;
          } else {
            me.el.scrollLeft += me.diffx * step;
            me.el.scrollTop += me.diffy * step;
            start -= me.time;
            animateId = window.requestAnimationFrame(animate);
          }
        };
      animate();
    }
  }

  /**
   * @method onMouseMove
   */
  onMouseWheel(e) {
    this.cancelEvent(e);
    if (e.detail) {
      this.zoom -= e.detail;
    } else {
      this.zoom += (e.wheelDelta / 1200);
    }
    if (this.zoom < 1) {
      this.zoom = 1;
    } else if (this.zoom > 10) {
      this.zoom = 10;
    }
    /*
    this.elzoom.style.OTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
    this.elzoom.style.MozTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
    this.elzoom.style.msTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
    this.elzoom.style.WebkitTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
    this.elzoom.style.transform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
    */
    this.elzoom.style.zoom = this.zoom * 100 + '%';
    // this.el.scrollLeft += e.wheelDelta / 10;
    // this.el.scrollTop += e.wheelDelta / 8;
  }

}
