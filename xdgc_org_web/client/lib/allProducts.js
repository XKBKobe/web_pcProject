/**
 * Created by Chenjn on 2015/8/24.
 */

// get all product name and uuid list for post loan module select box
Template.registerHelper("allProducts", function () {
    return Session.get("allProductsNamesUuid");
});

queryAllProducts = function() {
    var pageSize = 40;
    var params = {
        rows: pageSize
    };
    allProductsCall(params);
    var resData = Session.get('allProductsNamesUuid');
    if(!resData){
        return;
    }
    var total = resData.total;
    if(total > pageSize){
        params.rows = total;
        allProductsCall(params);
    }

}

function allProductsCall(params){
     Meteor.call("doPost", "productcust/list", params, function (err, result) {
        var res = doProcess(err, result);
        if (res) {
            Session.set('allProductsNamesUuid', res.data);
        }
    });
}

