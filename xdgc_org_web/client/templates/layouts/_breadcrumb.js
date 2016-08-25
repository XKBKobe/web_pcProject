Template._breadcrumb.helpers({
    hasBread: function (Breadcrumb) {
        if(Breadcrumb.length){
            Session.set("Breadcrumb", Breadcrumb);
            return Breadcrumb;
        }else{
            return Session.get("Breadcrumb");
        }
    }
});