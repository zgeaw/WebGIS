/*webGIS插件 32237384@qq.com*/
$(function() {
	var opts = {
		tool_layer: [
		{
				'name': '一级菜单1',
				'Id': 1,
				'AddType': true,
				'value': [{
						'name': '二级菜单1-1',
						'Id': 2,
						'AddType': true,
						'value': [{
								'name': '三级菜单1-1-1',
								'Id': 3,
								'AddType': true,
								'value': [{
										'name': '四级菜单1-1-1-1',
										'Id': 4,
										'AddType': true,
										'value': [{
												'name': '五级菜单1-1-1-1-1-1',
												'Id': 41,
												'AddType': true,
												'value': [{
														'name': '六级菜单1-1-1-1-1-1',
														'Id': 61,
														'AddType': true,
														'value': []
													},
													{
														'name': '六级菜单1-1-1-1-1-2',
														'Id': 61,
														'AddType': true,
														'value': []
													}
												]
											},
											{
												'name': '五级菜单1-1-1-1-1-2',
												'Id': 51,
												'AddType': true,
												'value': []
											}
										]
									},
									{
										'name': '四级菜单1-1-1-2',
										'Id': 5,
										'AddType': true,
										'value': []
									}
								]
							},
							{
								'name': '三级菜单1-1-2',
								'Id': 6,
								'AddType': true,
								'value': []
							}
						]
					},
					{
						'name': '二级菜单1-2',
						'Id': 7,
						'AddType': true
					}
				]
			},
			{
				'name': '一级菜单2',
				'Id': 8,
				'AddType': true,
				'value': [{
						'name': '二级菜单2-1',
						'Id': 9,
						'AddType': false,
						'value': []
					},
					{
						'name': '二级菜单2-2',
						'Id': 10,
						'AddType': false,
						'value': []
					}
				]
			}
		],
		tool_toolbar: [{
				'Id': 1,
				'check': 0, //互斥
				'value': [{
						'Id': 2,
						'Mode': true,
						'name': '工具2',
						'icon': 'rotate1',
						'check': 0 //互斥
					},
					{
						'Id': 3,
						'Mode': true,
						'name': '工具3',
						'icon': 'hand',
						'check': 0 //互斥
					},
					{
						'Id': 4,
						'Mode': true,
						'name': '工具4',
						'icon': 'ranging2',
						'check': 0 //互斥
					},
					{
						'Id': 5,
						'Mode': true,
						'name': '工具5',
						'icon': 'people',
						'check': 0 //互斥
					},
					{
						'Id': 6,
						'Mode': false,
						'name': '工具6',
						'icon': 'camera',
						'check': 0, //互斥
						'value': [{
								'Id': 7,
								'Mode': true,
								'name': '工具7',
								'icon': 'photo',
								'check': 0 //互斥
							},
							{
								'Id': 8,
								'Mode': true,
								'name': '工具8',
								'icon': 'sector',
								'check': 0 //互斥
							},
							{
								'Id': 9,
								'Mode': true,
								'name': '工具9',
								'icon': 'rotate2',
								'check': 0 //互斥
							}
						]
					}
				]
			},
			{
				'Id': 10,
				'check': 0, //可选中
				'value': [{
						'Id': 11,
						'Mode': false,
						'name': '工具11',
						'icon': 'pc',
						'check': 0 //点击不变蓝色
					},
					{
						'Id': 12,
						'Mode': false,
						'name': '工具12',
						'icon': 'ranging1',
						'check': 0 //点击不变蓝色
					},
					{
						'Id': 13,
						'Mode': false,
						'name': '工具13',
						'icon': 'modeling',
						'check': 2 //点击不变蓝色
					}
				]
			},
			{
				'Id': 14,
				'check': 2, //可选中
				'value': [{
						'Id': 15,
						'Mode': false,
						'name': '工具15',
						'icon': 'org',
						'check': 2 //点击不变蓝色
					},
					{
						'Id': 16,
						'Mode': false,
						'name': '工具16',
						'icon': 'data',
						'check': 2 //点击不变蓝色
					},
					{
						'Id': 17,
						'Mode': false,
						'name': '工具17',
						'icon': 'set',
						'check': 2 //点击不变蓝色
					},
					{
						'Id': 18,
						'Mode': false,
						'name': '工具18',
						'icon': 'mapping',
						'check': 2 //点击不变蓝色
					}
				]
			}
		],
		tool_attr: [{
				'FieldName': '尺寸标注',
				'value': [{
						'name': '顶部高度',
						'FieldValue': '20150.000',
						'IsAmend': false
					},
					{
						'name': '底部高度',
						'FieldValue': '19900.000',
						'IsAmend': true
					},
					{
						'name': '坡度',
						'FieldValue': '0.00度',
						'IsAmend': true
					},
					{
						'name': '厚度',
						'FieldValue': '250.000',
						'IsAmend': true
					},
					{
						'name': '体积',
						'FieldValue': '46.260',
						'IsAmend': true
					},
					{
						'name': '面积',
						'FieldValue': '185.030',
						'IsAmend': true
					},
					{
						'name': '周长',
						'FieldValue': '69924.000',
						'IsAmend': true
					}
				]
			},
			{
				'FieldName': '限制条件',
				'value': [{
						'name': '自标高的高度偏移',
						'FieldValue': '0.000',
						'IsAmend': true
					},
					{
						'name': '标高',
						'FieldValue': '5F',
						'IsAmend': true
					},
					{
						'name': '与体重相关',
						'FieldValue': '否',
						'IsAmend': true
					},
					{
						'name': '房间边界',
						'FieldValue': '是',
						'IsAmend': true
					}
				]
			},
			{
				'FieldName': '标识数据',
				'value': [{
						'name': '类型名称',
						'FieldValue': '',
						'IsAmend': true
					},
					{
						'name': '注释',
						'FieldValue': '',
						'IsAmend': true
					},
					{
						'name': '设计选项',
						'FieldValue': '-1',
						'IsAmend': true
					},
					{
						'name': '标记',
						'FieldValue': '',
						'IsAmend': true
					},
					{
						'name': '图像',
						'FieldValue': '<无>',
						'IsAmend': true
					}
				]
			},
			{
				'FieldName': '阶段化',
				'value': [{
						'name': '创建的阶段',
						'FieldValue': '新构造',
						'IsAmend': true
					},
					{
						'name': '拆除的阶段',
						'FieldValue': '无',
						'IsAmend': true
					}
				]
			}
		]
	};
	var WebGIS = new Web_GIS(opts);
	window.WebGIS = WebGIS;
	WebGIS.init(); //初始化插件
	
	WebGIS.ToolTabs.SetMaxNumber(5);
	WebGIS.ToolTabs.AddTabInf('00' , function(){alert(00)});
	WebGIS.ToolTabs.AddTabInf('11' , function(){alert(11)});
	WebGIS.ToolTabs.AddTabInf('22' , function(){alert(22)});
	WebGIS.ToolTabs.AddTabInf('33' , function(){alert(33)});
	WebGIS.ToolTabs.AddTabInf('44' , function(){alert(44)});
	//WebGIS.ToolTabs.RemoveTab(Tilte);
	//WebGIS.ToolTabs.UpDateTab(OldTilte , NewTilte);

});