angular.module('Oneline.actionsServices', [])
.service('olActionsHelper', ['Action', 'olUI',
    function(Action, olUI){

    this.toggleAction = function (action, provider, id, isActive){
        var method = isActive ? 'destroy' : 'create',
            _id = id;

        if (action === 'retweet' && method === 'destroy'){
            id = olUI.actionData(action, _id)
        }

        return Action[method]({ action: action, provider: provider, id: id })
        .$promise
        .then(function (data){

            if (method === 'create'){
                if (action === 'retweet'){
                    olUI.actionData(action, _id, data.id_str)
                }

                if (action !== 'star'){
                    var count = ~~olUI.actionData(action, _id, null, 'count') + 1;

                    olUI.actionData(action, _id, count, 'count')
                }
            } else {
                if (action !== 'star'){
                    var count = ~~olUI.actionData(action, _id, null, 'count') - 1;

                    olUI.actionData(action, _id, count > 0 ? count : '', 'count')
                }
            }
        })
    }
}])