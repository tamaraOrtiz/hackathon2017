var ProgramaRender = function () {
	var programa;
	var programaService = new ProgramaService();
	var showTemplate  = Handlebars.compile($('#programa-show-tpl').html());

	this.initialize = function () {
		programaService.initialize();
		programa = {};
	};

	this.show = function (wrapper, nivel_id, entidad_id, programa_id, tipo_presupuesto_id ) {
		wrapper.html(showTemplate({}));
		//programaService.getMetaById(nivel_id, entidad_id, tipo_presupuesto_id, programa_id).done(function (result) {
		//	programa['resumenPrograma'] = result.rows;
		//	var l = result.rows.length;
		resumenProgramaChart();
		//});
	}

	function structResumenPrograma () {
		var acciones = {};

		$.each(programa.resumenPrograma, function (index, row) {
			if(acciones[row.tipo_presupuesto_id] === undefined){
				acciones[row.tipo_presupuesto_id] = {nombre: row.tipo_presupuesto_nombre, nombre_programas: [], programas: []};
			}
			presupuestos[row.tipo_presupuesto_id].nombre_programas.push(row.programa_nombre);
			presupuestos[row.tipo_presupuesto_id].programas.push({name: row.programa_nombre, value: row.cantidad_total});
			presupuestos[row.tipo_presupuesto_id].nombre_programas = $.unique(presupuestos[row.tipo_presupuesto_id].nombre_programas.sort());
		});
		return presupuestos;
	}
	function randomData(now, oneDay) {
		now = new Date(now + oneDay);
		value = value + Math.random() * 21 - 10;
		return {
			name: now.toString(),
			value: [
				[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
				Math.round(value)
			]
		}
	}

	function resumenProgramaChart() {
		var id = 'chart-'+1;
		//$('.principal_content').initScrollable({y: 'auto'});
		$('#chart-list').append('<div id=\"'+id+'\" class=\"chart-canva\"></div>');
		$('#'+id).css('width', $('.principal_content').prop('clientWidth'));
		$('#'+id).css('height', $('.principal_content').prop('clientHeight')*0.8);

		var myChart = echarts.init(document.getElementById(id));

		option = {
			title : {
				text: "Programa de Vacunación 2017",
				x:'center'
			},
			tooltip : {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}<br/>{c} ({d}%)"
				},
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'
					}
				}
			},
			toolbox: {
				show: false,
				feature: {
					dataView: {show: true, readOnly: false},
					magicType: {show: true, type: ['line', 'bar']},
					restore: {show: true},
					saveAsImage: {show: true}
				}
			},
			legend: {
				data:['Avance Alcanzado','Costo','Avance Estimado', 'Costo Estimado'],
				y: 'bottom',
          		x: 'center'
			},
			xAxis: [
				{
					type: 'category',
					data: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],
					axisPointer: {
						type: 'shadow'
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '',
					min: 0,
					max: 15000,
					interval: 500,
					axisLabel: {
						formatter: '{value} p'
					}
				},
				{
					type: 'value',
					name: '',
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} gs'
					}
				}
			],
			series: [
				{
					name:'Costo',
					type:'bar',
					data:[1269, 4900, 2035.0, 3000, 10000, 7677, 4500, 1622, 3260, 1000.0, 6497, 9093]
				},
				{
					name:'Avance Alcanzado',
					type:'bar',
					yAxisIndex: 1,
					data:[45, 35, 50, 60, 150, 200, 150, 182.2, 48.7, 18.8, 6.0, 2.3]
				},
				{
					name:'Avance Estimado',
					type:'line',
					data:[1000, 2000, 3000, 4500, 6300, 12000, 10000 , 2300, 23.0, 16.5, 120]
				},
				{
					name:'Costo Estimado',
					type:'line',
					yAxisIndex: 1,
					data:[30, 22, 33, 40, 150, 102, 70, 23.4, 23.0, 16.5, 70, 62]
				}
			]
		};
		myChart.setOption(option);	
		$('#chart-list').append('<div style="padding-bottom: 70px;"></div>');
	}


}
