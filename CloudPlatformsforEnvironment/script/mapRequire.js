/// <reference path="script.js" />

window.onload = mapRequire;

var url_featureLayer_enterprise = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/0";

var url_featureLayer_split = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/1";

var url_featureLayer_region = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/2";

var url_gpPointDensity = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/PointDensityService";

var url_gpIDW = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/IDWService";

var url_imgHistoryDetection_IDW = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/HistoryDetection_IDW/MapServer";

var url_imgHistoryDetection_PD = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/HistoryDetection_PD/MapServer";;

var url_imgChangeDetection_IDW = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/ChangeDetection_IDW/MapServer";

var url_imgChangeDetection_PD = "http://localhost:6080/arcgis/rest/services/CloudPlatformsforEnvironment/ChangeDetection_PD/MapServer";


function mapRequire() {
    require([
        "esri/Map",
        "esri/Basemap",
        "esri/views/MapView",
        "esri/layers/MapImageLayer",
        "esri/layers/FeatureLayer",
        "esri/layers/GraphicsLayer",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/Graphic",
        "esri/layers/ImageryLayer",
        "esri/views/layers/LayerView",
        "esri/widgets/Attribution",
        "esri/widgets/Locate",
        "esri/widgets/Search",
        "esri/geometry/geometryEngine",
        "esri/layers/support/ImageParameters",
        "esri/tasks/GeometryService",
        "esri/tasks/Geoprocessor",
        "esri/tasks/support/DensifyParameters",
        "esri/tasks/support/FeatureSet",
        "esri/tasks/QueryTask",
        "esri/tasks/RouteTask",
        "esri/tasks/support/Query",
        "esri/tasks/support/RouteParameters",
        "esri/widgets/Legend",
        "esri/layers/TileLayer",
        "esri/tasks/Locator",
        "esri/widgets/Zoom",
        "esri/widgets/Home",
        "esri/widgets/BasemapToggle",
        "esri/PopupTemplate",
        "esri/geometry/Point",
        "esri/geometry/Polygon",
        "esri/geometry/Polyline",
        "dijit/a11yclick",
        "esri/core/watchUtils",
        "dojo/promise/all",
        "dojo/dom",
        "dojo/dom-attr",
        "dojo/dom-construct",
        "dojo/on",
        "dojo/_base/array",
        "dojo/number",
        "dojo/domReady!",
    ], function (Map, Basemap, MapView, MapImageLayer, FeatureLayer, GraphicsLayer, SimpleRenderer,
        SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol, PictureMarkerSymbol, Graphic,
        ImageryLayer, LayerView, Attribution, Locate, Search, geometryEngine, ImageParameters, GeometryService, Geoprocessor,
        DensifyParameters, FeatureSet, QueryTask, RouteTask, Query, RouteParameters, Legend, TileLayer, Locator, Zoom, Home, BasemapToggle, PopupTemplate,
        Point, Polygon, Polyline, a11yclick, watchUtils, all, dom, domAttr, domConstruct, on, arrayUtils, number) {

        ///** 要素符号渲染 **///

        var renderer_enterprise = new SimpleRenderer({
            symbol: new SimpleMarkerSymbol({
                outline: {
                    color: "white",
                    width: 1,
                }
            }),
            visualVariables: [{
                type: "size",
                field: "CreditRank",
                stops: [{
                    value: 0,
                    size: "12px"
                }, {
                    value: 4,
                    size: "24px"
                }]
            }, {
                type: "opacity",
                field: "CreditRank",
                minDataValue: 0,
                maxDataValue: 4,
                opacityValues: [0.6, 0.6]
            }, {
                type: "color",
                field: "CreditRank",
                stops: [{
                    value: 0,
                    color: "#000000"
                }, {
                    value: 1,
                    color: "#FF6138"
                }, {
                    value: 2,
                    color: "#FFEEAD"
                }, {
                    value: 3,
                    color: "#67B8DE"
                }, {
                    value: 4,
                    color: "#85C79C"
                }]
            }]
        });

        var renderer_split = new SimpleRenderer({
            symbol: new SimpleLineSymbol({
                color: [63, 133, 173, 0.5],
                width: "10",
                style: "solid"
            })
        });

        var renderer_region = new SimpleRenderer({
            symbol: new SimpleLineSymbol({
                color: [63, 133, 173, 0.5],
                width: "2",
                style: "solid"
            })
        });

        //////////////////////

        ///** 要素弹出层 **///

        var popupTemplate_enterprise = new PopupTemplate({
            title: "{Name}",
            content: "<section><p><b> 环保信用等级: {CreditRank} 星 </b></p>" +
                //"<p> 企业地址: {Adress}</p>" +
                "<p> 均值污染指数: {SDI} </p>" +
                "<p> 主要排放物类别: {Type}</p>" +
                "<p> 运行状态: {State}</p></section>" +
                "<p> 所属城市: {Location}</p></section>" +
                //"<p> 企业编号: <span class=\"EnterpriseId\">{Id}<span></p></section>" +
                "<section class=\"descartesResult\"><span><a onclick=\"controlDescartes()\"><span class=\"ion-ios-pulse-strong ionicons before\"></span>近五日排污统计图表</a></span>" +
                "<div class=\"descartes\">" +
                //"<div class=\"loader\"><div class=\"loader-inner ball-scale-multiple small\"></div></div>" +
                "</div>" +
                //"<div class=\"loader\"><div class=\"loader-inner ball-scale-multiple small\"></div></div>" +
                "</section>"
        });

        //////////////////////

        ///** 要素图层定义 **///

        var featureLayer_enterprise = new FeatureLayer({
            url: url_featureLayer_enterprise,
            outFields: ["*"],
            id: "PollutionEnterprise",
            popupTemplate: popupTemplate_enterprise,
            renderer: renderer_enterprise
        });

        var featureLayer_split = new FeatureLayer({
            url: url_featureLayer_split,
            outFields: ["*"],
            id: "JiangsuDistrict",
            renderer: renderer_split
        });

        var featureLayer_region = new FeatureLayer({
            url: url_featureLayer_region,
            outFields: ["*"],
            id: "JiangsuDistrict",
            renderer: renderer_region
        });

        //////////////////////

        ///** 底图及基本小部件 **///

        var map = new Map({
            basemap: "osm"
            //basemap: "gray"
            //basemap: "satellite"
            //basemap: "gray-vector"
            //basemap: "dark-gray"
        });
        //alert("0");
        map.add(featureLayer_region);
        //alert("1");
        map.add(featureLayer_split);
       //alert("2");
        map.add(featureLayer_enterprise);
        //alert("3");
        var centerPoint = new Point({
            latitude: 33.000,
            longitude: 119.000
        })

        var view = new MapView({
            container: "baseMap",
            map: map,
            center: centerPoint,
            zoom: 8,
            popup: {
                dockEnabled: true,
                dockOptions: {
                    buttonEnabled: true,
                    breakpoint: true
                }
            }
        });

        view.constraints = {
            minZoom: 7,
            maxZoom: 16,
            rotationEnabled: false
        };

        view.ui.remove(["attribution", "zoom"]);

        var zoomBtn = new Zoom({
            view: view
        }, "zoomdiv");
        zoomBtn.startup();

        var homeBtn = new Home({
            view: view
        }, "homediv");
        zoomBtn.startup();

        var basemapToggle = new BasemapToggle({
            view: view
        }, "basemapTogglediv");
        basemapToggle.startup();

        var legend = new Legend({
            view: view,
            layerInfos: [
            {
                layer: featureLayer_enterprise,
                title: ""
            }]
        });

        view.ui.add(homeBtn, "bottom-right");
        view.ui.add(zoomBtn, "bottom-right");
        view.ui.add(legend, "bottom-left");

        view.then(function () {

            var options = {
                type: "POST",
                cache: false,
                url: "../services/DataService.svc/GetEnterpriseDescartesData",
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            };

            $.ajax(options);
            options.url = "../services/DataService.svc/GetProvinceDescartesData";
            $.ajax(options);
            options.url = "../services/DataService.svc/GetPollutantDescartesData_01";
            $.ajax(options);
            options.url = "../services/DataService.svc/GetPollutantDescartesData_02";
            $.ajax(options);


            //$("body > .loader").css('display', 'none');

            $(".esri-popup .esri-show-dock .esri-close").click(function () {

                myChart.clear();

                $('.esri-view-width-xlarge .esri-popup .esri-popup-main > article').css("border-top", "1px dotted #85C79C");
                $('.esri-view-width-xlarge .esri-popup .esri-popup-main > article > div > div > div > div:last-child div section > div').css("border", "none")
                $('.esri-view-width-xlarge .esri-popup .esri-popup-main > article > div > div > div > div:last-child div section > div').css("height", "0px")
                $('.esri-view-width-xlarge .esri-popup .esri-popup-main > article').css("max-height", "120px");
            });

            $(".esri-home").click(function () {

                var featureLayerCount = 0;

                map.layers.forEach(function (item, i) {

                    if (item.id != "PollutionEnterprise") {
                        featureLayerCount++;
                    }
                });

                if (featureLayerCount == map.layers.length) {

                    map.removeAll();

                    //alert("0");

                    map.add(featureLayer_region);
                    map.add(featureLayer_split);
                    map.add(featureLayer_enterprise);

                    //alert("1");

                    LoadEnterpriseList();
                }
                else {
                }

                node = new Array();
                view.graphics.removeAll();
                routeLyr.removeAll();
                mapRemoveByID("routeLyr");
                mapRemoveByID("QueryLyr");
                MouseStatusArray = new Array();
                currentMouse = 0;

                featureLayer_enterprise.popupTemplate = popupTemplate_enterprise;

                $('#searching-window > section > section:last-child > p').css("display", "none");

                featureFlag = true;
            });
        });

        //////////////////////

        ///** 污染源企业列表生成及定义点击事件 **///

        LoadEnterpriseList();

        function LoadEnterpriseList() {

            $('#searching-window > section > section:last-child > ul li').remove();

            $('#searching-window > section > section:last-child > ul li').unbind();

            var graphics;

            view.whenLayerView(featureLayer_enterprise).then(function (lyrView) {
                lyrView.watch("updating", function (val) {

                    if (!val) {
                        lyrView.queryFeatures().then(function (features) {

                            graphics = features;

                            features.forEach(function (feature, index) {

                                var attribute = feature.attributes;
                                $('#searching-window > section > section:last-child > ul').append("<li class=\"panel-result\" tabIndex=0 data-result-id=\"" + index + "\"><abbr " + "title=" + attribute.Name + " (" + attribute.Location + ")" + ">" + attribute.Name + " (" + attribute.Location + ")" + "</abbr></li>");
                                //$('#searching-window > section > section:last-child > ul').append("<li class=\"panel-result\" tabIndex=0 data-result-id=\"" + index + "\">" + attribute.Name + "</li>");
                            });

                            $('#searching-window > section > section:last-child > ul li').click(controlSearchingUl);

                            //$('#searching-window > section > section:last-child > ul li').mouseenter(controlSearchingUl);

                            $('#searching-window > section > section:last-child > ul li').click(controlPopup);

                            //$('#searching-window > section > section:last-child > ul li').mouseenter(controlPopup);

                            function controlPopup() {

                                $('.esri-view-width-xlarge .esri-popup .esri-popup-main > article').css("border-top", "1px dotted #85C79C");
                                $('.esri-view-width-xlarge .esri-popup .esri-popup-main > article > div > div > div > div:last-child div section > div').css("border", "none")
                                $('.esri-view-width-xlarge .esri-popup .esri-popup-main > article > div > div > div > div:last-child div section > div').css("height", "0px")
                                $('.esri-view-width-xlarge .esri-popup .esri-popup-main > article').css("max-height", "120px");

                                var resultId = $(this).attr("data-result-id");

                                var result = resultId && graphics && graphics[parseInt(resultId, 10)];

                                if (result) {
                                    view.popup.open({
                                        features: [result],
                                        location: graphics[resultId].geometry
                                    });
                                }
                            }
                        });
                    }
                    $("body > .loader").css('display', 'none');
                });
            });
        }

        /**鼠标历史状态模块**///

        var MouseStatusArray = new Array();
        var currentMouse = 0;
        function changeStatus(newStatus) {
            if (newStatus >= 0) {
                MouseStatusArray.push(newStatus);
                currentMouse = newStatus;
            }
            else {
                deleteFromReverse(-newStatus);
                currentMouse = MouseStatusArray[MouseStatusArray.length - 1];
                //MouseStatusArray.pop();
                if (newStatus == -3) {
                    //var tempLyr = findLayerById("routeLyr");
                    //map.remove(tempLyr);
                    routeLyr.removeAll();
                    routeParams = new RouteParameters({
                        stops: new FeatureSet(),
                        outSpatialReference: { // autocasts as new SpatialReference()
                            wkid: 3857
                        }
                    });
                }
            }

            if (currentMouse == 3) {

            }
            //alert(MouseStatusArray);

        }
        changeStatus(0);

        function deleteFromReverse(value) {
            //alert(value);
            for (var i = MouseStatusArray.length - 1; i >= 0; i--) {
                if (MouseStatusArray[i] == value) {
                    MouseStatusArray.splice(i, 1);
                    //alert(MouseStatusArray);
                    return i;
                }
            }
        }
        //////////////////////

        //////////////////////

        /**量测模块**///

        var measureThisAction = {
            title: "量测",
            id: "measure-this",
            image: "../image/measure.png"
        };

        var template = new PopupTemplate({
            title: "量测",
            content: "",
            actions: [measureThisAction]
        });

        function measureThis() {

            //var geom = view.popup.selectedFeature.geometry;
            if (node.length == 2) {
                var polyline = new Polyline({
                    paths: node
                });
                var geom = polyline;
                var distance = geometryEngine.geodesicLength(geom, "kilometers");
                distance = parseFloat(Math.round(distance * 100) / 100).toFixed(2);
                view.popup.content = "<div style='color: #777'>" + distance +
                " 公里.</div>";
            }
            else if (node.length > 2) {
                node.push(node[0]);
                var polygon = new Polygon({
                    rings: node
                });
                var geom = polygon;

                var area = geometryEngine.geodesicArea(geom, "square-kilometers");
                area = parseFloat(Math.round(area * 100) / 100).toFixed(2);
                view.popup.content = "<div style='bstyle='color: #777'>" + area +
                " 平方公里.</div>";
                node.pop();
            }
        }

        view.popup.on("trigger-action", function (evt) {
            if (evt.action.id === "measure-this") {
                measureThis();
            }
        });

        ///////////////////

        /**网络分析模块**/ //

        $('#group-2-2-1').click(function () {
            var flag = contrlRoute($(this));
            //alert(flag);
            if (flag) {
                //currentMouse = 3;
                changeStatus(3);

            }
            else {
                //currentMouse = 0;
                changeStatus(-3);

            }
            //alert(currentMouse);
        });

        var routeTask = new RouteTask({
            url: "https://utility.arcgis.com/usrsvcs/appservices/sgcR7S40icnYzN8l/rest/services/World/Route/NAServer/Route_World"
        });

        // The stops and route result will be stored in this layer

        // Setup the route parameters
        var routeParams = new RouteParameters({
            stops: new FeatureSet(),
            outSpatialReference: { // autocasts as new SpatialReference()
                wkid: 3857
            }
        });

        // Define the symbology used to display the stops
        var stopSymbol = new SimpleMarkerSymbol({
            style: "cross",
            size: 15,
            outline: { // autocasts as new SimpleLineSymbol()
                width: 4
            }
        });

        // Define the symbology used to display the route
        var routeSymbol = new SimpleLineSymbol({
            color: [0, 0, 255, 0.5],
            width: 5
        });
        var routeLyr = new GraphicsLayer({
            id: "routeLyr"
        });
        map.add(routeLyr);


        function addStop(evt) {
            // Add a point at the location of the map click
            var stop = new Graphic({
                geometry: evt.mapPoint,
                symbol: stopSymbol
            });
            routeLyr.add(stop);

            // Execute the route task if 2 or more stops are input
            routeParams.stops.features.push(stop);
            if (routeParams.stops.features.length >= 2) {
                routeTask.solve(routeParams).then(showRoute);
            }
        }
        // Adds the solved route to the map as a graphic
        function showRoute(data) {
            var routeResult = data.routeResults[0].route;
            routeResult.symbol = routeSymbol;
            routeLyr.add(routeResult);
        }

        ///////////////////////

        /**鼠标点击及绘制图形模块**///

        var flag_geometry = false;

        var node = new Array();

        $('#searching-window > section > section:last-child > a:nth-of-type(2)').click(function () {
            var flag = contrlMouseDraw($(this));

            if (flag) {
                changeStatus(2);
                view.graphics.removeAll();
                node = new Array();
                flag_geometry = false;
                query.geometry = null;
            }
            else {
                changeStatus(-2);
            }
        });

        function drawPolygon(evt) {

            featureLayer_enterprise.popupTemplate = null;

            // Get the coordinates of the click on the view
            var lat = Math.round(evt.mapPoint.latitude * 1000) / 1000;
            var lon = Math.round(evt.mapPoint.longitude * 1000) / 1000;
            //alert(lon + "; " + lat);
            node.push([lon, lat]);

            var point = new Point({
                longitude: lon,
                latitude: lat
            });
            var nodeMarkerSymbol = new SimpleMarkerSymbol({
                color: [120, 120, 120, 0.8],
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 2
                }
            });
            var pointGraphic = new Graphic({
                geometry: point,
                symbol: nodeMarkerSymbol,
                popupTemplate: null
            });
            if (node.length == 2) {
                var polyline = new Polyline({
                    paths: node
                });

                var lineSymbol = new SimpleLineSymbol({
                    color: [120, 120, 120, 0.8],
                    width: 3
                });
                var polylineGraphic = new Graphic({
                    geometry: polyline,
                    symbol: lineSymbol,
                    popupTemplate: template
                });

                view.graphics.addMany([polylineGraphic]);
            }
            if (node.length > 2) {
                node.push(node[0]);
                var polygon = new Polygon({
                    rings: node
                });

                var fillSymbol = new SimpleFillSymbol({
                    color: [120, 120, 120, 0.6],
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 255],
                        width: 1
                    }
                });

                var polygonGraphic = new Graphic({
                    geometry: polygon,
                    symbol: fillSymbol,
                    popupTemplate: template
                });

                view.graphics.removeAt(view.graphics.length - 2);
                view.graphics.addMany([polygonGraphic]);
                node.pop();
            }

            view.graphics.addMany([pointGraphic]);
            measureThis();

            if (node.length > 2) {
                flag_geometry = true;
            }
        }

        view.on("click", function (evt) {
            if (currentMouse == 2) {
                drawPolygon(evt);
            }

            else if (currentMouse == 3) {
                addStop(evt);
            }
            else {
                //node = new Array();
                //view.graphics.removeAll();
            }
        });

        ///////////////////

        ///** 查询模块 **///

        var queryTask = new QueryTask({
            url: url_featureLayer_enterprise
        });

        var query = new Query({
            returnGeometry: true,
            outFields: ["*"]
        });

        $('#searching-window > section > section:last-child > a:nth-of-type(1)').click(function () {

            if (flag_geometry) {
                ////////////
                if (currentMouse == 2) {
                    changeStatus(-2);
                }

                if (node.length > 2) {

                    var polygon = new Polygon({
                        rings: node
                    });

                    query.geometry = polygon;

                    queryTask.execute(query).then(startQueryTask);

                    flag_geometry = false;
                }
                else {
                    $('#searching-window > section > section:last-child > a:nth-of-type(1)').text('请绘制至少三个点以上');

                    $(function () {
                        setTimeout(function () {
                            $('#searching-window > section > section:last-child > a:nth-of-type(1)').text('检索');
                        }, 1000);
                    })
                }
            }

            else {
                var isInputNull = false;

                $("#searching-window > section > section:first-child section").each(function () {

                    //var inputValue = $(this).children("input").val();
                    if ($(this).children("input").val() == '') {

                        $('#searching-window > section > section:last-child > a:nth-of-type(1)').text('搜索框输入为空，请检查');

                        $(function () {
                            setTimeout(function () {
                                $('#searching-window > section > section:last-child > a:nth-of-type(1)').text('检索');
                            }, 1000);
                        })
                        isInputNull = true;
                    }
                });
                if (!isInputNull) confirmQueryTask();
            }
            mapRemoveByID("QueryLyr");
        });

        function confirmQueryTask() {

            query.where = startSearching();
            if (query.where == "") {
                query.where = "1 = 1";
            }
            //query.where = "CreditRank > 3 and Location = '南京市'";

            queryTask.execute(query).then(startQueryTask);
            //node = new Array();

        }

        function startQueryTask(response) {
            var queryResultsLayer = new GraphicsLayer({
                id: "QueryLyr"
            });
            var enterpriseResults = arrayUtils.map(response.features, function (feature) {

                feature.symbol = new PictureMarkerSymbol({
                    url: "../image/location.svg",
                    width: "30px",
                    height: "32px",
                    yoffset: "10pt"
                });

                feature.popupTemplate = popupTemplate_enterprise;

                return feature;
            });

            if (response.features.length == 0) {

                $('#searching-window > section > section:last-child > p').text("没有查询到符合条件的结果");

                $('#searching-window > section > section:last-child > p').css("display", "block");

                $(function () {
                    setTimeout(function () {
                        $('#searching-window > section > section:last-child > p').css("display", "none");
                    }, 2000);
                })

                return false;
            }

            else {

                node = new Array();
                view.graphics.removeAll();

                routeLyr.removeAll();
                mapRemoveByID("routeLyr");

                featureLayer_enterprise.popupTemplate = popupTemplate_enterprise;

                queryResultsLayer.removeAll();

                queryResultsLayer.addMany(enterpriseResults);

                map.removeAll();

                map.add(featureLayer_region);
                map.add(featureLayer_split);

                map.add(queryResultsLayer);

                $('#searching-window > section > section:last-child > p').text("共查询到 " + response.features.length + " 条结果");

                $('#searching-window > section > section:last-child > p').css("display", "block");

                $('#searching-window > section > section:last-child > ul li').remove();

                $('#searching-window > section > section:last-child > ul li').unbind();

                response.features.forEach(function (feature, index) {

                    var attribute = feature.attributes;

                    $('#searching-window > section > section:last-child > ul').append("<li class=\"panel-result\" tabIndex=0 data-result-id=\"" + index + "\"><abbr " + "title=" + attribute.Name + " (" + attribute.Location + ")" + ">" + attribute.Name + " (" + attribute.Location + ")" + "</abbr></li>");
                    //$('#searching-window > section > section:last-child > ul').append("<li class=\"panel-result\" tabIndex=0 data-result-id=\"" + index + "\">" + attribute.Name + "</li>");
                });

                $('#searching-window > section > section:last-child > ul li').click(controlSearchingUl);

                //$('#searching-window > section > section:last-child > ul li').mouseenter(controlSearchingUl);

                $('#searching-window > section > section:last-child > ul li').click(controlPopup);

                //$('#searching-window > section > section:last-child > ul li').mouseenter(controlPopup);

                function controlPopup() {

                    var resultId = $(this).attr("data-result-id");

                    var result = resultId && response.features && response.features[parseInt(resultId, 10)];

                    if (result) {
                        view.popup.open({
                            features: [result],
                            location: response.features[resultId].geometry
                        });
                    }
                }
                //view.goTo(enterpriseResults[0]);
            }
        }

        //////////////////////

        ///** GP分析模块 **///

        var gpPointDensity = url_gpPointDensity;
        var gpIDW = url_gpIDW;

        var imgHistoryDetection_IDW = url_imgHistoryDetection_IDW;
        var imgHistoryDetection_PD = url_imgHistoryDetection_PD;

        var imgChangeDetection_IDW = url_imgChangeDetection_IDW;
        var imgChangeDetection_PD = url_imgChangeDetection_PD;

        var gpUrl = "";
        var gpMapUrl = "";
        var gpLayerID = "";

        function doGeoprocessor(gpName, timeIndex, city, field) {

            //alert(gpName);
            //alert(field);
            //alert(city);
            //alert($('#timelineless-window').prop('className'));

            if (gpName == "HistoryDetectionService") {

                if ($('#timeline-window').prop('className') == 'HistoryDetection_IDW') {

                    imagLegendRequire($('#timeline-window').prop('className'));

                    gpMapUrl = imgHistoryDetection_IDW;
                    gpLayerID = 'HistoryDetection_IDW_0' + timeIndex;

                    var gpResultLayer = new MapImageLayer(gpMapUrl, {
                        id: "ProcessedMap",
                        opacity: 0.00,
                        sublayers: [{ id: 0, visible: false }, { id: 1, visible: false }, { id: 2, visible: false }, { id: 3, visible: false }, { id: 4, visible: false }]
                    });

                    gpResultLayer.findSublayerById(timeIndex).visible = true;

                    node = new Array();
                    view.graphics.removeAll();
                    routeLyr.removeAll();
                    mapRemoveByID("routeLyr");
                    mapRemoveByID("QueryLyr");
                    mapGradualChangeDisappear("ProcessedMap");
                    mapRemoveByID("PollutionEnterprise");
                    mapRemoveByID("JiangsuDistrict");
                    map.add(featureLayer_region);
                    map.add(featureLayer_split);

                    $("aside > .loader").css('display', 'none');

                    mapGradualChangeAppear("ProcessedMap", gpResultLayer);

                } else if ($('#timeline-window').prop('className') == 'HistoryDetection_PD') {

                    imagLegendRequire($('#timeline-window').prop('className'));

                    gpMapUrl = imgHistoryDetection_PD;
                    gpLayerID = 'HistoryDetection_PD_0' + timeIndex;

                    var gpResultLayer = new MapImageLayer(gpMapUrl, {
                        id: "ProcessedMap",
                        opacity: 0.00,
                        sublayers: [{ id: 0, visible: false, legendEnabled: false }, { id: 1, visible: false, legendEnabled: false }, { id: 2, visible: false, legendEnabled: false }, { id: 3, visible: false, legendEnabled: false }, { id: 4, visible: false, legendEnabled: false }]
                    });

                    gpResultLayer.findSublayerById(timeIndex).visible = true;

                    gpResultLayer.findSublayerById(timeIndex).legendEnabled = true;

                    //alert(gpResultLayer.findSublayerById(timeIndex).legendEnabled);

                    //legend.layerInfos[0].layer = gpResultLayer;

                    //view.ui.add(legend, "bottom-left");

                    //alert(legend.layerInfos[0].layer.id);

                    node = new Array();
                    view.graphics.removeAll();
                    routeLyr.removeAll();
                    mapRemoveByID("routeLyr");
                    mapRemoveByID("QueryLyr");
                    mapGradualChangeDisappear("ProcessedMap");
                    mapRemoveByID("PollutionEnterprise");
                    mapRemoveByID("JiangsuDistrict");
                    map.add(featureLayer_region);
                    map.add(featureLayer_split);

                    $("aside > .loader").css('display', 'none');

                    mapGradualChangeAppear("ProcessedMap", gpResultLayer);
                }
            }
            else if (gpName == "ChangeDetectionService") {

                if ($('#timelineless-window').prop('className') == 'ChangeDetection_IDW') {

                    imagLegendRequire($('#timelineless-window').prop('className'));

                    gpMapUrl = imgChangeDetection_IDW;
                    gpLayerID = 'ChangeDetection_IDW_0' + timeIndex;

                    var gpResultLayer = new MapImageLayer(gpMapUrl, {
                        id: "ProcessedMap",
                        opacity: 0.00,
                        sublayers: [{ id: 0, visible: false }, { id: 1, visible: false }, { id: 2, visible: false }, { id: 3, visible: false }]
                    });

                    gpResultLayer.findSublayerById(timeIndex).visible = true;

                    node = new Array();
                    view.graphics.removeAll();
                    routeLyr.removeAll();
                    mapRemoveByID("routeLyr");
                    mapRemoveByID("QueryLyr");
                    mapGradualChangeDisappear("ProcessedMap");
                    mapRemoveByID("PollutionEnterprise");
                    mapRemoveByID("JiangsuDistrict");
                    map.add(featureLayer_region);
                    map.add(featureLayer_split);

                    $("aside > .loader").css('display', 'none');

                    mapGradualChangeAppear("ProcessedMap", gpResultLayer);

                }
                else if ($('#timelineless-window').prop('className') == 'ChangeDetection_PD') {

                    imagLegendRequire($('#timelineless-window').prop('className'));

                    gpMapUrl = imgChangeDetection_PD;
                    gpLayerID = 'ChangeDetection_PD_0' + timeIndex;

                    var gpResultLayer = new MapImageLayer(gpMapUrl, {
                        id: "ProcessedMap",
                        opacity: 0.00,
                        sublayers: [{ id: 0, visible: false }, { id: 1, visible: false }, { id: 2, visible: false }, { id: 3, visible: false }]
                    });

                    gpResultLayer.findSublayerById(timeIndex).visible = true;

                    node = new Array();
                    view.graphics.removeAll();
                    routeLyr.removeAll();
                    mapRemoveByID("routeLyr");
                    mapRemoveByID("QueryLyr");
                    mapGradualChangeDisappear("ProcessedMap");
                    mapRemoveByID("PollutionEnterprise");
                    mapRemoveByID("JiangsuDistrict");
                    map.add(featureLayer_region);
                    map.add(featureLayer_split);

                    $("aside > .loader").css('display', 'none');

                    mapGradualChangeAppear("ProcessedMap", gpResultLayer);
                }
            }
            else if (gpName == "NavigationService") {
            }
            else if (gpName == "endGP") {
            }
            else { 

                $("aside > .loader").css('display', 'block');
                $("#select-window > .loader").css('display', 'block');

                var queryTask = new QueryTask({
                    url: url_featureLayer_enterprise
                });

                //var field = "Polluted_02";
                //var city = "*";

                if (city != "*") {
                    var location = "Location  = '" + city + "'";
                    var suoShuShi = "SuoShuShi  = '" + city + "'";
                }
                else {
                    var location = "1 = 1";
                    var suoShuShi = "1 = 1";
                }

                var query = new Query({
                    returnGeometry: true,
                    outFields: [field],
                    //where: location
                    where: "1 = 1"
                });

                queryTask.execute(query).then(function (results) {
                    var params;
                    if (gpName == "PointDensityService") {

                        gpUrl = gpPointDensity + "/GPServer/PointDensityService";
                        gpMapUrl = gpPointDensity + "/MapServer/jobs/"
                        gpLayerID = "PointDensityService";
                        params = {
                            InputFeatureset: results,
                            Population: field,
                            Neighborhood: "Circle .5 MAP",
                            Size: ".01",
                            Expression: suoShuShi
                        };
                        var gp = new Geoprocessor({
                            url: gpUrl
                        });
                        //alert("执行至此1");
                        gp.submitJob(params).then(jobResult).otherwise(promiseRejected);

                    } else if (gpName == "IDWService") {

                        gpUrl = gpIDW + "/GPServer/IDWService";
                        gpMapUrl = gpIDW + "/MapServer/jobs/"
                        gpLayerID = "IDWService";
                        params = {
                            InputFeatureset: results,
                            z_value: field,
                            Radius: "FIXED .5",
                            Size: ".01",
                            Expression: suoShuShi
                        };
                        var gp = new Geoprocessor({
                            url: gpUrl
                        });
                        //alert("执行至此2");
                        gp.submitJob(params).then(jobResult).otherwise(promiseRejected);

                    } else {
                        //map.remove(gpLayerID);
                    }
                }).otherwise(promiseRejected);
            }
        }

        function jobResult(jobinfo) {

            //alert("执行至此3");

            var status = jobinfo.jobStatus;

            //alert(status);

            if (status == "job-succeeded") {
                //成功之后，将其中的结果取出来，当然这也是参数名字。
                //在模型中，想要取出中间结果，需要设置为模型参数

                var mapurl = gpMapUrl + jobinfo.jobId;
                //create a dynamic map service
                var gpResultLayer = new MapImageLayer(mapurl, {
                    //id: gpLayerID,
                    id: "ProcessedMap",
                    opacity: 0.00
                });

                //alert(mapurl);

                mapGradualChangeDisappear("ProcessedMap");
                //map.add(gpResultLayer, 0);
                node = new Array();
                view.graphics.removeAll();
                routeLyr.removeAll();
                mapRemoveByID("routeLyr");
                mapRemoveByID("QueryLyr");
                mapRemoveByID("PollutionEnterprise");
                mapRemoveByID("JiangsuDistrict");
                map.add(featureLayer_region);
                map.add(featureLayer_split);

                $("aside > .loader").css('display', 'none');
                $("#select-window > .loader").css('display', 'none');

                mapGradualChangeAppear("ProcessedMap", gpResultLayer);

                if (gpLayerID == "IDWService") {
                    imagLegendRequire("HistoryDetection_IDW");
                }
                else {
                    imagLegendRequire("HistoryDetection_PD");
                }
            }
        }

        function promiseRejected() {
            alert("出现异常错误，请重试");
        }

        var gpNameOriginal;

        $('#group-1-1-1').click(function () { gpNameRequire($(this)); });
        $('#group-1-1-2').click(function () { gpNameRequire($(this)); });

        $("#select-window > a").click(function () {
            doGeoprocessor(gpStart(), "", $("#select-window > section > div:nth-of-type(1) > div > a").text(), gpFieldRequire());
        });

        $('#group-1-3-1').click(function () {
            var element = $(this);

            if ($(this)[0].checked) {
                $("aside > .loader").css('display', 'block');
                $(function () {
                    setTimeout(function () {
                        gpNameOriginal = gpNameRequire(element);
                        $("aside > .loader").css('display', 'none');
                    }, 500);
                });
            }
            else {
                gpNameOriginal = gpNameRequire(element);
            }
        });

        $('#group-1-3-2').click(function () {
            var element = $(this);

            if ($(this)[0].checked) {
                $("aside > .loader").css('display', 'block');
                $(function () {
                    setTimeout(function () {
                        gpNameOriginal = gpNameRequire(element);
                        $("aside > .loader").css('display', 'none');
                    }, 500);
                });
            }
            else {
                gpNameOriginal = gpNameRequire(element);
            }
        });

        $('#group-1-4-1').click(function () {
            var element = $(this);

            if ($(this)[0].checked) {
                $("aside > .loader").css('display', 'block');
                $(function () {
                    setTimeout(function () {
                        gpNameOriginal = gpNameRequire(element);
                        $("aside > .loader").css('display', 'none');
                    }, 500);
                });
            }
            else {
                gpNameOriginal = gpNameRequire(element);
            }
        });

        $('#group-1-4-2').click(function () {

            var element = $(this);

            if ($(this)[0].checked) {
                $("aside > .loader").css('display', 'block');
                $(function () {
                    setTimeout(function () {
                        gpNameOriginal = gpNameRequire(element);
                        $("aside > .loader").css('display', 'none');
                    }, 500);
                });
            }
            else {
                gpNameOriginal = gpNameRequire(element);
            }
        });

        //$('#group-1-3-1 ').click(function () { gpNameOriginal = gpNameRequire($(this)); });
        //$('#group-1-3-2').click(function () { gpNameOriginal = gpNameRequire($(this)); });
        //$('#group-1-4-1').click(function () { gpNameOriginal = gpNameRequire($(this)); });
        //$('#group-1-4-2').click(function () { gpNameOriginal = gpNameRequire($(this)); });

        $('#timeline-window div a').click(function () { doGeoprocessor(gpNameOriginal, timeIndexRequire($(this)), "", ""); });
        $("#timelineless-window div a").click(function () { doGeoprocessor(gpNameOriginal, timeIndexRequire($(this)), "", ""); });

        //$('#group-2-2-1').click(function () { doGeoprocessor(gpNameRequire($(this)), ""); });

        ////////////////////////

        ///** 其他函数 **///

        function mapRemoveByID(ID) {
            for (var i = 0; i < map.layers.length; i++) {
                if (map.layers.getItemAt(i).id == ID) {
                    map.layers.removeAt(i);
                    return true;
                }
            }
            return false;
        }

        function mapGradualChangeAppear(ID, gpResultLayer) {
            $(function () {
                setTimeout(function () {
                    map.add(gpResultLayer, 0);
                }, 700);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.05;
                }, 800);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.10;
                }, 900);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.15;
                }, 1000);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.20;
                }, 1100);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.25;
                }, 1200);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.30;
                }, 1300);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.35;
                }, 1400);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.40;
                }, 1500);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.45;
                }, 1600);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.50;
                }, 1700);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.55;
                }, 1800);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.60;
                }, 1900);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.65;
                }, 2000);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.70;
                }, 2100);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.75;
                }, 2200);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.80;
                }, 2300);
            });
            //$(function () {
            //    setTimeout(function () {
            //        map.findLayerById(ID).opacity = 0.85;
            //    }, 2400);
            //});
            //$(function () {
            //    setTimeout(function () {
            //        map.findLayerById(ID).opacity = 0.90;
            //    }, 2500);
            //});
        }

        function mapGradualChangeDisappear(ID) {
            //$(function () {
            //    setTimeout(function () {
            //        map.findLayerById(ID).opacity = 0.90;
            //    }, 000);
            //});
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.80;
                }, 050);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.70;
                }, 100);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.60;
                }, 150);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.50;
                }, 200);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.40;
                }, 250);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.30;
                }, 300);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.20;
                }, 350);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.10;
                }, 400);
            });
            $(function () {
                setTimeout(function () {
                    map.findLayerById(ID).opacity = 0.00;
                }, 550);
            });
            $(function () {
                setTimeout(function () {
                    mapRemoveByID(ID);
                }, 600);
            });
        }

        //////////////////////
    });
}