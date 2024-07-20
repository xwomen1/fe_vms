let lastTime = 0;

function getPrefixed(name) {
	if (typeof window !== 'undefined') {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	return null;
}

// Fallback for IE 7-8
function timeoutDefer(fn) {
	const time = +new Date();
	const timeToCall = Math.max(0, 16 - (time - lastTime));

	lastTime = time + timeToCall;
	if (typeof window !== 'undefined') {
		return window.setTimeout(fn, timeToCall);
	}

	return setTimeout(fn, timeToCall);
}

export function bind(fn, obj) {
	const slice = Array.prototype.slice;

	if (fn.bind) {
		return fn.bind.apply(fn, slice.call(arguments, 1));
	}

	const args = slice.call(arguments, 2);

	return function () {
		return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
	};
}

const requestFn = typeof window !== 'undefined'
	? window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer
	: timeoutDefer;

const cancelFn = typeof window !== 'undefined'
	? window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') || getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); }
	: function (id) { clearTimeout(id); };

const raf = (fn, context, immediate) => {
	if (immediate && requestFn === timeoutDefer) {
		fn.call(context);
	} else {
		if (typeof window !== 'undefined') {
			return requestFn.call(window, bind(fn, context));
		} else {
			fn.call(context)
		}
	}
};

raf.cancel = (id) => {
	if (id) {
		if (typeof window !== 'undefined') {
			cancelFn.call(window, id);
		} else {
			cancelFn.call(context)
		}
	}
};

export default raf;
