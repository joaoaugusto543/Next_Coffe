const {body}=require('express-validator')

function validationCreateUser(){

    return [
        body('name')
            .isString()
            .withMessage('Name is required')
            .isLength({min:3})
            .withMessage('The name must be at least three characters long'),
        body('email')
            .isString()
            .withMessage('E-mail is required')
            .isEmail()
            .withMessage('Invalid email'),
        body('password')
            .isString()
            .withMessage('Password is required')
            .isLength({min:6})
            .withMessage('Password must be at least 6 characters long')
            .custom((value,{req})=>{

                if(value!==req.body.confirmPassword){
                    throw new Error('Passwords need to be the same')
                }

                return true
            }),
        body('image')
            .isString()
            .withMessage('Image is required')
            .custom((value)=>{
                const values=['avatarFive.png','avatarFour.png','avatarOne.png','avatarThree.png','avatarTwo.png','anonimo.png']

                if(!values.includes(value)){
                    throw new Error('Invalid image')
                }

                return true
            })
    ]

}

function validationUpdateUser(){

    return [
        body('name')
            .optional()
            .isString()
            .withMessage('Name is required')
            .isLength({min:3})
            .withMessage('The name must be at least three characters long'),
        body('newPassword')
            .optional()
            .isString()
            .withMessage('Password is required')
            .isLength({min:6})
            .withMessage('Password must be at least 6 characters long')
            .custom(async (value,{req})=>{

                const {password}=req.body

                const user=req.user

                if(!await verifyPassword(user,password)){
                    throw new Error('Incorrect password')
                }

                if(value!==req.body.confirmPassword){
                    throw new Error('Passwords need to be the same')
                }

                return true
            }),
        body('image')
            .optional()
            .isString()
            .withMessage('Image is required')
            .custom((value)=>{
                const values=['avatarFive.png','avatarFour.png','avatarOne.png','avatarThree.png','avatarTwo.png','anonimo.png']

                if(!values.includes(value)){
                    throw new Error('Invalid image')
                }

                return true
            })
    ]

}

const userValidation={
    validationCreateUser,
    validationUpdateUser
}

module.exports=userValidation