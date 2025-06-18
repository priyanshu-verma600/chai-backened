/*const asyncHandler = (requestHandler) =>{
    (req , res, next)=>{
        Promise.resolve(requestHandler(req , res, next)).
        catch((err)=> next(err))
    }
} 

export {asyncHandler}*/

// another method to write the same code.
const asyncHandler =(fn) =>async(req , res , next)=>{
    try{
        return await fn(req , res , next)
    }catch(error){
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export {asyncHandler}