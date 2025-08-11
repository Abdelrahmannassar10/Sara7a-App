// function asyncHandler(fn){
//     return function(req, res, next){
//         fn(req, res, next).catch(error => {
//             next(error);
//         });
//     }
// }
// this is a utility function to handle async errors in Express.js , in express version 5 and above, 
// you can use the built-in error handling middleware that automatically catches async errors,
//  so this utility may not be necessary in newer versions.