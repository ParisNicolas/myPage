const errorHandler = (error, req, res, next) => {
    const sc = error.statusCode || 400;
    
    if(error.code == 'ENOENT'){
        return res.status(404).send('No such file or directory');
    }else if(error.code == 'EEXIST'){
        return res.status(400).send('File already exists: '+error.syscall);
    }else if(error.code == 'EEXIST'){
        return res.status(sc).send(error.message);
    }
    
}

module.exports = errorHandler;