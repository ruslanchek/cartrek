/*
	Plugin Datepicker v2.0.2
	http://imperavi.com/
 
	Copyright 2012, Imperavi Ltd.
	Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function($){

	var kubedatepickerindex = 0;
		
	// Initialization
	$.fn.datepicker = function(options)
	{
		return this.each(function() {
			var obj = new Construct(this, options);
			obj.init();
		});
	};
	
	// Options and variables
	function Construct(el, options)
	{
		this.opts = $.extend({
		
			lang: 'ru',	// en, ru, fr, es, it, de, pt		
			theme: 'realistic', // realistic, simple, dark
			
			effect: 'fade', // false, slide, fade
			
			callback: false, // function
			
			embed: false,
			
			onlytrigger: false,	
			trigger: false, // element
			
			setDate: false,	// date or function return
			
			format: 'dd.mm.yy',
			
			today: false,
			close: false,
			
			
			date: false,			
			daysInMonth: [0,31,28,31,30,31,30,31,31,30,31,30,31],	
			dateRegexp: /^(.*?)(\/|\.|\-)(.*?)(?:\/|\.|\-)(.*?)$/,				
			splitter: '.',

			month: false,
			day: false,
			year: false,
			
			current_day: false,
			current_month: false,
			current_year: false,			
			
			prev_day: false,
			prev_month: false,
			prev_year: false,
			
			next_day: false,
			next_month: false,
			next_year: false,			
					
			today_day: false,
			today_month: false,
			today_year: false,
			
			langToday: {
				'fr': 'Aujourd\'hui',
				'en': 'Today',
				'es': 'Hoy',
				'it': 'Oggi',
				'de': 'Heute',
				'pt': 'Hoje',
				'ru': 'Сегодня'			
			},				
			langClose: {
				'fr': 'Fermer',
				'en': 'Close',
				'es': 'Cerrar',
				'it': 'Chiudi',
				'de': 'Schließen',
				'pt': 'Fechar',
				'ru': 'Закрыть'			
			},
			langDays: {
				'fr': [ 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim' ],
				'en': [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
				'es': [ 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'S&#224;b', 'Dom' ],
				'it': [ 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom' ],
				'de': [ 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam', 'Son' ],
				'pt': [ 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&#225;', 'Dom' ],
				'ru': [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ]
			},
			langMonth: {
				'fr': ['', 'Janvier', 'F&#233;vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'D&#233;cembre' ],
				'en': ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
				'es': ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
				'it': ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre' ],
				'de': ['', 'Januar', 'Februar', 'M&#228;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
				'pt': ['', 'Janeiro', 'Fevereiro', 'Mar&#231;o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
				'ru': ['', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ]
			}
						
		}, options);
		
		this.$el = $(el);
	};

	// Functionality
	Construct.prototype = {
	
		init: function() 
		{
			// handlers
			this.closeHandler = function(e) { this.close(e); }.bind2(this); 				
		
		
			// today
			var today = new Date();
			this.opts.today_year = today.getFullYear()
			this.opts.today_month = this._leftpad_zero(today.getMonth()+1);
			this.opts.today_day = this._leftpad_zero(today.getDate());		
		
			// index
			this.opts.index = kubedatepickerindex;		
		
			// setDate
			if (this.opts.setDate !== false && typeof(this.opts.setDate) != 'function')
			{
				this.opts.date = this.opts.setDate;
			}		
		
			// build
			this.build();
			
			if (this.opts.onlytrigger) this.opts.trigger = this.$el;
			
			// events
			if (this.opts.embed === false) 
			{
				if (this.opts.trigger === false) this.$el.addClass('kube_datepicker_trigger').attr('rel', kubedatepickerindex).click(function(e) { this.open(e); }.bind2(this));	
				else $(this.opts.trigger).addClass('kube_datepicker_trigger').attr('rel', kubedatepickerindex).click(function(e) { this.open(e); }.bind2(this));	
			}
			else this.draw();
			

			kubedatepickerindex++;			

		},
		build: function()
		{
			// main
			this.$datepicker_box = $('<div class="kube_datepicker">')
			.attr('id', 'kube_datepicker' + this.opts.index)
			.addClass('kube_datepicker_theme_' + this.opts.theme)
			.attr('rel', this.opts.index)
			.hide();			
			
			
			if (this.opts.embed) this.$datepicker_box.addClass('kube_datepicker_embed');			
			
			this.$datepicker_wrapper = $('<div class="kube_datepicker_wrapper">');			
			
			this.$datepicker_box.append(this.$datepicker_wrapper);
			
			// header
			this.$datepicker_header = $('<div class="kube_datepicker_header">');			
			this.$datepicker_prev = $('<a href="javascript:void(null);" class="kube_datepicker_prev"></a>').html('&lt;').click(function(e) { return this.setPrevMonth(e); }.bind2(this));	
			this.$datepicker_next = $('<a href="javascript:void(null);" class="kube_datepicker_next"></a>').html('&gt;').click(function(e) { return this.setNextMonth(e); }.bind2(this));	
			this.$datepicker_monthname = $('<div class="kube_datepicker_monthname">');													
			
			var top1 = $('<div  class="kube_datepicker_top1">');	
			var top2 = $('<div  class="kube_datepicker_top2">');				

			this.$datepicker_header.append(top1);
			this.$datepicker_header.append(top2);
			
			this.$datepicker_header.append(this.$datepicker_prev);
			this.$datepicker_header.append(this.$datepicker_next);
			this.$datepicker_header.append(this.$datepicker_monthname);

			this.$datepicker_wrapper.append(this.$datepicker_header);
			
	
			// table
			this.$datepicker_table = $('<table class="kube_datepicker_table">');			
			this.$datepicker_table_head = $('<thead>');
			this.$datepicker_table_body = $('<tbody>');			


			this.$datepicker_table.append(this.$datepicker_table_head);
			this.$datepicker_table.append(this.$datepicker_table_body);			
			this.$datepicker_wrapper.append(this.$datepicker_table);
			
			// footer
			this.$datepicker_footer_wrap = $('<div class="kube_datepicker_footer_wrap">');
			this.$datepicker_footer = $('<div class="kube_datepicker_footer">');	

			if (this.opts.today)
			{
				this.$datepicker_today = $('<a href="javascript:void(null);">' + this.opts.langToday[this.opts.lang] + '</a>');
				this.$datepicker_today.click(function()
				{
					this.setTodayMonth();
					
				}.bind2(this));
				this.$datepicker_footer.append(this.$datepicker_today);			
			}
			
			if (this.opts.close && this.opts.embed === false)
			{
				this.$datepicker_close = $('<a href="javascript:void(null);">' + this.opts.langClose[this.opts.lang] + '</a>');
				this.$datepicker_close.click(function()
				{
					this.close(false);
					
				}.bind2(this));
				this.$datepicker_footer.append(this.$datepicker_close);
			}

			this.$datepicker_footer_wrap.append(this.$datepicker_footer);
			this.$datepicker_wrapper.append(this.$datepicker_footer_wrap);			

	
			if (this.opts.embed) 
			{
				this.$el.append(this.$datepicker_box);
				this.$datepicker_box.show();
			}
			else $(document.body).append(this.$datepicker_box);
		},
		draw: function()
		{
			this.parseDate();
			this.grid();
			this.setGridMonth();			
		},
		open: function(e)
		{
			if (e.preventDefault) e.preventDefault();
			
			var index = $(e.target).attr('rel');
		
			$('.kube_datepicker').not('.kube_datepicker_embed').hide();		
			
			
			this.$datepicker_box = $('#kube_datepicker' + index);
			
			this.draw();

			if (this.opts.trigger === false) var $element = this.$el;
			else var $element = $(this.opts.trigger);
			
			var pos = $element.offset();

			var datepickerwidth = this.$datepicker_box.outerWidth();
			var datepickerheight = this.$datepicker_box.outerHeight();
			
			var width = $element.width();
			var height = $element.outerHeight();			
			var right = $(document).width() - pos.left - width;

			var top = $(document).height() - pos.top - height;
			
			if (top < datepickerheight) var y = (pos.top - datepickerheight - height) + 'px';			
			else var y = (pos.top + height) + 'px';
			
			if (right < datepickerwidth)
			{			
				var x = 'auto';
				var z = right + 'px';
			}
			else
			{
				var x = pos.left + 'px';				
				var z = 'auto';
			}
			
			this.$datepicker_box.css({ top: y, left: x, right: z });



			if (this.opts.effect === false) this.$datepicker_box.show();	
			else if (this.opts.effect == 'slide') this.$datepicker_box.slideDown();	
			else if (this.opts.effect == 'fade') this.$datepicker_box.fadeIn();				
			
				
			$(document).click(this.closeHandler);			
			
		},
		grid: function()
		{		
		
			// weekdays
			this.$datepicker_table_head.html('');
			
			var tr = $('<tr>');
						
			$.each(this.opts.langDays[this.opts.lang], function(i,s)
			{
				var th = $('<th>').html(s);
				tr.append(th);				
			});
			
			this.$datepicker_table_head.append(tr);
			
		
		
			var daysCurrentMonth = this.getDaysCurrentMonth();
			var daysPrevMonth = this.getDaysPrevMonth();
			var daysNextMonth = this.getDaysNextMonth();	
			
			// start index
			var d = new Date(this.opts.year, this.opts.month-1, 1);			
			var startIndex	= ( !d.getDay() ) ? 7 : d.getDay();
			
			var daysPrevMonthStart = daysPrevMonth - startIndex + 2;
			var startCurrent = 8 - startIndex;

			// clear grid
			this.$datepicker_table_body.html('');
		
		
			// matrix
			var y = 1, c = 1;
			for (z = 0; z<6; z++)
			{
				var tr = $('<tr>');
			
				for (i = 0; i<7; i++)
				{
					if (z == 0)
					{
						var dayPrev = daysPrevMonthStart+i;
						
						if (dayPrev > daysPrevMonth) 
						{
							// current day
							var day = { 
								num: y, 
								last: false, 
								year: this.opts.current_year,
								month: this.opts.current_month,								
								date: this.getGridDay(this.opts.current_year, this.opts.current_month, y), 
								select: this.checkSelectDate(this.opts.current_year, this.opts.current_month, y), 
								today: this.checkTodayDate(this.opts.current_year, this.opts.current_month, y) 
							}
							y++;
						}
						else 
						{
							// prev day
							var day = { 
								num: dayPrev, 
								last: true, 
								year: this.opts.prev_year,
								month: this.opts.prev_month,								
								date: this.getGridDay(this.opts.prev_year, this.opts.prev_month, dayPrev), 
								select: this.checkSelectDate(this.opts.prev_year, this.opts.prev_month, dayPrev), 
								today: this.checkTodayDate(this.opts.prev_year, this.opts.prev_month, dayPrev) 								
							}
						}
					}
					else if (y > daysCurrentMonth)
					{
						// next day
						var day = { 
							num: c, 
							last: true, 
							year: this.opts.next_year,
							month: this.opts.next_month,								
							date: this.getGridDay(this.opts.next_year, this.opts.next_month, c), 
							select: this.checkSelectDate(this.opts.next_year, this.opts.next_month, c), 
							today: this.checkTodayDate(this.opts.next_year, this.opts.next_month, c) 							
						}
						c++;						
					}
					else
					{
						// current day
						var day = { 
							num: y, 
							last: false, 
							year: this.opts.current_year,
							month: this.opts.current_month,							
							date: this.getGridDay(this.opts.current_year, this.opts.current_month, y), 
							select: this.checkSelectDate(this.opts.current_year, this.opts.current_month, y), 
							today: this.checkTodayDate(this.opts.current_year, this.opts.current_month, y) 
						}
						y++;
					}
										
					tr.append(this.setGridDay(day));
				}
				
				this.$datepicker_table_body.append(tr);	
			}
				
		},
		parseDate: function()
		{
			var tagName = this.$el.get(0).tagName;
			
			if (typeof(this.opts.setDate) == 'function') 
			{
				this.opts.date = this.opts.setDate();
			}
			else if (this.opts.setDate === false && this.opts.embed === false && this.opts.onlytrigger == false)
			{
				if (tagName == 'INPUT' || tagName == 'TEXTAREA') this.opts.date = $.trim(this.$el.val());
				else this.opts.date = $.trim(this.$el.html());			
			}

			if (this.opts.date == '') this.getTodayDate();
			
			var date = this.opts.date.match(this.opts.dateRegexp);
			var format = this.opts.format.match(this.opts.dateRegexp);
			
			this.opts.splitter = date[2];	

			$.each(format, function(i,s)
			{
				if (s == 'mm') this.opts.month = this._leftpad_zero(date[i]);
				else if (s == 'yy') this.opts.year = date[i];
				else if (s == 'dd') this.opts.day = this._leftpad_zero(date[i]);								
				
			}.bind2(this));

			// current
			this.opts.current_year = this.opts.year;
			this.opts.current_month = this.opts.month;
			this.opts.current_day = this.opts.day;						
			
			this._setPrev();
			this._setNext();
			
		},
		getFormatDate: function(year, month, day)
		{
			var date = new Date(year, month-1, day);
			
			return this.replaceFormatDate(date.getFullYear(), this._leftpad_zero(date.getMonth()+1), date.getDate());
						
		},
		replaceFormatDate: function(year, month, day)
		{
			var adate = this.opts.format.replace('dd', this._add_zero(day));
			adate = adate.replace('mm', this._add_zero(month));
			return adate.replace('yy', year);		
		},
		getTodayDate: function()
		{
			var adate = this.opts.format.replace('dd', this.opts.today_day);
			adate = adate.replace('mm', this.opts.today_month);
			this.opts.date = adate.replace('yy', this.opts.today_year);
			
			return this.opts.date;
		},
		setGridMonth: function()
		{
			this.$datepicker_monthname.html(this.opts.langMonth[this.opts.lang][this.opts.current_month] + ' ' + this.opts.current_year);
		},
		checkSelectDate: function(year, month, day)
		{
			if (this.opts.year == year && this.opts.month.toString() == month.toString() && this.opts.day == day) return true;
			else return false;			
		},
		checkTodayDate: function(year, month, day)
		{
			if (this.opts.today_year == year && this.opts.today_month.toString() == month.toString() && this.opts.today_day == day) return true;
			else return false;
		},
		getGridDay: function(year, month, day)
		{
			return this.replaceFormatDate(year, month, day);
		},		
		setGridDay: function(day)
		{
			var td = $('<td>');
			
			if (day.last) td.addClass('kube_datepicker_day_last');
			
			if (day.today) td.addClass('kube_datepicker_day_today');
			if (day.select) td.addClass('kube_datepicker_day_select');			
			
			var a = $('<a href="javascript:void(null);" title="' + day.date + '">' + day.num + '</a>').click(function(e)
			{
			
				this.callback(e, day.date, day.year, day.month, day.num);
			
			}.bind2(this));
			
			return td.append(a);
						
		},
		callback: function(e, date, year, month, day)
		{
			if (this.opts.embed === false && this.opts.onlytrigger === false)
			{
				var tagName = this.$el.get(0).tagName;
			
				this.opts.date = date;			
			
				if (tagName == 'INPUT' || tagName == 'TEXTAREA') this.$el.val(date);
				else this.$el.html(date);	
				
				this.close(false);
			}
			
			if (this.opts.onlytrigger !== false) this.close(false);
			
			if (this.opts.callback) this.opts.callback(e, date, year, month, day);						
				
		},
		close: function(e)
		{
			if (e !== false) 
			{
				if ($(e.target).hasClass('kube_datepicker_trigger')) return false;				
				
				if ($(e.target).attr('id') == 'kube_datepicker' + this.opts.index) return false;
				else if ($(e.target).parents('#kube_datepicker' + this.opts.index).size() != 0) return false;
			}
			
			if (this.opts.embed === false)
			{
				if (this.opts.effect === false) $('#kube_datepicker' + this.opts.index).hide();	
				else if (this.opts.effect == 'slide') $('#kube_datepicker' + this.opts.index).slideUp();	
				else if (this.opts.effect == 'fade') $('#kube_datepicker' + this.opts.index).fadeOut();	
				
			
				$(document).unbind('click', this.closeHandler);	
			}			

		},
		updateGrid: function()
		{
			this.grid();
			this.setGridMonth();		
		},
		setTodayMonth: function()
		{
			var date = new Date();
			
			this.opts.current_year = date.getFullYear();			
			this.opts.current_month = this._leftpad_zero(date.getMonth()+1)

			this._setPrev();
			this._setNext();
			
			this.updateGrid();			
			
		},
		setCurrentMonth: function()
		{
			var date = new Date(this.opts.current_year, this.opts.current_month, 1);
			
			this.opts.current_year = date.getFullYear();			
			this.opts.current_month = this._leftpad_zero(date.getMonth())
			
			this._setPrev();
			this._setNext();
			
			this.updateGrid();
			
		},
		setPrevMonth: function(e)
		{
			if (e.preventDefault) e.preventDefault();
		
			var date = new Date(this.opts.current_year, this.opts.current_month-1, 1);
			
			var month = date.getMonth();
			this.opts.current_year = date.getFullYear();
			
			if (month == 0) 
			{
				month = 12;
				this.opts.current_year--;
			}
									
			this.opts.current_month = this._leftpad_zero(month)
			
			this._setPrev();
			this._setNext();
			
			this.updateGrid();
			
			return false;						
		},
		setNextMonth: function(e)
		{
			if (e.preventDefault) e.preventDefault();
		
			var date = new Date(this.opts.current_year, this.opts.current_month+1, 1);

			var month = date.getMonth();
			this.opts.current_year = date.getFullYear();
			
			if (month == 0) 
			{
				month = 12;
				this.opts.current_year--;
			}
						
			this.opts.current_month = this._leftpad_zero(month)

			this._setPrev();
			this._setNext();
			
			this.updateGrid();
			
			return false;							
		},		
		_setPrev: function()
		{
			var arr = this.getPrevMonthYear(this.opts.current_year, this.opts.current_month);			
			this.opts.prev_year = arr[0];
			this.opts.prev_month = arr[1];		
		},
		_setNext: function()
		{
			var arr = this.getNextMonthYear(this.opts.current_year, this.opts.current_month);			
			this.opts.next_year = arr[0];
			this.opts.next_month = arr[1];		
		},
		getDaysCurrentMonth: function()
		{
			return this.getMonthDays(this.opts.current_year, this.opts.current_month);
		},
		getDaysPrevMonth: function()
		{
			return this.getMonthDays(this.opts.prev_year, this.opts.prev_month);
		},
		getDaysNextMonth: function()
		{
			return this.getMonthDays(this.opts.next_year, this.opts.next_month);
		},		
		getMonthDays: function (year, month)
		{	
			if (((0 == (year%4)) && ((0 != (year%100)) || (0 == (year%400)))) && (month == 1)) return 29;
			
			return this.opts.daysInMonth[month];
		},	
		getPrevMonthYear: function(year, month)
		{
			var c_mon = this._leftpad_zero(month)-1;
			var c_year = year;

			if (c_mon <= 0)
			{
				c_mon = 12;
				c_year--;
			}		
			
			return [ c_year, c_mon ];
		},
		getNextMonthYear: function (year, month)
		{
			var c_mon = this._leftpad_zero(month)+1;
			var c_year = year;
			
			if (c_mon > 12)
			{
				c_mon = 1;
				c_year++;
			}			
	
			return [ c_year, c_mon ];
		},				

		// util
		_add_zero: function(str)
		{
			str = new Number(str);
			if (str < 10) return '0' + str;
			else return str;
		},
		_leftpad_zero: function(str)
		{
			return new Number(str);
		}
	};
	
	// bind2
	Function.prototype.bind2 = function(object)
	{
	    var method = this; var oldArguments = $.makeArray(arguments).slice(1);
	    return function (argument)
	    {
	        if (argument == new Object) { method = null; oldArguments = null; }
	        else if (method == null) throw "Attempt to invoke destructed method reference.";
	        else { var newArguments = $.makeArray(arguments); return method.apply(object, oldArguments.concat(newArguments)); }
	    };
	}		

})(jQuery);