const asyncHandler = (requestHandlerfn)=>{
    return async(req , res , next)=>{
        Promise.resolve(requestHandlerfn(req,res,next))
        .catch((err)=>next(err));
    }
}

export {asyncHandler};