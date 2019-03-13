$(function(){
	init();
});

function init(){
	var nameArr = [
		'淳安电视台',
		'兰溪电视台',
		'龙陵县融媒体中心',
		'漾濞县融媒体中心',
		'会泽县融媒体中心',
		'蒙自县融媒体中心',
		'寿县融媒体中心',
		'枞阳县融媒体中心',
		'和县融媒体中心',
		'濉溪县融媒体中心',
		'广德县融媒体中心',
	];

	$('video')[0].play();

	// create_name(nameArr);
	create_canvas(nameArr);
	create_shaw();

	init_event();
};

function init_event() {
	$(window).resize(function(){
		$('.dot').remove();
		setTimeout(function(){
			create_shaw();
		}, 300);
		create_canvas();
	});
}
// 弹幕
function create_name(nameArr) {
	if(nameArr.length < 20){
		nameArr = nameArr.concat(nameArr);
	}

	nameArr.map(function(item, idx){
			var $span = $(`<div class="animate_name"><span>${item}</span></div>`);

			function opacity(is){
				var n = is ? .6 : 0;
				$span.find('span').animate({
					opacity: n
				}, random(4000, 2000), function(){
					opacity(!is);
				});
			};
			function toLeft(){
				$span.css({
					'top': random(100, 0) + '%',
					'right': '0%'
				});
				
				$span.animate({
					right: '110%'
				}, random(50000, 30000), function(){
					toLeft();
				});
			};

			opacity(true);

		setTimeout(function(){
			toLeft();
			$('.z_index_2').append($span);
		}, random(5000, 0));
	});
}
// 移动亮点
function create_shaw() {
	var first = $('.right_item:first-child').position();
	var first_wire = $('.right_item:first-child').find('.wire').position();
	var three = $('.right_item:nth-child(3)').position();
	var three_wire = $('.right_item:nth-child(3)').find('.wire').position();
	var last = $('.right_item:nth-child(5)').position();
	var last_wire = $('.right_item:nth-child(5)').find('.wire').position();

	$('.border_left').css({
		left: first.left + first_wire.left,
		top: first.top + first_wire.top,
		height: last.top - (first.top + first_wire.top) + last_wire.top
	});

	animate_shaw(
		$(`<div class="dot"></div>`),
		[ last_wire.top, last_wire.top, -(last.top - three.top - three_wire.top), -(last.top - three.top - three_wire.top) ],
		[ last_wire.left + $('.right_item:nth-child(5)').find('.wire').width(),
		  last_wire.left,
		  last_wire.left,
		  three_wire.left
		]
	);
	setTimeout(function(){
		animate_shaw(
			$(`<div class="dot"></div>`),
			[ last_wire.top, last_wire.top, -(last.top - three.top - three_wire.top), -(last.top - three.top - three_wire.top) ],
			[ last_wire.left + $('.right_item:nth-child(5)').find('.wire').width(),
			  last_wire.left,
			  last_wire.left,
			  three_wire.left
			]
		);
	}, 2000)
}
// canvas背景
function create_canvas(nameArr) {
	var $canves = $('#canvas');
	var $index_2 = $('.z_index_2');
	var options = {
		n: 0,
		speed: 3,
		num: 5,
		width: $index_2.width(),
		height: $index_2.height(),
		animate_speed: 1500,
		older: {
			x: 0,
			y: 0
		},
		dot: {
			radius: 5,
			name: 'dot',
			color: 'rgba(41,206,221,0)',
			Ecolor: 'rgba(41,206,221,0.7)'
		},
		loop: {
			name: 'loop',
			color: 'rgba(41,206,221,0.7)',
			radius: 3,
			Ecolor: 'rgba(41,206,221,0)',
			Eradius: 30
		},
		text: {
			idx: 0,
			size: 15,
			list: nameArr,
			name: 'text',
			color: 'rgba(41,206,221,0)',
			Ecolor: 'rgba(41,206,221,0.4)'
		},
		line: {
			color: 'rgba(41,206,221,0.4)',
			size: 5,
			name: 'line'
		}
	}

	$canves.attr({
		"width": options.width,
		"height": options.height
	})

	for(var i=0; i< options.num; i++){
		_canvas_draw($canves, options, i, true);
	}
}

function _canvas_draw($can, options, idx, isFirst) {
	var text = options.text.list[options.text.idx];

	if(options.text.idx > (options.text.list.length - 2)){
		options.text.idx = 0;
	}else{
		options.text.idx += 1;
	}

	options.x = random(options.width - options.loop.Eradius, options.loop.Eradius);
	options.y = random(options.height - options.loop.Eradius, options.loop.Eradius);

	$can.drawArc({
	  layer: true,
	  name: options.dot.name + "_" + idx + (isFirst ? '_f' : ''),
	  fillStyle: options.dot.color,
	  x: options.x,
	  y: options.y,
	  radius: options.dot.radius
	});
	$can.animateLayer(options.dot.name + "_" + idx + (isFirst ? '_f' : ''), {
		fillStyle: options.dot.Ecolor,
	}, options.animate_speed);

	$can.drawText({
	  fillStyle: options.text.color,
	  strokeStyle: options.text.color,
	  layer: true,
	  name: options.text.name + '_' + idx + (isFirst ? '_f' : ''),
	  strokeWidth: 1,
	  x: options.x,
	  y: options.y - options.text.size,
	  fontSize: options.text.size,
	  text: text
	});
	$can.animateLayer(options.text.name + '_' + idx + (isFirst ? '_f' : ''), {
		fillStyle: options.text.Ecolor,
	  	strokeStyle: options.text.Ecolor,
	}, options.animate_speed);

	if(options.older.x != 0 && options.older.y != 0){
		$can.drawLine({
		  strokeStyle: options.line.color,
		  strokeWidth: options.line.size,
		  rounded: true,
		  layer: true,
	  	  name: options.line.name + '_' + idx,
		  x1: options.older.x,
		  y1: options.older.y,
		  x2: options.older.x,
		  y2: options.older.y
		});
	}

	_canvas_loop($can, options, idx, 0, isFirst);
	_canvas_line_an($can, options, idx);
}
function _canvas_loop($can, options, idx, n, isFirst) {
	$can.drawArc({
	  strokeStyle: options.loop.color,
	  strokeWidth: 2,
	  layer: true,
	  name: options.loop.name + '_' + idx + (isFirst ? '_f' : ''),
	  x: options.x,
	  y: options.y,
	  n: n || 0,
	  idx: idx,
	  radius: options.loop.radius,
	  closed: true
	});

	_canvas_loop_an($can, options, idx, isFirst);
}
function _canvas_line_an($can, options, idx) {
	$can.animateLayer(options.line.name + '_' + idx, {
		x2: options.x,
		y2: options.y,
		strokeStyle: options.loop.Ecolor,
	}, options.animate_speed);
}
function _canvas_loop_an($can, options, idx, isFirst) {
	$can.animateLayer(options.loop.name + '_' + idx + (isFirst ? '_f' : ''), {
		radius: options.loop.Eradius,
		strokeStyle: options.loop.Ecolor,
		n: '+=1' 
	}, options.animate_speed, function(layer){
		options.x = layer.x;
		options.y = layer.y;

		if(layer.n >= options.speed){
			$can.animateLayer(options.text.name + '_' + idx + (isFirst ? '_f' : ''), {
				fillStyle: options.loop.Ecolor,
				strokeStyle: options.loop.Ecolor,
			}, options.animate_speed);
			$can.animateLayer(options.dot.name + '_' + idx + (isFirst ? '_f' : ''), {
				fillStyle: options.loop.Ecolor
			}, options.animate_speed)

			$can.removeLayer(layer.name).drawLayers();

			options.older.x = layer.x;
			options.older.y = layer.y;
			
			setTimeout(function(){
				$can.removeLayer(options.text.name + "_" + idx + (isFirst ? '_f' : '')).drawLayers();
				$can.removeLayer(options.dot.name + "_" + idx + (isFirst ? '_f' : '')).drawLayers();
				$can.removeLayer(options.line.name + "_" + idx).drawLayers();
			}, options.animate_speed + 500);

			_canvas_draw($can, options, idx, !isFirst);
		}else{
			$can.removeLayer(layer.name).drawLayers();
			_canvas_loop($can, options, idx, layer.n, isFirst);
		}
	})
}

function animate_shaw($ele, top, left) {
	if($('.dot').length < 2){
		$('.right_item:nth-child(5)').append($ele);

		$ele.css({
			left: left[0],
			top: top[0]
		}).show();

		var nLeft = $ele.width() / 2;

		$ele.animate({ top: top[1], left: left[1] - nLeft, opacity: .9 }, 1000,'linear', function(){
			$ele.addClass('deg');
		});
		$ele.animate({ top: top[2], left: left[2] - nLeft, opacity: .9 }, 2500,'linear', function(){
			$ele.removeClass('deg');
		});
		$ele.animate({ top: top[3], left: left[3] - nLeft, opacity: .9 }, 800,'linear', function(){
			$ele.remove();

			animate_shaw($(`<div class="dot"></div>`), top, left);
		});
	}
}

function random(a, b){
	return Math.floor( ( Math.random() * a ) + b ); 
}