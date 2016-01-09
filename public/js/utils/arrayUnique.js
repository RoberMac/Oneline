// via http://jszen.com/best-way-to-get-unique-values-of-an-array-in-javascript.7.html

export const literal = (a) => {
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

export const object = (a) => {
    var flags = [], output = [], l = a.length, i;
    for (i = 0; i < l; i++) {
        if(flags[a[i].s]) continue;

        flags[a[i].s] = true;

        output.push(a[i]);
    }
    return output;
}
