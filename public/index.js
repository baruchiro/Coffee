var optionAll = {
    responsive: true,
    elements: {
        point: {
            radius: 2
        }
    },
    scales: {
        xAxes: [{
            type: "time",
            time: {
                parser: false, // false == a pattern string from http://momentjs.com/docs/#/parsing/string-format/ or a custom callback that converts its argument to a moment
                format: false, // DEPRECATED false == date objects, moment object, callback or a pattern string from http://momentjs.com/docs/#/parsing/string-format/
                unit: false, // false == automatic or override with week, month, year, etc.
                round: false, // none, or override with week, month, year, etc.
                displayFormat: false, // DEPRECATED
                isoWeekday: false, // override week start day - see http://momentjs.com/docs/#/get-set/iso-weekday/
                minUnit: "day",

                // defaults to unit's corresponding unitFormat below or override using pattern string from http://momentjs.com/docs/#/displaying/format/
                displayFormats: {
                    /*millisecond: "h:mm:ss.SSS a", // 11:20:01.123 AM,
                    second: "h:mm:ss a", // 11:20:01 AM
                    minute: "h:mm:ss a", // 11:20:01 AM
                    hour: "MMM D, hA", // Sept 4, 5PM*/
                    day: "ll", // Sep 4 2015
                    week: "ll", // Week 46, or maybe "[W]WW - YYYY" ?
                    month: "MMM YYYY", // Sept 2015
                    //quarter: "[Q]Q - YYYY", // Q3
                    year: "YYYY" // 2015
                }
            },
            scaleLabel: {
                display: true,
                labelString: 'Date'
            }
        }],
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'value'
            },
            ticks: {
                suggestedMin: 0,
                min: -70,
            }
        }]
    },
    tooltips: {
        mode: 'nearest'
    }
}

function formatDate(dateLong){
    var date = new Date(dateLong);
    return String.format("")
}

var template = "<p class=\"list-group-item\"><span class=\"badge badge-default badge-pill\">%%date%%</span>עבודה %%number%% ב%%lesson%%</p>"

$.get_homworks = function(){
    $.ajax({
        url: "https://sapir-coffe.firebaseapp.com/func/works",
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log("get_homework")
            //console.log(data);
            var items = Object.keys(data).map(key=>{
                return data[key]-7200000;
            })
            //console.log(items);
            items.sort((first,second)=>{
                return first["date"] - second["date"];
            });
            //console.log(items);
            var today = new Date();
            today.setHours(0,0,0,0);
            //console.log(today);
            items = items.filter(item=>{
                return item["date"] >= today.getTime();
            })
            //console.log(items);
            items.forEach(item =>{
                var text = template.replace("%%date%%" ,new Intl.DateTimeFormat('he-IL',{
                    year: '2-digit',
                    month:'2-digit',
                    day: 'numeric',
                    hour: '2-digit',
                    minute:'2-digit',
                    weekday: 'long'
                }).format(item["date"]))

                text = text.replace("%%number%%",item["number"]);
                text = text.replace("%%lesson%%",item["lesson"]);

                $("#works").append(text).fadeIn();
            })
        },
        error: function (jqXHR, exception) {
            console.log("get_homworks fail: " + jqXHR.responseText);
        }
    });
}

$.get_cash_status = function () {
    $.cash_status_text.attr('class', 'model');
    $.ajax({
        url: "https://sapir-coffe.firebaseapp.com/func/sum",
        cache: false,
        dataType: 'json',
        success: function (data) {
            $.change_status_color(data)
        },
        error: function (jqXHR, exception) {
            console.log("get_cash_status fail: " + jqXHR.responseText);
        }
    });
    //return 55.5
}

$.change_status_color = function (json) {
    var sum = json.sum;
    $.cash_status_text.text(sum);
    $.cash_status_text.attr('class', sum >= 0 ? 'positive' : 'negative')
}

function load_chart_earn_year_2() {
    $.ajax({
        url: "https://sapir-coffe.firebaseapp.com/func/earn/year2",
        cache: false,
        dataType: 'json',
        success: function (data) {
            draw_chart_earn_year_2(data);
        },
        error: function (jqXHR, exception) {
            console.log("load_chart_earn_year_2 fail: "+ jqXHR.responseText);
        }
    });
}

function draw_chart_earn_year_2(data) {
    var ctx = document.getElementById("chart_earn_year_2").getContext('2d');
    //console.log(data);
    var keys = [];
    var values = [];
    for (var k in data) {
        //console.log(k);
        values.push(data[k]);
        d = new Date(parseInt(k));
        keys.push(d)
    }
    //console.log(keys);
    //console.log(values);
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: keys, // ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],//get_date()
            datasets: [{
                label: 'רווחים ליום',
                fill: false,
                data: values, //[12, 19, 3, 5, 2, 3],//get_sum_of_day()
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
            }
            ]
        },
        options: optionAll
    });
}

function load_chart_sum_year_2() {
    $.ajax({
        url: "https://sapir-coffe.firebaseapp.com/func/sum/year2",
        cache: false,
        dataType: 'json',
        success: function (data) {
            draw_chart_sum_year_2(data);
        },
        error: function (jqXHR, exception) {
            console.log("load_chart_sum_year_2 fail: " + jqXHR.responseText);
        }
    });
}

function draw_chart_sum_year_2(data) {
    var ctx = document.getElementById("chart_sum_year_2").getContext('2d');
    //console.log(data);
    var keys = [];
    var values_day = [];
    var values_positive = [];
    var values_negative = [];
    for (var k in data) {
        //console.log(k);
        values_day.push(data[k]['day']);
        values_positive.push(data[k]['positive']);
        values_negative.push(data[k]['negative']);
        d = new Date(parseInt(k));
        keys.push(d)//d.getDate() + "/" + (d.getMonth() + 1))
    }
    //console.log(keys);
    //console.log(values);
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: keys, // ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],//get_date()
            datasets: [{
                label: 'רווחים',
                fill: true,
                data: values_positive, //[12, 19, 3, 5, 2, 3],//get_sum_of_day()
                backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                borderColor: 'rgba(0,255,0,1)',
                borderWidth: 1
            },
            {
                label: 'הפסדים',
                fill: true,
                data: values_negative, //[12, 19, 3, 5, 2, 3],//get_sum_of_day()
                backgroundColor: ['rgba(255, 0, 0, 0.2)'],
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1
            }]
        },
        options: optionAll
    });
}

function load_chart_earn_year_1() {
    $.ajax({
        url: "https://sapir-coffe.firebaseapp.com/func/earn/year1",
        cache: false,
        dataType: 'json',
        success: function (data) {
            draw_chart_earn_year_1(data);
        },
        error: function (jqXHR, exception) {
            console.log("load_chart_earn_year_1 fail: "+ jqXHR.responseText);
        }
    });
    var timeFormat = 'DD/MM';
}

function draw_chart_earn_year_1(data) {
    var ctx = document.getElementById("chart_earn_year_1").getContext('2d');
    //console.log(data);
    var keys = [];
    var values = [];
    for (var k in data) {
        //console.log(k);
        values.push(data[k]);
        d = new Date(parseInt(k));
        keys.push(d)//d.getDate() + "/" + (d.getMonth() + 1))
    }
    //console.log(keys);
    //console.log(values);
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: keys, // ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],//get_date()
            datasets: [{
                label: 'רווחים ליום',
                fill: false,
                spanGaps: true,
                pointRadius: 0,
                borderWidth: 1,
                data: values, //[12, 19, 3, 5, 2, 3],//get_sum_of_day()
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: 'rgba(255,99,132,1)',
            }]
        },
        options: optionAll
    });
}

function load_chart_sum_year_1() {
    $.ajax({
        url: "https://sapir-coffe.firebaseapp.com/func/sum/year1",
        cache: false,
        dataType: 'json',
        success: function (data) {
            draw_chart_sum_year_1(data);
        },
        error: function (jqXHR, exception) {
            console.log("load_chart_sum_year_1 fail: " + jqXHR.responseText);
        }
    });
    var timeFormat = 'DD/MM';
}

function draw_chart_sum_year_1(data) {
    var ctx = document.getElementById("chart_sum_year_1").getContext('2d');
    //console.log(data);
    var keys = [];
    var values_day = [];
    var values_positive = [];
    var values_negative = [];
    for (var k in data) {
        //console.log(k);
        values_day.push(data[k]['day']);
        values_positive.push(data[k]['positive']);
        values_negative.push(data[k]['negative']);
        d = new Date(parseInt(k));
        keys.push(d)//d.getDate() + "/" + (d.getMonth() + 1))
    }
    //console.log(keys);
    //console.log(values);
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: keys, // ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],//get_date()
            datasets: [{
                label: 'רווחים',
                fill: true,
                data: values_positive, //[12, 19, 3, 5, 2, 3],//get_sum_of_day()
                backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                borderColor: 'rgba(0,255,0,1)',
                borderWidth: 1
            },
            {
                label: 'הפסדים',
                fill: true,
                data: values_negative, //[12, 19, 3, 5, 2, 3],//get_sum_of_day()
                backgroundColor: ['rgba(255, 0, 0, 0.2)'],
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1
            }]
        },
        options: optionAll
    });
}