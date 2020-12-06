export type Product = {
    name: string,
    producer: string,
    categories: string[]
}
export type ProductFilter = {
    producer?: string
    category?: string
}
export type ProductQueryReq = {
    filter: ProductFilter
    pageNumber: number // 0-based
    pageSize: number   
}
export type ProductQueryRes = {
    products: Product[]
}
export type ProductQueryHeaderReq = {
    filter: ProductFilter
}
export type ProductQueryHeaderRes = {
    productsTotal: number
    producers: string[]
    categories: string[]
}
///
export function generateProducts(): Product[] {
    const producers = generateRandomStrings(5)
    const categories = generateRandomStrings(10)
    const products: Product[] = []
    for(let i = 0; i < 100; i++) {
        const product = {
            name: generateRandomString(),
            producer: producers[Math.floor(Math.random() * 5)],
            categories: selectRandomStrings(categories, Math.floor(Math.random() * 3) + 1),
        } as Product
        products.push(product)
    }
    return products
}
function selectRandomStrings(array: string[], size: number): string[] {
    const list: string[] = []
    while(list.length < size) {
        const value = array[Math.floor(Math.random() * array.length)]
        if(list.indexOf(value) == -1) list.push(value)
    }
    return list
}
function generateRandomStrings(size: number): string[] {
    const list = []
    for(let i = 0; i < size; i++) list.push(generateRandomString())
    return list
}
function generateRandomString(): string {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
}
///
export async function productQuery(products: Product[], req: ProductQueryReq): Promise<ProductQueryRes> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
        products: filterProducts(products, req.filter)
            .slice(req.pageNumber * req.pageSize, (req.pageNumber + 1) * req.pageSize)
    }
}
export async function productQueryHeader(
    products: Product[], req: ProductQueryHeaderReq
): Promise<ProductQueryHeaderRes> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const filtered = filterProducts(products, req.filter)
    return {
        productsTotal: filtered.length,
        producers: filtered.map((it) => it.producer).filter((v, i, a) => a.indexOf(v) === i),
        categories: filtered.reduce((prev, curr) => prev.concat(curr.categories), [] as string[])
            .filter((v, i, a) => a.indexOf(v) === i),
    }
}
function filterProducts(products: Product[], filter: ProductFilter) {
    return products.filter((it) => filter.producer ? it.producer == filter.producer : true)
        .filter((it) => filter.category ? it.categories.indexOf(filter.category) > -1 : true)
}
///
async function usageExample() {
    const products = generateProducts()
    console.log(await productQuery(products, {filter: {}, pageNumber: 0, pageSize: 15}))
    console.log(await productQueryHeader(products, {filter: {}}))
    console.log(await productQueryHeader(products, {filter: {category: products[0].categories[0]}}))
}
