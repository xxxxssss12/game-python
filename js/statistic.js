/* 统计 */
var comeId = 0;
var failCnt = 0;
var maxScore = 0;
var changeId = function (data) {
    comeId = data;
};
var comeIn = function() {
    $.ajax({
        url: $.baseURI + "/come/insert",
        type: 'post',
        dataType: "json",
        success: function (ri) {
            if (ri && ri.code) {
                changeId(ri.data);
            }
        }
    });
    setTimeout("update("+comeId+","+failCnt+","+score+")", 2000);
}
var update = function(id, failTime, maxScore) {
    if (comeId) {
        $.ajax({
            url: $.baseURI + "/come/update",
            type: "post",
            dataType: "json",
            data: {"id": id, "failTime": failTime}
        })
    } else {
        comeIn();
    }
    setTimeout("update("+comeId+","+failCnt+","+score+")", 2000);
}
var getMaxScore = function() {
    $.ajax({
        url: $.baseURI + "/come/getMaxScore?time=" + new Date().getTime(),
        type: 'get',
        dataType: "json",
        success: function (ri) {
            if (ri && ri.code) {
                $("#maxScore").html(ri.data);
            }
        }
    })
}