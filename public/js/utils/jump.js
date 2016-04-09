/* eslint no-param-reassign: 0 */

// via https://github.com/callmecavs/jump.js
const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;

    if (t < 1) return c / 2 * t * t + b;

    t--;

    return -c / 2 * (t * (t - 2) - 1) + b;
};

export default class Jump {
    jump(target, options = {}) {
        this.options = {
            duration: options.duration,
            offset: options.offset || 0,
            callback: options.callback,
            easing: options.easing || easeInOutQuad,
            container: document.querySelector(options.container) || null,
        };

        this.distance = typeof target === 'string'
            ? this.options.offset + document.querySelector(target).getBoundingClientRect().top
        : target;

        this.duration = typeof this.options.duration === 'function'
            ? this.options.duration(this.distance)
        : this.options.duration;

        !!this.options.container
            ? this.start = this.options.container.scrollTop
        : this.start = window.pageYOffset;

        requestAnimationFrame(time => this._loop(time));
    }

    _loop(time) {
        if (!this.timeStart) {
            this.timeStart = time;
        }

        this.timeElapsed = time - this.timeStart;
        this.next = this.options.easing(this.timeElapsed, this.start, this.distance, this.duration);

        !!this.options.container
            ? this.options.container.scrollTop = this.next
        : window.scrollTo(0, this.next);

        this.timeElapsed < this.duration
          ? requestAnimationFrame(t => this._loop(t))
        : this._end();
    }

    _end() {
        !!this.options.container
            ? this.options.container.scrollTop = this.next + this.distance
        : window.scrollTo(0, this.next + this.distance);

        typeof this.options.callback === 'function' && this.options.callback();
        this.timeStart = false;
    }
}
