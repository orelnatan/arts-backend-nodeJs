
function allowCrossDomain(request, response, next) { 
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
  
    next();
}

module.exports = allowCrossDomain;