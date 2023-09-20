const {body}=require('express-validator')

function validationCreateComment(){

    return [
        body('comment')
            .isString()
            .withMessage('Comment is required')
            .isLength({min:1,max:100})
            .withMessage('Very long comment'),
        body('assessment')
            .isInt()
            .withMessage('Assessment is required')
            .custom((value)=>{

                if(value > 5){
                    throw new Error('Five stars is the limit')
                }

                return true

            })
    ]

}


const commentValidation={
    validationCreateComment,

}

module.exports=commentValidation