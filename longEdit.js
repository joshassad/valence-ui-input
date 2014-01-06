( function( vui ) {

	// Check if the provided vui global is defined, otherwise try to require it if
	// we're in a CommonJS environment; otherwise we'll just fail out
	if( vui === undefined ) {
		if( typeof require === 'function' ) {
			vui = require('../../core');
		} else {
			throw new Error('load vui first');
		}
	}

	// Export the vui object if we're in a CommonJS environment.
	// It will already be on the window otherwise
	if( typeof module === 'object' && typeof module.exports === 'object' ) {
		module.exports = vui;
	}

	var $ = vui.$;

	$.widget( "vui.vui_longEdit", {

		options: {
			MaxHeight: 0,
			MinHeight: '20px'
		},

		_create: function () {
			var $longEdit = $(this.element),
				minHeight = $longEdit.attr('data-longedit-minheight') || $longEdit.css('min-height') || op.MinHeight,
				maxHeight = $longEdit.attr('data-longedit-maxheight') || $longEdit.css('max-height') || op.MaxHeight;

			// normalize height values by setting and retrieving them on the element
			$longEdit[0].style.height = maxHeight;
			maxHeight = $longEdit.height();

			$longEdit[0].style.height = minHeight;
			minHeight = $longEdit.height();

			// bind the adjust function with all values
			var populatedAdjust = this._textAreaAdjust.bind(this, $longEdit, minHeight, maxHeight);

			$longEdit.keyup(populatedAdjust);
			$longEdit.change(populatedAdjust);

			$longEdit.css('overflow-y', 'hidden');

			populatedAdjust();
		},

		_textAreaAdjust: function ($longEdit, minHeight, maxHeight) {
			var padding = $longEdit.innerHeight() - $longEdit.height();

			$longEdit
				.height(minHeight);

			var currentHeight = $longEdit[0].scrollHeight - padding;

			var setHeight = Math.max(minHeight, currentHeight);
			setHeight = setHeight > maxHeight ? maxHeight : setHeight;

			$longEdit
				.height(setHeight)
				.css('overflow-y', setHeight === maxHeight ? 'auto' : 'hidden')
				.trigger('vui-longedit-change');
		}

	} );

	vui.addClassInitializer(
		'vui-longedit',
		function( node ) {
			$( node ).vui_longEdit();
		}
	);

} )( window.vui );
