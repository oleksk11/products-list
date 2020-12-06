import React, { useState } from 'react';
import classes from './ProductsPage.module.css';
import Products from './Products/Products';
import Pagination from './Pagination/Pagination';
import { ProductQueryRes, productQuery, Product } from '../../functions/functions';

type StateType = {
	viewProducts: Product[],
	producerFiltredProducts: Product[],
	allFiltredProducts: Product[],
	selectedCategories?: string,
	pageNumber: number,
	pageSize: number,
	isEmpty?: boolean
}

function ProductsPage(props: any) {
	let products: Product[] = props.products;
	const [state, setState] = useState({ viewProducts: [], producerFiltredProducts: [], allFiltredProducts: [], pageNumber: 0, pageSize: 0, isEmpty: true } as StateType);
	const pageSizes = [15, 30, 50];

	if (state.isEmpty) {
		productQuery(products,
			{ filter: {}, pageNumber: 0, pageSize: 15 }
		).then((value: ProductQueryRes) => {
			setState({
				viewProducts: value.products,
				producerFiltredProducts: products,
				allFiltredProducts: products,
				pageNumber: 0,
				pageSize: 15
			});
		});
	}

	async function handleProducersSelectChange(event: any) {
		let currentSelectedProducer;
		if (event.target.value === "initialProducer") {
			currentSelectedProducer = undefined;
		} else {
			currentSelectedProducer = event.target.value;
		}
		let filteredProducts: Product[] = (await productQuery(products,
			{ filter: { producer: currentSelectedProducer }, pageNumber: 0, pageSize: 99999 }
		)).products;
		let newViewProducts: Product[] = (await productQuery(filteredProducts,
			{ filter: {}, pageNumber: 0, pageSize: state.pageSize }
		)).products;
		setState({
			viewProducts: newViewProducts,
			producerFiltredProducts: filteredProducts,
			allFiltredProducts: filteredProducts,
			selectedCategories: undefined,
			pageNumber: 0,
			pageSize: state.pageSize
		});
	}
	async function handleCategoriesSelectChange(event: any) {
		let currentSelectedCategory;
		if (event.target.value === "initialCategory") {
			currentSelectedCategory = undefined;
		} else {
			currentSelectedCategory = event.target.value;
		}
		let filteredProducts: Product[] = (await productQuery(state.producerFiltredProducts,
			{ filter: { category: currentSelectedCategory }, pageNumber: 0, pageSize: 99999 }
		)).products;
		let newViewProducts: Product[] = (await productQuery(filteredProducts,
			{ filter: {}, pageNumber: 0, pageSize: state.pageSize }
		)).products;
		setState({
			viewProducts: newViewProducts,
			producerFiltredProducts: state.producerFiltredProducts,
			allFiltredProducts: filteredProducts,
			selectedCategories: currentSelectedCategory,
			pageNumber: 0,
			pageSize: state.pageSize
		});
	}
	async function handlePageChange(pageNumber: number) {
		let newViewProducts: Product[] = (await productQuery(state.allFiltredProducts,
			{ filter: {}, pageNumber: pageNumber, pageSize: state.pageSize }
		)).products;
		setState({
			viewProducts: newViewProducts,
			producerFiltredProducts: state.producerFiltredProducts,
			allFiltredProducts: state.allFiltredProducts,
			selectedCategories: state.selectedCategories,
			pageNumber: pageNumber,
			pageSize: state.pageSize
		});
	}
	async function handlePageSizeChange(event: any) {
		let currentSelectedPageSize;
		currentSelectedPageSize = event.target.value;
		let newViewProducts: Product[] = (await productQuery(state.allFiltredProducts,
			{ filter: {}, pageNumber: 0, pageSize: currentSelectedPageSize }
		)).products;
		setState({
			viewProducts: newViewProducts,
			producerFiltredProducts: state.producerFiltredProducts,
			allFiltredProducts: state.allFiltredProducts,
			selectedCategories: state.selectedCategories,
			pageNumber: 0,
			pageSize: currentSelectedPageSize
		});
	}
	let productsProducer = Array.from(
		new Set(
			products
				.map((p: Product) => p.producer)
		)
	).map((p: string) => <option className={classes.producer}>{p}</option>);

	let productsCategory = Array.from(
		new Set(
			state.producerFiltredProducts
				.flatMap((p: Product) => p.categories)
		)
	).map((p: string) => <option className={classes.category}>{p}</option>);

	return (
		<div className={classes.products_page}>
			<div className={classes.filters}>
				<div className={classes.producer_filter}>
					<span className={classes.filter_span}>Wybierz producenta:</span>
					<select className={classes.producer_item} onChange={handleProducersSelectChange}>
						<option value="initialProducer" selected>Wszyscy producenci</option>
						{productsProducer}
					</select>
				</div>
				<div className={classes.category_filter}>
					<span className={classes.filter_span}>Wybierz kategorię:</span>
					<select className={classes.category_item} value={!state.selectedCategories ? "initialProducer" : state.selectedCategories} onChange={handleCategoriesSelectChange}>
						<option value="initialCategory" selected>Wszystkie kategorie</option>
						{productsCategory}
					</select>
				</div>
				<div className={classes.page_size}>
					<span className={classes.filter_span}>Wybierz ilość produktów:</span>
					<select className={classes.size} onChange={handlePageSizeChange} value={state.pageSize}>
						{pageSizes.map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
				</div>
			</div>

			<Products productsList={state.viewProducts} />
			<Pagination pageNumber={state.pageNumber} pageSize={state.pageSize} totalProducts={state.allFiltredProducts.length} onChange={handlePageChange} />
		</div>
	);
}

export default ProductsPage;