angular.module('Oneline.tokenHelperServices', [])
.service('olTokenHelper', ['jwtHelper', function(jwtHelper){


    /* 添加 token */
    this.addToken = function (){
        var newToken  = localStorage.getItem('addToken'),
            provider  = jwtHelper.decodeToken(newToken).provider,
            tokenList = store.get('tokenList') || [];

        // 刪除相同 provider 的 token
        tokenList = util.removeToken(tokenList, provider)

        tokenList.push(newToken)
        store.set('tokenList', tokenList)

        // 刪除 `addToken`
        store.remove('addToken')
    },
    // 替換整個 tokenList
    this.replaceTokenList = function (tokenList){
        store.set('tokenList', tokenList)
    },
    /* 刪除指定 provider 的 token */
    this.removeToken = function (provider){
        var tokenList = store.get('tokenList') || [];

        tokenList = util.removeToken(tokenList, provider)

        store.set('tokenList', tokenList)
    },
    /* 清空無效 token */
    this.clearInvalidToken = function (){
        var tokenList = store.get('tokenList') || [],
            _this = this;

        tokenList.forEach(function (token){
            var isTokenExpired = jwtHelper.isTokenExpired(token),
                provider = jwtHelper.decodeToken(token).provider;

            if (isTokenExpired){
                _this.removeToken(provider)
            }
        })
    },
    /* 獲取 provider 列表 */
    this.getProviderList = function (){
        var tokenList = store.get('tokenList') || [];
        return tokenList.map(function (token){
            return jwtHelper.decodeToken(token).provider
        })
    },
    /* 驗證 token 是否有效 */
    this.isValidToken = function (){
        var tokenList = store.get('tokenList') || [];

        return (tokenList.length > 0) && tokenList.every(function (token){
            return !jwtHelper.isTokenExpired(token)
        })
    }


    // Util
    var util = {
        removeToken: function (tokenList, provider){
            return tokenList.filter(function (token){
                return provider !== jwtHelper.decodeToken(token).provider
            })
        }
    }
    var store = {
        get: function (key){
            return parseJSON(localStorage.getItem(key))
        },
        set: function (key, value){
            localStorage.setItem(key, JSON.stringify(value))
        },
        remove: function (key){
            localStorage.removeItem(key)
        }
    }
    function parseJSON(data){
        try {
            data = JSON.parse(data)
        } catch (e) {
        } finally {
            return data
        }
    }
    
}])