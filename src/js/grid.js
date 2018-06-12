import $ from 'jquery';
import {L} from "../lib/lquery.js";
import {templates} from "./templates.js";

function Grid(gridSelector, gridItemClass, options) {
    var thiz = this;

    //options
    var gridSelector = gridSelector;
    var gridItemClass = gridItemClass;
    var gridRows = 9;
    var enableResizing = false;

    //internal
    var _gridListInstance = null;
    var _gridElement = null;
    var _layoutChangedStartListener = null;
    var _layoutChangedEndListener = null;
    var _animationTimeMs = 200; //see gridlist.css

    function init() {
        parseOptions(options);
        initGrid();
        initResizing();
    }

    function parseOptions(options) {
        if (options) {
            gridRows = options.gridRows || gridRows;
            enableResizing = options.enableResizing != undefined ? options.enableResizing : enableResizing;
        }
    }

    function initGrid() {
        _gridElement = $(gridSelector);
        for (var i = 0; i < 50; i++) {
            var sizeX = L.getRandomInt(2, 2);
            var sizeY = L.getRandomInt(1, 1);
            L(gridSelector).insertAdjacentHTML('beforeend', templates.getGridItem(i, sizeX, sizeY));
        }

        _gridElement.gridList({
            lanes: gridRows,
            widthHeightRatio: 1,
            heightToFontSizeRatio: 0.25,
        }, {
            start: notifyLayoutChangeStart,
            stop: notifyLayoutChangeEnd
        });
        _gridListInstance = _gridElement.data('_gridList');
        _gridElement.gridList('resize', gridRows);
    }

    function initResizing() {
        $(gridItemClass).resizable(getResizeOptions());

        $(window).resize(function () {
            _gridElement.gridList('reflow');
        });
    }

    function refreshResizeOptions() {
        $(gridItemClass).resizable('option', getResizeOptions());
    }

    function getResizeOptions() {
        var itemSize = _gridListInstance._cellWidth;
        return {
            grid: [itemSize, itemSize],
            autoHide: true,
            handles: 'se',
            disabled: !enableResizing,
            start: notifyLayoutChangeStart,
            stop: notifyLayoutChangeEnd,
            resize: function (event, ui) {
                ui.element.parent().css('z-index', 1);
                var w = Math.round(ui.element.width() / (itemSize));
                var h = Math.round(ui.element.height() / (itemSize));
                _gridElement.gridList('resizeItem', ui.element.parent(), {
                    w: w,
                    h: h
                });
                ui.element.css('height', '');
                ui.element.css('width', '');
            }
        };
    }

    function notifyLayoutChangeStart() {
        if(L.isFunction(_layoutChangedStartListener)) {
            _layoutChangedStartListener();
        }
    }

    function notifyLayoutChangeEnd() {
        if(L.isFunction(_layoutChangedEndListener)) {
            setTimeout(function(){
                _layoutChangedEndListener();
            }, _animationTimeMs);
        }
        refreshResizeOptions();
    }

    thiz.enableElementResizing = function () {
        $(gridItemClass).resizable("enable");
    };

    thiz.disableElementResizing = function () {
        $(gridItemClass).resizable("disable");
    };

    thiz.addRow = function () {
        notifyLayoutChangeStart();
        gridRows++;
        _gridElement.gridList('resize', gridRows);
        notifyLayoutChangeEnd();
    };

    thiz.removeRow = function () {
        notifyLayoutChangeStart();
        if (gridRows > 1) {
            gridRows--;
            _gridElement.gridList('resize', gridRows);
        }
        notifyLayoutChangeEnd();
    };

    thiz.setNumberOfRows = function (nr) {
        notifyLayoutChangeStart();
        if (nr && nr > 0) {
            gridRows = nr;
            _gridElement.gridList('resize', gridRows);
        }
        notifyLayoutChangeEnd();
    };

    thiz.setLayoutChangedStartListener = function (fn) {
        _layoutChangedStartListener = fn;
    };

    thiz.setLayoutChangedEndListener = function (fn) {
        _layoutChangedEndListener = fn;
    };

    init();
}

export {Grid};