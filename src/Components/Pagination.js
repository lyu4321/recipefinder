import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export default function PaginationComponent({ jumpToPage, active, setActive }) {
    const numArr = [...Array(10).keys()]
    const getTenPages = () => {
        return (<>{numArr.map((e, i) =>
            <PaginationItem className="page" key={i}>
                <PaginationLink className={active === i ? "active" : ""} onClick={() => jumpToPage(i)} >
                    {i + 1}
                </PaginationLink>
            </PaginationItem>
        )}</>)
    }
    return (
        <Pagination>
            <PaginationItem>
                <PaginationLink previous onClick={() => {
                    if (active - 1 >= 0) {
                        jumpToPage(active - 1)
                    }
                }} />
            </PaginationItem>
            {getTenPages()}
            <PaginationItem>
                <PaginationLink next onClick={() => {
                    if (active + 1 <= 9) {
                        jumpToPage(active + 1)
                    }
                }} />
            </PaginationItem>
        </Pagination>
    );
}