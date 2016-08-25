/**
* 高德地图
*/
var mapObj = {
    saveLnglat4bd: true,//如果为true，则先将高德的GCJ02系坐标转换为百度BD09系坐标后保存
    locAutofillMinVal: 100,//触发街道地址自动填充功能所需的最小距离值，单位米
    mapRenderFlag: true,
    initedFlag: false,
    mapRClickLock: false,
    renderQueue: [],
    renderQueueProgressFlag: false,
    _defaultSetting: {
        tmp: null,
        selectorTarget: '.addressSelect',
        searchInputTarget: '#loc',
        autocompleteInputId: 'loc',
        searchBtnTarget: '#locSearch',
        provSelectorTarget: '#prov',
        citySelectorTarget: '#city',
        areaSelectorTarget: '#area',
        coordinatesInputTarget: '#coordinates'
    },
    clear: function() {
        this.map = null;
        this.auto = null;
        this.road = null;
        this.point = null;
        this.area = null;
        this.geo = null;
        this.circle = null;
    },
    // _debug: function () {
    //     var self = this;
    //     console.log('==== q length: ' + this.renderQueue.length);
    //     console.log('==== flag: ' + this.renderQueueProgressFlag);
    //     _.forEach(this.renderQueue, function (e) {
    //         console.log(e);
    //     });
    //     setTimeout(function () {
    //         self._debug();
    //     }, 10000);
    // },
    //GCJ02系 转 BD09系
    gcj2bd: function (lnglatStr) {
        var pi = Math.PI*3000.0/180.0;
        var lnglat = lnglatStr.split(',');
        var x = new Number(lnglat[0]);
        var y = new Number(lnglat[1]);
        var z = Math.sqrt(x*x + y*y) + 0.00002*Math.sin(y*pi);
		var theta = Math.atan2(y, x) + 0.000003*Math.cos(x*pi);
        var bdX = z*Math.cos(theta) + 0.0065;
		var bdY = z*Math.sin(theta) + 0.006;
		return bdX.toFixed(6) + ',' + bdY.toFixed(6);
    },
    //BD09系 转 GCJ02系
    bd2gcj: function (lnglatStr) {
        var pi = Math.PI*3000.0/180.0;
        var lnglat = lnglatStr.split(',');
        var x = new Number(lnglat[0]);
        var y = new Number(lnglat[1]);
        x -= 0.0065;
        y -= 0.006;
        var z = Math.sqrt(x*x + y*y) - 0.00002*Math.sin(y*pi);
		var theta = Math.atan2(y, x) - 0.000003*Math.cos(x*pi);
		var gcjX = z*Math.cos(theta);
		var gcjY = z*Math.sin(theta);
        return gcjX.toFixed(6) + ',' + gcjY.toFixed(6);
    },
    _adcode2Name: function (adcode) {
        var _result = '';
        var _prov = common_assets.cities.getData().province;
        var _flag;
        for (var i = 0; i < _prov.length; i++) {
            if (_prov[i].code === adcode.substring(0, 2) + '0000') {
                _flag = _prov[i].flag;
                _result += _prov[i].name;
                var _city = _prov[i].city;
                for (var _i = 0; _i < _city.length; _i++) {
                    if (_city[_i].code === adcode.substring(0, 4) + '00') {
                        _result += _flag ? _city[_i].name : '';
                        var _area = _city[_i].area;
                        for (var __i = 0; __i < _area.length; __i++) {
                            if (_area[__i].code === adcode) {
                                _result += _area[__i].name;
                                return _result;
                            }
                        }
                    }
                }
            }
        }
        return _result;
    },
    _mapRClick: function (e, cb) {
        var self = this;
        try {
            self.markPoint(e.lnglat, null, null, true);
            self.geo.getAddress(e.lnglat, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    var _ad = result.regeocode.formattedAddress;
                    var _adcode = result.regeocode.addressComponent.adcode;
                    if (_adcode) {
                        self.mapRenderFlag = false;
                        self.setSelector({
                            prov: _adcode.substring(0, 2) + '0000',
                            city: _adcode.substring(0, 4) + '00',
                            area: _adcode
                        }, function () {
                            self.markPoint(e.lnglat, _ad);
                            self.tmp.$(self.opts.searchInputTarget).val(_ad.replace(self._adcode2Name(_adcode), ''));
                            self.mapRenderFlag = true;
                            cb && cb();
                        });
                    } else {
                        self.markPoint(e.lnglat, _ad);
                        self.tmp.$(self.opts.searchInputTarget).val(_ad);
                    }
                }
            });
        } catch (e) {
            //TODO 国外坐标无法catch error
            //console.log(e);
        }
    },
    init: function(opts) {
        var self = this;
        self.initedFlag = false;
        self.opts = _.defaults(opts, self._defaultSetting);
        self.clear();
        self.tmp = self.opts.tmp;
        self.map = new AMap.Map('container', {
            resizeEnable: true
        });
        self.map.on('rightclick', function(e) {
            if (!self.mapRClickLock) {
                self.mapRClickLock = true;
                self._mapRClick(e, function () {
                    self.mapRClickLock = false;
                });
            }
        });
        if (self.opts.selectorTarget) {
            self.tmp.$(self.opts.selectorTarget).on('change', function (e) {
                var _data = {};
                var name = $(e.target).attr('name');
                _data[name] = $(e.target).find('option:selected').val();
                self.pushRenderQueue(_data);
            });
        }
        if (self.opts.searchInputTarget) {
            var _doSearch = function () {
                self.search(self.tmp.$(self.opts.searchInputTarget).val());
            };
            self.tmp.$(self.opts.searchInputTarget).on('focus', function (e) {
                self.setSearchRange();
            });
            self.tmp.$(self.opts.searchInputTarget).on('keyup', function (e) {
                if (e.keyCode === 13) {
                    self.tmp.$(self.opts.searchInputTarget).blur();
                    _doSearch();
                }
            });
            if (self.opts.searchBtnTarget) {
                self.tmp.$(self.opts.searchBtnTarget).on('click', function () {
                    _doSearch();
                });
            }
        }
        AMap.service(['AMap.Autocomplete', 'AMap.RoadInfoSearch', 'AMap.Geocoder'], function() {
            self.auto = new AMap.Autocomplete({
                input: self.opts.autocompleteInputId
            });
            self.road = new AMap.RoadInfoSearch({
                map: self.map
            });
            self.geo = new AMap.Geocoder({});
            AMap.event.addListener(self.auto, 'select', function(e) {
                self.markPoi(e.poi);
            });
            self.initedFlag = true;
        });
    },
    markPoi: function(poi) {
        var self = this;
        if (poi) {
            if (poi.adcode) {
                self.setSelector({
                    prov: poi.adcode.substring(0, 2) + '0000',
                    city: poi.adcode.substring(0, 4) + '00',
                    area: poi.adcode
                }, function() {
                    self.pushRenderQueue({
                        coordinates: poi.location.toString(),
                        loc: poi.name
                    });
                });
            }
        }
    },
    markPoint: function(lnglat, title, zoom, isTemp, cb) {
        var self = this;
        zoom = zoom || self.map.getZoom();
        var lnglatStr = lnglat.toString();
        if (self.saveLnglat4bd) {
            lnglatStr = self.gcj2bd(lnglatStr);
        }
        self.tmp.$(self.opts.coordinatesInputTarget).val(lnglatStr);
        if (!self.point) {
            self.point = new AMap.Marker({
                map: self.map
            });
            self.point.on('moveend', function () {
                self.point.setAngle(0);
            });
            self.point.on('moving', function () {
                self.circle.setCenter(self.point.getPosition());
            });
        }
        self.point.setAnimation(isTemp ? 'AMAP_ANIMATION_BOUNCE' : 'AMAP_ANIMATION_DROP');
        self.point.setPosition(lnglat);
        self.point.setTitle(title);
        self.map.setCenter(lnglat);
        self.map.setZoom(zoom);
        cb && cb();
        !isTemp && self.markCircle(lnglat);
    },
    movePoint: function (lnglat, cb) {
        if (this.point) {
            var lnglatStr = lnglat.toString();
            if (this.saveLnglat4bd) {
                lnglatStr = this.gcj2bd(lnglatStr);
            }
            this.tmp.$(this.opts.coordinatesInputTarget).val(lnglatStr);
            var startPoint = this.point.getPosition();
            var degree = Math.atan2(lnglat.getLng() - startPoint.getLng(), lnglat.getLat() - startPoint.getLat());
            degree -= degree*2/Math.PI;
            var angle = degree*180/Math.PI;
            this.point.setAngle(angle);
            this.point.moveTo(lnglat, 3*this.locAutofillMinVal, function (k) {
                return k*k;
            });
        }
        cb && cb();
    },
    markCircle: function (lnglat, cb) {
        var self = this;
        if (!self.circle) {
            self.circle = new AMap.Circle({
                map: self.map,
                radius: self.locAutofillMinVal,
                fillColor: '#aaaaaa',
                fillOpacity: 0.1,
                strokeColor: '#aaaaaa',
                strokeOpacity: 0.3
            });
            self.circle.on('rightclick', function (e) {
                self.movePoint(e.lnglat);
            });
        }
        self.circle.setCenter(lnglat);
        cb && cb();
    },
    markArea: function(path) {
        if (!this.area) {
            this.area = new AMap.Polygon({
                strokeColor: '#3bbae9',
                strokeStyle: 'solid',
                map: this.map
            });
        }
        this.area.setPath(path);
    },
    render: function(data, cb) {
        if (this.mapRenderFlag) {
            var _data = data || {};
            if (_data.coordinates) {
                this.markPoint(_data.coordinates.split(','), _data.loc, 18, false, cb);
            } else {
                var _city = _data.area || _data.city || _data.prov;
                if (_city) {
                    this.map.setCity(_city, function () {
                        cb && cb();
                    });
                } else {
                    cb && cb();
                }
            }
        } else {
            cb && cb();
        }
    },
    pushRenderQueue: function (data) {
        this.renderQueue.push(data);
        if (!this.renderQueueProgressFlag) {
            this.renderQueueProgressFlag = true;
            this.renderQueue.length && this.progressRenderQueue();
        }
    },
    progressRenderQueue: function () {
        var self = this;
        var data = self.renderQueue.shift();
        self.render(data, function () {
            if (self.renderQueue.length) {
                self.progressRenderQueue();
            } else {
                self.renderQueueProgressFlag = false;
            }
        });
    },
    setSelector: function(data, cb) {
        var self = this;
        if (data.prov) {
            try {
                self.tmp.$(self.opts.provSelectorTarget).val(data.prov).change().promise().done(function () {
                    self.tmp.$(self.opts.citySelectorTarget).val(data.city).change().promise().done(function () {
                        self.tmp.$(self.opts.areaSelectorTarget).val(data.area).change().promise().done(cb).fail(cb);
                    }).fail(cb);
                }).fail(cb);
            } catch (e) {
                cb();
            }
        }
    },
    setSearchRange: function() {
        var self = this;
        self.map.getCity(function(data){
            self.auto.setCity(data.citycode);
        });
    },
    search: function(key) {
        var self = this;
        if (key) {
            self.map.getCity(function(data) {
                self.auto.setCity(data.citycode);
                self.auto.search(key, function(status, result) {
                    result.tips = _.filter(result.tips, function (e) {
                        return e.adcode || e.location;
                    });
                    if (status === 'complete' && result.info === 'OK' && result.tips.length) {
                        self.markPoi(result.tips[0]);
                        setTimeout(function() {
                            $('.amap-sug-result').hide();
                        }, 500);
                    } else {
                        self.road.setCity(data.citycode);
                        self.road.roadInfoSearchByRoadName(key, function(status, result) {
                            if (status === 'complete' && result.info === 'OK' && result.roadInfo.length) {
                                self.markArea(result.roadInfo[0].path);
                                self.markPoint(result.roadInfo[0].center.split(','), result.roadInfo[0].name, 14);
                            } else if (key.length > 1) {
                                self.search(key.substring(0, key.length-2));
                            }
                        });
                    }
                });
            });
        }
    }
};

Meteor.amapUtils = {
    init: function (opts) {
        mapObj.init.call(mapObj, opts);
        // mapObj._debug();
    },
    render: function (data) {
        if (mapObj.initedFlag) {
            mapObj.setSelector.call(mapObj, data, function() {
                if (mapObj.saveLnglat4bd && data && data.coordinates) {
                    data.coordinates = mapObj.bd2gcj(data.coordinates);
                }
                mapObj.pushRenderQueue.call(mapObj, data);
            });
        } else {
            var self = this;
            setTimeout(function () {
                self.render(data);
            }, 500);
        }
    }
};
