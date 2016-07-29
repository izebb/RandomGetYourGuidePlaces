var re = require('../utils/re')

/**
 * Backgroung View
 * @param String imageUrl image url
 */
function Background(imageUrl) {
	if(imageUrl)
	    var _backgroundView =
	        re('section', {
	                className: "bg-image",
	                style: {
	                    backgroundImage: 'url(' + imageUrl + ')'
	                }
	            });
    return _backgroundView;
}

module.exports = Background;
