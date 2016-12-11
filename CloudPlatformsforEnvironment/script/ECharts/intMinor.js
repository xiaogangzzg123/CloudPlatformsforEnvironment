(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('intMinor', {
        "color": [
            "#00968b",
            "#56ae8b",
            "#85c79c",
            "#92cdcf",
            "#91c9e8",
            "#ffeead",
            "#ff6f96",
            "#ff6138"
        ],
        "backgroundColor": "rgba(245,245,245,0.8)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#777777"
            },
            "subtextStyle": {
                "color": "#999999"
            }
        },
        "line": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 1
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 2
                }
            },
            "symbolSize": 4,
            "symbol": "emptyRect",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 1
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 2
                }
            },
            "symbolSize": 4,
            "symbol": "emptyRect",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "normal": {
                    "barBorderWidth": "0",
                    "barBorderColor": "#ccc"
                },
                "emphasis": {
                    "barBorderWidth": "0",
                    "barBorderColor": "#ccc"
                }
            }
        },
        "pie": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            }
        },
        "scatter": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            }
        },
        "boxplot": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            }
        },
        "parallel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            }
        },
        "sankey": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            }
        },
        "funnel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            }
        },
        "gauge": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            }
        },
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#c23531",
                    "color0": "#314656",
                    "borderColor": "#c23531",
                    "borderColor0": "#314656",
                    "borderWidth": 1
                }
            }
        },
        "graph": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 1,
                    "color": "#aaa"
                }
            },
            "symbolSize": 4,
            "symbol": "emptyRect",
            "smooth": false,
            "color": [
                "#00968b",
                "#56ae8b",
                "#85c79c",
                "#92cdcf",
                "#91c9e8",
                "#ffeead",
                "#ff6f96",
                "#ff6138"
            ],
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "rgba(245,245,245,1)"
                    }
                }
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#eeeeee",
                    "borderColor": "#999999",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "#85c79c",
                    "borderColor": "#eeeeee",
                    "borderWidth": "1"
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#ffffff"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#eeeeee",
                    "borderColor": "#999999",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "#85c79c",
                    "borderColor": "#eeeeee",
                    "borderWidth": "1"
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#ffffff"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#777777"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#777777"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#777777"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#dddddd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#777777"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#777777"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#777777"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#dddddd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#777777"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#777777"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#777777"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#dddddd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#777777"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#777777"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#777777"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#dddddd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#999999"
                },
                "emphasis": {
                    "borderColor": "#666666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#777777"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#aaaaaa",
                    "width": "2"
                },
                "crossStyle": {
                    "color": "#aaaaaa",
                    "width": "2"
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#999999",
                "width": 1
            },
            "itemStyle": {
                "normal": {
                    "color": "#999999",
                    "borderWidth": "1"
                },
                "emphasis": {
                    "color": "#ff6f96"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#999999",
                    "borderColor": "#999999",
                    "borderWidth": "0"
                },
                "emphasis": {
                    "color": "#999999",
                    "borderColor": "#999999",
                    "borderWidth": "0"
                }
            },
            "checkpointStyle": {
                "color": "#ff6138",
                "borderColor": "rgba(194,53,49,0.5)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#777777"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#777777"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#56ae8b",
                "#92cdcf"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(47,69,84,0)",
            "dataBackgroundColor": "rgba(47,69,84,0.3)",
            "fillerColor": "rgba(167,183,204,0.4)",
            "handleColor": "#a7b7cc",
            "handleSize": "100%",
            "textStyle": {
                "color": "#777777"
            }
        },
        "markPoint": {
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "rgba(245,245,245,1)"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgba(245,245,245,1)"
                    }
                }
            }
        }
    });
}));
