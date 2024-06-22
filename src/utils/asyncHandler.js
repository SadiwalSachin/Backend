const asyncHandler = (requestHandler) => {
    return (req , res , next) =>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>{
            next(err)
        })
    }
}



export {asyncHandler}












// const asyncHandler = () => {}
// const asyncHandler = (func) => {
//     async (func) =>{}
// }
// const asyncHandler = (func) => async (func) => {}

// const asyncHandler = (fn) => async (req , res , next) => {
//     try {
//         await fun(req,res,next)
//     } catch (error) {
//         res.status(err.code || 400).json({
//             success: false,
//             message : err.message
//         })
//     }
// } 