const {body}=require('express-validator')

function validationCreateProduct(){

    return [
        body('name')
            .isString()
            .withMessage('Name is required')
            .isLength({min:3,max:16})
            .withMessage('Name too short or too long'),
        body('image')
            .isString()
            .withMessage('Image is required')
            .custom((value)=>{
                try {
                    new URL(value)
                    
                    return true

                } catch (error) {
                    throw new Error('Invalid image')
                }
                
            }),
        body('price')
            .isString()
            .withMessage('Price is required')
            .custom((value)=>{

                const priceFloat=parseFloat(value)

                if(priceFloat <=0 || value.indexOf(',') !== -1 || !priceFloat){
                    throw new Error('Invalid price') 
                }

                return true
            }),
        body('type')
            .isString()
            .withMessage('Type is required')
            .custom((value)=>{

                const types=['bebida','doce','salgado']

                if(!types.includes(value)){
                    throw new Error('Invalid type') 
                }

                return true
            }),
        body('description')
            .isString()
            .withMessage('Description is required')
            .isLength({min:3})
            .withMessage('Short description')
        
    ]

}

function validationUpdateProduct(){

    return [
        body('name')
            .optional()
            .isString()
            .withMessage('Name is required')
            .isLength({min:3,max:16})
            .withMessage('Name too short or too long'),
        body('image')
            .optional()
            .isString()
            .withMessage('Image is required')
            .custom((value)=>{
                try {
                    new URL(value)
                    
                    return true

                } catch (error) {
                    throw new Error('Invalid image')
                }
                
            }),
        body('price')
            .optional()
            .isString()
            .withMessage('Price is required')
            .custom((value)=>{

                const priceFloat=parseFloat(value)

                if(priceFloat <=0 || value.indexOf(',') !== -1){
                    throw new Error('Invalid price') 
                }

                return true
            }),
        body('type')
            .optional()
            .isString()
            .withMessage('Type is required')
            .custom((value)=>{

                const types=['bebida','doce','salgado']

                if(!types.includes(value)){
                    throw new Error('Invalid type') 
                }

                return true
            }),
        body('description')
            .optional()
            .isString()
            .withMessage('Description is required')
            .isLength({min:3})
            .withMessage('Short description'),
        body('discount')
            .optional()
            .isFloat()
            .withMessage('Discount is required')
            .custom((value)=>{

                if(value <=0 || value >= 100 ){
                    throw new Error('Invalid discount') 
                }

                return true
            }),
        
    ]

}

const userValidation={
    validationCreateProduct,
    validationUpdateProduct
}

module.exports=userValidation