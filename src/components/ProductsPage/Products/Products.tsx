import React from 'react';
import classes from './Products.module.css';
import { Product } from '../../../functions/functions';

function Products(props: { productsList: Product[]; }) {
    let productsElements = props.productsList.map((p: Product) => <tr>
        <td>{p.name}</td>
        <td>{p.producer}</td>
        <td>{p.categories.map((c: string) => c + ' ')}</td>
    </tr>);

    return (
        <div>
            <div className={classes.products}>
                <table className={classes.products_table}>
                    <thead>
                        <tr>
                            <th colSpan={3}>Tabela produktów</th>
                        </tr>
                        <tr>
                            <th>Nazwa produktu</th>
                            <th>Producent</th>
                            <th>Kategoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsElements}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Products;