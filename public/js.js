function sendDataToServer(survey) {
    //send Ajax request to your web server.
    //alert("The results are:" + JSON.stringify(survey.data));
    var path = "http://www.zap.co.il/models.aspx?sog=c-pclaptop&db1634543="
    console.log(survey.data.proccessor);
    for (var i = 0; i < survey.data.proccessor.length; i++) {
        path += survey.data.proccessor[i] + ",";
    }
    $("#link").attr("href", path.slice(0, -1)).show();
}