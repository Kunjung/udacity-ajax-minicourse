
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Step 1 of 3 - Street View
    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var location = street + ', ' + city;

    $greeting.text('So you wanna live at ' + location + '?');
    
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + 
        location + '">');

  

    // Step 2 - New York Times Articles

    var NYTimesAPI = "e15db2de7b7b4f0daed32d1fe82b0f45"

    var nyTimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyTimesUrl += "?q=" + city + "&sort=newest" + "&api-key=" + 
        NYTimesAPI;

    $.getJSON(nyTimesUrl, function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + city);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i]

            $nytElem.append('<li class="article">' + 
                '<a href="' + article.web_url + '">' + article.headline.main + 
                '</a>' +
                '<p>' + article.snippet + '</p>' + 
            '</li>'
            );

        }
    })
    .error(function() {
        $nytHeaderElem.text('New York Times Articles Could Not be Loaded');
    });

    // Step 3 of 3 - Wikipedia Articles
    var wikiTimeout = setTimeout(function() {
        $wikiElem.text("Failed to load wikipedia articles");
    }, 8000);

    $.ajax({
        dataType : "jsonp",
        url : "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + 
            "&callback=wikiCallback",

        success : function(data) {
            var articles = data[1];
            for (var i = 0; i < articles.length; i++) {
                var article = articles[i];
                var url = "https://en.wikipedia.org/wiki/" + article;

                $wikiElem.append('<li><a href="' + url + '">' +
                    article + '</a></li>');

            }
            clearTimeout(wikiTimeout);
        }
    })

    return false;
};

$('#form-container').submit(loadData);
