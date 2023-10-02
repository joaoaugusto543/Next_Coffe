import Product from '../Product/Product'
import { getProducts } from '@/services/productsServices'

async function Products({type}) {

    const products=await getProducts(type)

  return (
    <>
        {products && products.map((product)=>
            <Product key={product.id} product={product}/>
        )}
    </>
  )
}

export default Products