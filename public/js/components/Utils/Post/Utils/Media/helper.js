export const handleImageError = event => {
    const elem = event.target;

    elem.setAttribute('src', 'data:image/svg+xml;utf8,<svg viewBox="0 0 529 530" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M51.245 150.775c-3.454-1.729-5.458-.098-4.476 3.638l.706 2.688c8.01 30.498-2.986 73.86-24.566 96.854l-.662.706c-2.643 2.816-1.649 5.288 2.193 5.52l136.636 8.237c9.376.565 23.953-2.031 32.554-5.798l21.279-9.319-13.768-18.801c-5.55-7.579-16.851-17.127-25.254-21.333l-124.642-62.392z" fill="#000"/><path d="M9.298 290.938c13.001 129.203 122.073 230.062 254.702 230.062 141.385 0 256-114.615 256-256s-114.615-256-256-256c-84.794 0-159.96 41.226-206.547 104.728" stroke="#000" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M361.259 190.733c-4.06-1.129-8.339-1.733-12.759-1.733-26.234 0-47.5 21.266-47.5 47.5 0 4.115.523 8.109 1.507 11.917" stroke="#000" stroke-width="17" stroke-linecap="round"/><path d="M213.468 406.97c13.141-16.776 37.347-28.026 65.032-28.026 30.37 0 56.552 13.538 68.536 33.056" stroke="#000" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/></g></svg>')
}

export const fuckLongWeibo = event => {
    const elem = event.target;
    const imageW = elem.width;
    const viewportH = window.innerWidth;

    if (viewportH * 0.33 / imageW > 2){
        let originPic = elem.nextElementSibling;
        originPic.setAttribute('href', originPic.getAttribute('href').replace('large', 'bmiddle'))
    }

}

export const lazySize = ratio => ({'paddingBottom': ratio * 100 + '%'});


const ratio2deg = ratio => Math.atan(ratio) * 180 / Math.PI;
export const calcDegree = (x, y, w, h) => {
    let w_, h_, _deg;

    if (x > 0.5){
        w_ = (1 - x) * w
        // 右下
        if (y > 0.5){
            h_ = (1 - y) * h
            _deg = ratio2deg(h_ / w_) + 90
        }
        // 右上
        else {
            h_ = y * h
            _deg = ratio2deg(w_ / h_)
        }
    }
    else {
        w_ = x * w
        // 左下
        if (y > 0.5){
            h_ = (1 - y) * h
            _deg = ratio2deg(w_ / h_) + 180
        }
        // 左上
        else {
            h_ = y * h
            _deg = - ratio2deg(h_ / w_)
        }
    }
    return _deg;
}



