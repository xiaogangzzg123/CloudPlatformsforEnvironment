/// <reference path="script.js" />

window.onload = mapRequire;


function mapRequire() {
    require([
        "esri/Map",
        "esri/Basemap",
        "esri/views/MapView",
        "esri/layers/MapImageLayer",
        "esri/layers/FeatureLayer",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/widgets/Legend",
        "esri/layers/TileLayer",
        "esri/tasks/Locator",
        "esri/widgets/Zoom",
        "esri/widgets/Home",
        "esri/widgets/BasemapToggle",
        "esri/PopupTemplate",
        "esri/geometry/Point",
        "dijit/a11yclick",
        "dojo/dom",
        "dojo/dom-attr",
        "dojo/dom-construct",
        "dojo/on",
        "dojo/number",
        "dojo/domReady!",
    ], function (Map, Basemap, MapView, MapImageLayer, FeatureLayer, SimpleRenderer,
                 SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol, Legend, TileLayer,
                 Locator, Zoom, Home, BasemapToggle, PopupTemplate, Point, a11yclick, dom,
                 domAttr, domConstruct, on, number) {


        ///** 要素符号渲染 **///



        //////////////////////


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
                    size: "24px"
                }, {
                    value: 4,
                    size: "16px"
                }]
            }, {
                type: "opacity",
                field: "CreditRank",
                minDataValue: 0,
                maxDataValue: 4,
                opacityValues: [0.8, 0.8]
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

        var renderer_buildings = new SimpleRenderer({
            symbol: new SimpleFillSymbol({
                color: [51, 51, 204, 0.9],
                style: "solid",
                outline: {
                    color: "white",
                    width: 1
                }
            })
        });

        var renderer_natural = new SimpleRenderer({
            symbol: new SimpleFillSymbol({
                color: [51, 51, 204, 0.9],
                style: "solid",
                outline: {
                    color: "white",
                    width: 1
                }
            })
        });

        var renderer_roads = new SimpleRenderer({
            symbol: new SimpleLineSymbol({
                color: "#FF6F69",
                width: "2px",
                style: "short-dash-dot-dot"
            })
        });

        var renderer_railways = new SimpleRenderer({
            symbol: new SimpleLineSymbol({
                color: "#FF6F69",
                width: "2px",
                style: "short-dash-dot-dot"
            })
        });

        var renderer_waterways = new SimpleRenderer({
            symbol: new SimpleLineSymbol({
                color: "#FF6F69",
                width: "2px",
                style: "short-dash-dot-dot"
            })
        });

        var renderer_split = new SimpleRenderer({
            symbol: new SimpleLineSymbol({
                color: "#FF6F69",
                width: "2px",
                style: "short-dash-dot-dot"
            })
        });

        var renderer_region = new SimpleRenderer({
            symbol: new SimpleFillSymbol({
                color: [120, 120, 120, 0.4],
                style: "solid",
                outline: {
                    color: "whitesmoke",
                    width: "0px",
                    style: "short-dash-dot-dot"
                }
            })
        });

        //////////////////////

        ///** 要素弹出层 **///

        var popupTemplate_enterprise = new PopupTemplate({
            title: "{Name}",
            content: "<p><b> 环保信用等级: {CreditRank} 星 </b></p>" +
                "<p> 企业地址: {Adress}</p>" +
                "<p> 污染物排放量: {Emissinos}</p>" +
                "<p> 主要排放物类别: {Type}</p>" +
                "<p> 运行状态: {State}</p>"
        });

        //////////////////////

        ///** 要素图层定义 **///

        var featureLayer_enterprise = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/0",
            outFields: ["*"],
            popupTemplate: popupTemplate_enterprise,
            renderer: renderer_enterprise
        });

        var featureLayer_buildings = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/1",
            outFields: ["*"],
            renderer: renderer_buildings
        });

        var featureLayer_natural = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/2",
            outFields: ["*"],
            renderer: renderer_natural
        });

        var featureLayer_roads = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/3",
            outFields: ["*"],
            renderer: renderer_roads
        });

        var featureLayer_railways = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/4",
            outFields: ["*"],
            renderer: renderer_railways
        });

        var featureLayer_waterways = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/5",
            outFields: ["*"],
            renderer: renderer_waterways
        });

        var featureLayer_split = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/6",
            outFields: ["*"],
            renderer: renderer_split
        });

        var featureLayer_region = new FeatureLayer({
            url: "https://localhost:6443/arcgis/rest/services/CloudPlatformsforEnvironment/CloudPlatformsforEnvironment/FeatureServer/7",
            outFields: ["*"],
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

        map.add(featureLayer_enterprise);
        //map.add(featureLayer_buildings);
        //map.add(featureLayer_natural);
        //map.add(featureLayer_roads);
        //map.add(featureLayer_railways);
        //map.add(featureLayer_waterways);
        //map.add(featureLayer_region);
        //map.add(featureLayer_split);

        var centerPoint = new Point({
            latitude: 33.289,
            longitude: 119.461
        })

        var view = new MapView({
            container: "baseMap",
            map: map,
            center: centerPoint,
            zoom: 8
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

        view.ui.add(homeBtn, "bottom-right");
        view.ui.add(zoomBtn, "bottom-right");

        view.then(function () {
            $("body > .loader").css('display', 'none');
        });

        //////////////////////

        ///** 污染源企业列表生成及定义点击事件 **///

        var listNode = dom.byId("resultList");

        var graphics;

        view.whenLayerView(featureLayer_enterprise).then(function (lyrView) {
            lyrView.watch("updating", function (val) {
                if (!val) {
                    lyrView.queryFeatures().then(function (results) {

                        graphics = results;

                        var fragment = document.createDocumentFragment();

                        results.forEach(function (result, index) {

                            var attribute = result.attributes;


                            var name = attribute.Name + " (" +
                                attribute.Location + ")"

                            domConstruct.create("li", {
                                className: "panel-result",
                                tabIndex: 0,
                                "data-result-id": index,
                                textContent: name,
                            }, fragment);
                        });

                        domConstruct.place(fragment, listNode, "only");

                        $('#searching-window > section > section:last-child > ul li').click(controlSearchingUl);
                    });
                }
            });
        });

        on(listNode, on.selector("li", a11yclick), function (evt) {
            var target = evt.target;
            var resultId = domAttr.get(target, "data-result-id");

            var result = resultId && graphics && graphics[parseInt(resultId, 10)];

            if (result) {
                view.popup.open({
                    features: [result],
                    location: graphics[resultId].geometry
                });
            }
        });

        //////////////////////
    });
}