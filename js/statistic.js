/* 统计 */
var comeId = 0;
var failCnt = 0;
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
    setTimeout("update("+comeId+","+failCnt+")", 2000);
}
var update = function(id, failTime) {
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
    setTimeout("update("+comeId+","+failCnt+")", 2000);
}