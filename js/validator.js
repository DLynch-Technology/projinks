/** validates projink name before any save **/
var validate_projink_name = function(value){
	var ck = 0;
    var error_code = '';
    if ( value.length < 1 ){
        ck++; error_code = "STRING_EMPTY_ERROR"
    }
    if ( value.length > 25 ){
        ck++; error_code = "STRING_LENGTH_ERROR"
    }
    if ( !value.match(/^[a-z0-9\.\#\s]+$/i) ){
        ck++; error_code = "STRING_ALLOWED_CHARACTER_ERROR";
    }
    if ( ck > 0 ){
        //this.error_message = error_code;
        return false;
    }
    return true;
}