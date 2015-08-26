angular.module('Oneline.relativeDateServices', ['relativeDate'])
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
.directive('relativeDate', ['$timeout', '$filter', function ($timeout, $filter){

    return function (scope, elem, attrs){
        var time  = attrs.relativeDate,
            delay = 1000,
            timeoutPromise;

        function updateTime(){
            elem.text($filter('relativeDate')(time))

            // 降低刷新速率
            if (delay < 60000 && new Date() - Date.parse(time) > 60000){
                delay = 60000
            }
        }

        function updateLater (){
            timeoutPromise = $timeout(function (){
                updateTime()
                updateLater()
            }, delay)
        }

        elem.bind('$destroy', function() {
            $timeout.cancel(timeoutPromise);
        })

        updateTime()
        updateLater()
    }

}])