$(function() {
   layui.use('form', function() {
      var form = layui.form
         , layer = layui.layer
      layui.layer.load();
      $('#searchInp').val(sessionStorage.getItem('searchVal'));
      var ind = sessionStorage.getItem('searchType') - 0;
      $('.headinp-tab li').removeClass('inp-liact');
      $('.headinp-tab li').eq(ind).addClass('inp-liact');
      // 找医院
      findHos()
      function findHos() {
         layui.layer.load();
         // 所在区域
         var jsonParam = {
            areaCode: '5303' // 区划编号
         };
         $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/area/getAreaList',
            data: jsonParam,
            success: function (resultMsg) {
               var html = "";
               if (resultMsg.retCode == 0) {
                  $.each(resultMsg.data, function (i, item) {
                     html += ' <span class="label select_label" ids="' + item.areaCode + '">' + item.areaName + '</span>';
                  })
                  $("#areaList").append(html);
               } else {
                  layer.alert('提示', {
                     content: resultMsg.retMsg
                  });
               }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
               alert('加载资源失败');
            }
         });


         // 医院类型
         $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/dict/queryDictAreaList',
            data: '',
            success: function (resultMsg) {
               var str = "";
               if (resultMsg.retCode == 0) {
                  $.each(resultMsg.data, function (i, item) {
                     str += '<span class="label select_label" ids="' + item.code + '">' + item.name + '</span>';
                  })
                  $("#hosType").append(str);
               } else {
                  layer.alert('提示', {
                     content: resultMsg.retMsg
                  });
               }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
               alert('加载资源失败');
            }
         });

         var jsonParamPage = {
            pageSize: 1000
         };
         // 医院科室
         $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/appoint/getDepartmentList',
            data: jsonParamPage,
            success: function (resultMsg) {
               var str = "";
               if (resultMsg.retCode == 0) {
                  $.each(resultMsg.data.list, function (i, item) {
                     str += '<span class="label select_label" ids="' + item.code + '">' + item.name + '</span>';
                  })
                  $("#hosSection").append(str);
               } else {
                  layer.alert('提示', {
                     content: resultMsg.retMsg
                  });
               }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
               alert('加载资源失败');
            }
         });

         // 所在科室
         $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/appoint/getDepartmentList',
            data: jsonParamPage,
            success: function (resultMsg) {
               var str = "";
               if (resultMsg.retCode == 0) {
                  $.each(resultMsg.data.list, function (i, item) {
                     str += '<span class="label select_label" ids="' + item.code + '">' + item.name + '</span>';
                  })
                  $("#docSection").append(str);
               } else {
                  layer.alert('提示', {
                     content: resultMsg.retMsg
                  });
               }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
               alert('加载资源失败');
            }
         });
         layui.layer.closeAll()
         $(".showLoading").css("opacity",'1')
      }

      var jsonParamHos = {
         areaCode: '', // 区划编号
         name: '', // 医院名称
         recommend: '', // 推荐（1.推荐 2.不推荐  不传参返全部）
         deptCodes: '', // 科室编号
         type: '', // 医院类型
         pageNo: '1', //页数
         pageSize: '16'
      };
      var jsonParamDoc = {
         name: '', // 医生名称
         status: '1', // 推荐（1.推荐 2.不推荐）
         hospitId: '', // 所属医院的唯一编码
         deptCode: '', // 所属科室的编号
         // id: '', // 医生唯一标识
         pageNo: '1', //页数
         pageSize: '12'
      };
      var allcount = ''
      var allcounts = ''
      // 所在区域
      $("#areaList").on("click", ".select_label", function () {
         if ($(this).text() === "全部") {
            jsonParamHos.areaCode = ''
         } else {
            jsonParamHos.areaCode = $(this).attr("ids")
         }
         getHospitalList()
         setTimeout(function () {
            pageList()
            // pageLists()
         }, 800);
      })
      // 医院类型
      $("#hosType").on("click", ".select_label", function () {
         if ($(this).text() === "全部") {
            jsonParamHos.type = ''
         } else {
            jsonParamHos.type = $(this).attr("ids")
         }
         getHospitalList()
         setTimeout(function () {
            pageList()
            // pageLists()
         }, 800);
      })
      // 医院科室
      $("#hosSection").on("click", ".select_label", function () {
         if ($(this).text() === "全部") {
            jsonParamHos.deptCodes = ''
         } else {
            jsonParamHos.deptCodes = $(this).attr("ids")
         }
         getHospitalList()
         setTimeout(function () {
            pageList()
            // pageLists()
         }, 800);
      })
      // 医生所在科室
      $("#docSection").on("click", ".select_label", function () {
         if ($(this).text() === "全部") {
            jsonParamDoc.deptCode = ''
         } else {
            jsonParamDoc.deptCode = $(this).attr("ids")
         }
         getDoctorLists()
         setTimeout(function () {
            // pageList()
            pageLists()
         }, 800);
      })

      // 主页搜索查询
      function getUrlParam(key) {
         var url = window.location.search;
         var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
         var result = url.substr(1).match(reg);
         return result ? decodeURIComponent(result[2]) : null;
      }

      var searchType = getUrlParam("searchType")
      var searchVal = getUrlParam("searchVal")
      // if(searchVal !== null && searchVal !== '') {
      if (searchVal !== null) {
         $(".select_container").hide()
         if (searchType === '0') {
            $(".hospital_s").addClass("isShow")
            $(".doctor_s").removeClass("isShow")
            jsonParamHos.name = searchVal
            // console.log(jsonParamHos.name)
         } else if (searchType === '1') {
            $(".doctor_s").addClass("isShow")
            $(".hospital_s").removeClass("isShow")
            jsonParamDoc.name = searchVal
            // console.log(jsonParamDoc.name)
         }
      } else if (searchVal == null) {
         if (searchType === '0') {
            $(".hospital_s").addClass("isShow")
            $(".doctor_s").removeClass("isShow")
            $(".findHospital").addClass("active")
            $(".findDoctor").removeClass("active")
            // jsonParamHos.name = searchVal
         } else if (searchType === '1') {
            $(".doctor_s").addClass("isShow")
            $(".hospital_s").removeClass("isShow")
            $(".findHospital").removeClass("active")
            $(".findDoctor").addClass("active")
            $(".getFind").addClass("isShow")
            $(".getHospital").removeClass("isShow")
            // jsonParamDoc.name = searchVal
         }
      }

      // 获取医院列表
      getHospitalList()
      function getHospitalList() {
         layui.layer.load();
         $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/appoint/getHospitalList',
            data: jsonParamHos,
            success: function (resultMsg) {
               layui.layer.closeAll()
               $(".showLoading").css("opacity",'1')
               var html = "";
               if (resultMsg.retCode == 0) {
                  if (resultMsg.data.list.length == 0) {
                     html += '<div style="margin:50px 0 200px; text-align: center;font-size: 16px ">暂未查询到此信息</div>'
                     $("#demo7").hide()
                  } else {
                     // var item = resultMsg.data.list;
                     allcount = resultMsg.data.count
                     // pageList()
                     $.each(resultMsg.data.list, function (i, item) {
                        var ketarr = ['id', 'levelType', 'imageUrl', 'name', 'telephone', 'address'];
                        for (var p = 0; p < ketarr.length; p++) {
                           if (item[ketarr[p]] == undefined) {
                              item[ketarr[p]] = '暂无数据';
                           }
                        }
                        html += '<div class="hospital-card layui-col-md3" ids="' + item.id + '"><div class="hosCard-box"><div class="hosCard-pic">\n' +
                           '<div class="hos-tag">' + item.levelType + '</div><img src="' + item.imageUrl + '" alt=""></div>\n' +
                           '<div class="hosCard-info"><div class="hosCard-name">\n' +
                           '<span>' + item.name + '</span>\n' +
                           '<div class="tel-box"><i class="iconfamily">&#xe63a;</i><div class="tel-txt">' + item.telephone + '</div></div></div>\n' +
                           '<div class="hosCard-addr"><i class="iconfamily">&#xe61e;</i>' + item.address + '</div></div></div></div>'
                     })
                     $("#demo7").show()
                  }

                  $(".toHospital").html(html);
                  getTel()
                  toClick();
               } else {
                  layer.alert('提示', {
                     content: resultMsg.retMsg
                  });
               }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
               alert('加载资源失败');
            }
         });
         layui.layer.closeAll()
         $(".showLoading").css("opacity",'1')
      }

      // 获取医生列表
      getDoctorLists()
      function getDoctorLists() {
         layui.layer.load();
         $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/appoint/getDoctorList',
            data: jsonParamDoc,
            success: function (resultMsg) {
               if (resultMsg.retCode == 0) {
                  var html = "";
                  if (resultMsg.data.list.length == 0) {
                     html += '<div style="margin:50px 0 200px; text-align: center;font-size: 16px ">暂未查询到此信息</div>'
                     $("#demo8").hide()
                  } else {
                     allcounts = resultMsg.data.count
                     // console.log(allcounts)
                     // 只展示6个医生
                     var dataList = resultMsg.data.list;
                     var col = 3
                     var row = Math.ceil(dataList.length / col);
                     for (var i = 0; i < row; i++) {
                        html += '<div class="layui-row layui-col-space20">';
                        for (var j = 0; j < col; j++) {
                           if ((j + i * col) < dataList.length) {
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
                                 '<div class="doc-hospital">' + dataList[(j + i * col)].hospitalName + '&nbsp;' + dataList[(j + i * col)].deptName + '</div>' +
                                 '<div class="doc-shanchang">' +
                                 '<span class="shanc">擅长：</span>' + dataList[(j + i * col)].depict +
                                 // '擅长：' + item.depict.substring(0,9) + '...' +
                                 '</div></div>' +
                                 '<div class="clear"></div>' +
                                 '</div></div>';
                           }
                           $("#demo8").show()
                           // html += '<div class="doctor-card layui-col-md4" ids="' + dataList[(j + i * col)].id + '">' +
                        }
                        html += '</div>';
                     }
                  }
                  $(".toDoctor").html(html);
               } else {
                  layer.alert('提示', {
                     content: resultMsg.retMsg
                  });
               }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
               alert('加载资源失败');
            }
         });
         layui.layer.closeAll()
         $(".showLoading").css("opacity", '1')
      }

      // 医院医生列表分页
      setTimeout(function () {
         pageList()
         pageLists()
      }, 800);

      function pageList() {
         layui.use(['laypage', 'layer'], function () {
            var laypage = layui.laypage
               , layer = layui.layer;
            //完整功能
            laypage.render({
               elem: 'demo7'
               , count: allcount //数据总数
               , limit: 16  //得到每页显示的条数
               , curr: 1  //得到当前页，以便向服务端请求对应页的数据。
               , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
               , jump: function (obj) {
                  // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                  // console.log(obj.limit); //得到每页显示的条数
                  // console.log(obj.count); //得到每页显示的条数
                  // console.log(obj)
                  jsonParamHos.pageSize = obj.limit
                  jsonParamHos.pageNo = obj.curr
                  getHospitalList()
               }
            });
         })
      }

      function pageLists() {
         layui.use(['laypage', 'layer'], function () {
            var laypage = layui.laypage
               , layer = layui.layer;
            //完整功能
            laypage.render({
               elem: 'demo8'
               , count: allcounts //数据总数
               , limit: 12  //得到每页显示的条数
               , curr: 1  //得到当前页，以便向服务端请求对应页的数据。
               , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
               , jump: function (obj) {
                  // console.log('当前页'+obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                  // console.log(obj.limit); //得到每页显示的条数
                  // console.log(obj.count); //得到每页显示的条数
                  // console.log(obj)
                  jsonParamDoc.pageSize = obj.limit
                  jsonParamDoc.pageNo = obj.curr
                  getDoctorLists()
               }
            });
         })
      }

      // 医院列表hover显示联系方式
      function getTel() {
         $('.tel-box i').hover(function () {
            $(this).next('.tel-txt').show();
         }, function () {
            $(this).next('.tel-txt').hide();
         })
      }

      toClick()

      function toClick() {
         $(".select_container p").off("click").on("click", function () {
            var index = $(this).index();
            $(this).addClass("active").siblings().removeClass("active");
            $(".bg_content .right_content").eq(index).addClass("isShow").siblings().removeClass("isShow");
            $(".message_bd .message_list").eq(index).addClass("isShow").siblings().removeClass("isShow");
         });
         $('.right_content li .toMore').on("click", function () {
            var str = $(this).find(".bg_more").text()
            switch (str) {
               case "展开全部":
                  $(this).parent(".label_container").addClass('readActive')
                  // $(this).parent(".label_container").addClass('readActive').siblings().removeClass("readActive")
                  $(this).find(".bg_more").text("收起")
                  break;
               case "收起":
                  $(this).find(".bg_more").text("展开全部")
                  $(this).parent().removeClass('readActive')
                  break;
            }
         })
         $('.right_content li .toMoreYs').on("click", function () {
            var str = $(this).find(".bg_more").text()
            switch (str) {
               case "展开全部":
                  $(this).parent(".label_container_ys").addClass('readActive')
                  // $(this).parent(".label_container").addClass('readActive').siblings().removeClass("readActive")
                  $(this).find(".bg_more").text("收起")
                  break;
               case "收起":
                  $(this).find(".bg_more").text("展开全部")
                  $(this).parent().removeClass('readActive')
                  break;
            }
         })
         $(".label_two .select_label").on("click", function () {
            $(this).addClass("bg_left_active").siblings().removeClass("bg_left_active");
         })
         $(".messagea_s li").on("click", function () {
            $(this).addClass("mes_left_active").siblings().removeClass("mes_left_active");
         })
         //跳转医院主页详细
         $('.toHospital').on("click", ".hospital-card", function () {
            var hospitalId = $(this).attr("ids")
            localStorage.setItem("hospitalId", hospitalId);
            window.location.href = "appHospital.html";
         })
         //跳转医生主页详细
         $(".toDoctor").on("click", ".doctor-card", function () {
            var doctorId = $(this).attr("ids")
            localStorage.setItem("doctorId", doctorId);
            window.location.href = "appDoctor.html";
         })
      }
   })
})