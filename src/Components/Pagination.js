import React from "react";
import classNames from "classnames";

export default function PaginationComponent({ jumpToPage, active }) {
  const numArr = [...Array(5).keys()];

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" onClick={() => active >= 1 && jumpToPage(active - 1)}>&laquo;</a>
        </li>
        {numArr.map((e) => <li key={e} className="page-item">
          <a onClick={() => jumpToPage(e)} className={classNames("page-link", { "active": active === e })}>
            {e + 1}
          </a>
        </li>)}
        <li className="page-item">
          <a className="page-link" onClick={() => active <= 3 && jumpToPage(active + 1)}>&raquo;</a>
        </li>
      </ul>
    </nav>
  );
}