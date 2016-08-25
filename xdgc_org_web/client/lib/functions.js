/**
 * Created by Administrator on 2015/9/8.
 */

Namespace('xdgc.utils', function () {

    this.trimString = function(str) {
        return (typeof str === 'string') ? str.trim() : str;
    };

});
