/**
 * Created by xs on 2017/1/22.
 */
basepath=function(){
    var location = (window.location+"").split("/");
    var basePath = location[0]+"//"+location[2]+"/"+location[3]+"/";
    return basePath;
};
$.baseURI=basepath();
