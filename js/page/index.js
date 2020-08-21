$(function () {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    var token=GetQueryString('token');
    if(GetQueryString('type') == '1'){
        if(token){
            localStorage.setItem('authToken', token);
        }else{
            localStorage.setItem('authToken', '');
        }
    }

    // 医院电话悬浮函数绑定
    $('#hospitalList').on('mouseover mouseout', '.tel-box i', function (ev) {
        if(ev.type == "mouseover"){
            //鼠标悬浮
            $(this).next('.tel-txt').show();
        }else if(ev.type == "mouseout"){
            //鼠标离开
            $(this).next('.tel-txt').hide();
        }
    }).on('click', '.hospital-card', function () {
        var ids = $(this).attr('ids');
        localStorage.setItem('hospitalId', ids);
        window.location.href = 'appHospital.html';
    })
    $('#doctorList').on('click', '.doctor-card', function () {
        var ids = $(this).attr('ids');
        localStorage.setItem('doctorId', ids);
        window.location.href = 'appDoctor.html?ids=' + ids;
    })
    $('#kepuList').on('click', '.doctor-card', function () {
        var kepuId = $(this).attr('ids');
        var hospitalId = $(this).attr('hosId');
        localStorage.setItem('kepuId', kepuId);
        localStorage.setItem('hospitalId', hospitalId);
        window.location.href = 'healthScienceDetails.html';
    })
    // 推荐更多跳转
    // 推荐医院、推荐医生跳转同一页面，tab不同
    $('.cardTit-more').click(function () {
        window.location.href = $(this).attr('tourl') + '?searchType=' + $(this).attr('code');
        sessionStorage.setItem('searchType', $(this).attr('code'));
        sessionStorage.setItem('searchVal', '');
    })
    // 联动下拉列表
    layui.use('form', function(){
        var form = layui.form;
        getYiyuanSelect();
        // 医院下拉选中
        var hosId = '';
        form.on('select(hospitalSel)', function(data){
            // 获取科室下拉列表
            hosId = data.value;
            var jsonParam = {
                hospitId: data.value, // 医院唯一编码
                name: '' // 科室名称
            };
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/reg/appoint/getDepartmentList',
                data: jsonParam,
                success: function (resultMsg) {
                    $("#keshi").empty();
                    if(resultMsg.retCode == 0) {
                        var dataList = resultMsg.data.list;
                        if (dataList.length > 0) {
                            $("#keshi").append('<option value="">搜索科室</option>');
                            $.each(dataList, function (i, item) {
                                $("#keshi").append('<option value="' + item.code + '">' + item.name + '</option>');
                            });
                        } else {
                            $("#keshi").append('<option value="">暂无数据</option>');
                        }

                    } else {
                        $("#keshi").append('<option value="">暂无数据</option>');
                    }
                    layui.form.render("select");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
            // console.log(data.elem); //得到select原始DOM对象
            // console.log(data.value); //得到被选中的值
            // console.log(data.othis); //得到美化后的DOM对象
        });
        form.on('select(keshiSel)', function(data){
            var jsonParam = {
                name: '', // 医生名称
                status: '', // 推荐（1.推荐 2.不推荐）
                hospitId: hosId, // 所属医院的唯一编码
                deptCode: data.value, // 所属科室的编号
                id: '' // 医生唯一标识
            };
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/reg/appoint/getDoctorList',
                data: jsonParam,
                success: function (resultMsg) {
                    $("#yisheng").empty();
                    if(resultMsg.retCode == 0) {
                        var dataList = resultMsg.data.list;
                        if (dataList.length > 0) {
                            $("#yisheng").append('<option value="">搜索医生</option>');
                            $.each(dataList, function (i, item) {
                                $("#yisheng").append('<option value="' + item.id + '">' + item.name + '</option>');
                            });
                        } else {
                            $("#yisheng").append('<option value="">暂无数据</option>');
                        }
                    } else {
                        $("#yisheng").append('<option value="">暂无数据</option>');
                    }
                    layui.form.render("select");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
        });
        layui.form.render("select");
        // 获取医院下拉列表
        function getYiyuanSelect () {
            var jsonParam = {
                areaCode: '', // 区划编号
                name: '', // 医院名称
                recommend: '', // 推荐（1.推荐 2.不推荐  不传参返全部）
                deptCodes: '' // 科室编号
            };
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/reg/appoint/getHospitalList',
                data: jsonParam,
                success: function (resultMsg) {
                    $("#hospital").empty();
                    if(resultMsg.retCode == 0) {
                        var dataList = resultMsg.data.list;
                        if (dataList.length > 0) {
                            $('#hospital').append('<option value="">搜索医院</option>');
                            // $('#hospital').next('div').find('.layui-input').attr('value', '搜索医院')
                            $.each(dataList, function (i, item) {
                                $("#hospital").append('<option value="' + item.id + '">' + item.name + '</option>');
                            });
                        } else {
                            $("#hospital").append('<option value="">暂无数据</option>');
                        }
                    }
                    layui.form.render("select");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
        }
        // 监听提交
        form.on('submit(formDemo)', function (data) {
            console.log(data.field);
            localStorage.setItem("doctorId", data.field.yisheng);
            window.location.href = 'appDoctor.html';
        })
    });
    // 推荐列表
    getHospitalList();
    getDoctorList();
    getKepuList();
    function getHospitalList () {
        var jsonParam = {
            areaCode: '', // 区划编号
            name: '', // 医院名称
            recommend: '1', // 推荐（1.推荐 2.不推荐）
            deptCodes: '' // 科室编号
        };
        $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/appoint/getHospitalList',
            data: jsonParam,
            success: function (resultMsg) {
                if(resultMsg.retCode == 0) {
                    var html = "";
                    // 只展示四个医院
                    var dataList = resultMsg.data.list.slice(0, 4);
                    $.each(dataList, function (i, item) {
                        // levelTypeText
                        var ketarr = ['id', 'levelType', 'imageUrl', 'name' ,'telephone', 'address'];
                        for (var p = 0; p < ketarr.length; p++) {
                            if (item[ketarr[p]] == undefined) {
                                item[ketarr[p]] = '暂无数据';
                            }
                        }
                        html += '<div class="hospital-card layui-col-md3" ids="' + item.id + '">' +
                            '<div class="hosCard-box"><div class="hosCard-pic">' +
                            '<div class="hos-tag">' + item.levelType + '</div>' +
                            '<img src="' + item.imageUrl + '" alt="">' +
                            '</div>' +
                            '<div class="hosCard-info"><div class="hosCard-name">' +
                            '<span>' + item.name + '</span>' +
                            '<div class="tel-box">' +
                            '<i class="iconfamily">&#xe63a;</i>' +
                            '<div class="tel-txt">' + item.telephone + '</div>' +
                            '</div></div>' +
                            '<div class="hosCard-addr">' +
                            '<i class="iconfamily">&#xe61e;</i>' + item.address +
                            '</div></div></div></div>';
                    });
                    $("#hospitalList").append(html);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                alert('加载资源失败');
            }
        });
    }
    function getDoctorList () {
        var jsonParam = {
            name: '', // 医生名称
            status: '1', // 推荐（1.推荐 2.不推荐）
            hospitId: '', // 所属医院的唯一编码
            deptCode: '', // 所属科室的编号
            id: '' // 医生唯一标识
        };
        $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/appoint/getDoctorList',
            data: jsonParam,
            success: function (resultMsg) {
                if(resultMsg.retCode == 0) {
                    var html = "";
                    // 只展示6个医生
                    var dataList = resultMsg.data.list.slice(0, 6);
                    var col = 3
                    var row = Math.ceil(dataList.length / col);
                    for (var i = 0; i < row; i++) {
                        html += '<div class="layui-row layui-col-space20">';
                        for (var j = 0; j < col; j++) {
                            if ((j + i * col) < dataList.length) {
                                var ketarr = ['id', 'imageUrl', 'name', 'professional' ,'hospitalName', 'deptName', 'depict'];
                                for (var p = 0; p < ketarr.length; p++) {
                                    if (dataList[(j + i * col)][ketarr[p]] && dataList[(j + i * col)][ketarr[p]] == undefined) {
                                        dataList[(j + i * col)][ketarr[p]] = '暂无数据';
                                    }
                                }
                                html += '<div class="doctor-card layui-col-md4" ids="' + dataList[(j + i * col)].id + '">' +
                                    '<div class="docCard-box"><div class="docCard-pic">' +
                                    '<img src="' + dataList[(j + i * col)].imageUrl + '" alt="">' +
                                    '</div>' +
                                    '<div class="docCard-info">' +
                                    '<div class="doc-name">' +
                                    '<span>' + dataList[(j + i * col)].name + '</span>\n' +
                                    '<span>' + dataList[(j + i * col)].professional + '</span>' +
                                    // '<span>教授</span>' +
                                    '</div>' +
                                    '<div class="doc-hospital">' +
                                    dataList[(j + i * col)].hospitalName + '  ' +
                                    dataList[(j + i * col)].deptName +
                                    // dataList[(j + i * col)].hospitalName
                                    // '马龙区人民医院111   儿童消化内科' +
                                    '</div><div class="doc-shanchang">' +
                                    '<span class="shanc">擅长：</span>' + dataList[(j + i * col)].depict +
                                    // '擅长：' + item.depict.substring(0,9) + '...' +
                                    '</div></div>' +
                                    '<div class="clear"></div>' +
                                    '</div></div>';
                            }
                            // html += '<div class="doctor-card layui-col-md4" ids="' + dataList[(j + i * col)].id + '">' +
                        }
                        html += '</div>';
                    }
                    // $.each(dataList, function (i, item) {
                    //     // levelTypeText
                    //     html += '<div class="doctor-card layui-col-md4" ids="' + item.id + '">' +
                    //         '<div class="docCard-box"><div class="docCard-pic">' +
                    //         '<img src="' + item.imageUrl + '" alt="">' +
                    //         '</div>' +
                    //         '<div class="docCard-info">' +
                    //         '<div class="doc-name">' +
                    //         '<span>' + item.name + '</span>\n' +
                    //         '<span>' + item.professional + '</span>' +
                    //         // '<span>教授</span>' +
                    //         '</div>' +
                    //         '<div class="doc-hospital">' +
                    //         '马龙区人民医院   儿童消化内科' +
                    //         '</div><div>' +
                    //         '擅长：' + item.depict +
                    //         // '擅长：' + item.depict.substring(0,9) + '...' +
                    //         '</div></div>' +
                    //         '<div class="clear"></div>' +
                    //         '</div></div>';
                    // });
                    $("#doctorList").append(html);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('加载资源失败');
            }
        });
    }
    function getKepuList () {
        var jsonParam = {
            startTime: '', // 起始时间
            endTime: '' // 结束时间
        };
        $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/healthEducateInfo/getHealthEducateInfoList',
            data: jsonParam,
            success: function (resultMsg) {
                if(resultMsg.retCode == 0) {
                    var html = "";
                    // 只展示6个健康科普
                    var dataList = resultMsg.data.list.slice(0, 6);
                    $.each(dataList, function (i, item) {
                        if(!item.hospitalName){
                            item.hospitalName = '卫健委';
                        }
                        // levelTypeText
                        html += '<div class="doctor-card layui-col-md4" ids="' + item.id + '" hosId="' + item.hospitalId + '">' +
                            '<div class="docCard-box">' +
                            '<div class="docCard-pic">' +
                            '<img src="' + item.imageUrl + '" alt="">' +
                            '</div>' +
                            '<div class="health-info">' +
                            '<div class="health-tit">' +
                            '<span>' + item.title + '</span>' +
                            '</div>' +
                            '<div class="health-from">' + item.hospitalName + '</div>' +
                            '</div>' +
                            '<div class="clear"></div>' +
                            '</div>' +
                            '</div>';
                    });
                    $("#kepuList").append(html);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('加载资源失败');
            }
        });
    }
})