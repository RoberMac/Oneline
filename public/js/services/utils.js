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
.service('olRecord', ['store', function(store){
    this.mentions = function (providerList){
        var _MAX_COUNT = 2000;
        var regex = {
            twitter: /(|\s)*@([\w]+)/g,
            instagram: /(|\s)*@([\w\.]+)/g,
            weibo: /(|\s)*@([\u4e00-\u9fa5\w-]+)/g
        };
        var prefix = {
            twitter: '//twitter.com/',
            instagram: '//instagram.com/',
            weibo: '//weibo.com/n/'
        };

        providerList.forEach(function (provider){
            if (provider === 'instagram') return;

            var _mentionsList = store.get('mentions_' + provider) || [],
                _target = [
                    document.querySelectorAll('.timeline--' + provider + ' p'),
                    document.querySelectorAll(
                        '.timeline--' + provider + ' .timeline__profile__fullname a'
                    )
                ];

            // From Tweet Text
            angular.forEach(angular.element(_target[0]), function (item){

                var mentions = item.innerText.match(regex[provider]);

                if (!mentions) return;

                if (provider === 'twitter'){
                    mentions = mentions.map(function (i){
                        return { 's': i.trim() }
                    })
                }

                if (_mentionsList.length >= _MAX_COUNT){
                    if (provider === 'twitter'){
                        var _len = mentions.length;
                        _mentionsList = _mentionsList.filter(function (item){
                            if (!item.hasOwnProperty('u') && _len > 0){
                                _len --
                                return false;
                            } else {
                                return true;
                            }
                        })
                    } else {
                        _mentionsList.splice(0, mentions.length) 
                    }
                }

                _mentionsList = _mentionsList.concat(mentions)
            })
            // Trim
            if (provider === 'weibo'){
                _mentionsList = _mentionsList.map(function(i){return i.trim()})
            }

            // From Tweet Author
            angular.forEach(angular.element(_target[1]), function (item){
                var _item = angular.element(item),
                    _href = _item.attr('href');

                if (!_href) return;

                var mentions = '@' + _href.replace(prefix[provider], '');

                if (provider === 'twitter'){
                    mentions = { 's': mentions, 'u': _item.find('strong').text() }
                }

                _mentionsList.push(mentions)
            })

            // Store
            store.set(
                'mentions_' + provider,
                provider === 'twitter'
                    ? arrayUnique_obj(_mentionsList)
                : arrayUnique_literal(_mentionsList)
            )
        })
    }
    // via http://jszen.com/best-way-to-get-unique-values-of-an-array-in-javascript.7.html
    function arrayUnique_literal(a){
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
    function arrayUnique_obj(a){
        var flags = [], output = [], l = a.length, i;
        for (i = 0; i < l; i++) {
            if(flags[a[i].s]) continue;

            flags[a[i].s] = true;

            output.push(a[i]);
        }
        return output;
    }
}])