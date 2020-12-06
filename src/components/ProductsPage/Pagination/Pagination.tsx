import React from 'react';
import classes from './Pagination.module.css';

const Pagination = (props: any) => {
    const pageNumbers = [];
    for (let i = 0; i < Math.ceil(props.totalProducts / props.pageSize); i++) {
        pageNumbers.push(i);
    }
    function handlePageChange(newPage: number) {
        props.onChange(newPage)
    }
    debugger;
    return (
        <div className={classes.pagination_box}>
            <nav>
                <ul>
                    {pageNumbers.map(number => (
                        <li className={classes.page_item} key={number} >
                            <a href="#" className={number === props.pageNumber ? classes.page_link_selected : classes.page_link}
                                onClick={() => handlePageChange(number)}>{number + 1}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;