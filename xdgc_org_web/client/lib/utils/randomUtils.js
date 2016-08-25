var geneRandomArgu = function () {
    var _now = new Date();
    return '_t_e_m_p_=' + _now.getTime();
};

var removePreRandomArgu = function (url) {
    return url.replace(/(\?|&)(_t_e_m_p_=)([0-9]*)/, '');
};

Meteor.randomUtils = {
    geneUrl: function (url) {
        var url = url || '';
        url = removePreRandomArgu(url);
        url += url.indexOf('?') !== -1 ? '&' : '?';
        url += geneRandomArgu();
        return url;
    }
}
