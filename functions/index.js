const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

/*exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});*/

exports.saveFirstLastDate = functions.database.ref("{InEx}/{pushId}/date").onWrite(event => {
    const dateRef = admin.database().ref("/dates");
    //sconst firstDateRef = admin.database().ref("/dates/first");    

    var newDate = parseInt(event.data.val());
    console.log("new: " + newDate);

    return dateRef.once('value').then(snapshot => {
        last_date = parseInt(snapshot.child('last').val());
        first_date = parseInt(snapshot.child('first').val());
        console.log("first: " + first_date + " last: " + last_date);

        if (newDate > last_date) dateRef.child('last').set(newDate);
        else if (newDate < first_date) dateRef.child('first').set(newDate);
        return newDate;
    });
});


exports.getHomeWork = functions.https.onRequest((req, res) => {
    var lessons = []
    admin.database().ref("works").once("value").then(snapshot => {
        snapshot.child("homeworks").forEach(work => {
            console.log("work: " + JSON.stringify(work.val()));
            temp = work.val();
            temp["lesson"] = snapshot.child("lessons").child(temp["lessonID"]).val();
            lessons.push(temp);
        });
        res.status(200).send(lessons);
    });
});

/*exports.saveDateExpense = functions.database.ref("expenses/{pushId}/date").onWrite(event => {
    const dateRef = admin.database().ref("/dates");
    //sconst firstDateRef = admin.database().ref("/dates/first");    

    var newDate = parseInt(event.data.val());
    console.log("new: " + newDate);

    return dateRef.once('value').then(snapshot => {
        last_date = parseInt(snapshot.child('last').val());
        first_date = parseInt(snapshot.child('first').val());
        console.log("first: " + first_date + " last: " + last_date);
        
        if (newDate > last_date) dateRef.child('last').set(newDate);
        else if(newDate < first_date) dateRef.child('first').set(newDate);
        return newDate;
    });
});*/

exports.getSum = functions.https.onRequest((req, res) => {
    sum = 0;
    console.log("Hello");

    admin.database().ref().once("value").then(snapshot => {
        console.log("snapshot: " + JSON.stringify(snapshot.val()));
        sum = 0;
        snapshot.child("incomes").forEach(income => {
            console.log("income: " + JSON.stringify(income.val()));
            sum += parseInt(income.child('sum').val(), 10);
        });
        console.log("Sum income: " + sum);

        snapshot.child("expenses").forEach(expense => {
            console.log("expense: " + JSON.stringify(expense.val()));
            sum -= parseInt(expense.child('sum').val(), 10);
        });
        console.log("Sum expense: " + sum);

        res.status(200).send({ "sum": sum });
        console.log(res);
    });
});

/*exports.getDatesArray = functions.https.onRequest((req, res) => {
    admin.database().ref("/dates").once('value').then(snapshot => {
        console.log(JSON.stringify(snapshot));
        var first = parseInt(snapshot.child("first").val());
        var last = parseInt(snapshot.child("last").val());
        console.log("first: " + first + " last: " + last);

        var dateFirst = new Date(first);
        var dateLast = new Date(last);

        console.log("first: " + dateFirst.toDateString() + " last: " + dateLast.toDateString())

        var result = [];

        while (dateFirst < dateLast) {
            result.push(dateFirst);
            console.log(dateFirst.toDateString())
            dateFirst.setDate(dateFirst.getDate() + 1);
        }

        res.status(200).send(result);
    });
});*/

exports.get_earn_year_2 = functions.https.onRequest((req, res) => {

    var cashMap = {};

    admin.database().ref("/dates").once('value').then(snapshot => {
        console.log(JSON.stringify(snapshot));
        var first = parseInt(snapshot.child("first").val());
        var last = parseInt(snapshot.child("last").val());
        console.log("first: " + first + " last: " + last);

        //var dateFirst = new Date(first);
        //var dateLast = new Date(last);
        //console.log("first: " + dateFirst.toDateString() + " last: " + dateLast.toDateString())

        while (first <= last) {
            cashMap[first] = 0;
            //console.log(dateFirst.toDateString())
            first += 86400000;
        }
        console.log(cashMap);

        admin.database().ref().once("value").then(snapshot => {

            snapshot.child("incomes").forEach(income => {
                //console.log("income: " + JSON.stringify(income.val()));
                var date = parseInt(income.child('date').val());
                var sum = parseFloat(income.child('sum').val());
                cashMap[date] += sum;
            });
            console.log(cashMap);

            snapshot.child("expenses").forEach(expense => {
                var date = parseInt(expense.child('date').val());
                var sum = parseFloat(expense.child('sum').val());
                cashMap[date] -= sum;
            });
            console.log(cashMap);



            res.status(200).send(cashMap);
        });
    });
});

exports.get_sum_year_2 = functions.https.onRequest((req, res) => {

    var cashMap = {};
    var sumPositive = 0;
    var sumNegative = 0;

    admin.database().ref("/dates").once('value').then(snapshot => {
        console.log(JSON.stringify(snapshot));
        var first = first_const = parseInt(snapshot.child("first").val());
        var last = parseInt(snapshot.child("last").val());
        console.log("first: " + first + " first_const: " + first_const + " last: " + last);

        //var dateFirst = new Date(first);
        //var dateLast = new Date(last);
        //console.log("first: " + dateFirst.toDateString() + " last: " + dateLast.toDateString())

        while (first <= last) {
            cashMap[first] = { 'day': 0, 'positive': 0, 'negative': 0 };
            //console.log(dateFirst.toDateString())
            first += 86400000;
        }
        console.log(cashMap);

        admin.database().ref().once("value").then(snapshot => {

            snapshot.child("incomes").forEach(income => {
                //console.log("income: " + JSON.stringify(income.val()));
                var date = parseInt(income.child('date').val());
                var sum = parseFloat(income.child('sum').val());
                console.log(date);
                console.log(cashMap[date]);
                cashMap[date]['day'] += sum;

                sumPositive += sum;
                cashMap[date]['positive'] = sumPositive;
            });
            console.log(cashMap);

            snapshot.child("expenses").forEach(expense => {
                var date = parseInt(expense.child('date').val());
                var sum = parseFloat(expense.child('sum').val());
                cashMap[date]['day'] -= sum;

                sumNegative += sum;
                cashMap[date]['negative'] = sumNegative;
            });
            console.log(cashMap);

            var counter_positive = counter_negative = 0;
            while (first_const <= last) {
                if (cashMap[first_const]['positive'] == 0) cashMap[first_const]['positive'] = counter_positive;
                else counter_positive = cashMap[first_const]['positive']

                if (cashMap[first_const]['negative'] == 0) cashMap[first_const]['negative'] = counter_negative;
                else counter_negative = cashMap[first_const]['negative']

                first_const += 86400000;
            }


            res.status(200).send(cashMap);
        });
    });
});

exports.get_earn_year_1 = functions.https.onRequest((req, res) => {

    var cashMap = {};
    var sumPositive = 0;
    var sumNegative = 0;

    admin.database().ref("/year1").once('value').then(snapshot => {
        console.log(JSON.stringify(snapshot));

        var last = 1497916800000;
        var first = 1483315200000;
        console.log("first: " + first + " last: " + last);

        //var dateFirst = new Date(first);
        //var dateLast = new Date(last);
        //console.log("first: " + dateFirst.toDateString() + " last: " + dateLast.toDateString())

        while (first <= last) {
            cashMap[first] = 0;
            //console.log(dateFirst.toDateString())
            first += 86400000;
        }
        console.log(cashMap);

        snapshot.forEach(income => {
            //console.log("income: " + JSON.stringify(income.val()));
            var date = parseInt(income.child('date').val());
            var sumOfDay = parseFloat(income.child('sum').val());
            cashMap[date] += sumOfDay;

            if (sumOfDay >= 0) sumPositive += sumOfDay;
            else sumNegative += sumOfDay;

            //cashMap[date]['positive'] = sumPositive;
            //cashMap[date]['negative'] = sumNegative;
        });
        console.log(cashMap);

        res.status(200).send(cashMap);
    });
});

exports.get_sum_year_1 = functions.https.onRequest((req, res) => {

    var cashMap = {};
    var sumPositive = 0;
    var sumNegative = 0;

    admin.database().ref("/year1").once('value').then(snapshot => {
        console.log(JSON.stringify(snapshot));

        var last = 1497916800000;
        var first = 1483315200000;
        console.log("first: " + first + " last: " + last);

        //var dateFirst = new Date(first);
        //var dateLast = new Date(last);
        //console.log("first: " + dateFirst.toDateString() + " last: " + dateLast.toDateString())

        while (first <= last) {
            cashMap[first] = { 'day': 0, 'positive': 0, 'negative': 0 };
            //console.log(dateFirst.toDateString())
            first += 86400000;
        }
        console.log(cashMap);

        snapshot.forEach(income => {
            //console.log("income: " + JSON.stringify(income.val()));
            var date = parseInt(income.child('date').val());
            var sumOfDay = parseFloat(income.child('sum').val());
            cashMap[date]['day'] += sumOfDay;

            if (sumOfDay >= 0) sumPositive += sumOfDay;
            else sumNegative -= sumOfDay;

            cashMap[date]['positive'] = sumPositive;
            cashMap[date]['negative'] = sumNegative;
        });
        console.log(cashMap);


        var last = 1497916800000;
        var first = 1483315200000;
        var counter_positive = 0;
        var counter_negative = 0;
        while (first <= last) {

            if (cashMap[first]['positive'] == 0) cashMap[first]['positive'] = counter_positive;
            else counter_positive = cashMap[first]['positive']

            if (cashMap[first]['negative'] == 0) cashMap[first]['negative'] = counter_negative;
            else counter_negative = cashMap[first]['negative']
            //console.log(dateFirst.toDateString())
            first += 86400000;
        }

        res.status(200).send(cashMap);
    });
});

exports.getByWhat = functions.https.onRequest((req, res) => {
    whatsMap = {};
    admin.database().ref("/expenses").once("value").then(snapshot => {

        console.log(JSON.stringify(snapshot));

        snapshot.forEach(expense => {
            console.log("expense: " + JSON.stringify(expense.val()));
            var what = expense.child('what').val();
            var sum = parseFloat(expense.child('sum').val());
            var units = parseInt(expense.child('units').val());
            if (whatsMap[what]['sum'] == undefined) whatsMap[what]['sum'] = 0;
            if (whatsMap[what]['units'] == undefined) whatsMap[what]['units'] = 0;
            whatsMap[what]['sum'] += sum;
            whatsMap[what]['units'] += units;
        });
        console.log(whatsMap);

        res.status(200).send(whatsMap);
    });
});
