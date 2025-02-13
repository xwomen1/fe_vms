/**
 * Format number nicely
 *
 * @module  mumath/loop
 *
 */
'use strict';

import precision from './precision';
import almost from './almost';

export default function (v, prec) {
	if (almost(v, 0)) return '0';

	if (prec == null) {
		prec = precision(v);
		prec = Math.min(prec, 20);
	}

	// return v.toFixed(prec);
	return v.toFixed(prec);

}
