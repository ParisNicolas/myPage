const errorHandler = (error, req, res, next) => {
    const sc = error.statusCode || 400;
    
    if(error.code == 'ENOENT'){
        return res.status(404).json({message: 'No such file or directory'});
    }else if(error.code == 'EEXIST'){
        return res.status(400).json({message: 'File already exists: '+error.syscall});
    }else {
        return res.status(sc).json({message: error.message});
    }
    
}

module.exports = errorHandler;