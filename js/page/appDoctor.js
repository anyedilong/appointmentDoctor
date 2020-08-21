$(function(){
   layui.use(['laypage', 'layer'], function() {
      var laypage = layui.laypage;
      layui.layer.load();
      var blues = '../img/button_guanzhu.png';
      var reds = '../img/button_qxguanzhu.png';
      var greens = '../img/button_yguanzhu.png';
      var ids = localStorage.getItem('doctorId');
      // authToken 一个小时会失效
      var authToken = localStorage.getItem('authToken');
      // 医生详情
      getDoctorInfo();
      getDoctorNum();
      getGuanzhu();

      function getDoctorInfo() {
         var jsonParam = {
            name: '', // 医生名称
            status: '1', // 推荐（1.推荐 2.不推荐）
            hospitId: '', // 所属医院的唯一编码
            deptCode: '', // 所属科室的编号
            id: ids // 医生唯一标识
         };
         $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/appoint/getDoctorDetail',
            data: jsonParam,
            success: function (resultMsg) {
               layui.layer.closeAll()
               $(".showLoading").css("opacity", '1')
               var obj = resultMsg.data;
               // for (var key in obj) {
               //     if (obj[key] == '' || obj[key] == undefined) {
               //         obj[key] = '暂无数据'
               //     }
               // }
               var ketarr = ['name', 'hospitalName', 'deptName', 'professional', 'introduce', 'depict', 'imageUrl'];
               for (var p = 0; p < ketarr.length; p++) {
                  if (obj[ketarr[p]] == undefined) {
                     obj[ketarr[p]] = '暂无数据';
                  }
               }
               if (resultMsg.retCode == 0) {
                  $('#name').html(obj.name);
                  $('#hospitalName').html(obj.hospitalName);
                  $('#deptName').html(obj.deptName);
                  $('#professional').html(obj.professional);
                  if (obj.professional == '' || obj.professional == undefined) {
                     $('#professional').hide();
                  }
                  $('#introduce').html(obj.introduce);
                  $('#depict').html(obj.depict);
                  $('#imageUrl').attr('src', obj.imageUrl);
                  // 医生简介\医生擅长字数控制
                  $(".intro_d").each(function () {
                     var maxwidth = 50;//设置最多显示的字数
                     var text = $(this).text();
                     if ($(this).text().length > maxwidth) {
                        $(this).text($(this).text().replace(/\s*/g, "").substring(0, maxwidth));
                        //如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；
                        $(this).html($(this).html() + '...' + '<a href="###" class="more_r open-a"> 展开 <i class="iconfamily iconStyle more_r">&#xe62a;</i></a>');
                     }
                     ;
                     $(this).on('click', '.open-a', function () {
                        // $(this).parent().text(text);//点击“点击展开”，展开全文
                        $(this).parent().html(text + '<br><a href="###" class="more_r close-a"><i class="iconfamily iconStyle more_r">&#xe62b;</i>收起</a>');//点击“点击展开”，展开全文
                     })
                     $(this).on('click', '.close-a', function () {
                        $(this).text($(this).parent().text().replace(/\s*/g, "").substring(0, maxwidth));
                        //如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；
                        $(this).parent().html($(this).html() + '...' + '<a href="###" class="more_r open-a"> 展开 <i class="iconfamily iconStyle more_r">&#xe62a;</i></a>');
                     })
                  })
               }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
               alert('加载资源失败');
               layui.layer.closeAll()
               $(".showLoading").css("opacity", '1')
            }
         });
      }

      // 获取预约数和关注数
      function getDoctorNum() {
         var jsonParam = {
            doctorId: ids // 医生唯一标识
         };
         $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/appoint/getSubNumAndConcernNum',
            data: jsonParam,
            success: function (resultMsg) {
               layui.layer.closeAll()
               $(".showLoading").css("opacity", '1')
               var obj = resultMsg.data;
               $('#subNum').html(obj.subNum);
               $('#concernNum').html(obj.concernNum);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
               alert('加载资源失败');
               layui.layer.closeAll()
               $(".showLoading").css("opacity", '1')
            }
         });
      }

      // 判断医生是否被关注
      function getGuanzhu() {
         if (authToken != undefined && authToken != '') {
            var jsonParam = {
               doctorId: ids, // 医生唯一标识
               authToken: authToken // 医生唯一标识
            };
            $.ajax({
               type: 'get',
               dataType: "jsonp",
               jsonp: "callback",//服务端用于接收
               async: false,
               contentType: 'application/json',
               url: roadPath + '/reg/appoint/queryDoctorConcern',
               data: jsonParam,
               success: function (resultMsg) {
                  layui.layer.closeAll()
                  $(".showLoading").css("opacity", '1')
                  var status = resultMsg.data;
                  // 大于零为已关注
                  if (resultMsg.retCode == 0) {
                     if ((status - 0) > 0) {
                        $('.guanzhuBtn img').attr('src', greens);
                        $('.guanzhuBtn').attr('status', status);
                     } else {
                        $('.guanzhuBtn img').attr('src', blues);
                        $('.guanzhuBtn').attr('status', status);
                     }
                  }
               },
               error: function (XMLHttpRequest, textStatus, errorThrown) {
                  alert('加载资源失败');
               }
            });
         }
      }

      // 关注
      $('.guanzhuBtn').on('mouseover mouseout', 'img', function (ev) {
         var status = $(this).parents('.guanzhuBtn').attr('status');
         if (ev.type == "mouseover") {
            //鼠标悬浮
            if ((status - 0) > 0) {
               $(this).attr('src', reds);
               $(this).attr('title', '取消关注');
            } else {
               $(this).attr('src', greens);
               $(this).attr('title', '点击关注');
            }
         } else if (ev.type == "mouseout") {
            //鼠标离开
            if ((status - 0) > 0) {
               $(this).attr('src', greens);
            } else {
               $(this).attr('src', blues);
            }
         }
      });
      // 点击关注、取消关注
      $('.guanzhuBtn').click(function () {
         layui.layer.load();

         // if (authToken != undefined && authToken != '') {
         var imgsrc = $('.guanzhuBtn').children('img').attr('src');
         var status = $(this).attr('status');
         var jsonParam = {
            doctorId: ids, // 医生唯一标识
            authToken: authToken
         };
         if ((status - 0) > 0) {
            $.ajax({
               type: 'get',
               dataType: "jsonp",
               jsonp: "callback",//服务端用于接收
               async: false,
               contentType: 'application/json',
               url: roadPath + '/reg/appoint/quitDoctorConcern',
               data: jsonParam,
               success: function (resultMsg) {
                  layui.layer.closeAll()
                  $(".showLoading").css("opacity", '1')
                  if (resultMsg.retCode == 0) {
                     getGuanzhu();
                     getDoctorNum();
                  } else if (resultMsg.retCode == 1004) {
                     denglu();
                  }
               },
               error: function (XMLHttpRequest, textStatus, errorThrown) {
                  layui.layer.closeAll()
                  $(".showLoading").css("opacity", '1')
                  alert('加载资源失败');
               }
            });
         } else {
            $.ajax({
               type: 'get',
               dataType: "jsonp",
               jsonp: "callback",//服务端用于接收
               async: false,
               contentType: 'application/json',
               url: roadPath + '/reg/appoint/saveDoctorConcern',
               data: jsonParam,
               success: function (resultMsg) {
                  if (resultMsg.retCode == 0) {
                     getGuanzhu();
                     getDoctorNum();
                  } else if (resultMsg.retCode == 1004) {
                     denglu();
                  }
               },
               error: function (XMLHttpRequest, textStatus, errorThrown) {
                  alert('加载资源失败');
               }
            });
         }
         // }
         // else {
         //     denglu();
         // }
      });
      layui.use(['form'], function () {
         var form = layui.form;
         // getSelect();
         //监听提交
         form.on('submit(formDemo)', function (data) {
            layer.msg(JSON.stringify(data.field));
            return false;
         });
         // 获取医生的未来七天所在医院和科室
         // function getSelect () {
         //     var jsonParam = {
         //         doctorId: ids, // 医生唯一标识
         //     };
         //     $.ajax({
         //         type: 'get',
         //         dataType: "jsonp",
         //         jsonp: "callback",//服务端用于接收
         //         async: false,
         //         contentType: 'application/json',
         //         url: roadPath + '/reg/arrangment/getDoctorOrg',
         //         data: jsonParam,
         //         success: function (resultMsg) {
         //             $("#hospital").empty();
         //             $("#keshi").empty();
         //             if(resultMsg.retCode == 0) {
         //                 var dataList = resultMsg.data.hospitList;
         //                 if (dataList.length > 0) {
         //                     // $("#hospital").append('<option value="">搜索医院</option>');
         //                     // $("#keshi").append('<option value="">搜索科室</option>');
         //                     $.each(dataList, function (i, item) {
         //                         $("#hospital").append('<option value="' + item.id + '">' + item.name + '</option>');
         //                     });
         //                 } else {
         //                     $("#hospital").append('<option value="">暂无数据</option>');
         //                 }
         //                 getkeshi(ids, dataList[0].id);
         //             }
         //             layui.form.render("select");
         //         },
         //         error: function (XMLHttpRequest, textStatus, errorThrown) {
         //             alert('加载资源失败');
         //         }
         //     });
         // }
         // // 联动下拉科室
         // form.on('select(hospitalSel)', function(data){
         //     getkeshi(ids, data.value);
         // });
         form.on('select(keshiSel)', function (data) {
            // getPaiban(ids, $('#hospital').val(), data.value);
            getPaiban(ids, data.value);
         });
         getkeshi(ids);

         function getkeshi(doctorId, hospitalId) {
            $.ajax({
               type: 'get',
               dataType: "jsonp",
               jsonp: "callback",//服务端用于接收
               async: false,
               contentType: 'application/json',
               url: roadPath + '/reg/arrangment/getDoctorDepart',
               data: {
                  doctorId: doctorId,
                  hospitalId: hospitalId,
               },
               success: function (resultMsg) {
                  $("#keshi").empty();
                  if (resultMsg.retCode == 0) {
                     var dataList = resultMsg.data.departList;
                     if (dataList.length > 0) {
                        // $("#keshi").append('<option value="">搜索科室</option>');
                        $.each(dataList, function (i, item) {
                           $("#keshi").append('<option value="' + item.id + '">' + item.name + '</option>');
                        });
                     } else {
                        $("#keshi").append('<option value="">暂无数据</option>');
                     }
                  }
                  getPaiban(doctorId, dataList[0].id);
                  layui.form.render("select");
               },
               error: function (XMLHttpRequest, textStatus, errorThrown) {
                  alert('加载资源失败');
               }
            });
         }

         // 获取医生的预约排班(网站端)
         function getPaiban(doctorId, departId) {
            var jsonParam = {
               doctorId: doctorId, // 医生唯一标识
               // hospitalId: hospitalId, // 医生唯一标识
               departId: departId, // 医生唯一标识
            };
            $.ajax({
               type: 'get',
               dataType: "jsonp",
               jsonp: "callback",//服务端用于接收
               async: false,
               contentType: 'application/json',
               url: roadPath + '/reg/arrangment/getDoctorAppointDate',
               data: jsonParam,
               success: function (resultMsg) {
                  if (resultMsg.retCode == 0) {
                     $('.out_desc').html(resultMsg.data.out_desc);
                     $('.myTable thead tr').html('');
                     $('.myTable tbody .morning').html('');
                     $('.myTable tbody .afternoon').html('');
                     $('.myTable tbody .nightDiag').html('');
                     var headth = '<th></th>';
                     var arrs = {
                        morning: '<td class="leftTit">上午</td>',
                        afternoon: '<td class="leftTit">下午</td>',
                        nightDiag: '<td class="leftTit">晚上</td>'
                     }
                     var dataList = resultMsg.data.list;
                     // var paibantxt = '';
                     // console.log(dataList);
                     // var
                     $.each(dataList, function (i, item) {
                        headth += '<th>' +
                           '<div>' + item.subTime.substring(0, 2) + '</div>' +
                           '<div>' + item.subTime.substring(2, item.subTime.length) + '</div>' +
                           '</th>';
                        for (var key in arrs) {
                           var keyarr = ['num', 'outTime', 'price'];
                           for (var t = 0; t < keyarr.length; t++) {
                              if (item[key][keyarr[t]] == undefined) {
                                 item[key][keyarr[t]] = '暂无数据';
                              }
                           }
                           arrs[key] += '<td nums="' + item[key].num + '">' +
                              '<div class="table-tab">可预约</div>' +
                              '<div class="table-info">仅剩' + item[key].num + '个</div>' +
                              '<div class="table-hover">' +
                              '<p class="outTime" outTime="' + item[key].outTime + '">出诊时间：' + item[key].outTime + '</p>' +
                              '<p class="price" price="' + item[key].price + '">挂号费：' + item[key].price + '元(到院付)</p>' +
                              '</div></td>';
                        }
                     });
                     $('.myTable thead tr').append(headth);
                     $('.myTable tbody .morning').append(arrs.morning);
                     $('.myTable tbody .afternoon').append(arrs.afternoon);
                     $('.myTable tbody .nightDiag').append(arrs.nightDiag);
                     for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 8; j++) {
                           var num = $('.myTable tbody tr').eq(i).children('td').eq(j).attr('nums');
                           var ele = $('.myTable tbody tr').eq(i).children('td').eq(j);
                           if (num == -1) {
                              ele.children('div').hide();
                           } else if (num == 0) {
                              ele.addClass('table-tabgray');
                              ele.children('.table-info').html('截止预约');
                           } else {
                              ele.addClass('table-taborg');
                              if (num < 4) {
                                 ele.children('.table-info').show();
                              } else {
                                 ele.children('.table-info').hide();
                              }
                           }
                        }
                     }
                  }
               },
               error: function (XMLHttpRequest, textStatus, errorThrown) {
                  alert('加载资源失败');
               }
            });
         }

         // 预约时间表
         $('.myTable').on('mouseover mouseout click', '.table-taborg .table-tab', function (ev) {
            if (ev.type == "mouseover") {
               $(this).parent().children(".table-hover").show();
            } else if (ev.type == "mouseout") {
               $(this).parent().children(".table-hover").hide();
            } else {
               // localStorage.setItem("hospitalId", $('#hospital').val());
               localStorage.setItem("departId", $('#keshi').val());
               localStorage.setItem("outTime", $(this).next().next('.table-hover').find('.outTime').attr('outTime'));
               localStorage.setItem("price", $(this).next().next('.table-hover').find('.price').attr('price'));
               window.location.href = 'appointmentConfirm.html';
            }
         })
      });
   })
})