var ProgramaRender = function () {
	var programa;
	var programaService = new ProgramaService();

	this.initialize = function () {
		programaService.initialize();
		programa = {};
	};

	this.show = function (wrapper, nivel_id, entidad_id, programa_id, tipo_presupuesto_id ) {
		programaService.getMetaById(nivel_id, entidad_id, tipo_presupuesto_id, programa_id).done(function (result) {
			programa['resumenPrograma'] = result.rows;
			var l = result.rows.length;
			resumenProgramaChart();
		});
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

	function resumenProgramaChart() {
		//var data = structResumenPrograma();
		var data = [{name: 'Personas', value: 1},{name: 'Personas', value: 2}]
		$.each(data, function (index, presupuesto) {
			var id = 'chart-'+index;
			//$('.principal_content').initScrollable({y: 'auto'});
			$('#chart-list').append('<div id=\"'+id+'\" class=\"chart-canva\"></div>');
			$('#'+id).css('width', $('.principal_content').prop('clientWidth'));
			$('#'+id).css('height', $('.principal_content').prop('clientHeight')*0.8);
			var myChart = echarts.init(document.getElementById(id));
			option = {
				title: {
					text: 'Programas'
				},
				tooltip: {
					trigger: 'axis',
					formatter: function (params) {

					},
					axisPointer: {
						animation: false
					}
				},
				xAxis: {
					type: 'time',
					splitLine: {
						show: false
					}
				},
				yAxis: {
					type: 'value',
					boundaryGap: [0, '100%'],
					splitLine: {
						show: false
					}
				},
				series: [{
					name: 'Aba',
					type: 'line',
					showSymbol: false,
					hoverAnimation: false,
					data: data
				}]
			};
			myChart.setOption(option);
			$(window).on('resize', function(){
				myChart.resize();
			});
		});
		$('#chart-list').append('<div style="padding-bottom: 70px;"></div>');
	}
}
