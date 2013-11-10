(function($){
	$.fn.tzCheckbox = function(options){
		return this.each(function(){
			var originalCheckBox = $(this),
				labels = ['I', 'O'];

			// Checking for the data-on / data-off HTML5 data attributes:
			if(originalCheckBox.data('on') && originalCheckBox.data('off')){
				labels[0] = originalCheckBox.data('on');
				labels[1] = originalCheckBox.data('off');
			}else if(options && options.labels){
                labels = options.labels;
            };

			// Creating the new checkbox markup:
			var checkBox = $('<span>');

            checkBox.attr('class', 'tzCheckBox '+(this.checked?'checked':''));
            checkBox.html('<span class="tzCBContent">'+labels[this.checked?0:1]+ '</span><span class="tzCBPart"></span>');

			// Inserting the new checkbox, and hiding the original:
			checkBox.insertAfter(originalCheckBox.hide());

			checkBox.on('click', function(){
				checkBox.toggleClass('checked');

				var isChecked = checkBox.hasClass('checked');

				// Synchronizing the original checkbox:
				originalCheckBox.attr('checked', isChecked);
				checkBox.find('.tzCBContent').html(labels[isChecked?0:1]);

                if(options && options.onChange){
                    options.onChange(originalCheckBox, isChecked);
                };
			});

			// Listening for changes on the original and affecting the new one:
			originalCheckBox.on('change',function(){
				checkBox.click();
			});
		});
	};
})(jQuery);