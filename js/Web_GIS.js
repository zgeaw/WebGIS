/*WebGIS插件 32237384@qq.com*/

//define(['jquery'], function($) {
var Web_GIS = function(opts) {
	var _this = this;
	var tools = $('<div class="tools">');
	//默认配置参数
	var config = {
		tool_layer: null, //图层管理
		tool_toolbar: null, //工具栏管理
		tool_attr: null, //属性
		ToolLayerId: 'ToolLayer',
		ToolBarId: 'ToolBar',
		FullScreenId: 'FullScreen',
		ToolSearchId: 'ToolSearch',
		ToolTabsId: 'ToolTabs',
		ToolStatesId: 'ToolStates',
		ToolAttrId: 'ToolAttr',
		ToolMapxId: 'ToolMapx',
		ToolLayerClickLeft: null,
		ToolLayerClickRight: null,
		ToolLayerClickDb: null,
		ToolBarClickLeft: null,
		ToolBarClickRight: null
	}
	if(opts && $.isPlainObject(opts)) { //默认参数扩展
		$.extend(config, opts);
	} else {
		this.isConfig = true; //没有传入配置参数
	}

	var ToolAppend = { //初始化默认插件
		LayerHtml: [],
		LayerData: function(Obj, Level, Levelid) { //返回图层数据
			var _this_ = this;
			if(Obj) {
				_this_.LayerHtml.push('<ul>');
				var itemplus = '<i class="icon"></i>';
				for(var i = 0; i < Obj.length; i++) {
					var item = Obj[i];
					var num = Level;
					var itemcheck = '';
					var _checked = 'unchecked';
					var _minus = '';
					var active = '';
					var NewLevel = 'Layer_' + Level;
					if(Levelid) {
						num = [];
						for(var j = 0; j < Levelid.length; j++) {
							if(j == 0) {
								num += Levelid[j];
							} else {
								num += '_' + Levelid[j];
							}
						}
						NewLevel = Level;
					} else {
						if(num == undefined) {
							num = i;
							NewLevel = 'Layer_00';
						} else {
							num = Level + '_' + i;
						}
					}
					if(!item.value) {
						item.value = [];
					}
					if(item.value.length > 0 && item.AddType) {
						_minus = 'icon-plus';
					}
					itemplus = ('<i class="icon ' + _minus + '"></i>');
					if(item.AddType) {
						itemcheck = '<input type="checkbox" name="' + NewLevel + '" /><span class="icon icon-checkbox-' + _checked + '"></span>';

					} else {
						itemcheck = '<input type="radio" name="' + NewLevel + '" ' + _checked + '/><span class="icon icon-radio-' + _checked + '"></span>';
					}
					_this_.LayerHtml.push('<li class="' + active + '">');
					_this_.LayerHtml.push('<div class="label" toolID="' + item.Id + '" title="' + item.name + '" levelid="' + num + '" addtype="' + item.AddType + '">' + itemplus + itemcheck + '<span class="nametit">' + item.name + '</span></div>');
					if(item.value.length > 0) {
						_this_.LayerData(item.value, num);
					}
					_this_.LayerHtml.push('</li>');
				}
				_this_.LayerHtml.push('</ul>');
				return _this_.LayerHtml;
			}
		},
		ModifyRadio: function() { //处理单选按钮默认选中事件
			var NewName = $('#' + config.ToolLayerId + ' input[type = radio]');
			NewName.each(function(i) {
				var _this_ = $(this);
				var name = _this_.attr('name');
				var _input = $('#' + config.ToolLayerId + ' input[name = ' + name + ']');
				var Radio = _input.eq(0).next();
				_input.eq(0).prop('checked',true);
				Radio.attr('class','icon icon-radio-checked');
			});
		},
		CheckClick: function(Obj) {
			var ToolLayerId = $('#' + config.ToolLayerId);
			var _Check = function(Id) {
				Id.bind('click', function(event) {
					var _this_ = $(this);
					var _check = _this_.prev('input');
					var _type = _check.attr('type');
					var _name = _check.attr('name');
					var _ul = _this_.parent().next('ul');
					var _ulinput = _ul.find('input[type="checkbox"]');
					//公共选择半框与全框事件
					var _names = $('input[name=' + _name + ']').length;
					var _parent = _check.parent().parent().parent().prev();
					var _parent_input = _parent.find('input');
					var _parent_icon = _parent.find('span.icon');
					if(config.ToolLayerClickLeft) {
						var Ac_CallBack = function() {
							var CallBack = config.ToolLayerClickLeft;
							if(CallBack) {
								var LevelIds = _this_.parent().attr('levelid').split('_');
								var Layer = GlobalTool.SetArray('Get', config.tool_layer, LevelIds);
								var State = _this_.prev().prop('checked');
								if(State==true){//选择取反事件
									State = false;
								}else{
									State = true;
								}
								CallBack(Layer, State); //Layer为Json数据，State为 选中状态 True或false
							}
						}
						Ac_CallBack();
					}

					if(_type == 'radio') { //判断单选/多选事件
						$('input[name="' + _name + '"]').next('span.icon').attr('class', 'icon icon-' + _type + '-unchecked');
						_this_.attr('class', 'icon icon-' + _type + '-checked');
					} else {
						if(_this_.hasClass('icon-checkbox-unchecked')) {
							_this_.attr('class', 'icon icon-' + _type + '-checked');
							_check.prop('checked', true);
						} else {
							_this_.attr('class', 'icon icon-' + _type + '-unchecked');
							_check.prop('checked', false);
						}
						_parent_input.prop('checked', true);
						var _checksize = $('input[name=' + _name + ']:checked').length;
						if(_checksize > 0 && _checksize < _names) {
							_parent_icon.attr('class', 'icon icon-checkbox-checked').css('opacity', '.5');
						} else if(_checksize === _names) {
							_parent_icon.attr('class', 'icon icon-checkbox-checked').css('opacity', '1');
						} else {
							_parent_input.prop('checked', false);
							_parent_icon.attr('class', 'icon icon-checkbox-unchecked').css('opacity', '1');
						}
					}

					if(_ul && _check.prop('checked')) { //全选/反选事件
						_ulinput.prop('checked', true);
						_ulinput.next('span.icon').attr('class', 'icon icon-' + _type + '-checked');
					} else {
						_ulinput.prop('checked', false);
						_ulinput.next('span.icon').attr('class', 'icon icon-' + _type + '-unchecked');
					}

					event.stopPropagation(); //防止事件向上冒泡
					return false; //防止事件向上冒泡
				});
			};
			var _DropDown = function(Id) {
				Id.bind('click', function(event) { //折叠图层事件
					var _this_ = $(this);
					var _thisul = _this_.parent().next('ul');
					var _thisclass = _this_.attr('class');
					_thisul.slideToggle();
					if(_this_.hasClass('icon-plus')) {
						_this_.attr('class', 'icon icon-minus');
					} else {
						_this_.attr('class', 'icon icon-plus');
					}
					event.stopPropagation(); //防止事件向上冒泡
					return false; //防止事件向上冒泡
				});
			};

			if(!Obj) {		
				ToolLayerId.find('.label').each(function() {
					var _this_ = $(this);
					var check = _this_.find('span.icon');
					_this_.click(function(event) {
						event.stopPropagation(); //防止事件向上冒泡
					});	
					_Check(check);
					_DropDown(_this_.find('i.icon'));
				});
			} else {
				var Label = ToolLayerId.find('.label[title='+Obj.attr('title')+']');
				_Check(Label.find('span.icon'));
				_DropDown(Label.find('i.icon'));
			}
		},
		LayerClick: function() { //图层点击事件
			var ToolLayerId = $('#' + config.ToolLayerId);
			var btn = ToolLayerId.children('a.btn');
			var dropDown = btn.next('.dropDown');
			ToolLayerId.bind('click', function(event) { //展开/关闭图层管理
				event.stopPropagation(); //防止事件向上冒泡
				return false; //防止事件向上冒泡
			});
			btn.unbind().bind('click', function(event) { //展开/关闭图层管理
				dropDown.slideToggle();
				event.stopPropagation(); //防止事件向上冒泡
				return false; //防止事件向上冒泡
			});
			this.CheckClick();
		},
		tool_layer: function(obj) { //图层管理
			var _this_ = this;
			if(obj) {
				var tool_class = 'tool-layer';
				$('.' + tool_class).remove();
				var _html = _this_.LayerData(obj).join("");

				var tool = $('<div class="' + tool_class + '" id="' + config.ToolLayerId + '">');
				var btn = $('<a href="javascript:;" class="btn btn-blue" title="图层管理"><span class="icon icon-stack"></span></a>');
				var dropDown = $('<div class="dropDown">');

				dropDown.append(_html);
				tool.append(btn, dropDown);
				tools.append(tool);
				_this_.LayerHtml = [];
			}
		},
		AttrClick: function() { //属性点击事件
			var ToolAttrId = $('#' + config.ToolAttrId);
			var AttrId = ToolAttrId.next('.attr');
			var header_tit = AttrId.find('.header_tit');
			var attr_dropDown = header_tit.next('.attr_dropDown');
			var _close = AttrId.find('.close');
			var content = AttrId.find('.content');
			var _value = content.find('.value');
			var _input = content.find('input');
			var onespan = content.find('.onespan');

			GlobalTool.ToolShow(ToolAttrId, AttrId); //显示/隐藏属性
			GlobalTool.ToolShow(_close, AttrId); //关闭属性
			header_tit.each(function(i) { //展开/折叠二级属性
				GlobalTool.ToolShow(header_tit.eq(i), attr_dropDown.eq(i));
			});
			_value.each(function(i) { //显示输入框
				var Amend = $(this).parent().attr('amend');
				if(Amend == 'true') { //判断属性是否可修改
					GlobalTool.ToolShow(_value.eq(i), content.eq(i));
					_value.eq(i).bind('click', function() {
						var _this_ = $(this).parent();
						var Input = _this_.find('input');
						Input.focus();
					});
				}
			});
			_input.focusout(function() {
				var _this_ = $(this);
				var _parent = _this_.parent().parent();
				_parent.removeClass('active');
			});

			_input.change(function() { //数据改变保存数据
				var _this_ = $(this);
				var _parent = _this_.parent().parent();
				var Value = _parent.find('.value');
				var LevelIds = _parent.attr('levelid').split('_');
				var name = _parent.find('.onespan').text();
				var FieldValue = _this_.val();
				var IsAmend = _parent.attr('.amend');
				var header_tit = _parent.parent().parent().prev('.header_tit');
				var _Json = {
					'name': name,
					'FieldValue': FieldValue,
					'IsAmend': IsAmend
				};
				AttrId.attr('amend', true);
				_parent.attr('isamend', true);
				header_tit.attr('isamend', true);
				GlobalTool.SetArray('Set', config.tool_attr, LevelIds, _Json); //修改Json 数据
				console.log(config.tool_attr);
				Value.text(FieldValue);
			});
		},
		tool_search: function(obj) { //全屏-搜索-属性
			var tool_class = 'tool-search';
			$('.' + tool_class).remove();
			var tool = $('<div class="' + tool_class + '">');
			var search = $('<div class="search" id="' + config.ToolSearchId + '"><input type="text" class="form-input" placeholder="Enter an address or landmark..."><a href="javascript:;" class="btn btn-blue" title="搜索"><span class="icon icon-search"></span></a></div>');
			var btn1 = $('<a href="javascript:;" class="btn btn-blue show" title="全屏" id="' + config.FullScreenId + '"><span class="icon icon-enlarge"></span></a>');
			tool.append(search, btn1);
			if(obj) {
				var btn2 = $('<a href="javascript:;" class="btn btn-blue" title="属性" id="' + config.ToolAttrId + '"><span class="icon icon-attr"></span></a>');
				var attrdiv = $('<div class="attr" Amend="false"><p class="title"><span>属性</span><a href="javascript:;" class="fr close"><i class="icon icon-close"></i></a></p>');
				var _ul = $('<ul>');
				for(var i = 0; i < obj.length; i++) {
					var item = obj[i];
					var _li = $('<li><p class="header_tit" levelid="' + i + '" isAmend="false" title="' + item.FieldName + '"><i class="space"></i><span>' + item.FieldName + '</span></p></li>');
					if(item.value) {
						var _active = '';
						if(i == 0) {
							_active = 'active';
						}
						var _li_ul = $('<ul class="attr_dropDown ' + _active + '">');
						for(var j = 0; j < item.value.length; j++) {
							var itemtwo = item.value[j];
							var _li_ul_li = $('<li><p class="content" levelid="' + i + '_' + j + '" Amend="' + itemtwo.IsAmend + '" isAmend="false" title="' + itemtwo.name + '"><i class="space"></i><span class="onespan" title="' + itemtwo.name + '">' + itemtwo.name + '</span><span class="value">' + itemtwo.FieldValue + '</span><span class="form-control"><input type="text" value="' + itemtwo.FieldValue + '"></span></p></li>');
							_li_ul.append(_li_ul_li);
						}
						_li.append(_li_ul);
					}
					_ul.append(_li);
				}
				attrdiv.append(_ul);
				tool.append(btn2, attrdiv);
			}
			tools.append(tool);
			btn1.bind('click', function() { //按钮全屏事件
				var btn = $(this).find('span.icon');
				if(btn.hasClass('icon-enlarge')) {
					_this.FullScreen.SetScreenState(true); //全屏
				} else {
					_this.FullScreen.SetScreenState(false); //退出全屏
				}
			});
		},
		TabClick: function() { //对话框点击事件
			var ToolTabsId = $('#' + config.ToolTabsId);
			var btn = ToolTabsId.children('a.btn');
			var tabs = ToolTabsId.find('.tabs');
			var icon = tabs.find('i.icon');
			icon.each(function() {
				$(this).bind('click', function(event) {
					var _this_ = $(this);
					_this_.parent().remove();
					if(tabs.find('.tab').length == 0) {
						tabs.remove();
						ToolTabsId.attr('style', 'overflow:visible;');
						btn.attr('style', 'border-radius:4px;');
					}
					event.stopPropagation(); //防止事件向上冒泡
					return false; //防止事件向上冒泡
				});
			});
		},
		tool_tabs: function() { //对话框管理容器
			var tool_class = 'tool-tabs';
			$('.' + tool_class).remove();
			var tool = $('<div class="' + tool_class + '" id="' + config.ToolTabsId + '">');
			var btn = $('<a href="javascript:;" class="btn btn-blue" title="对话框"><span class="icon icon-menu"></span></a>');
			var tabs = $('<div class="tabs">');
			for(var i = 0; i < 5; i++) {
				var tab = $('<p class="tab active"><span title="标题' + i + '">标题' + i + '</span><i class="icon icon-close"></i></p>');
				tabs.append(tab);
			}
			tool.append(btn, tabs);
			tools.append(tool);
			GlobalTool.ToolShow(btn, tool); //显示/隐藏对话框管理容器
		},
		tool_mapx: function() { //鹰眼图管理
			var tool_class = 'tool-mapx';
			$('.' + tool_class).remove();
			var tool = $('<div class="' + tool_class + '" id="' + config.ToolMapxId + '">');
			var btn = $('<a href="javascript:;" class="btn btn-blue" title="鹰眼图"><span class="icon icon-arrow-up"></span></a>');
			var content = $('<div class="content"><i></i></div>');
			tool.append(btn, content);
			tools.append(tool);

			//显示/隐藏鹰眼图管理
			GlobalTool.ToolShow(btn, tool, function() {
				if(!tool.hasClass('active')) {
					btn.find('span.icon').attr('class', 'icon icon-arrow-up');
				} else {
					btn.find('span.icon').attr('class', 'icon icon-arrow-down');
				}
			});
		},
		tool_states: function() { //状态条管理
			var tool_class = 'tool-states';
			$('.' + tool_class).remove();
			var tool = $('<div class="' + tool_class + '" id="' + config.ToolStatesId + '">');
			var btn = $('<a href="javascript:;" class="btn btn-blue" title="状态"><span class="icon icon-state"></span></a>');
			var state = $('<div class="content"><span class="loading"></span><p><span class="active">35.32542 State</span><span class="active">&copy;2017,Goldtron 3D webGIS</span></p></div>');
			tool.append(btn, state);
			tools.append(tool);
			GlobalTool.ToolShow(btn, state); //显示/隐藏状态条
		},
		ToolBarClick: function() { //工具栏点击事件
			var ToolBarId = $('#' + config.ToolBarId);
			var btn_group = ToolBarId.find('.btn-group');
			var btn = ToolBarId.find('a.btn');
			btn_group.each(function(i) {
				var _this_ = $(this);
				var _check = _this_.attr('toolcheck');
				var _btn = _this_.find('a.btn');
				var state = false;
				var btn_group_btn = _this_.children('a.btn[toolcheck=0]');
				btn_group_btn.each(function(i) {
					var _this_ = $(this);
					if(_this_.hasClass('active')) {
						state = true;
					}
				});
				if(_check == 0 && !state) {
					btn_group_btn.eq(0).addClass('active');
				}
			});
			btn.bind('click', function(event) {
				var _this_ = $(this);
				var thisdropDown = _this_.next('.dropDown');
				var display = thisdropDown.css('display');
				var _Parent = _this_.parent();
				var _check = _this_.attr('toolcheck');
				var btn_group = _this_.parent().attr('toolcheck');
				var btn_group_btn = _this_.parent().find('a.btn[toolcheck=0]').eq(0);
				if(_Parent.attr('class') !== 'dropDown') { //判断是否为一级按钮
					ToolBarId.find('.dropDown').slideUp();
				}
				if(_Parent.attr('toolcheck') != 2 && _check == 0) {
					_this_.siblings('a.btn[toolcheck=0]').removeClass('active');
				}
				if(_check == 0) {
					if(!_this_.hasClass('active')) {
						_this_.addClass('active');
					}
				}
				if(_check == 1) {
					if(!_this_.hasClass('active')) {
						_this_.addClass('active');
					} else {
						_this_.removeClass('active');
					}
				}
				if(display == 'none') {
					thisdropDown.slideDown();
				} else {
					thisdropDown.slideUp();
				}
				event.stopPropagation(); //防止事件向上冒泡
				return false; //防止事件向上冒泡
			});
			$('body').bind('click', function() {
				$('.dropDown').slideUp();
			});
		},
		tool_toolbar: function(obj) { //工具栏管理
			if(obj) {
				var tool_class = 'tool-toolbar';
				$('.' + tool_class).remove();
				var tool = $('<div class="' + tool_class + '" id="' + config.ToolBarId + '">');
				var _btn = $('<a href="javascript:;" class="btn-toolbar"><i></i></a>');
				var _width = window.screen.width;
				for(var i = 0; i < obj.length; i++) {
					var item = obj[i];
					var btn_group = $('<div class="btn-group" toolID="' + item.Id + '" ToolCheck="' + item.check + '" levelid="' + i + '">');
					if(item.value) {
						for(var j = 0; j < item.value.length; j++) {
							var itembtn = item.value[j];
							var active = '';
							var Mode = '';
							if(itembtn.value) {
								active = ' btn-sub';
							}
							var btn = $('<a href="javascript:;" class="btn btn-blue' + active + '" ToolCheck="' + itembtn.check + '" title="' + itembtn.name + '" toolID="' + itembtn.Id + '" levelid="' + i + '_' + j + '"><span class="icon icon-' + itembtn.icon + '"></span></a>');
							if(_width > 1024 || itembtn.Mode) {
								btn_group.append(btn);
							}
							if(itembtn.value && (_width > 1024 || itembtn.Mode)) {
								var dropwidth = 42 * j;
								var dropDown = $('<div class="dropDown" style="left:' + dropwidth + 'px;" ToolCheck="' + itembtn.check + '" toolID="' + itembtn.Id + '" levelid="' + i + '_' + j + '">');
								for(var k = 0; k < itembtn.value.length; k++) {
									var itembtntwo = itembtn.value[k];
									var btntwo = $('<a href="javascript:;" class="btn btn-blue" ToolCheck="' + itembtntwo.check + '" title="' + itembtntwo.name + '" toolID="' + itembtntwo.Id + '" levelid="' + i + '_' + j + '_' + k + '"><span class="icon icon-' + itembtntwo.icon + '"></span></a>');
									dropDown.append(btntwo);
									btntwo.bind('click', function(event) {
										event.stopPropagation(); //防止事件向上冒泡
										return false; //防止事件向上冒泡
									});
								}
								btn_group.append(dropDown);
							}
						}
						if(btn_group.html()) { //工具栏居中定位处理
							tool.append(btn_group);
							var btn_width = tool.find('> .btn-group > a.btn');
							if(btn_width) {
								var _margin = (btn_width.length / 2) * 42;
								tool.attr('style', 'margin-left:-' + _margin + 'px;');
							}
						}
					}
				}
				tool.append(_btn);
				tools.append(tool);

				//显示/隐藏工具栏
				GlobalTool.ToolShow(_btn, tool, function() {
					if(tool.find('>.btn-group').length === 1) {
						tool.find('>.btn-group').addClass('active');
					}
				});
			}
		}
	}

	var GlobalTool = { //全局函数
		ToolShow: function(Obj, Id, CallBack) { //展开/闭合插件
			Obj.unbind().bind('click', function(event) {
				if(!Id.hasClass('active')) {
					Id.addClass('active');
				} else {
					Id.removeClass('active');
				}
				if(CallBack) { //执行回调
					CallBack();
				}
				event.stopPropagation(); //防止事件向上冒泡
			});
		},
		ReArray: function(Type, Obj, Array, Begin) { //Json递归
			var Begin = Begin || 0;
			if(Array != null) {
				if(Array.length > (Begin + 1)) {
					var Objs = Obj[Array[Begin]].value;
					return this.ReArray(Type, Objs, Array, Begin + 1);
				} else {
					if(Type == 'Get' || Type == 'Set') {
						return Obj[Array[Begin]];
					} else {
						return Obj;
					}
				}
			} else {
				return Obj;
			}
		},
		SetArray: function(Type, Obj, LevelIds, Button) { //设置 Json数据
			var state = false;
			if(Type == 'Add') { //添加Json数据
				if(!Button.value) { //创建新数组,防止没有传入数组
					Button.value = [];
				}
				state = this.ReArray(Type, Obj, LevelIds).push(Button);
			} else if(Type == 'Get') { //获取Json数据
				state = this.ReArray(Type, Obj, LevelIds);
				return JSON.stringify(state);
			} else if(Type == 'Set') { //修改Json数据
				state = this.ReArray(Type, Obj, LevelIds);
				for(var i in state) {
					state[i] = Button[i];
				}
			} else if(Type == 'Del') { //删除Json数据
				state = this.ReArray(Type, Obj, LevelIds).splice(0, 1);
			}
		},
		GlobalClick: function(Type, Obj, Index, CallBack) { //点击通用回调
			var _this_ = Obj;
			if(Index) {
				_this_ = Obj.eq(Index);
			}
			if(Type == 'Db') {
				_this_.dblclick(function(event) { //双击事件
					if(CallBack) { //判断是否传入回调函数
						CallBack(); //执行回调
					}
					event.stopPropagation(); //防止事件向上冒泡
				});
			} else {
				var Num = 1;
				var Ac_CallBack = function(e) {
					if(CallBack) { //判断是否传入回调函数
						CallBack(); //执行回调
					}
					e.stopPropagation(); //防止事件向上冒泡
				}
				if(Type == 'Right') {
					Num = 3;
					_this_.mousedown(function(event) {
						if(Num == event.which) { //右键单击事件
							Ac_CallBack(event);
						}
					});
				} else {
					_this_.bind('click', function(event) {
						Ac_CallBack(event);
					});
				}
			}
		},
		LeftClick: function(Obj, Index, CallBack) { //左击回调
			this.GlobalClick('Left', Obj, Index, CallBack);
		},
		RightClick: function(Obj, Index, CallBack) { //右击回调
			this.GlobalClick('Right', Obj, Index, CallBack);
		},
		DbClick: function(Obj, Index, CallBack) { //双击回调
			this.GlobalClick('Db', Obj, Index, CallBack);
		},
		GetX: function(e, Width) {
			Width = Width || 0;
			e = e || window.event;
			return e.pageX || window.event.pageX - e[0].offsetLeft + Width;
		},
		GetY: function(e, Height) {
			Height = Height || 0;
			e = e || window.event;
			return e.pageY || window.event.pageY - e[0].offsetTop + Height;
		},
		GetComponentState: function(Id) { //获取组件状态
			var content = $('#' + Id);
			var state = 'show';
			if(content.hasClass('hide')) {
				state = 'hide';
			}
			return state;
		},
		SetComponentState: function(Id, State, Obj) { //设置组件状态
			var content = $('#' + Id);
			if(State) {
				content.removeClass('hide').addClass('show');
				if(Obj) {
					Obj.removeClass('hide').addClass('show');
				}
			} else {
				content.removeClass('show').addClass('hide');
				if(Obj) {
					Obj.removeClass('show').addClass('hide');
				}
			}
		}
	}

	var ToolLayer = { //图层管理,组件封装
		LayerData: function(_ul, _array, Num, AddType) { //构造数据
			var _this_ = this;
			var label = _ul;
			var _li = _ul.children('li').length;
			var LevelId = label.attr('levelid');
			if(Num > 0) {
				label = _ul.next('ul').children('li:last-child').children('.label');
				_li = _ul.next('ul').children('li').length;
				NLevelId = LevelId + '_' + _li.toString();
			} else {
				NLevelId = _li.toString();
			}
			var LevelIds = NLevelId.split('_');
			var TypeName = label.find('input').attr('name');
			if(!TypeName) {
				TypeName = 'Layer_' + LevelId;
			}
			GlobalTool.SetArray('Add', config.tool_layer, LevelIds, _array); //添加Json 数据
			var _clone = $(ToolAppend.LayerData([_array], TypeName, LevelIds).join(''));
			if(Num > 0) {
				if(_ul.next('ul')){
					_ul.append('<ul>');
				}
				var _ul_ = _ul.next('ul');
				if(_ul_.length > 0) {
					_ul.next('ul').append(_clone.html());
				} else {
					_ul.children('i.icon').addClass('icon-plus');
					_ul.after(_clone);
				}

			} else {
				_ul.append(_clone.html());
			}
			ToolAppend.LayerHtml = [];
			ToolAppend.CheckClick(_clone.find('.label')); //图层点击事件
			//_this_.UpDate('LeftClick',config.ToolLayerClickLeft,_clone.find('.label'));
			_this_.UpDate('RightClick', config.ToolLayerClickRight, _clone.find('.label'));
			_this_.UpDate('DbClick', config.ToolLayerClickDb, _clone.find('.label'));
			//console.log(config.tool_layer)
		},
		IsObj: function(_ul, Layers, Num, AddType) { //判断数据是数组还是对象
			var _this_ = this;
			if(typeof Layers === 'object' && !isNaN(Layers.length)) {
				$(Layers).each(function(i) {
					_this_.LayerData(_ul, Layers[i], Num, AddType);
				});
			} else { //IS对象
				_this_.LayerData(_ul, Layers, Num, AddType);
			}
			ToolAppend.ModifyRadio(); //处理单选按钮默认选中事件
		},
		AddLayer: function(ParentLayerId, Layers, AddType) { //图层添加数据
			var _this_ = this;
			var label = $('#' + config.ToolLayerId + ' .label[toolid=' + ParentLayerId + ']');
			if(ParentLayerId == -1) {
				label = $('#' + config.ToolLayerId + ' .dropDown').children('ul');
			}
			if(label.length > 0) {
				_this_.IsObj(label, Layers, ParentLayerId, AddType);
			}
		},
		GetNode: function(LayerId, Child, Type) { //获取节点
			var label = $('#' + config.ToolLayerId + ' .label[toolid=' + LayerId + ']');
			var toolid = label.attr('toolid');
			var AddType = label.attr('addtype');
			var name = label.children('.nametit').text();
			var Parent = label.parent().parent().prev('.label').attr('toolid');
			var ChildNode = label.next('ul');
			var LevelIds;
			var state = false;
			if(LayerId && Child) { //获取所有子节点,返回json数据
				LevelIds = label.attr('levelid').split('_');
				state = GlobalTool.SetArray('Get', config.tool_layer, LevelIds);
			} else if(LayerId && Type) {
				if(Type == 'AddType') { //获取节点类型
					state = AddType;
				} else if(Type == 'Name') { //获取节点名称
					state = name;
				} else if(Type == 'Parent') { //获取父节点ID，为-1时表示没有父节点
					if(!Parent) {
						Parent = -1;
					}
					state = Parent;
				} else if(Type == 'Child') { //是否存在子节点
					if(ChildNode.length) {
						state = true;
					}
				}
			} else if(LayerId) { //获取节点
				if(label.length) {
					LevelIds = label.attr('levelid').split('_');
					state = GlobalTool.SetArray('Get', config.tool_layer, LevelIds);
				}
			} else { //返回根节点
				state = JSON.stringify(config.tool_layer);
			}
			return state;
		},
		RemoveNode: function(LayerId) { //删除节点
			var state = false;
			if(LayerId) {
				var label = $('#' + config.ToolLayerId + ' .label[toolid=' + LayerId + ']');
				var _parent = label.parent();
				if(label.length) {
					var LevelIds = label.attr('levelid').split('_');
					GlobalTool.SetArray('Del', config.tool_layer, LevelIds);
					_parent.remove();
					state = true;
				}
			}
			return state;
		},
		UpdateNode: function(Layer) { //更新已经存在的节点
			var state = false;
			if(Layer) {
				var label = $('#' + config.ToolLayerId + ' .label[toolid=' + Layer.Id + ']');
				var name = label.children('.nametit');
				if(label.length) {
					var LevelIds = label.attr('levelid').split('_');
					name.text(Layer.name);
					GlobalTool.SetArray('Set', config.tool_layer, LevelIds, Layer);
					state = true;
				}
			}
			return state;
		},
		UpDate: function(Type, CallBack, Clone) {
			var label = $('#' + config.ToolLayerId + ' .label');
			if(!Clone) {
				label.each(function(i) {
					var _this_ = $(this);
					var LevelIds = _this_.attr('levelid').split('_');
					var Layer = GlobalTool.SetArray('Get', config.tool_layer, LevelIds);
					var State = _this_.find('input').prop('checked');
					var Ac_CallBack = function() {
						if(CallBack) {
							CallBack(Layer, State); //Layer为Json数据，State为 选中状态 True或false
						}
					}
					if(Type == 'LeftClick') {
						//GlobalTool.LeftClick(_this_.find('span.icon'), null, Ac_CallBack);
					}
					if(Type == 'RightClick') {
						GlobalTool.RightClick(_this_, null, Ac_CallBack);
					}
					if(Type == 'DbClick') {
						GlobalTool.DbClick(_this_, null, Ac_CallBack);
					}
				});
			} else {
				var NewClone = $('.label[title=' + Clone.attr('title') + ']');
				var Ac_CallBack = function() {
					if(CallBack) {
						var LevelIds = Clone.attr('levelid').split('_');
						var Layer = GlobalTool.SetArray('Get', config.tool_layer, LevelIds);
						var State = NewClone.find('input').prop('checked');
						CallBack(Layer, State); //Layer为Json数据，State为 选中状态 True或false
					}
				}
				/*if(Type == 'LeftClick') {
					GlobalTool.LeftClick(NewClone.find('span.icon'), null,Ac_CallBack);
				}*/
				if(Type == 'RightClick') {
					GlobalTool.RightClick(NewClone, null, Ac_CallBack);
				}
				if(Type == 'DbClick') {
					GlobalTool.DbClick(NewClone, null, Ac_CallBack);
				}
			}
		}

	}
	this.ToolLayer = { //图层管理
		AddLayer: function(ParentLayerId, Layer) { //添加数据
			ToolLayer.AddLayer(ParentLayerId, Layer);
		},
		AddLayerList: function(ParentLayerId, Layer, AddType) { //批量添加数据
			ToolLayer.AddLayer(ParentLayerId, Layer, AddType);
		},
		RemoveNode: function(LayerId) { //删除节点,返回true 删除成功，返回false删除失败或节点不存在
			return ToolLayer.RemoveNode(LayerId);
		},
		UpdateNode: function(Layer) { //更新已经存在的节点,返回false时候,表示对应的节点不存在
			return ToolLayer.UpdateNode(Layer);
		},
		GetRootNode: function() { //返回根节点,返回json数据
			return ToolLayer.GetNode();
		},
		GetNode: function(LayerId) { //获取节点,返回json数据
			return ToolLayer.GetNode(LayerId);
		},
		GetAllChild: function(ParentLayerId) { //获取所有子节点,返回json数据
			return ToolLayer.GetNode(ParentLayerId, true);
		},
		GetNodeType: function(LayerId) { //获取节点类型，AddType为 true时表示普通节点，false时，为单选互斥节点
			return ToolLayer.GetNode(LayerId, false, 'AddType');
		},
		GetParentNode: function(LayerId) { //获取父节点ID，为-1时表示没有父节点
			return ToolLayer.GetNode(LayerId, false, 'Parent');
		},
		GetNodeName: function(LayerId) { //获取节点名称, false表示节点不存在
			return ToolLayer.GetNode(LayerId, false, 'Name');
		},
		GetChildNode: function(LayerId) { //是否存在子节点, true 表示存在, false 表示不存在
			return ToolLayer.GetNode(LayerId, false, 'Child');
		},
		SetLeftClickFun: function(CallBack) { //左击回调, CallBack(Layer,State) 为回调函数, Layer为Json数据，State为 选中状态 True或false
			ToolLayer.UpDate('LeftClick', CallBack);
			config.ToolLayerClickLeft = CallBack;
		},
		SetRightClickFun: function(CallBack) { //右击回调, CallBack(Layer,State) 为回调函数, Layer为Json数据，State为 选中状态 True或false
			ToolLayer.UpDate('RightClick', CallBack);
			config.ToolLayerClickRight = CallBack;
		},
		SetDbClickFun: function(CallBack) { //双击回调, CallBack(Layer,State) 为回调函数, Layer为Json数据，State为 选中状态 True或false
			ToolLayer.UpDate('DbClick', CallBack);
			config.ToolLayerClickDb = CallBack;
		},
		GetComponentState: function() { //获取组件是显示还是隐藏状态,返回值hide隐藏,show显示
			return GlobalTool.GetComponentState(config.ToolLayerId);
		},
		SetComponentState: function(State) { //设置组件状态, State 为 true显示，false 隐藏
			GlobalTool.SetComponentState(config.ToolLayerId, State);
		}
	}

	var ToolBar = { //工具栏管理,组件封装
		UpDate: function(Type, Button, GroupId) {
			var ToolBarId = $('#' + config.ToolBarId);
			var Group = ToolBarId.find('.btn-group');
			var _GroupId = {};
			var _ButtonId = {};
			var LevelIds = null;
			var _width = window.screen.width;
			var _html = [];
			var state = false;
			var ToolCheck = 2;
			if(Type == 'UpDate') {
				_ButtonId = ToolBarId.find('a.btn[toolid=' + Button.Id + ']');
			} else if(Type == 'Add' || Type == 'AddCheck' || Type == 'GetCheckStateButton' || Type == 'AddRadio') {
				_GroupId = ToolBarId.find('.btn-group[toolid=' + GroupId + ']');
			} else if(Type == 'LeftClick' || Type == 'RightClick') {
				_ButtonId = ToolBarId.find('a.btn');
			} else {
				_ButtonId = ToolBarId.find('a.btn[toolid=' + Button + ']');
			}
			if(_ButtonId.length > 0 && (Type != 'LeftClick' || Type != 'RightClick')) {
				LevelIds = _ButtonId.attr('levelid').split('_');
			}
			if(Type == 'AddRadio') { //一组按钮
				if(Button) {
					var group_html = $('<div class="btn-group" toolid="' + Button.Id + '" toolcheck="0" levelid="' + GroupId + '">');
					if(Button.value) {
						var LeveGroup = Group.length;
						if(_GroupId.length) {
							var btn = _GroupId.children('a.btn');
							var btn_levelid = btn.eq(btn.length - 1).attr('levelid').split('_');;
							var btn_levelid_length = btn_levelid[btn_levelid.length - 1];
						}
						for(var i = 0; i < Button.value.length; i++) {
							var item = Button.value[i];
							if(_GroupId.length) {
								btn_levelid_length++;
								LeveGroup = _GroupId.attr('levelid') + '_' + btn_levelid_length;
								LevelIds = btn_levelid;
								GlobalTool.SetArray('Add', config.tool_toolbar, LevelIds, Button.value[i]); //添加Json 数据
							} else {
								LeveGroup = Group.length + '_' + i;
							}
							var _btn = $('<a href="javascript:;" class="btn btn-blue" toolcheck="0" title="' + item.name + '" toolid="' + item.Id + '" levelid="' + LeveGroup + '"><span class="icon icon-' + item.icon + '"></span></a>');
							group_html.append(_btn);
							if(item.value) {
								var _dropDown = $('<div class="dropDown" toolcheck="0" toolid="' + item.Id + '" levelid="' + LeveGroup + '">');
								for(var j = 0; j < item.value.length; j++) {
									var _Ditem = item.value[i];
									var _Dbtn = $('<a href="javascript:;" class="btn btn-blue" toolcheck="0" title="' + _Ditem.name + '" toolid="' + _Ditem.Id + '" levelid="' + LeveGroup + '_' + j + '"><span class="icon icon-' + _Ditem.icon + '"></span></a>');
									_dropDown.append(_Dbtn);
								}
								_btn.addClass('btn-sub');
								group_html.append(_dropDown);
							}
						}
					}
					_html = group_html;
					if(_GroupId.length) {
						_GroupId.append(_html.html());
					} else {
						ToolBarId.append(_html);
						GlobalTool.SetArray('Add', config.tool_toolbar, null, Button); //添加Json 数据
					}
					ToolAppend.ToolBarClick()
					//console.log(config.tool_toolbar);
				}
			} else { //单个按钮
				_html = $('<a href="javascript:;" class="btn btn-blue" ToolCheck="' + ToolCheck + '" title="' + Button.name + '" toolid="' + Button.Id + '" levelid=""><span class="icon icon-' + Button.icon + '"></span></a>');
			}
			if(Type == 'Add' || Type == 'AddCheck') { //添加普通Button
				var _levelid = _GroupId.attr('levelid');
				var Child = _GroupId.children('a.btn');
				var ChildSplit = '';
				var NewLevelId = {};
				if(Child.length) {
					ChildSplit = Child.eq(Child.length - 1).attr('levelid').split('_');
					NewLevelId = _levelid + '_' + (parseInt(ChildSplit[ChildSplit.length - 1]) + 1);
				} else {
					NewLevelId = _levelid + '_0';
				}
				if(_width > 1024 || Button.Mode) {
					if(Type == 'AddCheck') {
						_html.attr('ToolCheck', Button.check);
					}
					_GroupId.append(_html.attr('levelid', NewLevelId));
				}
				if(_GroupId.length) {
					LevelIds = NewLevelId.split('_');
					GlobalTool.SetArray('Add', config.tool_toolbar, LevelIds, Button); //添加Json 数据
					ToolAppend.ToolBarClick()
					state = true;
				}
			} else if(Type == 'Del') { //删除对应的Button
				if(_ButtonId.length) {
					_ButtonId.next('.dropDown').remove();
					_ButtonId.remove();
					GlobalTool.SetArray('Del', config.tool_toolbar, LevelIds); //删除Json 数据
					state = true;
				}
			} else if(Type == 'UpDate') { //更新button内容
				if(_ButtonId.length) {
					_ButtonId.attr('title', Button.name);
					_ButtonId.find('span.icon').attr('class', 'icon icon-' + Button.icon);
					if(Button.Mode) {
						_ButtonId.addClass('hidden-md');
					} else {
						_ButtonId.removeClass('hidden-md');
					}
					GlobalTool.SetArray('Set', config.tool_toolbar, LevelIds, Button); //修改Json 数据
					state = true;
				}
			} else if(Type == 'GetButtonState') { //获取对应的button的check状态
				if(_ButtonId.length && _ButtonId.hasClass('active')) {
					state = true;
				}
			} else if(Type == 'GetCheckStateButton') { //依据组ID获取选中的button
				if(_GroupId.length) {
					LevelIds = _GroupId.attr('levelid').split('_');
					state = GlobalTool.SetArray('Get', config.tool_toolbar, LevelIds); //获取Json 数据
				}
			} else if(Type == 'GetButton') { //获取普通button
				if(_ButtonId.length) {
					state = GlobalTool.SetArray('Get', config.tool_toolbar, LevelIds); //获取Json 数据
				}
			} else if(Type == 'GetButtonType') { //获取button的类型
				if(_ButtonId.length) {
					_ParentId = _ButtonId.attr('toolcheck');
					if(_ParentId == 0) {
						state = true;
					}
				}
			}
			if(Type == 'LeftClick' || Type == 'RightClick') {
				if(_ButtonId.length) {
					_ButtonId.each(function(i) {
						var _this_ = $(this);
						LevelIds = _this_.attr('levelid').split('_');
						var _Json = GlobalTool.SetArray('Get', config.tool_toolbar, LevelIds); //获取Json 数据
						var AcCallBack = function() {
							if(Button) {
								Button(_Json); //执行回调函数，并回传参数
							}
						}
						if(Type == 'LeftClick') { //左击回调
							GlobalTool.LeftClick(_this_, null, AcCallBack);
						}
						if(Type == 'RightClick') { //右击回调
							GlobalTool.RightClick(_this_, null, AcCallBack);
						}
					});
				}
			}
			return state;
		}
	}
	this.ToolBar = { //工具栏管理
		AddButton: function(Button, GroupId) { //添加普通Button
			ToolBar.UpDate('Add', Button, GroupId);
		},
		AddStateButton: function(Button, GroupId) { //添加具有check状态的Button
			ToolBar.UpDate('AddCheck', Button, GroupId);
		},
		AddRadioButtons: function(Buttons, GroupId) { //添加具有单选排斥状态的一组button
			ToolBar.UpDate('AddRadio', Buttons, GroupId);
		},
		RemoveButton: function(ButtonId) { //删除对应的Button，返回false时候，便是没有找到对应的button
			return ToolBar.UpDate('Del', ButtonId);
		},
		UpDateButton: function(Button) { //更新button内容返回false时候，便是没有找到对应的button
			return ToolBar.UpDate('UpDate', Button);
		},
		GetButton: function(ButtonId) { //获取普通button , 返回json数据
			return ToolBar.UpDate('GetButton', ButtonId);
		},
		GetButtonState: function(ButtonId) { //获取对应的button的check状态, 返回true 表示选中
			return ToolBar.UpDate('GetButtonState', ButtonId);
		},
		GetCheckStateButton: function(Groupid) { //依据组ID获取选中的button , 返回json数据
			return ToolBar.UpDate('GetCheckStateButton', {}, Groupid);
		},
		GetButtonType: function(ButtonId) { //获取button的类型，Group类型 , 返回true 表示互斥
			return ToolBar.UpDate('GetButtonType', ButtonId);
		},
		SetLeftClickFun: function(CallBack) { //左击的回调函数设置, CallBack() 回调函数 , Button 为Json数据
			ToolBar.UpDate('LeftClick', CallBack);
			config.ToolBarClickLeft = CallBack;
		},
		SetRightClickFun: function(CallBack) { //右击的回调函数设置, CallBack() 回调函数 , Button 为Json数据
			ToolBar.UpDate('RightClick', CallBack);
			config.ToolBarClickRight = CallBack;
		},
		GetComponentState: function() { //获取组件是显示还是隐藏状态,返回值hide隐藏,show显示
			return GlobalTool.GetComponentState(config.ToolBarId);
		},
		SetComponentState: function(State) { //设置组件状态, State 为 true显示，false 隐藏
			GlobalTool.SetComponentState(config.ToolBarId, State);
		}
	}

	this.ToolSearch = { //快速查询管理
		GetSearchKeyWord: function() { //获取搜索关键词
			var KeyWord = $('#' + config.ToolSearchId + ' input').val();
			if(KeyWord) {
				return KeyWord;
			}
		},
		SetSearchFun: function(CallBack) { //执行回调函数
			var SearchId = $('#' + config.ToolSearchId);
			var KeyWord;
			var _btn = SearchId.find('.btn');
			if(CallBack) {
				_btn.bind('click', function() {
					KeyWord = SearchId.find('input').val();
					CallBack(KeyWord); //执行回调
				});
				SearchId.keydown(function(e) { //回车搜索事件
					var _key = e.keyCode;
					if(_key == 13) {
						KeyWord = SearchId.find('input').val();
						CallBack(KeyWord); //执行回调
					}
				});
			}
		},
		GetComponentState: function() { //获取组件是显示还是隐藏状态,返回值hide隐藏,show显示
			return GlobalTool.GetComponentState(config.ToolSearchId);
		},
		SetComponentState: function(State) { //设置组件状态, State 为 true显示，false 隐藏
			GlobalTool.SetComponentState(config.ToolSearchId, State);
		}
	}

	var FullScreen = { //全屏插件,组件封装
		SetScreenState: function(state) {
			var sel = document.documentElement;
			var _FullScreen = $('#' + config.FullScreenId + ' span.icon');
			var exit_Screen = setInterval(function() { //判断是否退出全屏
				checkScreen();
			}, 500);

			function checkScreen() { //判断是否退出全屏/使用ESC退出后改变按钮状态
				if($('body').height() == window.screen.height) {
					_FullScreen.attr('class', 'icon icon-shrink');
				} else {
					_FullScreen.attr('class', 'icon icon-enlarge');
					clearInterval(exit_Screen); //清除循环
				}
			}

			if(state) { //全屏
				if(sel.requestFullscreen) {
					sel.requestFullscreen();
				} else if(sel.mozRequestFullScreen) {
					sel.mozRequestFullScreen();
				} else if(sel.webkitRequestFullscreen) {
					sel.webkitRequestFullscreen();
				} else if(sel.msRequestFullscreen) {
					sel.msRequestFullscreen();
				}
				_FullScreen.attr('class', 'icon icon-enlarge');
			} else { //退出全屏
				if(document.exitFullscreen) {
					document.exitFullscreen();
				} else if(document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if(document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
				_FullScreen.attr('class', 'icon icon-shrink');
				clearInterval(exit_Screen); //清除循环
			}
		},
		GetScreenState: function() {
			var _icon = $('#' + config.FullScreenId + ' .icon-enlarge').length;
			var state = false;
			if(!_icon) {
				state = true;
			}
			return state;
		}
	}
	this.FullScreen = { //全屏插件
		SetScreenState: function(state) { //state 为true进入全屏状态，false退出全屏状态
			FullScreen.SetScreenState(state);
		},
		GetScreenState: function() { //获取是否在全图状态,返回值true或false
			return FullScreen.GetScreenState();
		},
		GetComponentState: function() { //获取组件是显示还是隐藏状态,返回值hide隐藏,show显示
			return GlobalTool.GetComponentState(config.FullScreenId);
		},
		SetComponentState: function(State) { //设置组件状态, State 为 true显示，false 隐藏
			GlobalTool.SetComponentState(config.FullScreenId, State);
		}
	}

	var ToolTabs = {
		Num: 0,
		Size: function(e) {
			var Con = $('#' + config.ToolTabsId);
			var content = Con.find('.tabs');
			if(e) {
				content.html(''); //清楚状态栏原有内容
				for(var i = 0; i < e; i++) { //创建新的状态栏
					var _html = $('<p class="tab"><span title=""></span><i class="icon icon-close"></i></p>');
					content.append(_html);
				}
			}
		},
		UpDate: function(Type, Title, CallBack) { //更改属性
			var Con = $('#' + config.ToolTabsId);
			var content = Con.find('.tabs');
			var tab = content.find('.tab');
			var title = tab.find('span');
			var NewTitle = tab.find('span[title = ' + Title + ']');
			var Num = title.eq(this.Num).text();
			var state = false;
			if(Type == 'Title') {
				if(Num && this.Num < title.length) {
					this.Num++;
					if(this.Num >= title.length) {
						this.Num = 0;
					}
					ToolAppend.TabClick(); //对话框点击事件
				}
				title.eq(this.Num).text(Title).attr('title', Title).parent().addClass('active');
				if(CallBack) { //回调事件
					title.eq(this.Num).parent().unbind("click").bind('click', function() {
						CallBack();
					});
				}
			} else if(Type == 'Del') { //关闭指定标题的Tab页面
				if(NewTitle.length) {
					NewTitle.parent().remove();
					state = true;
				}
				return state;
			} else if(Type == 'UpDate') { //替换对应的Tab
				if(NewTitle.length) {
					NewTitle.text(CallBack).attr('title', CallBack);
					state = true;
				}
				return state;
			}
		}
	}
	this.ToolTabs = { //对话框管理容器
		SetMaxNumber: function(Size) { //设置状态提示的数量
			ToolTabs.Size(Size);
		},
		AddTabInf: function(Tilte, CallBack) { //添加数据 , Index 指定位置，Tilte为显示标题，CallBack 为单击时候的回调函数
			ToolTabs.UpDate('Title', Tilte, CallBack);
		},
		RemoveTab: function(Tilte) { //关闭指定标题的Tab页面
			return ToolTabs.UpDate('Del', Tilte);
		},
		UpDateTab: function(OldTilte, NewTilte) { //替换对应的Tab
			ToolTabs.UpDate('UpDate', OldTilte, NewTilte);
		},
		GetComponentState: function() { //获取组件是显示还是隐藏状态,返回值hide隐藏,show显示
			return GlobalTool.GetComponentState(config.ToolTabsId);
		},
		SetComponentState: function(State) { //设置组件状态, State 为 true显示，false 隐藏
			GlobalTool.SetComponentState(config.ToolTabsId, State);
		}
	}

	var ToolStates = { //状态条管理, 组件封装
		Size: function(e) {
			var Con = $('#' + config.ToolStatesId);
			var content = Con.find('.content p');
			if(e) {
				content.html(''); //清楚状态栏原有内容
				for(var i = 0; i < e; i++) { //创建新的状态栏
					var _html = $('<span>');
					content.append(_html);
				}
			}
		},
		UpDate: function(Type, Index, Info) { //更改属性/单击回调
			var Con = $('#' + config.ToolStatesId);
			var content = Con.find('.content');
			var _span = content.find('p span');
			if(Type == 'Info') { //更新指定位置的提示信息
				_span.eq(Index).text(Info).addClass('active');
			} else if(Type == 'Color') { //设置对应状态文字颜色
				_span.eq(Index).css('color', Info);
			} else if(Type == 'BgColor') { //设置背景的透明度与颜色
				content.css({
					'opacity': Index,
					'background': Info
				});
			}
			if(Type == 'LeftClick' || Type == 'RightClick') {
				_span.each(function(i) {
					var _this_ = $(this);
					var AcCallBack = function() {
						if(Index) {
							Index(i);
						}
					}
					if(Type == 'LeftClick') { //设置左键单击的回调函数
						GlobalTool.LeftClick(_this_, null, AcCallBack);
					}
					if(Type == 'RightClick') { //设置右键单击的回调函数
						GlobalTool.RightClick(_this_, null, AcCallBack);
					}
				});
			}
		}
	}
	this.ToolStates = { //状态条管理
		SetStateNumber: function(Size) { //设置状态提示的数量
			ToolStates.Size(Size);
		},
		UpDateInf: function(Index, Info) { //更新指定位置的提示信息
			ToolStates.UpDate('Info', Index, Info);
		},
		SetStateColor: function(Index, Color) { //设置对应状态文字颜色
			ToolStates.UpDate('Color', Index, Color);
		},
		SetBackColor: function(Transparent, Color) { //设置背景的透明度与颜色，透明度：0至1范围数值
			ToolStates.UpDate('BgColor', Transparent, Color);
		},
		SetLeftClickFun: function(CallBack) { //设置左键单击的回调函数, Index 指定位置, CallBack 回调函数
			ToolStates.UpDate('LeftClick', CallBack);
		},
		SetRightClickFun: function(CallBack) { //设置右键单击的回调函数
			ToolStates.UpDate('RightClick', CallBack);
		},
		GetComponentState: function() { //获取组件是显示还是隐藏状态,返回值hide隐藏,show显示
			return GlobalTool.GetComponentState(config.ToolStatesId);
		},
		SetComponentState: function(State) { //设置组件状态, State 为 true显示，false 隐藏
			GlobalTool.SetComponentState(config.ToolStatesId, State);
		}
	}

	var ToolAttr = { //属性管理面板, 组件封装
		Datas: function(ObjAttr) {
			var _htmlAttr = $('<ul>');
			for(var i = 0; i < ObjAttr.length; i++) {
				var item = ObjAttr[i];
				var _li_ = $('<li><p class="header_tit" levelid="' + i + '" isAmend="false" title="' + item.FieldName + '"><i class="space"></i><span>' + item.FieldName + '</span></p></li>');
				if(item.value) {
					var _active = '';
					if(i == 0) {
						_active = 'active';
					}
					var _ul_ = $('<ul class="attr_dropDown ' + _active + '">');
					for(var j = 0; j < item.value.length; j++) {
						var itemli = item.value[j];
						var _ul_li_ = $('<li><p class="content" levelid="' + i + '_' + j + '" Amend="' + itemli.IsAmend + '" isAmend="false" title="' + itemli.name + '"><i class="space"></i><span class="onespan" title="' + itemli.name + '">' + itemli.name + '</span><span class="value">' + itemli.FieldValue + '</span><span class="form-control"><input type="text" value="' + itemli.FieldValue + '"></span></p></li>');
						_ul_.append(_ul_li_);
					}
					_li_.append(_ul_);
				}
				_htmlAttr.append(_li_);
			}
			return _htmlAttr;
		},
		UpDate: function(Type, ObjAttr) {
			var ToolAttrId = $('#' + config.ToolAttrId).next('.attr');
			var ToolAttrUl = ToolAttrId.children('ul');
			var Amend = ToolAttrId.attr('amend');
			var Levelids;
			var state = false;
			if(Type == 'Add' && ObjAttr) { //添加数据
				ToolAttrUl.remove();
				ToolAttrId.append(this.Datas(ObjAttr));
				config.tool_attr = [];
				for(var i = 0; i < ObjAttr.length; i++) { //重构数组
					config.tool_attr.push({});
				}
				GlobalTool.SetArray('Set', config.tool_attr, null, ObjAttr); //修改json数据
				ToolAppend.AttrClick(); //属性点击事件
				ToolAttrId.addClass('active');
				state = true;
			} else if(Type == 'Caption') { //添加数据//修改属性标题栏
				var title = ToolAttrId.children('.title').find('span');
				title.text(ObjAttr);
			} else if(Type == 'IsAmend') {
				if(Amend == 'true') {
					state = true;
				}
			} else if(Type == 'IsAmendSection') {
				var IsAmendSection = ToolAttrId.find('.header_tit[title=' + ObjAttr + ']').attr('isamend');
				if(IsAmendSection == 'true') {
					state = true;
				}
			} else if(Type == 'IsAmendField') {
				var IsAmendField = ToolAttrId.find('.content[title=' + ObjAttr + ']').attr('isamend');
				if(IsAmendField == 'true') {
					state = true;
				}
			} else if(Type == 'GetSectionValue') {
				Levelids = ToolAttrId.find('.header_tit[title=' + ObjAttr + ']').attr('levelid').split('_');
				state = GlobalTool.SetArray('Get', config.tool_attr, Levelids); //获取json数据
			} else if(Type == 'GetValue') {
				Levelids = ToolAttrId.find('.onespan[title=' + ObjAttr + ']').parent().attr('levelid').split('_');
				state = GlobalTool.SetArray('Get', config.tool_attr, Levelids); //获取json数据
			}
			return state;
		}
	}
	this.ToolAttr = { //属性管理面板
		AddSectionData: function(AttrStruct) { //添加数据
			ToolAttr.UpDate('Add', AttrStruct);
		},
		IsAmend: function() { //属性是否被修改过, 返回 true 修改过
			return ToolAttr.UpDate('IsAmend');
		},
		IsAmendSection: function(StrSectionName) { //数据段是否被修改, 返回 true 修改过
			return ToolAttr.UpDate('IsAmendSection', StrSectionName);
		},
		IsAmendField: function(StrFieldName) { //属性段是否被修改, 返回 true 修改过
			return ToolAttr.UpDate('IsAmendField', StrFieldName);
		},
		SetCaption: function(String) { //修改属性标题栏
			ToolAttr.UpDate('Caption', String);
		},
		GetSectionValue: function(String) { //获取一级属性数据
			return ToolAttr.UpDate('GetSectionValue', String);
		},
		GetValue: function(String) { //获取二级属性数据
			return ToolAttr.UpDate('GetValue', String);
		},
		GetComponentState: function() { //获取组件是显示还是隐藏状态,返回值hide隐藏,show显示
			return GlobalTool.GetComponentState(config.ToolAttrId);
		},
		SetComponentState: function(State) { //设置组件状态, State 为 true显示，false 隐藏
			GlobalTool.SetComponentState(config.ToolAttrId, State, $('#' + config.ToolAttrId).next('.attr'));
		}
	}

	var ToolMapx = { //鹰眼图管理, 组件封装
		UpData: function(Type, Url, Point, Height) {
			var _this_ = this;
			var ToolMapxId = $('#' + config.ToolMapxId);
			var content = ToolMapxId.find('.content');
			var Pane = content.find('i');
			var MinPoint = Url;
			var MaxPoint = Point;
			var Curpoint = Url;
			var Size = 200;
			var Width = Point / Size;
			var Height = Height / Size;
			var Proportion = 1; //比例
			var Position = {
				x: 0,
				y: 0
			}

			var GetPosition = function(CallBack) { //获取点击位置，并执行回调函数
				var getx = GlobalTool.GetX(ToolMapxId, content.width());
				var gety = GlobalTool.GetY(ToolMapxId, content.width()) - Size;
				if(gety < 0) {
					gety = -gety;
				}
				Position.x = getx * Size * Proportion;
				Position.y = gety * Size * Proportion;
				if(CallBack) {
					CallBack(Position); //执行回调函数，并回传参数
				}
			}

			if(Type == 'Add' && Url) {
				content.css('background-image', 'url(' + Url + ')');
			} else if(Type == 'SetImageLogicRange') { //设置图片代表的实际范围
				MinPoint.x = MinPoint.x / Size;
				MinPoint.y = MinPoint.y / Size;
				MaxPoint.x = MaxPoint.x / Size;
				MaxPoint.y = MaxPoint.y / Size;
				Proportion = MinPoint.x; //设置比例
			} else if(Type == 'SetcurLocal') { //设置当前位置与屏幕代表的实际尺寸
				Curpoint.x = (Curpoint.x / Size) * Proportion;
				Curpoint.y = (Curpoint.y / Size) * Proportion;
				var left = Curpoint.x - (Width / 2);
				var top = Curpoint.y - (Height / 2);
				Pane.css({
					'width': Width,
					'height': Height,
					'left': left,
					'top': top
				});
			}
			if(Type == 'Left') { //设置左击回调函数
				GlobalTool.LeftClick(content, null, function() {
					GetPosition(Url);
				});
			}
			if(Type == 'Right') { //设置右击回调函数
				GlobalTool.RightClick(content, null, function() {
					GetPosition(Url);
				});
			}
		}
	}
	this.ToolMapx = { //鹰眼图管理
		AddBaseImage: function(Url) { //设置地图 , Url是图片地址
			ToolMapx.UpData('Add', Url);
		},
		SetImageLogicRange: function(MinPoint, MaxPoint) { //设置图片代表的实际范围, MinPoint={x:200,y:200}, MaxPoint ={x:40000,y:40000}
			ToolMapx.UpData('SetImageLogicRange', MinPoint, MaxPoint);
		},
		SetcurLocal: function(Curpoint, Width, Height) { //设置当前位置与屏幕代表的实际尺寸，Curpoint = { x:20000,y:20000} 方块中心点位置，Width Point计算后的宽度，Hight Point计算后的高度
			ToolMapx.UpData('SetcurLocal', Curpoint, Width, Height);
		},
		SetLeftClickFun: function(CallBack) { //设置左击回调函数, CallBack回调函数, Curpoint = { x:20000,y:20000} 方块中心点位置, 返回值为中心点位置
			ToolMapx.UpData('Left', CallBack);
		},
		SetRightClickFun: function(CallBack) { //设置右击回调函数, CallBack回调函数, Curpoint = { x:20000,y:20000} 方块中心点位置, 返回值为中心点位置
			ToolMapx.UpData('Right', CallBack);
		},
		GetComponentState: function() { //获取组件是显示还是隐藏状态,返回值hide隐藏,show显示
			return GlobalTool.GetComponentState(config.ToolMapxId);
		},
		SetComponentState: function(State) { //设置组件状态, State 为 true显示，false 隐藏
			GlobalTool.SetComponentState(config.ToolMapxId, State);
		}
	}

	this.init = function() { //初始化工具
		ToolAppend.tool_layer(config.tool_layer); //创建图层管理
		ToolAppend.tool_search(config.tool_attr); //全屏-搜索-属性
		ToolAppend.tool_tabs(); //对话框管理容器
		ToolAppend.tool_mapx(); //鹰眼图管理
		ToolAppend.tool_states(); //状态条管理
		ToolAppend.tool_toolbar(config.tool_toolbar); //工具栏管理
		$('body').append(tools); //渲染工具栏
		ToolAppend.LayerClick(); //图层点击事件
		ToolAppend.ToolBarClick(); //工具点击事件
		ToolAppend.AttrClick(); //状态栏点击事件
		ToolAppend.ModifyRadio(); //处理单选按钮默认选中事件
		ToolAppend.TabClick(); //对话框点击事件
	}
}
//	return {
//		newGis: Web_GIS
//	}
//});