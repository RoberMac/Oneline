angular.module('Oneline.utilsServices', ['relativeDate'])
.value('relativeDateTranslations', {
    just_now: '0s',
    seconds_ago: '{{time}}s',
    a_minute_ago: '1m',
    minutes_ago: '{{time}}m',
    an_hour_ago: '1h',
    hours_ago: '{{time}}h',
    a_day_ago: '1d',
    days_ago: '{{time}}d',
    a_week_ago: '1w',
    weeks_ago: '{{time}}w',
    a_month_ago: '1M',
    months_ago: '{{time}}M',
    a_year_ago: '1y',
    years_ago: '{{time}}y',
    over_a_year_ago: '> 1y',
    // Useless
    seconds_from_now: '+ {{time}}s',
    a_minute_from_now: '+ 1m',
    minutes_from_now: '+ {{time}}m',
    an_hour_from_now: '+ 1h',
    hours_from_now: '+ {{time}}h',
    a_day_from_now: '+ 1d',
    days_from_now: '+ {{time}}d',
    a_week_from_now: '+ 1w',
    weeks_from_now: '+ {{time}}w',
    a_month_from_now: '+ 1M',
    months_from_now: '+ {{time}}M',
    a_year_from_now: '+ 1y',
    years_from_now: '+ {{time}}y',
    over_a_year_from_now: '++ 1y'
})
.factory('timelineCache', ['$cacheFactory', function($cacheFactory){
    return $cacheFactory('timelineCache')
}])
.service('store', function(){
    this.get = function (key){
        return parseJSON(localStorage.getItem(key))
    },
    this.set = function (key, value){
        localStorage.setItem(key, JSON.stringify(value))
    },
    this.remove = function (key){
        localStorage.removeItem(key)
    }

    function parseJSON(data){
        try {
            data = JSON.parse(data)
        } catch (e) {
        } finally {
            return data
        }
    }
})
.service('arrayUnique', function(){
    // via http://jszen.com/best-way-to-get-unique-values-of-an-array-in-javascript.7.html
    this.literal = function (a){
        var n = {},r=[];
        for(var i = 0; i < a.length; i++) 
        {
            if (!n[a[i]]) 
            {
                n[a[i]] = true; 
                r.push(a[i]); 
            }
        }
        return r;
    }
    this.obj = function (a){
        var flags = [], output = [], l = a.length, i;
        for (i = 0; i < l; i++) {
            if(flags[a[i].s]) continue;

            flags[a[i].s] = true;

            output.push(a[i]);
        }
        return output;
    }    
})

