angular.module('Oneline.RESTfulServices', [])
.factory('Timeline', ['$resource', function($resource){

    return $resource('/timeline', null, {
        get: {
            method : 'GET'
        }
    })

}])
.factory('Action', ['$resource', function($resource){

    return $resource('/actions/:action/:provider/:id', null, {
        create: {
            method: 'PUT',
            params: {
                action: '@action',
                provider: '@provider',
                id: '@id'
            }
        },
        destroy: {
            method: 'DELETE'
        },
        update: {
            method: 'POST'
        },
        get: {
            method: 'GET'
        }
    })

}])
.factory('Auth', ['$resource', function($resource){

    return $resource('/auth/revoke/:provider', null, {
        revoke: {
            method: 'DELETE'
        }
    })
}])
.factory('Replicant', ['$resource', function($resource){
    return $resource('/auth/replicant/:replicant', null, {
        // Authorization
        deckard: {
            method: 'GET',
            params: { replicant: 'deckard' }
        },
        // Authentication
        rachael: {
            method: 'POST',
            params: { replicant: 'rachael' }
        }
    })
}])
.factory('Media', ['$resource', function($resource){
    return $resource('/upload/:provider', null, {
        // Upload
        upload: {
            method: 'POST',
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }
    })
}])