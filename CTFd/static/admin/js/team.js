function teamid (){
    loc = window.location.pathname
    return loc.substring(loc.lastIndexOf('/')+1, loc.length);
}


function cumulativesum (arr) {
    var result = arr.concat();
    for (var i = 0; i < arr.length; i++){
        result[i] = arr.slice(0, i + 1).reduce(function(p, i){ return p + i; });
    }
    return result
}

function scoregraph () {
    var times = []
    var scores = []
    var teamname = $('#team-id').text()
    $.get('/admin/solves/'+teamid(), function( data ) {
        var solves = $.parseJSON(JSON.stringify(data));
        solves = solves['solves'];

        if (solves.length == 0)
            return;

        for (var i = 0; i < solves.length; i++) {
            var date = moment(solves[i].time * 1000);
            times.push(date.format('YYYY-MM-DD hh:mm:ss'));
            scores.push(solves[i].value);
        }
        scores = cumulativesum(scores);

        var data = [
            {
                x: times,
                y: scores,
                type: 'scatter'
            }
        ];
        Plotly.newPlot('score-graph', data);
    });
}

function adjust_times () {
    $.each($(".solve-time"), function(i, e){
        $(e).text( moment(parseInt(e.innerText)).local().format('LLL') ) 
    })
    $(".solve-time").css('color', "#222")
}


function keys_percentage_graph(){
    // Solves and Fails pie chart
    $.get('/admin/fails/'+teamid(), function(data){
        var res = $.parseJSON(JSON.stringify(data));
        var solves = res['solves'];
        var fails = res['fails'];

        var data = [{
            values: [solves, fails],
            labels: ['Solves', 'Fails'],
            marker: {
                colors: [
                    "rgb(0, 209, 64)",
                    "rgb(207, 38, 0)"
                ]
            },
            hole: .4,
            type: 'pie'
        }];

        var layout = {
            height: 400,
            width: 500
        };

        Plotly.newPlot('keys-pie-graph', data, layout);
    });
}

function category_breakdown_graph(){
    $.get('/admin/solves/'+teamid(), function(data){
        var solves = $.parseJSON(JSON.stringify(data));
        solves = solves['solves'];

        if (solves.length == 0)
            return;

        var categories = [];
        for (var i = 0; i < solves.length; i++) {
            categories.push(solves[i].category)
        }

        var keys = categories.filter(function (elem, pos) {
            return categories.indexOf(elem) == pos;
        });

        var counts = [];
        for (var i = 0; i < keys.length; i++) {
            var count = 0;
            for (var x = 0; x < categories.length; x++) {
                if (categories[x] == keys[i]){
                    count++;
                }
            }
            counts.push(count)
        }

        var data = [{
            values: counts,
            labels: categories,
            hole: .4,
            type: 'pie'
        }];

        var layout = {
            height: 400,
            width: 500
        };

        Plotly.newPlot('categories-pie-graph', data, layout);
    });
}

category_breakdown_graph();
keys_percentage_graph();
adjust_times();
scoregraph();